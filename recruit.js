var Chain = function (chainData) {
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

      var next =  choices[Math.floor(Math.random() * choices.length)];
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


var moreBtn = document.querySelector('#more-btn');
moreBtn.addEventListener('click', function (evt) {
  var copyBtn = document.querySelector('#copy-btn');
  copyBtn.innerText = "Copy to clipboard";
  recruitOmatic([1,3,3,2]);
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
  } catch(err) {
    console.log('Oops, unable to copy.');
  }

  window.getSelection().removeAllRanges();

  copyBtn.innerText = "Copied!";
});

function recruitOmatic(paragraphLengths) {
  var chain = new Chain(chainData);
  var message = document.querySelector(".message");
  message.innerHTML = "";
  paragraphLengths.forEach(function (len) {
    var p = document.createElement("p");
    p.innerText = chain.generate(len);
    message.appendChild(p);
  });
}

recruitOmatic([1,3,3,1]);