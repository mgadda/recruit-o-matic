var Chain = function (chainData, prng) {
  var chain = chainData.Chain;
  var prefix;

  this.reset = function() {
    prefix = ["", ""];
  }

  // Ported and adapted from https://golang.org/doc/codewalk/markov/
  this.generate = function (n) {

    var words = [];

    // is end of sentence?
    function is_eos(word) {
      return (word.endsWith('.') ||
        word.endsWith('!') ||
        word.endsWith('?')) && !word.endsWith('Sr.') && !word.endsWith('e.g.');
    }

    var s = 0; // sentences generated so far
    do {
      var choices;
      choices = chain[prefix.join(" ")];

      if (choices === undefined || choices.length == 0) {
        break;
      }

      var next =  choices[prng.randInt(0, choices.length)];
      words = words.concat(next);
      // rotate left
      prefix.shift();
      prefix.push(next);

      if (is_eos(next)) {
        s++;
      }
    } while (s < n);

    return words.join(" ");
  }

  this.reset();
}
