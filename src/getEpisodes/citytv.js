var base = require("./base");

var getSeason = require("../getSeason");

module.exports = base({
  blockRedirect: true,
  waitSelector: "main",
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll('[data-video-type="episode"]'))
      .map(function(link) {
        var url = "?video=" + link.dataset.videoId;
        var info =
          link
            .querySelector(".latest-aired,.bcc-carousel-details")
            .innerText.match(/S([0-9]*),\s*E([0-9]*)/) || [];

        return {
          url,
          episode: info[2],
          season: info[1]
        };
      });
  },
  postProcess: function(url, episode) {
    episode.url = url + episode.url;
    episode.showName = url.match(/\/shows\/([^\/?]*)/i)[1];
    return episode;
  }
});
