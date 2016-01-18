var Chain = function (chainData, prng) {
  var chain = chainData.Chain;
  var prefix;

  this.reset = function() {
    prefix = ["", ""];
  }

  // Ported and adapted from https://golang.org/doc/codewalk/markov/
  this.generate = function (n, p) {

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
  return this;
}

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

var moreBtn = document.querySelector('#more-btn');
moreBtn.addEventListener('click', function (evt) {
  // Reset button state
  var copyBtn = document.querySelector('#copy-btn');
  copyBtn.textContent = "Copy to clipboard";

  // Update hash with last seed to this is bookmarkable
  window.location.hash = prng.getSeed();
  recruitOmatic([1,3,3,1], prng);

  // track page change (this is a virtual page refresh)
  if (typeof(ga) !== 'undefined') {
    recordPageView();
  }
});

// Adapted from http://codepen.io/nottrobin/pen/meObWe
var copyBtn = document.querySelector('#copy-btn');
copyBtn.addEventListener('click', function (event) {
  // Select the email link anchor text
  var messageEl = document.querySelector('.message');
  var range = document.createRange();
  range.selectNode(messageEl);
  window.getSelection().addRange(range);

  try {
    // Now that we've selected the anchor text, execute the copy command
    document.execCommand('copy');
    // track copy button click event
    if (typeof(ga) !== 'undefined') {
      ga('send', 'event', {
        eventCategory: 'Button',
        eventAction: 'click',
        eventLabel: window.location.hash.slice(1)
      });
    }
  } catch(err) {
    console.log('Oops, unable to copy.');
  }

  window.getSelection().removeAllRanges();

  copyBtn.textContent = "Copied!";
});

function recruitOmatic(paragraphLengths, prng) {
  var chain = new Chain(chainData, prng);
  var message = document.querySelector(".message");
  message.innerHTML = "";
  paragraphLengths.forEach(function (len) {
    var p = document.createElement("p");
    p.innerHTML = chain.generate(len);
    message.appendChild(p);
  });
}

var prng;

function recordPageView() {
  var path = document.location.pathname + document.location.hash;
  ga('set', 'page', path);
  ga('send', 'pageview');
}

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
      var seed;
      if (window.location.hash != "") {
        seed = parseFloat(window.location.hash.slice(1));
      } else {
        seed = Math.random();
        window.location.hash = seed;
      }
      prng = new PRNG(seed);
      recruitOmatic([1,3,3,1], prng);
      recordPageView();
    }
}
