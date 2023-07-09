// minify-js.js

const Terser = require('terser');
const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..');

Terser.minify({
    [path.join(basePath, 'js/scripts.js')]: fs.readFileSync(path.join(basePath, 'js/scripts.js'), 'utf8')
}, {
    compress: { passes: 2 },
    mangle: true,
    sourceMap: {
        content: fs.readFileSync(path.join(basePath, 'js/scripts.js.map'), 'utf8'),
        includeSources: true,
        url: 'scripts.min.js.map'
    },
    output: {
        comments: /^!/
    }
})
    .then(result => {
        fs.writeFileSync(path.join(basePath, 'js/scripts.min.js'), result.code);
        fs.writeFileSync(path.join(basePath, 'js/scripts.min.js.map'), result.map);
    })
