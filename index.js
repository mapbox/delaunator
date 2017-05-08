'use strict';

// var points = require('../concaveman/tmp/test.json');

var points = [];
for (var i = 0; i < 50; i++) {
    points.push([Math.random() * 800, Math.random() * 600]);
}
// var points = [[197.2438915845041,107.81312788615827],[322.1036604871113,166.9908316625814],[313.6562403018644,248.7626039180567],[289.81385723780323,38.475340891901766],[295.2642863075395,394.00767253413164],[402.81884257361185,330.00153530147463],[126.58954966249745,415.69554628436856],[33.34280336731297,450.0897765922154],[155.14277735518024,576.1370331856032],[621.7773361771856,53.83071491052118]];

console.log(points.length + ' points');

console.time('centroid');
var minX = Infinity;
var minY = Infinity;
var maxX = -Infinity;
var maxY = -Infinity;

for (var i = 0; i < points.length; i++) {
    var p = points[i];
    minX = Math.min(minX, p[0]);
    minY = Math.min(minY, p[1]);
    maxX = Math.max(maxX, p[0]);
    maxY = Math.max(maxY, p[1]);
}

var cx = (minX + maxX) / 2;
var cy = (minY + maxY) / 2;
console.timeEnd('centroid');

console.time('first');
var minDist = Infinity;
var first;

for (i = 0; i < points.length; i++) {
    var d = dist(cx, cy, points[i][0], points[i][1]);
    if (d < minDist) {
        first = points[i];
        minDist = d;
    }
}
console.timeEnd('first');

console.time('second');
minDist = Infinity;
var second;

for (i = 0; i < points.length; i++) {
    if (points[i] === first) continue;
    var d = dist(first[0], first[1], points[i][0], points[i][1]);
    if (d < minDist && d > 0) {
        second = points[i];
        minDist = d;
    }
}
console.timeEnd('second');

console.time('third');
var minRadius = Infinity;
var third;

for (i = 0; i < points.length; i++) {
    if (points[i] === first || points[i] === second) continue;

    var r = circumradius(first, second, points[i]);
    if (r < minRadius) {
        third = points[i];
        minRadius = r;
    }
}
console.timeEnd('third');

if (area(first, second, third) < 0) {
    var tmp = second;
    second = third;
    third = tmp;
}

var center = circumcenter(first, second, third);
var radius = Math.sqrt(circumradius(first, second, third));

console.time('sort');
quicksort(points, 0, points.length - 1, function (a, b) {
    var d1 = dist(a[0], a[1], center[0], center[1]);
    var d2 = dist(b[0], b[1], center[0], center[1]);
    return d1 - d2;
});
console.timeEnd('sort');

var hull = insertNode(first);
hull = insertNode(second, hull);
hull = insertNode(third, hull);

var triangles = [[first, second, third]];

console.time('triangulate');
function* triangulate() {
    for (i = 0; i < points.length; i++) {
        var p = points[i];
        if (p === first || p === second || p === third) continue;

        var e = hull;
        do {
            if (area(p, e.p, e.next.p) < 0) break;
            e = e.next;
        } while (e !== hull);

        triangles.push([p, e.p, e.next.p]);
        e = insertNode(p, e);

        var q = e.next;
        while (area(p, q.p, q.next.p) < 0) {
            triangles.push([p, q.p, q.next.p]);
            hull = removeNode(q);
            q = q.next;
        }

        q = e.prev.prev;
        while (area(p, q.p, q.next.p) < 0) {
            triangles.push([p, q.p, q.next.p]);
            hull = removeNode(q.next);
            q = q.prev;
        }

        yield true;
    }

    yield false;
}
console.timeEnd('triangulate');

function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

function circumradius(a, b, c) {
    var bx = b[0] - a[0];
    var by = b[1] - a[1];
    var cx = c[0] - a[0];
    var cy = c[1] - a[1];

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    if (bl === 0 || cl === 0) return Infinity;

    var d = bx * cy - by * cx;
    if (d === 0) return Infinity;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return x * x + y * y;
}

function area(p, q, r) {
    return (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
}

function circumcenter(a, b, c) {
    var bx = b[0] - a[0];
    var by = b[1] - a[1];
    var cx = c[0] - a[0];
    var cy = c[1] - a[1];

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    var d = bx * cy - by * cx;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return [a[0] + x, a[1] + y];
}

// create a new node in a doubly linked list
function insertNode(p, prev) {
    var node = {
        p: p,
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

function quicksort(arr, left, right, compare) {
    var i, j, temp;

    if (right - left <= 20) {
        for (i = left + 1; i <= right; i++) {
            temp = arr[i];
            j = i - 1;
            while (j >= left && compare(arr[j], temp) > 0) arr[j + 1] = arr[j--];
            arr[j + 1] = temp;
        }
    } else {
        var median = (left + right) >> 1;
        i = left + 1;
        j = right;
        swap(arr, median, i);
        if (compare(arr[left], arr[right]) > 0) swap(arr, left, right);
        if (compare(arr[i], arr[right]) > 0) swap(arr, i, right);
        if (compare(arr[left], arr[i]) > 0) swap(arr, left, i);

        temp = arr[i];
        while (true) {
            do i++; while (compare(arr[i], temp) < 0);
            do j--; while (compare(arr[j], temp) > 0);
            if (j < i) break;
            swap(arr, i, j);
        }
        arr[left + 1] = arr[j];
        arr[j] = temp;

        if (right - i + 1 >= j - left) {
            quicksort(arr, i, right, compare);
            quicksort(arr, left, j - 1, compare);
        } else {
            quicksort(arr, left, j - 1, compare);
            quicksort(arr, i, right, compare);
        }
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
