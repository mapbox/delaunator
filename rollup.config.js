import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';

const config = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'Delaunator',
        format: 'umd',
        file
    },
    plugins
});

export default [
    config('delaunator.js', [buble()]),
    config('delaunator.min.js', [uglify(), buble()])
];
