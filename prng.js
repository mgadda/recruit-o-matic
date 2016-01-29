// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var PRNG = function(seed) {
  var _seed;
  if (typeof(seed) != 'undefined') {
    _seed = seed;
  } else {
    _seed = Math.random();
  }
  // min (inclusive) to max (excusive)
  this.randInt = function (min, max) {
    max = max || 1;
    min = min || 0;

    _seed = (_seed * 9301 + 49297) % 233280;
    var rnd = _seed / 233280.0;

    return Math.floor(min + rnd * (max - min));
  }

  this.getSeed = function () {
    return _seed;
  }
};