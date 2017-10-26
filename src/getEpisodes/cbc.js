var base = require("./base");

var getSeason = require("../getSeason");

var num = /[0-9]*$/;

module.exports = base({
  waitSelector: ".episode-card-link",
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll(".episode-card-link"))
      .map(function(card) {
        var episodeEl = card.querySelector(".episode-number");
        return {
          url: card.href,
          episode:
            episodeEl &&
            episodeEl.getAttribute("aria-label").replace("Episode ", ""),
          season:
            card.href.includes("season-") &&
            card.href
              .match(/watch\.cbc\.ca\/([^\/]*)\/([^\/]*)\/([^\/]*)/)[2]
              .match(/[0-9]*$/)[0]
        };
      });
  },
  postProcess: function(url, epObj) {
    var meta = epObj.url.match(/watch\.cbc\.ca\/([^\/]*)\/([^\/]*)\/([^\/]*)/);

    epObj.showName = meta[1];
    epObj.season = epObj.season || meta[2].match(num)[0];
    epObj.episode = epObj.episode || meta[3].match(num)[0];

    if (!epObj.season && epObj.season !== 0) {
      return getSeason(epObj);
    }
    return epObj;
  }
});
