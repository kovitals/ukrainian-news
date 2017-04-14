const zipdir = require('zip-dir');

zipdir('public', {saveTo: 'build/build.zip'}, function (err, buffer){
   if(err) {
      console.log('An error occurred during archiving:', err);
   } else {
      console.log('Archive has successfully created;');
   }
});
