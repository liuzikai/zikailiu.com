const fs = require('fs');
const upath = require('upath');
const {PurgeCSS} = require("purgecss");

const htmlFile = upath.resolve(upath.dirname(__filename), '../index.html');
const srcFile = upath.resolve(upath.dirname(__filename), '../css/styles.full.css');
const safeList = {
    standard: [/.+-animated-svg/, 'come-in'],
}
const destFile = upath.resolve(upath.dirname(__filename), '../css/styles.css');

async function runPurgeCSS() {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: [htmlFile],
        css: [srcFile],
        safelist: safeList
    })
    fs.writeFileSync(destFile, purgeCSSResult[0].css.toString());
}

runPurgeCSS()
