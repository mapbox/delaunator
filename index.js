'use strict';

module.exports = Delaunator;
module.exports.default = Delaunator;

function Delaunator(points, getX, getY) {

    if (!getX) getX = defaultGetX;
    if (!getY) getY = defaultGetY;

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    var coords = this.coords = [];
    var ids = this.ids = new Uint32Array(points.length);

    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var x = getX(p);
        var y = getY(p);
        ids[i] = i;
        coords[2 * i] = x;
        coords[2 * i + 1] = y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    var cx = (minX + maxX) / 2;
    var cy = (minY + maxY) / 2;

    var minDist = Infinity;
    var i0, i1, i2;

    // pick a seed point close to the centroid
    for (i = 0; i < points.length; i++) {
        var d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
        if (d < minDist) {
            i0 = i;
            minDist = d;
        }
    }

    minDist = Infinity;

    // find the point closest to the seed
    for (i = 0; i < points.length; i++) {
        if (i === i0) continue;
        d = dist(coords[2 * i0], coords[2 * i0 + 1], coords[2 * i], coords[2 * i + 1]);
        if (d < minDist && d > 0) {
            i1 = i;
            minDist = d;
        }
    }

    var minRadius = Infinity;

    // find the third point which forms the smallest circumcircle with the first two
    for (i = 0; i < points.length; i++) {
        if (i === i0 || i === i1) continue;

        var r = circumradius(
            coords[2 * i0], coords[2 * i0 + 1],
            coords[2 * i1], coords[2 * i1 + 1],
            coords[2 * i], coords[2 * i + 1]);

        if (r < minRadius) {
            i2 = i;
            minRadius = r;
        }
    }

    if (minRadius === Infinity) {
        throw new Error('No Delaunay triangulation exists for this input.');
    }

    // swap the order of the seed points for counter-clockwise orientation
    if (area(coords[2 * i0], coords[2 * i0 + 1],
        coords[2 * i1], coords[2 * i1 + 1],
        coords[2 * i2], coords[2 * i2 + 1]) < 0) {

        var tmp = i1;
        i1 = i2;
        i2 = tmp;
    }

    var i0x = coords[2 * i0];
    var i0y = coords[2 * i0 + 1];
    var i1x = coords[2 * i1];
    var i1y = coords[2 * i1 + 1];
    var i2x = coords[2 * i2];
    var i2y = coords[2 * i2 + 1];

    var center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;

    // sort the points by distance from the seed triangle circumcenter
    quicksort(ids, coords, 0, ids.length - 1, center.x, center.y);

    // initialize a hash table for storing edges of the advancing convex hull
    this._hashSize = Math.ceil(Math.sqrt(points.length));
    this._hash = [];
    for (i = 0; i < this._hashSize; i++) this._hash[i] = null;

    // initialize a circular doubly-linked list that will hold an advancing convex hull
    var e = this.hull = insertNode(coords, i0);
    this._hashEdge(e);
    e.t = 0;
    e = insertNode(coords, i1, e);
    this._hashEdge(e);
    e.t = 1;
    e = insertNode(coords, i2, e);
    this._hashEdge(e);
    e.t = 2;

    var maxTriangles = 2 * points.length - 5;
    var triangles = this.triangles = new Uint32Array(maxTriangles * 3);
    var halfedges = this.halfedges = new Int32Array(maxTriangles * 3);

    this.trianglesLen = 0;

    this._addTriangle(i0, i1, i2, -1, -1, -1);

    var xp, yp;
    for (var k = 0; k < ids.length; k++) {
        i = ids[k];
        x = coords[2 * i];
        y = coords[2 * i + 1];

        // skip duplicate points
        if (x === xp && y === yp) continue;
        xp = x;
        yp = y;

        // skip seed triangle points
        if ((x === i0x && y === i0y) ||
            (x === i1x && y === i1y) ||
            (x === i2x && y === i2y)) continue;

        // find a visible edge on the convex hull using edge hash
        var startKey = this._hashKey(x, y);
        var key = startKey;
        var start;
        do {
            start = this._hash[key];
            key = (key + 1) % this._hashSize;
        } while ((!start || start.removed) && key !== startKey);

        e = start;
        while (area(x, y, e.x, e.y, e.next.x, e.next.y) >= 0) {
            e = e.next;
            if (e === start) {
                throw new Error('Something is wrong with the input points.');
            }
        }

        var walkBack = e === start;

        // add the first triangle from the point
        var t = this._addTriangle(e.i, i, e.next.i, -1, -1, e.t);

        e.t = t; // keep track of boundary triangles on the hull
        e = insertNode(coords, i, e);

        // recursively flip triangles from the point until they satisfy the Delaunay condition
        e.t = this._legalize(t + 2);
        if (e.prev.prev.t === halfedges[t + 1]) {
            e.prev.prev.t = t + 2;
        }

        // walk forward through the hull, adding more triangles and flipping recursively
        var q = e.next;
        while (area(x, y, q.x, q.y, q.next.x, q.next.y) < 0) {
            t = this._addTriangle(q.i, i, q.next.i, q.prev.t, -1, q.t);
            q.prev.t = this._legalize(t + 2);
            this.hull = removeNode(q);
            q = q.next;
        }

        if (walkBack) {
            // walk backward from the other side, adding more triangles and flipping
            q = e.prev;
            while (area(x, y, q.prev.x, q.prev.y, q.x, q.y) < 0) {
                t = this._addTriangle(q.prev.i, i, q.i, -1, q.t, q.prev.t);
                this._legalize(t + 2);
                q.prev.t = t;
                this.hull = removeNode(q);
                q = q.prev;
            }
        }

        // save the two new edges in the hash table
        this._hashEdge(e);
        this._hashEdge(e.prev);
    }

    // trim typed triangle mesh arrays
    this.triangles = triangles.subarray(0, this.trianglesLen);
    this.halfedges = halfedges.subarray(0, this.trianglesLen);
}

