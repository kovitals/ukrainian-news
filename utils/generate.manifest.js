/**
 * Created by valer on 14.04.2017.
 */
var manifest = require("../src/manifest.json"),
    fileSystem = require("fs"),
    path = require("path"),
    channels = require("../src/channels.json");

console.log( 'Generate manifest.json;');

var distDir = path.join(__dirname, "../dist");

Object.keys(channels).forEach(function (key) {
    manifest.permissions.push( channels[key].rss );
});

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

if( !fileSystem.existsSync(distDir) ){
    fileSystem.mkdirSync(distDir);
}

fileSystem.writeFileSync(
    distDir + '/manifest.json',
    JSON.stringify(manifest)
);