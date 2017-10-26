var episodeParser = require('episode-parser');
const TVDB = require('node-tvdb');
const tvdb = new TVDB('461789D57BA69B5F');

var loadAll = require('../loadAll');
var base = require('./base');

var promise = tvdb.getSeriesAllById(310925).then(r =>
  r.episodes
    .map(e => {
      e.normalizedTitle = (e.episodeName || '').replace(/[\s:]*/g, '');
      return e;
    })
    .filter(Boolean)
);

module.exports = base({
  windowSettings: {
    executionTimeout: 120000,
  },
  waitSelector: '.archivelist',
  loadAll: loadAll({
    delay: 10,
    loadMore: function() {
      window.__shift =
        typeof window.__shift === 'undefined'
          ? 700
          : Math.max(window.__shift - 10);
      var last = document.querySelector(
        '#infinitescrollwrap .article-type-video:last-child .title'
      );

      if (!last || last.innerText.replace(/\s*/g, '') !== 'LauraGibson') {
        scrollTo(
          0,
          document.querySelector('main').offsetHeight - window.__shift
        );
        // scrollTo(0, document.querySelector("main").offsetHeight);
        return true;
      }
    },
  }),
  getItems: function() {
    return fetch(
      'http://www.npr.org/partials/music/series/tiny-desk-concerts/archive?start=10'
    )
      .then(r => r.text())
      .then(str => {
        var div = document.createElement('div');
        div.innerHTML = str;
        document.querySelector('#event-more-inner').appendChild(div);
        return Array.prototype.slice
          .call(document.querySelectorAll('.article-type-video .title a'))
          .map(function(link) {
            return {
              title: link.innerText,
              url: link.href,
            };
          });
      });
  },
  postProcess: function(url, episode) {
    return promise.then(function(episodes) {
      const normalizedTitle = episode.title
        .replace('Tiny Desk Special Edition: ', '')
        .replace('Throwback Thursday: ', '')
        .replace('Tiny Desk Concert: ', '')
        .replace(/[\s:]*/g, '');
      const possibleEpisodes = episodes.filter(
        e => e.normalizedTitle === normalizedTitle
      );
      let epObj = possibleEpisodes[0];

      if (possibleEpisodes.length > 1) {
        const year = (episode.url.match(/\/(\d{4})\/\d{2}\/\d{2}\//) || [])[1];
        if (year) {
          epObj = possibleEpisodes.find(
            e => e.airedSeason === parseInt(year, 10)
          );
        } else if (episode.title === 'Wilco') {
          epObj = possibleEpisodes.find(e => e.airedSeason !== 2016);
        }
      }

      if (epObj) {
        Object.assign(episode, {
          showName: 'npr-music-tiny-desk-concerts',
          season: epObj.airedSeason,
          episode: epObj.airedEpisodeNumber,
        });
      } else if (episode.title) {
        // console.log("no title?");
      }

      return episode;
    });
  },
});
