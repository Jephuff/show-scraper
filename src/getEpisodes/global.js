var base = require("./base");

module.exports = base({
  blockRedirect: true,
  waitSelector: "body",
  getItems: function(done) {
    var retries = 0;

    (function getEpisodes() {
      if (retries > 3) return done(null, []);

      const title = Array.prototype.slice
        .call(document.querySelectorAll(".shawVideo_drawer_title"))
        .find(e => e.innerText.toLowerCase().includes("full episodes"));

      const episodes =
        title &&
        title.parentElement.parentElement.querySelectorAll(
          ".shawVideo_ThumbnailLink"
        );

      if (!episodes || !episodes.length) {
        retries += 1;
        setTimeout(getEpisodes, 100);
        return;
      }

      done(
        null,
        Array.prototype.slice
          .call(episodes)
          .filter(el => !el.classList.contains("shawVideo_RestrictedContent"))
          .map(function(link) {
            var url = link.href;
            var season = link.parentElement.querySelector(
              ".shawVideo_drawerItem_season"
            ).innerText;
            var episode = link.parentElement.querySelector(
              ".shawVideo_drawerItem_episode"
            ).innerText;
            var showName = url.match(/globaltv\.com\/([^\/?]*)/i)[1];

            return {
              url,
              episode,
              season,
              showName
            };
          })
      );
    })();
  }
});
