const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..');

const source = path.join(basePath, 'node_modules/baguettebox.js/dist/baguetteBox.min.js');
const destination = path.join(basePath, 'js/baguetteBox.min.js');

fs.copyFile(source, destination, (err) => {
    if (err) {
        throw new Error(`Failed to copy file: ${err}`);
    }
});
