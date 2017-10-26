const TVDB = require('node-tvdb');
const tvdb = new TVDB('461789D57BA69B5F');

const showCache = {};

module.exports = function(obj) {
  showCache[obj.showName] =
    showCache[obj.showName] ||
    tvdb
      .getSeriesByName(obj.showName.replace('-', ' '))
      .then(response => {
        return tvdb.getSeriesAllById(response[0].id);
      })
      .then(function(response) {
        var meta = response.episodes.reduce(function(acc, episode) {
          var sObj = (acc[episode.airedSeason] =
            acc[episode.airedSeason] || []);
          sObj[episode.airedEpisodeNumber] = episode;
          return acc;
        }, []);

        const absMap = meta.slice(1).reduce(function(acc, season) {
          return season.slice(1).reduce(function(acc, episode) {
            acc.push(episode);
            return acc;
          }, acc);
        }, [undefined]);
        return absMap;
      })
      .catch(error => {
        // console.log('error from the tvdb');
      })
      .then(d => d || []);

  return showCache[obj.showName].then(function(absMap) {
    const meta = absMap[obj.episode];

    if (meta) {
      obj.season = meta.airedSeason;
      obj.episode = meta.airedEpisodeNumber;
    }

    return obj;
  });
};
