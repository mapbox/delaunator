import uglify from 'rollup-plugin-uglify'

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
    config('delaunator.js', []),
    config('delaunator.min.js', [uglify()])
];
