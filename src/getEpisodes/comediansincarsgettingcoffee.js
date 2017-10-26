var episodeParser = require("episode-parser");

var loadAll = require("../loadAll");
var base = require("./base");

module.exports = base({
  waitSelector: ".js-video-swap",
  loadAll: loadAll({
    loadMore: function() {
      var button = document.querySelector(".js-show-episodes");
      if(button.innerText.includes('more')) {
        button.click();
        return true;
      } else {
        return false;
      }
    }
  }),
  getItems: function() {
    return (
      Array.prototype.slice
        .call(document.querySelectorAll(".js-video-swap"))
        .map(function(el) {
          var link = el.querySelector('a');
          var info = el.querySelector('.type--video-episode-num');

          return {
            meta: `comedians in cars getting coffee ${info ? info.innerText : ''}`,
            url: link.href,
          };
        })
    );
  },
  postProcess: function(url, episode) {
    var meta = episode.meta;

    var showParts = episodeParser(meta) || {};
    Object.assign(episode, {
      showName: showParts.show,
      season: showParts.season,
      episode: showParts.episode
    });

    return episode;
  }
});
