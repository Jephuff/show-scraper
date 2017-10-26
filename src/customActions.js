var Nightmare = require('nightmare');

Nightmare.action('hrefs', function(selector, done) {
  this.evaluate_now(
    function(selector) {
      return Array.prototype.slice
        .call(document.querySelectorAll(selector))
        .map(function(card) {
          return card.href;
        });
    },
    done,
    selector
  );
});
