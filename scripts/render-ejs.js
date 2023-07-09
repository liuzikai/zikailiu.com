let ejs = require('ejs');
const fs = require('fs')
const upath = require("upath");

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
        "data": {},
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

for (const f of files) {
    ejs.renderFile(upath.resolve(upath.dirname(__filename), f.input), f.data, {}, function (err, str) {
        if (err) {
            return console.error(err);
        }
        const outputFilename = upath.resolve(upath.dirname(__filename), f.output);
        fs.writeFile(outputFilename, str, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("Generate " + outputFilename);
        });
    });
}
