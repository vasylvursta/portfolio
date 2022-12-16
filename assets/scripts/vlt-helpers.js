/***********************************************
 * VLThemes
 ***********************************************/

'use strict';

/**
 * Initialize main helper object
 */
var VLTJS = {
	window: jQuery(window),
	document: jQuery(document),
	html: jQuery('html'),
	body: jQuery('body'),
	is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
	is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
	is_chrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
	is_ie10: navigator.appVersion.indexOf('MSIE 10') !== -1,
	transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
	animIteration: 'animationiteration webkitAnimationIteration oAnimationIteration MSAnimationIteration',
	animationEnd: 'animationend webkitAnimationEnd'
};

/**
 * Detects whether user is viewing site from a mobile device
 */
VLTJS.isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (VLTJS.isMobile.Android() || VLTJS.isMobile.BlackBerry() || VLTJS.isMobile.iOS() || VLTJS.isMobile.Opera() || VLTJS.isMobile.Windows());
	}
};

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout;
VLTJS.window.on('load resize orientationchange', function(e) {
	if (resizeArr.length) {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function() {
			for (var i = 0; i < resizeArr.length; i++) {
				resizeArr[i](e);
			}
		}, 250);
	}
});

VLTJS.debounceResize = function(callback) {
	if (typeof callback === 'function') {
		resizeArr.push(callback);
	} else {
		window.dispatchEvent(new Event('resize'));
	}
}

VLTJS.addLedingZero = function (number) {
	return ('0' + number).slice(-2);
}

/**
 * Throttle scroll
 */
var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;

VLTJS.window.on('load resize scroll orientationchange', function() {
	if (throttleArr.length) {
		didScroll = true;
	}
});

function hasScrolled() {

	var scrollTop = VLTJS.window.scrollTop(),
		windowHeight = VLTJS.window.height(),
		documentHeight = VLTJS.document.height(),
		scrollState = '';

	// Make sure they scroll more than delta
	if (Math.abs(lastScrollTop - scrollTop) <= delta) {
		return;
	}

	if (scrollTop > lastScrollTop) {
		scrollState = 'down';
	} else if (scrollTop < lastScrollTop) {
		scrollState = 'up';
	} else {
		scrollState = 'none';
	}

	if (scrollTop === 0) {
		scrollState = 'start';
	} else if (scrollTop >= documentHeight - windowHeight) {
		scrollState = 'end';
	}

	for (var i in throttleArr) {
		if (typeof throttleArr[i] === 'function') {
			throttleArr[i](scrollState, scrollTop, lastScrollTop, VLTJS.window);
		}
	}

	lastScrollTop = scrollTop;
}

setInterval(function() {
	if (didScroll) {
		didScroll = false;
		window.requestAnimationFrame(hasScrolled);
	}
}, 250);

VLTJS.throttleScroll = function(callback) {
	if (typeof callback === 'function') {
		throttleArr.push(callback);
	}
}

/**
 * VAR polyfill
 */
if (typeof cssVars !== 'undefined') {
	cssVars({
		onlyVars: true,
	});
}


/**
 * SVG animation logo
 */
const getData = el => ({
  s: el.r.baseVal.value * 2,
  x: el.cx.baseVal.value,
  y: el.cy.baseVal.value
})

const $base = document.querySelector('#base')
const base = getData($base)

const getFromObj = elData => ({
  transformOrigin: 'center',
  x: base.x - elData.x,
  y: base.y - elData.y,
  scale: base.s / elData.s
})

const tl = new TimelineMax({
  repeat: -1,
  yoyo: true
})

tl.from('#all', 2, {
  opacity: 0,
  ease: Expo.easeInOut
}, 0)

tl.from('#all', 3, {
  transformOrigin: 'center',
  rotation: 360,
  scale: .5,
  ease: Expo.easeInOut
}, 0)

const elements = [
  '#bottom',
  '#middle',
  '#top',
  '#big-left',
  '#big-right',
  '#biggest-left',
  '#biggest-right',
]

elements
  // .reverse()
  .forEach((el, i) => {
    el = document.querySelector(el)
    tl.from(el, 3, {
      ...getFromObj(getData(el)),
      ease: Expo.easeInOut
    }, i === 0 ? 0 : '-=2.8')
  })

tl.from('#signet', 3, {
  opacity: 0,
  ease: Power2.easeInOut
}, '-=2')

tl.staggerTo('circle', 1, {
  opacity: 0,
  ease: Power4.easeOut
}, -.1, '-=1')