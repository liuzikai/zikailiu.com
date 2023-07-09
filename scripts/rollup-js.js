// rollup-js.js

const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const path = require('path');

const basePath = path.join(__dirname, '..');

async function build() {
    const bundle = await rollup.rollup({
        input: path.join(basePath, 'src/js/scripts.js'),
        plugins: [resolve(), commonjs()],
    });

    await bundle.write({
        file: path.join(basePath, 'js/scripts.js'),
        format: 'umd',
        name: 'bootstrap',
        sourcemap: true,
    });
}

build()
