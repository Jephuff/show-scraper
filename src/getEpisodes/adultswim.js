var base = require("./base");

module.exports = base({
  waitSelector: ".show-content__header, .container",
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll(".show-content__season"))
      .map(function(el) {
        let season = el.querySelector(".season__seasonHeader");
        season = season && season.innerText;
        season = season && season.match(/[0-9]+$/);
        if (!season) return [];

        const seasonNum = parseInt(season[0], 10);

        return Array.prototype.slice
          .call(el.querySelectorAll(".episode__link"))
          .filter(el => !el.querySelector(".watch-as-logo__root"))
          .map(function(episodeEl) {
            const url = episodeEl.href;
            const episodeIdent = episodeEl.querySelector(
              ".episode__identifier"
            );

            const titleMatch = episodeEl
              .querySelector(".episode__title")
              .innerText.match(/season [0-9]+, episode ([0-9]+)/i);
            const episode = episodeIdent
              ? episodeIdent.innerText.match(/[0-9]+/)[0]
              : titleMatch && titleMatch[1];
            return {
              url,
              season: seasonNum,
              episode,
              showName: url.match(/videos\/([^\/]*)/)[1]
            };
          });
      })
      .reduce((a, b) => a.concat(b), []);
  }
});
