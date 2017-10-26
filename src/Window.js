var Nightmare = require('nightmare');

var settings = require('./settings');

module.exports = function(url, redirect, extraSettings) {
  var w = Nightmare(Object.assign(settings.nightmare, extraSettings));
  if (redirect) w = w.on('did-get-redirect-request', redirect);
  return w.goto(url);
};
