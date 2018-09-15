const set = require('lodash.set');
const path = require('path');
const fs = require('fs');
const parseCSV = require('csv-parse');
const util = require('util');

const langCSVDirectory = './assets/lang-csv';
const langBuildDirectory = './lang';

fs.readdir(langCSVDirectory, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err);

    files.forEach(function (file) {
        let csvFileContents = fs.readFileSync(path.join(langCSVDirectory, file), 'utf8');
        parseCSV(csvFileContents, {}, function(err, output){
            buildLangFile(output, file.replace('.csv', '.js'));
          });
    });
});

function buildLangFile(csv, fileName) {
    let languageObject = {};
    csv.forEach((row) => {
        let key = row[0];
        let comment = row[1];
        let sourceEnglish = row[2];
        let destinationLanguage = row[3];

        languageObject = set(languageObject, key, destinationLanguage);
    });
    
    fs.writeFile(
        path.join(langBuildDirectory, fileName),
        'export default ' + util.inspect(languageObject, {depth: Infinity}),
        (err) => {
            if(err) {
                return console.log(err);
            }
    
        console.log("Built " + path.join(langBuildDirectory, fileName));
    }); 
}


// let test = {};
// test = set(test, 'a.b.c', 234);
// console.log(test);