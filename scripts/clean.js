const fs = require('fs').promises;
const path = require('path');

const toRemove = ['css', 'js', 'index.html', 'photography/index.html', 'projects/index.html', 'errors/404.html', 'errors/other.html'];
const dirsToEnsure = ['css', 'js']

async function removeDirectoriesAndFiles() {
    const dirPath = path.join(__dirname, '..');
    for (const f of toRemove) {
        const fullPath = path.join(dirPath, f);
        await fs.rm(fullPath, {recursive: true, force: true});
    }

    for (const d of dirsToEnsure) {
        await fs.mkdir(d, {recursive: true});
    }
}

removeDirectoriesAndFiles();
