import {terser} from 'rollup-plugin-terser';
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
    config('delaunator.min.js', [terser(), buble()])
];
