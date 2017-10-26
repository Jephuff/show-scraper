var base = require("./base");

module.exports = base({
  waitSelector: ".episode",
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll(".episode"))
      .filter(function(el) {
        return el.querySelector(".unauth");
      })
      .map(function(link) {
        var info = link
          .querySelector(".number")
          .innerText.match(/Season ([0-9]*), Episode ([0-9]*)/);
        var url = link.href;
        var showName = url.match(/\/shows\/([^\/?]*)/i)[1];
        return {
          meta: link.querySelector(".number").innerText,
          url,
          showName,
          episode: parseInt(info[2], 10),
          season: parseInt(info[1], 10)
        };
      });
  }
});
