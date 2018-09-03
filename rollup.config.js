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

const bubleConfig = {transforms: {dangerousForOf: true}};

export default [
    config('delaunator.js', [buble(bubleConfig)]),
    config('delaunator.min.js', [terser(), buble(bubleConfig)])
];
