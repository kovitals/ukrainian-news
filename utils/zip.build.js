const zipdir = require('zip-dir');

zipdir('dist', {saveTo: 'build_' + process.env.npm_package_version + '.zip'}, function (err, buffer){
   if(err) {
      console.log('An error occurred during archiving:', err);
   } else {
      console.log('Archive has successfully created;');
   }
});
