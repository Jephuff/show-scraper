var base = require('./base');

module.exports = base({
  blockRedirect: true,
  waitSelector: '.video_carousel .video_carousel_item a, .page .main_content',
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll('.video_carousel .video_carousel_item a'))
      .filter(function(el) {
        return !el
          .querySelector('.episode_title .title')
          .innerText.match(/^\s*(Clips:|Exclusive)/);
      })
      .map(function(link) {
        var info = link
          .querySelector('.episode_title .seasonep')
          .innerText.match(/Season ([0-9]*): Ep\.([0-9]*)/);
        var url = link.href;
        var showName = url.match(/\/shows\/([^\/?]*)/i)[1];
        return {
          meta: link.querySelector('.episode_title .seasonep').innerText,
          url,
          showName,
          episode: info && info[2],
          season:
            info &&
            (showName === 'TheDailyShow'
              ? parseInt(info[1], 10) + 20
              : info[1]),
        };
      });
  },
});
