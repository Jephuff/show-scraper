var Window = require('./Window');
var settings = require('./settings');
var goToAll = require('./goToAll');

module.exports = function getUrls({
  url,
  wait,
  selector,
  prepare,
  filter = () => true,
}) {
  // console.log('start', url);
  let w = Window(url).wait(wait || selector);
  if (prepare) w = w.evaluate(prepare);
  return w
    .hrefs(selector)
    .end()
    .then(urls => urls.filter(filter));
};
