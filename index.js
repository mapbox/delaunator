'use strict';

var points = require('../concaveman/tmp/test.json');
var i;

// var points = [];
// for (var i = 0; i < 100; i++) {
//     points.push([Math.random() * 800, Math.random() * 600]);
// }

console.log(points.length + ' points');

console.time('flatten');

var minX = Infinity;
var minY = Infinity;
var maxX = -Infinity;
var maxY = -Infinity;
var coords = [];
var ids = [];

for (i = 0; i < points.length; i++) {
    var p = points[i];
    var x = p[0];
    var y = p[1];
    ids.push(i * 2);
    coords.push(x);
    coords.push(y);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
}

var cx = (minX + maxX) / 2;
var cy = (minY + maxY) / 2;

console.timeEnd('flatten');


console.time('first');

var minDist = Infinity;
var i0;

for (i = 0; i < coords.length; i += 2) {
    var d = dist(cx, cy, coords[i], coords[i + 1]);
    if (d < minDist) {
        i0 = i;
        minDist = d;
    }
}

console.timeEnd('first');

console.time('second');

minDist = Infinity;
var i1;

for (i = 0; i < coords.length; i += 2) {
    if (i === i0) continue;
    var d = dist(coords[i0], coords[i0 + 1], coords[i], coords[i + 1]);
    if (d < minDist && d > 0) {
        i1 = i;
        minDist = d;
    }
}

console.timeEnd('second');

console.time('third');

var minRadius = Infinity;
var i2;

for (i = 0; i < coords.length; i += 2) {
    if (i === i0 || i === i1) continue;

    var r = circumradius(
        coords[i0], coords[i0 + 1],
        coords[i1], coords[i1 + 1],
        coords[i], coords[i + 1]);

    if (r < minRadius) {
        i2 = i;
        minRadius = r;
    }
}

if (area(coords[i0], coords[i0 + 1],
         coords[i1], coords[i1 + 1],
         coords[i2], coords[i2 + 1]) < 0) {

    var tmp = i1;
    i1 = i2;
    i2 = tmp;
}

var center = circumcenter(
    coords[i0], coords[i0 + 1],
    coords[i1], coords[i1 + 1],
    coords[i2], coords[i2 + 1]);

console.timeEnd('third');

console.time('sort');
quicksort(ids, coords, 0, ids.length - 1, center.x, center.y);
console.timeEnd('sort');

console.time('triangulate');

var hull = insertNode(coords, i0);
hull = insertNode(coords, i1, hull);
hull = insertNode(coords, i2, hull);

var triangles = [i0, i1, i2];

// function* triangulate() {
for (var k = 0; k < ids.length; k++) {
    i = ids[k];
    if (i === i0 || i === i1 || i === i2) continue;

    var x = coords[i];
    var y = coords[i + 1];

    var e = hull;
    do {
        if (area(x, y, e.x, e.y, e.next.x, e.next.y) < 0) break;
        e = e.next;
    } while (e !== hull);

    addTriangle(triangles, i, e);
    e = insertNode(coords, i, e);

    var q = e.next;
    while (area(x, y, q.x, q.y, q.next.x, q.next.y) < 0) {
        addTriangle(triangles, i, q);
        hull = removeNode(q);
        q = q.next;
    }

    q = e.prev;
    while (area(x, y, q.prev.x, q.prev.y, q.x, q.y) < 0) {
        addTriangle(triangles, i, q.prev);
        hull = removeNode(q);
        q = q.prev;
    }
    // yield;
}
// }
console.timeEnd('triangulate');

function addTriangle(triangles, i, e) {
    triangles.push(e.i);
    triangles.push(i);
    triangles.push(e.next.i);
}

function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

function circumradius(ax, ay, bx, by, cx, cy) {
    var bx = bx - ax;
    var by = by - ay;
    var cx = cx - ax;
    var cy = cy - ay;

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    if (bl === 0 || cl === 0) return Infinity;

    var d = bx * cy - by * cx;
    if (d === 0) return Infinity;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return x * x + y * y;
}

function area(px, py, qx, qy, rx, ry) {
    return (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
}

function circumcenter(ax, ay, bx, by, cx, cy) {
    var bx = bx - ax;
    var by = by - ay;
    var cx = cx - ax;
    var cy = cy - ay;

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
        x: coords[i],
        y: coords[i + 1],
        prev: null,
        next: null
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
    var d1 = dist(coords[i], coords[i + 1], cx, cy);
    var d2 = dist(coords[j], coords[j + 1], cx, cy);
    return d1 - d2;
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
