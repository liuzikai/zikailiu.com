const fs = require('fs');
const upath = require('upath');
const {PurgeCSS} = require("purgecss");

const srcFile = upath.resolve(upath.dirname(__filename), '../css/styles.full.css');
const safeList = {
    standard: [
        /.+-animated-svg/,
        'come-in',
        'collapsed',
        'collapsing',
        /masthead-.+-bg/,
        'arrow-button',
    ],
    deep: [
        /^baguetteBox.*/,
    ],
}
const destFile = upath.resolve(upath.dirname(__filename), '../css/styles.css');

async function runPurgeCSS() {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: [
            upath.resolve(upath.dirname(__filename), '../index.html'),
            upath.resolve(upath.dirname(__filename), '../projects/index.html'),
            upath.resolve(upath.dirname(__filename), '../photography/index.html'),
            upath.resolve(upath.dirname(__filename), '../errors/404.html'),
            upath.resolve(upath.dirname(__filename), '../errors/other.html'),
        ],
        css: [srcFile],
        safelist: safeList
    })
    fs.writeFileSync(destFile, purgeCSSResult[0].css.toString());
}

runPurgeCSS()
