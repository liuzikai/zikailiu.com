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
        "input": '../src/html/projects.ejs',
        "output": '../projects/index.html',
        "data": {},
    },
    {
        "input": '../src/html/index.ejs',
        "output": '../index.html',
        "data": {},
    },
    {
        "input": '../src/html/photography.ejs',
        "output": '../photography/index.html',
        "data": readJsonFile('../src/html/photography.json'),
    },
    {
        "input": '../src/html/error.ejs',
        "output": '../errors/404.html',
        "data": {
            "pageID": "404",
            "title": "Zikai Liu's Portfolio - 404",
            "description": "Zikai Liu's portfolio. The requested page is not found.",
            "mainText": "page not found",
        },
    },
    {
        "input": '../src/html/error.ejs',
        "output": '../errors/other.html',
        "data": {
            "pageID": "error",
            "title": "Zikai Liu's Portfolio - Error",
            "description": "Zikai Liu's portfolio. An error occurred.",
            "mainText": "An error occurred",
        },
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
