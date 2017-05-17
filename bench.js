'use strict'; /* eslint no-new: 0, no-unused-vars: 0 */

var Delaunator = require('./');
var fasterDelaunay = require('faster-delaunay');
var incrementalDelaunay = require('incremental-delaunay');
var delaunayFast = require('delaunay-fast');

function triangulate(points) {
    new Delaunator(points);
    // fasterDelaunay(points).triangulate();
    // incrementalDelaunay(points);
    // delaunayFast.triangulate(points);
}

var counts = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
var generate = uniform;

triangulate(generate(counts[0]));

for (var i = 0; i < counts.length; i++) {
    var c = counts[i];
    var points = generate(c);
    console.time(c);
    triangulate(points);
    console.timeEnd(c);
}

function uniform(count) {
    var points = [];
    for (var i = 0; i < count; i++) {
        points.push([Math.random() * 1e3, Math.random() * 1e3]);
    }
    return points;
}

function gaussian(count) {
    var points = [];
    for (var i = 0; i < count; i++) {
        points.push([pseudoNormal() * 1e3, pseudoNormal() * 1e3]);
    }
    return points;
}

function pseudoNormal() {
    var v = Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
    return Math.min(0.5 * (v - 3) / 3, 1);
}
