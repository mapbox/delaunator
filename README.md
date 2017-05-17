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

Benchmark results against three fastest other libraries
(`bench.js` on Macbook Pro Retina mid-2012, Node v7.9.0):

#### Uniform distribution

library | 10,000 | 20,000 | 50,000 | 100,000 | 200,000 | 500,000 | 1,000,000
:-- | --: | --: | --: | --: | --: | --: | --:
delaunator | 26ms | 40ms | 174ms | 327ms | 658ms | 2.07s | 4.95s
[faster-delaunay](https://github.com/Bathlamos/delaunay-triangulation) | 78ms | 140ms | 328ms | 776ms | 1.74s | 3.87s | 6.99s
[incremental-delaunay](https://github.com/mikolalysenko/incremental-delaunay) | 81ms | 154ms | 428ms | 874ms | 1.74s | 4.3s | 9.03s
[delaunay-fast](https://github.com/ironwallaby/delaunay) | 136ms | 386ms | 1.18s | 3.03s | 7.95s | 28.2s | 76.96s

#### Gaussian distribution

library | 10,000 | 20,000 | 50,000 | 100,000 | 200,000 | 500,000 | 1,000,000
:-- | --: | --: | --: | --: | --: | --: | --:
delaunator | 22ms | 39ms | 162ms | 270ms | 586ms | 1.86s | 4.53s
[faster-delaunay](https://github.com/Bathlamos/delaunay-triangulation) | 76ms | 172ms | 291ms | 692ms | 1.19s | 3.46s | 6.36s
[incremental-delaunay](https://github.com/mikolalysenko/incremental-delaunay) | 74ms | 154ms | 410ms | 806ms | 1.67s | 4.27s | 8.3s
[delaunay-fast](https://github.com/ironwallaby/delaunay) | 152ms | 340ms | 1.19s | 3.2s | 8.37s | 30.03s | 82.05s

## Papers

The algorithm is based on ideas from the following papers:

- [A simple sweep-line Delaunay triangulation algorithm](http://www.academicpub.org/jao/paperInfo.aspx?paperid=15630), 2013, Liu Yonghe, Feng Jinming, Shao Yuehong
- [S-hull: a fast radial sweep-hull routine for Delaunay triangulation](http://www.s-hull.org/paper/s_hull.pdf), 2010, David Sinclair
