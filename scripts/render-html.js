let ejs = require('ejs');
const fs = require('fs')
const upath = require("upath");

function readJsonFile(filepath) {
    try {
        const data = fs.readFileSync(upath.resolve(__dirname, filepath), 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('An error occurred:', err);
        return null;
    }
}

const files = [
    {
        "input": '../src/html/index.ejs',
        "output": '../index.html',
        "data": readJsonFile('../src/html/data/index.json'),
    },
    {
        "input": '../src/html/projects.ejs',
        "output": '../projects/index.html',
        "data": readJsonFile('../src/html/data/projects.json'),
    },
    {
        "input": '../src/html/photography.ejs',
        "output": '../photography/index.html',
        "data": readJsonFile('../src/html/data/photography.json'),
    },
    {
        "input": '../src/html/error.ejs',
        "output": '../errors/404.html',
        "data": readJsonFile('../src/html/data/404.json'),
    },
    {
        "input": '../src/html/error.ejs',
        "output": '../errors/other.html',
        "data": readJsonFile('../src/html/data/error.json'),
    },
]

async function renderHTML() {
    for (const f of files) {
        ejs.renderFile(upath.resolve(upath.dirname(__filename), f.input), f.data, {}, function (err, str) {
            if (err) {
                console.error(err);
                throw new Error('failed to render HTML');
            }
            const outputFilename = upath.resolve(upath.dirname(__filename), f.output);
            fs.writeFile(outputFilename, str, function (err) {
                if (err) {
                    console.error(err);
                    throw new Error('failed to render HTML');
                }
                console.log("Generate " + outputFilename);
            });
        });
    }
}

renderHTML()
