/* Diagrams for the page need

   1. The Delaunator library
   2. The algorithms shown on the page (defined in <script> tags)

   The only things that remain are

   3. The sample data
   4. The conversion to SVG

   Those are in this file.

*/

/* global Delaunator, triangleCenter, forEachTriangle, forEachTriangleEdge, forEachVoronoiCell, edgesAroundPoint, nextHalfedge */

/* points1 = new Poisson([1000, 1000], 70, undefined, undefined, Math.random).fill() */
const points1 = [[338, 601], [357, 469], [200, 583], [424, 634], [302, 516], [265, 650], [459, 570], [367, 723], [453, 454], [220, 472], [326, 367], [424, 369], [393, 544], [121, 661], [180, 704], [126, 516], [87, 588], [523, 614], [472, 730], [277, 751], [585, 554], [532, 497], [351, 835], [450, 819], [511, 377], [586, 429], [251, 396], [164, 416], [224, 322], [299, 238], [404, 275], [470, 315], [121, 762], [2, 630], [21, 699], [186, 828], [40, 412], [28, 496], [572, 699], [646, 616], [566, 811], [275, 856], [622, 493], [720, 565], [382, 945], [257, 933], [475, 895], [554, 890], [512, 255], [627, 367], [570, 314], [712, 448], [126, 337], [122, 265], [212, 216], [397, 183], [326, 154], [35, 833], [117, 848], [145, 935], [58, 296], [652, 769], [653, 686], [770, 664], [628, 884], [697, 846], [816, 549], [454, 980], [586, 971], [670, 968], [508, 119], [573, 179], [697, 247], [755, 324], [625, 264], [783, 442], [73, 178], [142, 186], [188, 123], [408, 98], [318, 68], [21, 948], [9, 207], [782, 761], [717, 730], [854, 729], [894, 659], [741, 916], [815, 896], [884, 580], [856, 416], [898, 511], [804, 996], [599, 69], [472, 10], [665, 138], [821, 232], [775, 147], [884, 279], [98, 53], [17, 94], [208, 28], [381, 5], [91, 980], [836, 811], [918, 766], [974, 706], [900, 843], [962, 580], [939, 930], [874, 969], [970, 492], [958, 327], [938, 405], [567, 0], [700, 16], [910, 184], [863, 106], [956, 248], [780, 21], [890, 354], [987, 801], [979, 96], [742, 82], [917, 44], [853, 14], [986, 876], [986, 171], [980, 11]];
const points2 = [[320, 170], [400, 270], [220, 270], [530, 50], [100, 80], [300, 30]];

const delaunay1 = Delaunator.from(points1);
const delaunay2 = Delaunator.from(points2);


function tangent(a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.sqrt(dx * dx + dy * dy);
    return [dx / d, dy / d];
}

function normal(a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.sqrt(dx * dx + dy * dy);
    return [dy / d, -dx / d];
}


function redPointsSvg(points) {
    const results = ['<g class="seed-points">'];
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        results.push(`<circle class="point-${i}" cx="${p[0]}" cy="${p[1]}" r="5"/>`);
    }
    results.push('</g>');
    return results.join('');
}

function bluePointsSvg(points, delaunay) {
    const results = ['<g class="vertices">'];
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        const point = triangleCenter(points, delaunay, t);
        results.push(`<circle cx="${point[0]}" cy="${point[1]}" r="3" fill="hsl(240,50%,50%)"/>`);
    }
    results.push('</g>');
    return results.join('');
}

function delaunaySvg(points, delaunay) {
    const results = ['<g class="edges">'];
    forEachTriangleEdge(points, delaunay, (e, p, q) => {
        results.push(`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" />`);
    });
    results.push('</g>');
    return results.join('');
}

function trianglesSvg(points, delaunay, fill = () => 'white') {
    const results = ['<g class="delaunay-draw">'];
    forEachTriangle(points, delaunay, (t, p) => {
        results.push(`<polygon data-id="${t}" points="${p}" fill="${fill(t)}"/>`);
    });
    results.push('</g>');
    return results.join('');
}

function voronoiSvg(points, delaunay) {
    const results = ['<g class="edges">'];
    for (let e = 0; e < delaunay.halfedges.length; e++) {
        if (e < delaunay.halfedges[e]) {
            const a = triangleCenter(points, delaunay, Math.floor(e / 3));
            const b = triangleCenter(points, delaunay, Math.floor(delaunay.halfedges[e] / 3));
            results.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
        }
    }
    results.push('</g>');
    return results.join('');
}

