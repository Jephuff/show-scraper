require('./customActions');

var getUrls = require('./getUrls');
var settings = require('./settings');

var Nightmare = require('nightmare');

var season = require('./season');
var Window = require('./Window');
var getEpisodes = require('./getEpisodes');
var goToAll = require('./goToAll');

function getIt({ getShows, getSeasons, getEpisodes }) {
  var promise = getUrls(getShows);

  if (getSeasons) {
    promise = promise.then(
      goToAll(url => getUrls(Object.assign({ url }, getSeasons)))
    );
  }

  return promise.then(goToAll(getEpisodes)).then(function() {
    var library = require('./library').get();
    return Object.keys(library).reduce(function(acc, key) {
      acc[settings.includeShows[key] || key] = library[key];
      return acc;
    }, {});
  });
}

function defaultFilter(key) {
  const excludeShows = settings.excludeShows[key] || [];
  return url => !excludeShows.some(s => url.includes(s));
}

function renameShows() {
  var library = require('./library').get();
  return Object.keys(library).reduce(function(acc, key) {
    acc[settings.includeShows[key] || key] = library[key];
    return acc;
  }, {});
}

module.exports = {
  all: function() {
    return Object.entries(this)
      .filter(([k]) => !['all', 'tinyDesk'].includes(k))
      .reduce(
        (promise, [k, v]) => promise.then(v, e => console.log(k, 'failed')),
        this.tinyDesk().catch(e => console.log('tiny desk failed'))
      )
      .then(renameShows);
  },
  space: function() {
    return getIt({
      getShows: {
        url: 'http://www.space.ca/shows/',
        selector: '.post--show-home .post__title a',
        filter: defaultFilter('space'),
      },
      getEpisodes: getEpisodes.space,
    });
  },
  cbc: function() {
    return getIt({
      getShows: {
        url: 'http://watch.cbc.ca/shows/all/',
        selector: '.media-card-link',
        filter: defaultFilter('cbc'),
        prepare: function(done) {
          (function scrollDown() {
            if (document.querySelector('.show-more, .loading-container')) {
              scrollTo(0, document.querySelector('#main-content').offsetHeight);
              setTimeout(scrollDown, 10);
            } else {
              done();
            }
          })();
        },
      },
      getSeasons: {
        wait: '.media-list, .content-section',
        selector: '.tab-bar-wrapper ul > li > a',
      },
      getEpisodes: getEpisodes.cbc,
    });
  },
  comedy: function() {
    return getIt({
      getShows: {
        url: 'http://www.thecomedynetwork.ca/shows',
        selector: '.show .view_link a.show_page',
        filter: defaultFilter('comedy'),
      },
      getEpisodes: getEpisodes.comedy,
    });
  },
  much: function() {
    return getIt({
      getShows: {
        url: 'http://www.much.com/shows/',
        selector: '#ShowsLanding>div .watch-episodes',
        filter: defaultFilter('much'),
      },
      getEpisodes: getEpisodes.much,
    });
  },
  citytv: function() {
    return getIt({
      getShows: {
        url: 'https://www.citytv.com/toronto/shows/',
        selector: '.boxes-list-item a',
        filter: defaultFilter('citytv'),
      },
      getEpisodes: getEpisodes.citytv,
    });
  },
  global: function() {
    // no episodes?
    return getIt({
      getShows: {
        url: 'http://www.globaltv.com/shows/',
        selector: '.allShows-show .videoLink',
        filter: defaultFilter('global'),
      },
      getEpisodes: getEpisodes.global,
    });
  },
  adultswim: function() {
    // "http://www.adultswim.com/videos/" freezes for some reason, hard coding shows"
    return goToAll(getEpisodes.adultswim)([
      'http://www.adultswim.com/videos/american-dad/',
      'http://www.adultswim.com/videos/aqua-teen-hunger-force/',
      'http://www.adultswim.com/videos/attack-on-titan/',
      'http://www.adultswim.com/videos/black-jesus/',
      'http://www.adultswim.com/videos/bobs-burgers/',
      'http://www.adultswim.com/videos/childrens-hospital/',
      'http://www.adultswim.com/videos/the-cleveland-show/',
      'http://www.adultswim.com/videos/decker/',
      'http://www.adultswim.com/videos/the-eric-andre-show/',
      'http://www.adultswim.com/videos/family-guy/',
      'http://www.adultswim.com/videos/on-cinema/',
      'http://www.adultswim.com/videos/rick-and-morty/',
      'http://www.adultswim.com/videos/robot-chicken/',
      'http://www.adultswim.com/videos/samurai-jack/',
    ]).then(function() {
      var library = require('./library').get();
      return Object.keys(library).reduce(function(acc, key) {
        acc[settings.includeShows[key] || key] = library[key];
        return acc;
      }, {});
    });
    // return getIt({
    //   getShows: {
    //     url: "http://www.adultswim.com/videos/",
    //     wait: 5000,
    //     selector: ".show-list__showLink",
    //     filter: defaultFilter("adultswim")
    //   },
    //   getEpisodes: getEpisodes.adultswim
    // });
  },
  amc: function() {
    return getEpisodes
      .amc('http://www.amc.com/full-episodes-archive')
      .then(renameShows);
  },
  bravo: function() {
    return getIt({
      getShows: {
        url: 'http://www.bravo.ca/shows',
        selector: '.view_link a',
        filter: defaultFilter('bravo'),
      },
      getEpisodes: getEpisodes.bravo,
    });
  },
  starcrafts: function() {
    return getEpisodes
      .starcrafts(
        'https://www.youtube.com/playlist?list=PL0QrZvg7QIgpoLdNFnEePRrU-YJfr9Be7'
      )
      .then(renameShows);
  },
  comediansincarsgettingcoffee: function() {
    return getEpisodes
      .comediansincarsgettingcoffee('http://comediansincarsgettingcoffee.com/')
      .then(renameShows);
  },
  tinyDesk: function() {
    return getEpisodes
      .tinyDesk('http://www.npr.org/series/tiny-desk-concerts/archive')
      .then(renameShows);
  },
  trutv: function() {
    return getIt({
      getShows: {
        url: 'http://www.trutv.com/shows/index.html',
        selector: '.series-row .title a',
        filter: defaultFilter('trutv'),
      },
      getEpisodes: getEpisodes.truetv,
    });
  },
};
