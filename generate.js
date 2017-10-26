var fs = require('fs');
var scrapers = require('./src/');

scrapers
  .all()
  .then(function(library) {
    fs.writeFile('scraped.json', JSON.stringify(library), function() {});
  })
  .catch(e => console.log('error?', e));
