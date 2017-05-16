## delaunator

The fastest JavaScript library for
[Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of 2D points.
Implements a variation of the [Sweep-hull algorithm](http://s-hull.org/).

### [Demo](https://mapbox.github.io/delaunator/)

### Example

```js
var points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], ...];

var delaunay = new Delaunator(points);
console.log(delaunay.triangles);
```

### To do

- [x] Implement the algorithm.
- [x] Add a simple demo.
- [x] Add proper tests.
- [ ] Add a benchmark against similar libraries.
- [ ] Clean up and document the API.
- [ ] Release the first version to NPM.
