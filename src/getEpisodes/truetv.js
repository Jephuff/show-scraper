var base = require("./base");

module.exports = base({
  waitSelector: "body",
  transformUrl: url => url.replace(/\/shows\//, "/full-episodes/"),
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll(".ttvpromorow"))
      .reduce((seasons, seasonEl) => {
        const seasonMatch = seasonEl.querySelector("h2").innerText.match(/SEASON\s+(\d+)/);
        const season = seasonMatch && parseInt(
          seasonMatch[1],
          10
        );
        return Array.prototype.slice
          .call(seasonEl.querySelectorAll("li a"))
          .reduce((episodes, episodeEl) => {
            const url = episodeEl.href;
            const subHead = episodeEl.querySelector(".subhead").innerText.match(/^\d*(\d{2})/);
            episodes.push({
              url,
              episode:
                subHead &&
                parseInt(subHead[1], 10),
              season,
              showName: url.match(/trutv\.com\/full-episodes\/([^\/]+)/)[1]
            });

            return episodes;
          }, seasons);
      }, []);
  }
});
