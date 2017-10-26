module.exports = function loadAll({ loadMore, delay = 500 }) {
  return Function(
    'done',
    `
    var loadMore = ${loadMore.toString()};
    function scrollDown() {
        if(loadMore()) {
            setTimeout(scrollDown, ${delay});
        } else {
            done();
        }
    }

    scrollDown();
  `
  );
};
