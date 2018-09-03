/* eslint no-unused-vars: 0 */

import Delaunator from './index.js';
// import fasterDelaunay from 'faster-delaunay';
// import incrementalDelaunay from 'incremental-delaunay';
// import delaunayFast from 'delaunay-fast';
// import delaunaySlow from 'delaunay';
// import {voronoi} from 'd3-voronoi';
// import delaunayTriangulate from 'delaunay-triangulate';
// import cdt2d from 'cdt2d';

function triangulate(points) {
    Delaunator.from(points);
    // fasterDelaunay(points).triangulate();
    // voronoi()(points);
    // incrementalDelaunay(points);
    // delaunayFast.triangulate(points);
    // delaunaySlow.triangulate(points);
    // delaunayTriangulate(points);
    // cdt2d(points);
}

const distributions = [uniform, gaussian, grid, degenerate];
const counts = [20000, 100000, 200000, 500000, 1000000];

for (const generate of distributions) {
    console.log(`${generate.name}:`);

    // warmup
    triangulate(generate(counts[0]));
    triangulate(generate(counts[1]));

    for (let i = 0; i < counts.length; i++) {
        const c = counts[i];
        const points = generate(c);
        console.time(c);
        triangulate(points);
        console.timeEnd(c);
    }
}

function uniform(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        points.push([Math.random() * 1e3, Math.random() * 1e3]);
    }
    return points;
}

function grid(count) {
    const points = [];
    const size = Math.sqrt(count);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            points.push([i, j]);
        }
    }
    return points;
}

function gaussian(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        points.push([pseudoNormal() * 1e3, pseudoNormal() * 1e3]);
    }
    return points;
}

function degenerate(count) {
    const points = [[0, 0]];
    for (let i = 0; i < count; i++) {
        const angle = 2 * Math.PI * i / count;
        points.push([1e10 * Math.sin(angle), 1e10 * Math.cos(angle)]);
    }
    return points;
}

function pseudoNormal() {
    const v = Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
    return Math.min(0.5 * (v - 3) / 3, 1);
}
