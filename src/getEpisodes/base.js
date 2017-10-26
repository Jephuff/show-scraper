var Window = require('../Window');
var getSeason = require('../getSeason');
var library = require('../library');
var num = /[0-9]*$/;

module.exports = function getEpisodes({
  blockRedirect,
  waitSelector,
  getItems,
  postProcess,
  waitms,
  loadAll,
  windowSettings,
  transformUrl = u => u,
}) {
  return function(url) {
    url = transformUrl(url);
    // console.log('start', url);
    let offdomain = false;
    const onRedirect =
      blockRedirect &&
      function(e, oldURL, newUrl, isMainFrame) {
        if (isMainFrame) {
          offdomain = {
            oldURL,
            newUrl,
            isMainFrame,
          };
        }
      };

    const window = Window(url, onRedirect, windowSettings);

    return window
      .then(function() {
        if (!offdomain) {
          var n = window;
          if (waitSelector) {
            n = n.wait(waitSelector);
          }
          if (waitms) {
            n = n.wait(waitms);
          }
          return n;
        }
        // console.log('offdomain, blocked');
      })
      .then(function() {
        return window.evaluate(loadAll ? loadAll : function() {});
      })
      .then(function() {
        return window.evaluate(getItems);
      })
      .then(function(episodes) {
        if (postProcess) {
          return Promise.all(
            episodes.map(function(episode) {
              return postProcess(url, episode);
            })
          );
        }

        return episodes;
      })
      .then(function(episodes) {
        episodes
          .filter(function(epObj) {
            return epObj.season && epObj.episode;
          })
          .reduce(function(library, epObj) {
            var episodeUrl = epObj.url;
            var showName = epObj.showName;
            var season = epObj.season;
            var episode = epObj.episode;

            // console.log(showName, season, episode, episodeUrl);

            var showObj = (library[showName] =
              library[showName] || (season === '-' ? {} : []));

            var seasonObj = (showObj[season] = showObj[season] || []);
            seasonObj[episode] = episodeUrl;

            return library;
          }, library.get());
      })
      .then(
        () => window.end(),
        e => {
          return window.end().then(() => {
            throw e;
          });
        }
      );
  };
};
