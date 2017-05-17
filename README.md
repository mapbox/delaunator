# delaunator

A really fast JavaScript library for
[Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of 2D points.
Implements a variation of the [Sweep-hull algorithm](http://s-hull.org/).

[![Build Status](https://travis-ci.org/mapbox/delaunator.svg?branch=master)](https://travis-ci.org/mapbox/delaunator)
[![](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)


## [Demo](https://mapbox.github.io/delaunator/)


## Example

```js
var points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], ...];

var delaunay = new Delaunator(points);
console.log(delaunay.triangles);
// [623, 636, 619,  636, 444, 619, ...]
```


## API Reference

#### new Delaunator(points[, getX, getY])

Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
`getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
Duplicate points are skipped.

#### delaunay.triangles

A flat `Int32Array` array of triangle indices (each group of three numbers forms a triangle).


## Performance

Benchmark results for a uniform random distribution (`node bench.js`) against three fastest other libraries:

points | delaunator | [faster-del](https://github.com/Bathlamos/delaunay-triangulation) | [incr-del](https://github.com/mikolalysenko/incremental-delaunay) | [del-fast](https://github.com/ironwallaby/delaunay)
--: | --: | --: | --: | --:
10000 | 26ms | 78ms | 81ms | 136ms
20000 | 40ms | 140ms | 154ms | 386ms
50000 | 174ms | 328ms | 428ms | 1.18s
100000 | 327ms | 776ms | 874ms | 3.03s
200000 | 658ms | 1.74s | 1.74s | 7.95s
500000 | 2.07s | 3.87s | 4.3s | 28.2s
1000000 | 4.95s | 6.99s | 9.03s | 76.96s


## Papers

The algorithm is based on ideas from the following papers:

- [A simple sweep-line Delaunay triangulation algorithm](http://www.academicpub.org/jao/paperInfo.aspx?paperid=15630), 2013, Liu Yonghe, Feng Jinming, Shao Yuehong
- [S-hull: a fast radial sweep-hull routine for Delaunay triangulation](http://www.s-hull.org/paper/s_hull.pdf), 2010, David Sinclair
