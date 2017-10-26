var base = require("./base");

var getSeason = require("../getSeason");

module.exports = base({
  waitSelector: ".show__episodes, .show__hero",
  getItems: function() {
    return Array.prototype.slice
      .call(
        document.querySelectorAll(
          ".show__episodes .post--episode .playButton:not(.playButton--locked)"
        )
      )
      .map(function(button) {
        var info = Array.prototype.slice
          .call(
            button.parentElement.parentElement.querySelectorAll(
              ".post__info .post__title--epnum span"
            )
          )
          .map(numEl => parseInt(numEl.innerText, 10));
        var url = button.querySelector("a").href;
        return {
          url,
          showName: url.match(/space\.ca\/show\/([^\/]*)/)[1],
          episode: info[1],
          season: info[0]
        };
      });
  }
});
