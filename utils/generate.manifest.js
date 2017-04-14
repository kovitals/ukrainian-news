/**
 * Created by valer on 14.04.2017.
 */
var manifest = require("../src/manifest.json"),
    fileSystem = require("fs"),
    path = require("path");

console.log( 'Generate manifest.json;' );

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

fileSystem.writeFileSync(
    path.join(__dirname, "../dist/manifest.json"),
    JSON.stringify(manifest)
);