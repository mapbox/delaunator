
import Delaunator from '../index.js';

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'fs';

function loadJSON(path) {
    return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
}

const points = loadJSON('./fixtures/ukraine.json');
const issue13 = loadJSON('./fixtures/issue13.json');
const issue43 = loadJSON('./fixtures/issue43.json');
const issue44 = loadJSON('./fixtures/issue44.json');
const robustness1 = loadJSON('./fixtures/robustness1.json');
const robustness2 = loadJSON('./fixtures/robustness2.json');
const robustness3 = loadJSON('./fixtures/robustness3.json');
const robustness4 = loadJSON('./fixtures/robustness4.json');

test('triangulates plain array', () => {
    const d = new Delaunator([].concat(...points));
    assert.deepEqual(d.triangles, Delaunator.from(points).triangles);
});

test('triangulates typed array', () => {
    const d = new Delaunator(Float64Array.from([].concat(...points)));
    assert.deepEqual(d.triangles, Delaunator.from(points).triangles);
});

test('constructor errors on invalid array', () => {
    /* eslint no-new: 0 */
    assert.throws(() => {
        new Delaunator({length: -1});
    }, /Invalid typed array length/);
    assert.throws(() => {
        new Delaunator(points);
    }, /Expected coords to contain numbers/);
});

test('produces correct triangulation', () => {
    validate(points);
});

test('produces correct triangulation after modifying coords in place', () => {
    const d = Delaunator.from(points);

    validate(points, d);
    assert.equal(d.trianglesLen, 5133);

    const p = [80, 220];
    d.coords[0] = p[0];
    d.coords[1] = p[1];
    const newPoints = [p].concat(points.slice(1));

    d.update();
    validate(newPoints, d);
    assert.equal(d.trianglesLen, 5139);

});

test('issue #11', () => {
    validate([[516, 661], [369, 793], [426, 539], [273, 525], [204, 694], [747, 750], [454, 390]]);
});

test('issue #13', () => {
    validate(issue13);
});

test('issue #24', () => {
    validate([[382, 302], [382, 328], [382, 205], [623, 175], [382, 188], [382, 284], [623, 87], [623, 341], [141, 227]]);
});

test('issue #43', () => {
    validate(issue43);
});

test('issue #44', () => {
    validate(issue44);
});

test('robustness', () => {
    validate(robustness1);
    validate(robustness1.map(p => [p[0] / 1e9, p[1] / 1e9]));
    validate(robustness1.map(p => [p[0] / 100, p[1] / 100]));
    validate(robustness1.map(p => [p[0] * 100, p[1] * 100]));
    validate(robustness1.map(p => [p[0] * 1e9, p[1] * 1e9]));
    validate(robustness2.slice(0, 100));
    validate(robustness2);
    validate(robustness3);
    validate(robustness4);
});

test('returns empty triangulation for small number of points', () => {
    let d = Delaunator.from([]);
    assert.deepEqual(Array.from(d.triangles), []);
    assert.deepEqual(Array.from(d.hull), []);
    d = Delaunator.from(points.slice(0, 1));
    assert.deepEqual(Array.from(d.triangles), []);
    assert.deepEqual(Array.from(d.hull), [0]);
    d = Delaunator.from(points.slice(0, 2));
    assert.deepEqual(Array.from(d.triangles), []);
    assert.deepEqual(Array.from(d.hull), [1, 0]); // [0, 1] is also correct
});

test('returns empty triangulation for all-collinear input', () => {
    const d = Delaunator.from([[0, 0], [1, 0], [3, 0], [2, 0]]);
    assert.deepEqual(Array.from(d.triangles), []);
    assert.deepEqual(Array.from(d.hull), [0, 1, 3, 2]); // [2, 3, 0, 1] is also correct
});

test('supports custom point format', () => {
    const d = Delaunator.from(
        [{x: 5, y: 5}, {x: 7, y: 5}, {x: 7, y: 6}],
        p => p.x,
        p => p.y);
    assert.deepEqual(Array.from(d.triangles), [0, 2, 1]);
});

function orient([px, py], [rx, ry], [qx, qy]) {
    const l = (ry - py) * (qx - px);
    const r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
}
function convex(r, q, p) {
    return (orient(p, r, q) || orient(r, q, p) || orient(q, p, r)) >= 0;
}

function validate(points, d = Delaunator.from(points)) {
    // validate halfedges
    for (let i = 0; i < d.halfedges.length; i++) {
        assert.ok(d.halfedges[i] === -1 || d.halfedges[d.halfedges[i]] === i, 'valid halfedge connection');
    }

    // validate triangulation
    const hullAreas = [];
    for (let i = 0, len = d.hull.length, j = len - 1; i < len; j = i++) {
        const [x0, y0] = points[d.hull[j]];
        const [x, y] = points[d.hull[i]];
        hullAreas.push((x - x0) * (y + y0));
        assert.ok(
            convex(points[d.hull[j]], points[d.hull[(j + 1) % d.hull.length]],  points[d.hull[(j + 3) % d.hull.length]]),
            `hull should be convex at ${j}`);
    }
    const hullArea = sum(hullAreas);

    const triangleAreas = [];
    for (let i = 0; i < d.triangles.length; i += 3) {
        const [ax, ay] = points[d.triangles[i]];
        const [bx, by] = points[d.triangles[i + 1]];
        const [cx, cy] = points[d.triangles[i + 2]];
        triangleAreas.push(Math.abs((by - ay) * (cx - bx) - (bx - ax) * (cy - by)));
    }
    const trianglesArea = sum(triangleAreas);

    const err = Math.abs((hullArea - trianglesArea) / hullArea);
    assert.ok(err <= Math.pow(2, -51), `triangulation should be valid; ${err} error`);
}

// Kahan and Babuska summation, Neumaier variant; accumulates less FP error
function sum(x) {
    let sum = x[0];
    let err = 0;
    for (let i = 1; i < x.length; i++) {
        const k = x[i];
        const m = sum + k;
        err += Math.abs(sum) >= Math.abs(k) ? sum - m + k : k - m + sum;
        sum = m;
    }
    return sum + err;
}
