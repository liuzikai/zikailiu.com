let ejs = require('ejs');
const fs = require('fs')
const upath = require("upath");

const files = [
    {
        "input": '../src/html/photography.ejs',
        "output": '../photography/index.html',
        "data": {},
    },
]

for (const f of files) {
    ejs.renderFile(upath.resolve(upath.dirname(__filename), f.input), {}, {}, function (err, str) {
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
