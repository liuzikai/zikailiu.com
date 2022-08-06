'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderScripts() {

    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../');

    sh.cp('-R', sourcePath, destPath)

    sh.cp(upath.resolve(upath.dirname(__filename), '../node_modules/bootstrap/dist/js/bootstrap.min.js'), destPath + "/js")
    sh.cp(upath.resolve(upath.dirname(__filename), '../node_modules/bootstrap/dist/js/bootstrap.min.js.map'), destPath + "/js")
};
