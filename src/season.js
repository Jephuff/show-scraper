var Window = require('./Window');
var getEpisodes = require('./getEpisodes');

var num = /[0-9]*$/;

module.exports = function(url) {
  var window = Window(url);

  return getEpisodes(window, url).then(
    function() {
      return window.end();
    },
    e => {
      return window.end().then(() => {
        throw e;
      });
    }
  );
};
