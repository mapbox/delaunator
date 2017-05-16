## delaunator

The fastest JavaScript library for
[Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of 2D points.
Implements a variation of the [Sweep-hull algorithm](http://s-hull.org/).

[Demo](https://mapbox.github.io/delaunator/)

```js
var points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], ...];

var delaunay = new Delaunay(points);
console.log(delaunay.triangles);
```

A work in progress:

- [x] Implement the algorithm.
- [x] Add a simple demo.
- [ ] Add proper tests.
- [ ] Add a benchmark against similar libraries.
- [ ] Document the API.
