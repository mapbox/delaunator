## delaunator

A really fast JavaScript library for
[Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of 2D points.
Implements a variation of the [Sweep-hull algorithm](http://s-hull.org/).

[![Build Status](https://travis-ci.org/mapbox/delaunator.svg?branch=master)](https://travis-ci.org/mapbox/delaunator)
[![](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

### [Demo](https://mapbox.github.io/delaunator/)

### Example

```js
var points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], ...];

var delaunay = new Delaunator(points);
console.log(delaunay.triangles);
// [623, 636, 619,  636, 444, 619, ...]
```

### API Reference

#### new Delaunator(points[, getX, getY])

Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
`getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
Duplicate points are skipped.

#### delaunay.triangles

A flat array of triangle indices (each group of three numbers forms a triangle).