Delaunator.prototype = {

    _hashEdge: function (e) {
        this._hash[this._hashKey(e.x, e.y)] = e;
    },

    _hashKey: function (x, y) {
        var dx = x - this._cx;
        var dy = y - this._cy;
        // use pseudo-angle: a measure that monotonically increases
        // with real angle, but doesn't require expensive trigonometry
        var p = 1 - dx / (Math.abs(dx) + Math.abs(dy));
        return Math.floor((2 + (dy < 0 ? -p : p)) / 4 * this._hashSize);
    },

    _legalize: function (a) {
        var triangles = this.triangles;
        var coords = this.coords;
        var halfedges = this.halfedges;

        var b = halfedges[a];

        var a0 = a - a % 3;
        var b0 = b - b % 3;

        var al = a0 + (a + 1) % 3;
        var ar = a0 + (a + 2) % 3;
        var bl = b0 + (b + 2) % 3;

        var p0 = triangles[ar];
        var pr = triangles[a];
        var pl = triangles[al];
        var p1 = triangles[bl];

        var illegal = inCircle(
            coords[2 * p0], coords[2 * p0 + 1],
            coords[2 * pr], coords[2 * pr + 1],
            coords[2 * pl], coords[2 * pl + 1],
            coords[2 * p1], coords[2 * p1 + 1]);

        if (illegal) {
            triangles[a] = p1;
            triangles[b] = p0;

            this._link(a, halfedges[bl]);
            this._link(b, halfedges[ar]);
            this._link(ar, bl);

            var br = b0 + (b + 1) % 3;

            this._legalize(a);
            return this._legalize(br);
        }

        return ar;
    },

    _link: function (a, b) {
        this.halfedges[a] = b;
        if (b !== -1) this.halfedges[b] = a;
    },

    // add a new triangle given vertex indices and adjacent half-edge ids
    _addTriangle: function (i0, i1, i2, a, b, c) {
        var t = this.trianglesLen;

        this.triangles[t] = i0;
        this.triangles[t + 1] = i1;
        this.triangles[t + 2] = i2;

        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);

        this.trianglesLen += 3;

        return t;
    }
};

function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

function area(px, py, qx, qy, rx, ry) {
    return (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
}

function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    ax -= px;
    ay -= py;
    bx -= px;
    by -= py;
    cx -= px;
    cy -= py;

    var ap = ax * ax + ay * ay;
    var bp = bx * bx + by * by;
    var cp = cx * cx + cy * cy;

    return ax * (by * cp - bp * cy) -
           ay * (bx * cp - bp * cx) +
           ap * (bx * cy - by * cx) < 0;
}

function circumradius(ax, ay, bx, by, cx, cy) {
    bx -= ax;
    by -= ay;
    cx -= ax;
    cy -= ay;

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    if (bl === 0 || cl === 0) return Infinity;

    var d = bx * cy - by * cx;
    if (d === 0) return Infinity;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return x * x + y * y;
}

function circumcenter(ax, ay, bx, by, cx, cy) {
    bx -= ax;
    by -= ay;
    cx -= ax;
    cy -= ay;

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    var d = bx * cy - by * cx;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return {
        x: ax + x,
        y: ay + y
    };
}

// create a new node in a doubly linked list
function insertNode(coords, i, prev) {
    var node = {
        i: i,
        x: coords[2 * i],
        y: coords[2 * i + 1],
        t: 0,
        prev: null,
        next: null,
        removed: false
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

function removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.removed = true;
    return node.prev;
}

function quicksort(ids, coords, left, right, cx, cy) {
    var i, j, temp;

    if (right - left <= 20) {
        for (i = left + 1; i <= right; i++) {
            temp = ids[i];
            j = i - 1;
            while (j >= left && compare(coords, ids[j], temp, cx, cy) > 0) ids[j + 1] = ids[j--];
            ids[j + 1] = temp;
        }
    } else {
        var median = (left + right) >> 1;
        i = left + 1;
        j = right;
        swap(ids, median, i);
        if (compare(coords, ids[left], ids[right], cx, cy) > 0) swap(ids, left, right);
        if (compare(coords, ids[i], ids[right], cx, cy) > 0) swap(ids, i, right);
        if (compare(coords, ids[left], ids[i], cx, cy) > 0) swap(ids, left, i);

        temp = ids[i];
        while (true) {
            do i++; while (compare(coords, ids[i], temp, cx, cy) < 0);
            do j--; while (compare(coords, ids[j], temp, cx, cy) > 0);
            if (j < i) break;
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;

        if (right - i + 1 >= j - left) {
            quicksort(ids, coords, i, right, cx, cy);
            quicksort(ids, coords, left, j - 1, cx, cy);
        } else {
            quicksort(ids, coords, left, j - 1, cx, cy);
            quicksort(ids, coords, i, right, cx, cy);
        }
    }
}

function compare(coords, i, j, cx, cy) {
    var d1 = dist(coords[2 * i], coords[2 * i + 1], cx, cy);
    var d2 = dist(coords[2 * j], coords[2 * j + 1], cx, cy);
    return (d1 - d2) || (coords[2 * i] - coords[2 * j]) || (coords[2 * i + 1] - coords[2 * j + 1]);
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultGetX(p) {
    return p[0];
}
function defaultGetY(p) {
    return p[1];
}