function cellsSvg(points, delaunay) {
    const results = ['<g class="voronoi-draw">'];
    forEachVoronoiCell(points, delaunay, (p, vertices) => {
        const hue = (2 * p) % 360;
        results.push(`<polygon data-id="${p}" points="${vertices}" fill="hsl(${hue},20%,50%)"/>`);
    });
    results.push('</g>');
    return results.join('');
}

function halfedgeSvg(points, delaunay, filter = () => true) {
    const dn = 4, dt = 15;
    const results = ['<g class="edges arrowhead">'];
    for (let e1 = 0; e1 < delaunay.halfedges.length; e1++) {
        if (!filter(e1)) { continue; }
        const e2 = nextHalfedge(e1);
        const a = points[delaunay.triangles[e1]];
        const b = points[delaunay.triangles[e2]];
        const n = normal(a, b);
        const t = tangent(a, b);
        results.push(`<line class="edge-${e1}" x1="${a[0] + dn * n[0] + dt * t[0]}" y1="${a[1] + dn * n[1] + dt * t[1]}" x2="${b[0] + dn * n[0] - dt * t[0]}" y2="${b[1] + dn * n[1] - dt * t[1]}" />`);
    }
    results.push('</g>');
    return results.join('');
}

const $ = document.querySelector.bind(document);


$('#diagram-points').innerHTML = `
<svg viewBox="100 200 800 200">
  ${redPointsSvg(points1)}
</svg>
<figcaption>Delaunator input</figcaption>`;


$('#diagram-delaunay').innerHTML = `
<svg viewBox="100 200 800 200">
  ${delaunaySvg(points1, delaunay1)}
  ${redPointsSvg(points1)}
</svg>
<figcaption>Delaunator output</figcaption>`;


$('#diagram-halfedges').innerHTML = `
<svg viewBox="300 300 400 200">
  ${halfedgeSvg(points1, delaunay1)}
  ${redPointsSvg(points1)}
</svg>
<figcaption>Half-edges</figcaption>`;


$('#diagram-delaunay-edges').innerHTML = `
<svg viewBox="100 100 800 400">
  ${delaunaySvg(points1, delaunay1)}
</svg>
<figcaption>Drawing triangle edges</figcaption>`;


$('#diagram-triangles').innerHTML = `
<svg viewBox="100 100 800 400">
  ${trianglesSvg(points1, delaunay1, t => `hsl(${t % 360},20%,50%)`)}
  ${delaunaySvg(points1, delaunay1)}
</svg>
<figcaption>Drawing triangles</figcaption>`;


$('#diagram-circumcenters').innerHTML = `
<svg viewBox="100 100 800 400">
  ${delaunaySvg(points1, delaunay1)}
  ${bluePointsSvg(points1, delaunay1)}
  ${redPointsSvg(points1)}
</svg>
<figcaption>Circumcenters of the triangles</figcaption>`;


$('#diagram-voronoi-edges').innerHTML = `
<svg viewBox="100 100 800 400">
  ${voronoiSvg(points1, delaunay1)}
</svg>
<figcaption>Drawing Voronoi edges</figcaption>`;


$('#diagram-voronoi').innerHTML = `
<svg viewBox="100 100 800 400">
  ${cellsSvg(points1, delaunay1)}
  ${voronoiSvg(points1, delaunay1)}
</svg>
<figcaption>Drawing Voronoi cells</figcaption>`;


$('#diagram-circulate').innerHTML = `
<svg viewBox="0 0 600 300">
  <g class="highlight"></g>
  ${halfedgeSvg(points2, delaunay2)}
  ${redPointsSvg(points2)}
</svg>
Step: <input type=range value=0 min=0 max=9 oninput="updateCirculation()">
<figcaption>Circulate around point</figcaption>
</figure>`;
function updateCirculation() {
    const slider = $('#diagram-circulate input');
    const incoming = edgesAroundPoint(delaunay2, 2);
    const outgoing = incoming.map(e => nextHalfedge(e));
    const step = slider.valueAsNumber;
    const edge = step % 2 === 0 ? incoming[step / 2] : outgoing[(step - 1) / 2];
    $('#diagram-circulate .highlight').innerHTML = halfedgeSvg(points2, delaunay2, e => e === edge);
}
updateCirculation();
