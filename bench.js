/* eslint no-unused-vars: 0 */

import Delaunator from './';
// import fasterDelaunay from 'faster-delaunay';
// import incrementalDelaunay from 'incremental-delaunay';
// import delaunayFast from 'delaunay-fast';
// import {voronoi} from 'd3-voronoi';

function triangulate(points) {
    Delaunator.from(points);
    // fasterDelaunay(points).triangulate();
    // voronoi()(points);
    // incrementalDelaunay(points);
    // delaunayFast.triangulate(points);
}

const counts = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
const generate = uniform;

triangulate(generate(counts[0]));

for (let i = 0; i < counts.length; i++) {
    const c = counts[i];
    const points = generate(c);
    console.time(c);
    triangulate(points);
    console.timeEnd(c);
}

function uniform(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        points.push([Math.random() * 1e3, Math.random() * 1e3]);
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

function pseudoNormal() {
    const v = Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
    return Math.min(0.5 * (v - 3) / 3, 1);
}
