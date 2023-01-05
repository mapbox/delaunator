import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const config = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'Delaunator',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('delaunator.js', [resolve()]),
    config('delaunator.min.js', [resolve(), terser()])
];
