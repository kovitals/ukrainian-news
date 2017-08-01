/**
 * Created by valer on 15.04.2017.
 */
const fileSystem = require("fs-extra");
const path = require("path");
const dir = process.argv[2];

if(!dir) {
    console.log('Error. Cleanup dir isn\'t defined;');
    return;
}

console.log( 'Cleanup dir: ' + dir );

// clean de dist folder
fileSystem.emptyDirSync(path.join(__dirname, dir));