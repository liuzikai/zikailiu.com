'use strict';
const fs = require('fs');
const upath = require('upath');

const src = upath.resolve(upath.dirname(__filename), '../src/js/umami.js')
const dest = upath.resolve(upath.dirname(__filename), '../js/umami.js')


if (!fs.existsSync(upath.dirname(dest))){
    fs.mkdirSync(upath.dirname(dest));
}
fs.copyFile(src, dest, (err) => {
    if (err) throw err;
});
