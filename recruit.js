
// Adapted from http://codepen.io/nottrobin/pen/meObWe
// var copyBtn = document.querySelector('#copy-btn');
// copyBtn.addEventListener('click', function () {
//   // Select the email link anchor text
//   var messageEl = document.querySelector('.message');
//   var range = document.createRange();
//   range.selectNode(messageEl);
//   window.getSelection().addRange(range);

//   try {
//     // Now that we've selected the anchor text, execute the copy command
//     document.execCommand('copy');
//     // track copy button click event
//     if (typeof(ga) !== 'undefined') {
//       ga('send', 'event', {
//         eventCategory: 'Button',
//         eventAction: 'click',
//         eventLabel: window.location.hash.slice(1)
//       });
//     }
//   } catch(err) {
//     console.log('Oops, unable to copy.');
//   }

//   window.getSelection().removeAllRanges();

//   copyBtn.textContent = "Copied!";
// });

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

function recordPageView() {
  var path = document.location.pathname + document.location.hash;
  ga('set', 'page', path);
  ga('send', 'pageview');
}


var prng;
function init() {
  var seed;
  if (window.location.hash != "") {
    seed = parseFloat(window.location.hash.slice(1));
  } else {
    seed = Math.random();
    window.history.replaceState({}, null, '/#' + seed.toString());
  }
  prng = new PRNG(seed);
  recruitOmatic([1,3,3,1], prng);
  recordPageView();

  var moreBtn = document.querySelector('#more-btn');
  moreBtn.addEventListener('click', function () {
    // Reset button state
    var copyBtn = document.querySelector('#copy-btn');
    copyBtn.textContent = "Copy to clipboard";

    // Update hash with last seed to this is bookmark-able
    window.location.hash = prng.getSeed();
    recruitOmatic([1,3,3,1], prng);

    // track page change (this is a virtual page refresh)
    if (typeof(ga) !== 'undefined') {
      recordPageView();
    }
  });

  var copyBtn = document.querySelector('#copy-btn');
  copyBtn.href = "https://twitter.com/share?url=" +
        encodeURI(window.location.href) + "&hashtags=" +
        encodeURI("recruit-o-matic");


  twttr.ready(function () {
    twttr.widgets.createShareButton(
      'https:\/\/recruit-o-matic.com\/',
      document.getElementById('share'),
      {
        hashtags: "#recruit-o-matic",
        size: "large"
      }
    );
  });

}

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    init();
  }
};

window.onpopstate = function () {
  var seed = parseFloat(window.location.hash.slice(1));
  prng = new PRNG(seed);
  recruitOmatic([1,3,3,1], prng);
};
