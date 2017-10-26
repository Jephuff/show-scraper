var Nightmare = require('nightmare');

var settings = require('./settings');

module.exports = function(callback) {
  let result = [];
  return function(urls) {
    return urls
      .reduce(function(promise, url) {
        return promise.then(function(arr) {
          result = result.concat(arr);
          return callback(url);
        });
      }, Promise.resolve([]))
      .then(arr => result.concat(arr));
  };
};
