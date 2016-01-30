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

function updateTweetButton() {
  var tweetBtn = document.querySelector('.tweet-btn');
  tweetBtn.href = "https://twitter.com/intent/tweet?url=" +
    window.location.href.split("#").join("%23") + "&hashtags=" +
    encodeURI("recruitomatic");
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
    // Update hash with last seed to this is bookmark-able
    window.location.hash = prng.getSeed();
    recruitOmatic([1,3,3,1], prng);
    updateTweetButton();

    // track page change (this is a virtual page refresh)
    if (typeof(ga) !== 'undefined') {
      recordPageView();
    }
  });

  updateTweetButton();
}

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    init();
  }
};

window.onpopstate = function () {
  var seed = parseFloat(window.location.hash.slice(1));
  prng = new PRNG(seed);
  recruitOmatic([1,3,3,1], prng);
  updateTweetButton();
};
