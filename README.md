# delaunator

A really fast JavaScript library for
[Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of 2D points.

[![Build Status](https://travis-ci.org/mapbox/delaunator.svg?branch=master)](https://travis-ci.org/mapbox/delaunator)
[![](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)


## [Interactive Demo](https://mapbox.github.io/delaunator/)


## Example

```js
var points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], ...];

var delaunay = Delaunator.from(points);
console.log(delaunay.triangles);
// [623, 636, 619,  636, 444, 619, ...]
```

## Install

Install with NPM (`npm install delaunator`) or Yarn (`yarn add delaunator`), then:

```js
// import as an ES module
import Delaunator from 'delaunator';

// or require in Node / Browserify
const Delaunator = require('delaunator');
```

Or use a browser build directly:

```html
<script src="https://unpkg.com/delaunator@2.0.0/delaunator.min.js"></script> <!-- minified build -->
<script src="https://unpkg.com/delaunator@2.0.0/delaunator.js"></script> <!-- dev build -->
```

## API Reference

#### Delaunator.from(points[, getX, getY])

Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
`getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
Duplicate points are skipped.

#### new Delaunator(coords)

Constructs a delaunay triangulation object given a **typed array** of point coordinates of the form:
`[x0, y0, x1, y1, ...]`.

#### delaunay.triangles

A flat `Int32Array` array of triangle vertex indices (each group of three numbers forms a triangle).
All triangles are directed counterclockwise.

To get the coordinates of all triangles, use:

```js
for (var i = 0; i < triangles.length; i += 3) {
    coordinates.push([
        points[triangles[i]],
        points[triangles[i + 1]],
        points[triangles[i + 2]]
    ]);
}
```

#### delaunay.halfedges

A flat `Int32Array` array of triangle half-edge indices that allows you to traverse the triangulation.
`i`-th half-edge in the array corresponds to vertex `triangles[i]` the half-edge is coming from.
`halfedges[i]` is the index of a twin half-edge in an adjacent triangle
(or `-1` for outer half-edges on the convex hull).

The flat array-based data structures might be counterintuitive,
but they're one of the key reasons this library is fast.

## Performance

Benchmark results against four fastest other libraries
(`bench.js` on Macbook Pro Retina 15" 2017, Node v8.10.0):

library | 10,000 | 20,000 | 50,000 | 100,000 | 200,000 | 500,000 | 1,000,000
:-- | --: | --: | --: | --: | --: | --: | --:
delaunator | 31ms | 17ms | 59ms | 125ms | 232ms | 613ms | 1.35s
[faster-delaunay](https://github.com/Bathlamos/delaunay-triangulation) | 48ms | 88ms | 243ms | 447ms | 1.02s | 2.72s | 4.95s
[incremental-delaunay](https://github.com/mikolalysenko/incremental-delaunay) | 56ms | 131ms | 309ms | 577ms | 1.12s | 3.01s | 6.37s
[d3-voronoi](https://github.com/d3/d3-voronoi) | 132ms | 220ms | 483ms | 1s | 2.27s | 6.3s | 12.67s
[delaunay-fast](https://github.com/ironwallaby/delaunay) | 150ms | 343ms | 1.19s | 3.35s | 10.09s | 41.09s | 117.53s

## Papers

The algorithm is based on ideas from the following papers:

- [A simple sweep-line Delaunay triangulation algorithm](http://www.academicpub.org/jao/paperInfo.aspx?paperid=15630), 2013, Liu Yonghe, Feng Jinming and Shao Yuehong
- [S-hull: a fast radial sweep-hull routine for Delaunay triangulation](http://www.s-hull.org/paper/s_hull.pdf), 2010, David Sinclair
- [A faster circle-sweep Delaunay triangulation algorithm](http://cglab.ca/~biniaz/papers/Sweep%20Circle.pdf), 2011, Ahmad Biniaz and Gholamhossein Dastghaibyfard
