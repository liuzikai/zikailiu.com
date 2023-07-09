'use strict';
const autoprefixer = require('autoprefixer')
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const postcss = require('postcss')
const sass = require('sass');
const sh = require('shelljs');

const stylesPath = '../src/scss/styles.scss';
const destPath = upath.resolve(upath.dirname(__filename), '../css/styles.full.css');

const entryPoint = `/*!
 * CSS for my portfolio. See styles.full.js for the unminified version.
 * Copyright 2022 Zikai Liu
 * Reference: Start Bootstrap - Grayscale v7.0.5 (https://startbootstrap.com/theme/grayscale, Licensed under MIT)
 */
@import "${stylesPath}"
`;

const results = sass.renderSync({
    data: entryPoint,
    includePaths: [
        upath.resolve(upath.dirname(__filename), '../node_modules')
    ],
});

const destPathDirname = upath.dirname(destPath);
if (!sh.test('-e', destPathDirname)) {
    sh.mkdir('-p', destPathDirname);
}

postcss([ autoprefixer ]).process(results.css, {from: 'styles.css', to: 'styles.css'}).then(result => {
    result.warnings().forEach(warn => {
        console.warn(warn.toString())
    })
    fs.writeFileSync(destPath, result.css.toString());
});
