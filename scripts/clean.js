const fs = require('fs').promises;
const path = require('path');

const toRemove = ['css', 'js', 'photography/index.html'];

async function removeDirectoriesAndFiles() {
    try {
        const dirPath = path.join(__dirname, '..');
        for (const f of toRemove) {
            const fullPath = path.join(dirPath, f);
            await fs.rm(fullPath, { recursive: true, force: true });
        }
    } catch (error) {
        console.error(`Error while removing directory or file: ${error}`);
    }
}

removeDirectoriesAndFiles();
