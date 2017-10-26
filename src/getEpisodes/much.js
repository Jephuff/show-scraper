var loadAll = require('../loadAll');
var base = require('./base');

module.exports = base({
  waitSelector: '.ep-num,.seasonepisode, .ShowContainer, #Content',
  loadAll: loadAll({
    loadMore: function() {
      var button = document.querySelector('.load-more-collection-posts');
      var loader = document.querySelector('.loading-collection-posts');
      var loading = loader && loader.style.display !== 'none';

      if (loading) true;
      if (!button || button.style.display === 'none') return false;
      button.click();
      return true;
    },
  }),
  getItems: function() {
    return Array.prototype.slice
      .call(document.querySelectorAll('.ep-num,.seasonepisode'))
      .map(function(link) {
        var info = link.innerText.match(/S([0-9]*)E([0-9]*)/) || [];
        var url = link.href;
        return {
          url,
          showName: url.match(/\/shows\/([^\/?]*)/i)[1],
          episode: info[2],
          season: info[1],
        };
      });
  },
});
