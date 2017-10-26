// var settings = require("../src/settings");
// settings.nightmare.show = true;
// var scrape = require("../src");
// scrape.citytv().then(function(data) {
//   console.log("done", JSON.stringify(Object.keys(data), null, 2));
// });

var Nightmare = require("nightmare");

var w = Nightmare(Object.assign({ show: false }));
w.goto("http://google.ca").then(
  function() {
    console.log("hello");
  },
  function() {
    console.log("hello2");
  }
);
