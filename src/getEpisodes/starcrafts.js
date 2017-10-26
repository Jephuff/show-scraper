var episodeParser = require("episode-parser");

var loadAll = require("../loadAll");
var base = require("./base");

module.exports = base({
  waitSelector: ".pl-video .pl-video-title",
  loadAll: loadAll({
    loadMore: function() {
      var button = document.querySelector(".load-more-button");
      var loader = document.querySelector(".load-more-loading");
      var hiddenLoader = document.querySelector(".load-more-loading.hid");

      if (loader && !hiddenLoader) true;
      if (!button || button.style.display === "none") return false;
      button.click();
      return true;
    }
  }),
  getItems: function() {
    return (
      Array.prototype.slice
        .call(document.querySelectorAll(".pl-video .pl-video-title > a"))
        .map(function(link) {
          return {
            meta: link.innerText,
            url: link.href,
          };
        })
    );
  },
  postProcess: function(url, episode) {
    var meta = episode.meta;
    switch (meta) {
      case "StarCrafts Ep19 Christmas Special":
        meta = "StarCrafts S01E19 Christmas Special";
        break;
      case "StarCrafts Christmas Special 2013 the Twelve Days of StarCrafts":
      case "StarCrafts: Nation Wars 2017 Grand Finals":
        meta = "";
        break;
      default:
        if (meta.match(/[Ee]pisode \d+/) && !meta.match(/ Season \d+/)) {
          meta = meta.replace(/[Ee]pisode /, "S01E");
        }
        meta = meta.replace(
          /[Ss](eason)? ?(\d+) ?(BroodWar )?[Ee](p(isode)?)? ?(\d+)/,
          "s$2e$6"
        );
    }

    var showParts = episodeParser(meta) || {};
    Object.assign(episode, {
      showName: showParts.show,
      season: showParts.season,
      episode: showParts.episode
    });

    return episode;
  }
});
