var cc = cc || {};
cc._tmp = cc._tmp || {}, cc._LogInfos = {}, window._p, _p = window, _p.gl, _p.WebGLRenderingContext, _p.DeviceOrientationEvent, _p.DeviceMotionEvent, _p.AudioContext, _p.webkitAudioContext, _p.mozAudioContext, _p = Object.prototype, _p._super, _p.ctor, delete window._p, cc.newElement = function(a) {
	return document.createElement(a)
}, cc._addEventListener = function(a, b, c, d) {
	a.addEventListener(b, c, d)
}, cc._isNodeJs = "undefined" != typeof require && require("fs"), cc.each = function(a, b, c) {
	if (a) if (a instanceof Array) {
		for (var d = 0, e = a.length; e > d; d++) if (b.call(c, a[d], d) === !1) return
	} else for (var f in a) if (b.call(c, a[f], f) === !1) return
}, cc.extend = function(a) {
	var b = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];
	return cc.each(b, function(b) {
		for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
	}), a
}, cc.isFunction = function(a) {
	return "function" == typeof a
}, cc.isNumber = function(a) {
	return "number" == typeof a || "[object Number]" === Object.prototype.toString.call(a)
}, cc.isString = function(a) {
	return "string" == typeof a || "[object String]" === Object.prototype.toString.call(a)
}, cc.isArray = function(a) {
	return Array.isArray(a) || "object" == typeof a && "[object Array]" === Object.prototype.toString.call(a)
}, cc.isUndefined = function(a) {
	return "undefined" == typeof a
}, cc.isObject = function(a) {
	return "object" == typeof a && "[object Object]" === Object.prototype.toString.call(a)
}, cc.isCrossOrigin = function(a) {
	if (!a) return cc.log("invalid URL"), !1;
	var b = a.indexOf("://");
	if (-1 === b) return !1;
	var c = a.indexOf("/", b + 3),
		d = -1 === c ? a : a.substring(0, c);
	return d !== location.origin
}, cc.AsyncPool = function(a, b, c, d, e) {
	var f = this;
	f._srcObj = a, f._limit = b, f._pool = [], f._iterator = c, f._iteratorTarget = e, f._onEnd = d, f._onEndTarget = e, f._results = a instanceof Array ? [] : {}, cc.each(a, function(a, b) {
		f._pool.push({
			index: b,
			value: a
		})
	}), f.size = f._pool.length, f.finishedSize = 0, f._workingSize = 0, f._limit = f._limit || f.size, f.onIterator = function(a, b) {
		f._iterator = a, f._iteratorTarget = b
	}, f.onEnd = function(a, b) {
		f._onEnd = a, f._onEndTarget = b
	}, f._handleItem = function() {
		var a = this;
		if (!(0 === a._pool.length || a._workingSize >= a._limit)) {
			var b = a._pool.shift(),
				c = b.value,
				d = b.index;
			a._workingSize++, a._iterator.call(a._iteratorTarget, c, d, function(b) {
				a.finishedSize++, a._workingSize--;
				var c = Array.prototype.slice.call(arguments, 1);
				return a._results[this.index] = c[0], a.finishedSize === a.size ? void(a._onEnd && a._onEnd.call(a._onEndTarget, null, a._results)) : void a._handleItem()
			}.bind(b), a)
		}
	}, f.flow = function() {
		var a = this;
		if (0 === a._pool.length) return void(a._onEnd && a._onEnd.call(a._onEndTarget, null, []));
		for (var b = 0; b < a._limit; b++) a._handleItem()
	}
}, cc.async = {
	series: function(a, b, c) {
		var d = new cc.AsyncPool(a, 1, function(a, b, d) {
			a.call(c, d)
		}, b, c);
		return d.flow(), d
	},
	parallel: function(a, b, c) {
		var d = new cc.AsyncPool(a, 0, function(a, b, d) {
			a.call(c, d)
		}, b, c);
		return d.flow(), d
	},
	waterfall: function(a, b, c) {
		var d = [],
			e = [null],
			f = new cc.AsyncPool(a, 1, function(b, f, g) {
				d.push(function(b) {
					d = Array.prototype.slice.call(arguments, 1), a.length - 1 === f && (e = e.concat(d)), g.apply(null, arguments)
				}), b.apply(c, d)
			}, function(a) {
				return b ? a ? b.call(c, a) : void b.apply(c, e) : void 0
			});
		return f.flow(), f
	},
	map: function(a, b, c, d) {
		var e = b;
		"object" == typeof b && (c = b.cb, d = b.iteratorTarget, e = b.iterator);
		var f = new cc.AsyncPool(a, 0, e, c, d);
		return f.flow(), f
	},
	mapLimit: function(a, b, c, d, e) {
		var f = new cc.AsyncPool(a, b, c, d, e);
		return f.flow(), f
	}
}, cc.path = {
	normalizeRE: /[^\.\/]+\/\.\.\//,
	join: function() {
		for (var a = arguments.length, b = "", c = 0; a > c; c++) b = (b + ("" === b ? "" : "/") + arguments[c]).replace(/(\/|\\\\)$/, "");
		return b
	},
	extname: function(a) {
		var b = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(a);
		return b ? b[1] : null
	},
	mainFileName: function(a) {
		if (a) {
			var b = a.lastIndexOf(".");
			if (-1 !== b) return a.substring(0, b)
		}
		return a
	},
	basename: function(a, b) {
		var c = a.indexOf("?");
		c > 0 && (a = a.substring(0, c));
		var d = /(\/|\\\\)([^(\/|\\\\)]+)$/g,
			e = d.exec(a.replace(/(\/|\\\\)$/, ""));
		if (!e) return null;
		var f = e[2];
		return b && a.substring(a.length - b.length).toLowerCase() === b.toLowerCase() ? f.substring(0, f.length - b.length) : f
	},
	dirname: function(a) {
		return a.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, "$2")
	},
	changeExtname: function(a, b) {
		b = b || "";
		var c = a.indexOf("?"),
			d = "";
		return c > 0 && (d = a.substring(c), a = a.substring(0, c)), c = a.lastIndexOf("."), 0 > c ? a + b + d : a.substring(0, c) + b + d
	},
	changeBasename: function(a, b, c) {
		if (0 === b.indexOf(".")) return this.changeExtname(a, b);
		var d = a.indexOf("?"),
			e = "",
			f = c ? this.extname(a) : "";
		return d > 0 && (e = a.substring(d), a = a.substring(0, d)), d = a.lastIndexOf("/"), d = 0 >= d ? 0 : d + 1, a.substring(0, d) + b + f + e
	},
	_normalize: function(a) {
		var b = a = String(a);
		do b = a, a = a.replace(this.normalizeRE, "");
		while (b.length !== a.length);
		return a
	}
}, cc.loader = {
	_jsCache: {},
	_register: {},
	_langPathCache: {},
	_aliases: {},
	resPath: "",
	audioPath: "",
	cache: {},
	getXMLHttpRequest: function() {
		return window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP")
	},
	_getArgs4Js: function(a) {
		var b = a[0],
			c = a[1],
			d = a[2],
			e = ["", null, null];
		if (1 === a.length) e[1] = b instanceof Array ? b : [b];
		else if (2 === a.length)"function" == typeof c ? (e[1] = b instanceof Array ? b : [b], e[2] = c) : (e[0] = b || "", e[1] = c instanceof Array ? c : [c]);
		else {
			if (3 !== a.length) throw new Error("arguments error to load js!");
			e[0] = b || "", e[1] = c instanceof Array ? c : [c], e[2] = d
		}
		return e
	},
	loadJs: function(a, b, c) {
		var d = this,
			e = d._jsCache,
			f = d._getArgs4Js(arguments),
			g = f[0],
			h = f[1],
			i = f[2];
		navigator.userAgent.indexOf("Trident/5") > -1 ? d._loadJs4Dependency(g, h, 0, i) : cc.async.map(h, function(a, b, c) {
			var f = cc.path.join(g, a);
			return e[f] ? c(null) : void d._createScript(f, !1, c)
		}, i)
	},
	loadJsWithImg: function(a, b, c) {
		var d = this,
			e = d._loadJsImg(),
			f = d._getArgs4Js(arguments);
		this.loadJs(f[0], f[1], function(a) {
			if (a) throw new Error(a);
			e.parentNode.removeChild(e), f[2] && f[2]()
		})
	},
	_createScript: function(a, b, c) {
		var d = document,
			e = this,
			f = cc.newElement("script");
		f.async = b, e._jsCache[a] = !0, cc.game.config.noCache && "string" == typeof a ? e._noCacheRex.test(a) ? f.src = a + "&_t=" + (new Date - 0) : f.src = a + "?_t=" + (new Date - 0) : f.src = a, cc._addEventListener(f, "load", function() {
			f.parentNode.removeChild(f), this.removeEventListener("load", arguments.callee, !1), c()
		}, !1), cc._addEventListener(f, "error", function() {
			f.parentNode.removeChild(f), c("Load " + a + " failed!")
		}, !1), d.body.appendChild(f)
	},
	_loadJs4Dependency: function(a, b, c, d) {
		if (c >= b.length) return void(d && d());
		var e = this;
		e._createScript(cc.path.join(a, b[c]), !1, function(f) {
			return f ? d(f) : void e._loadJs4Dependency(a, b, c + 1, d)
		})
	},
	_loadJsImg: function() {
		var a = document,
			b = a.getElementById("cocos2d_loadJsImg");
		if (!b) {
			b = cc.newElement("img"), cc._loadingImage && (b.src = cc._loadingImage);
			var c = a.getElementById(cc.game.config.id);
			c.style.backgroundColor = "transparent", c.parentNode.appendChild(b);
			var d = getComputedStyle ? getComputedStyle(c) : c.currentStyle;
			d || (d = {
				width: c.width,
				height: c.height
			}), b.style.left = c.offsetLeft + (parseFloat(d.width) - b.width) / 2 + "px", b.style.top = c.offsetTop + (parseFloat(d.height) - b.height) / 2 + "px", b.style.position = "absolute"
		}
		return b
	},
	loadTxt: function(a, b) {
		if (cc._isNodeJs) {
			var c = require("fs");
			c.readFile(a, function(a, c) {
				a ? b(a) : b(null, c.toString())
			})
		} else {
			var d = this.getXMLHttpRequest(),
				e = "load " + a + " failed!";
			d.open("GET", a, !0), /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? (d.setRequestHeader("Accept-Charset", "utf-8"), d.onreadystatechange = function() {
				4 === d.readyState && (200 === d.status ? b(null, d.responseText) : b({
					status: d.status,
					errorMessage: e
				}, null))
			}) : (d.overrideMimeType && d.overrideMimeType("text/plain; charset=utf-8"), d.onload = function() {
				4 === d.readyState && (200 === d.status ? b(null, d.responseText) : b({
					status: d.status,
					errorMessage: e
				}, null))
			}, d.onerror = function() {
				b({
					status: d.status,
					errorMessage: e
				}, null)
			}), d.send(null)
		}
	},
	_loadTxtSync: function(a) {
		if (cc._isNodeJs) {
			var b = require("fs");
			return b.readFileSync(a).toString()
		}
		var c = this.getXMLHttpRequest();
		return c.open("GET", a, !1), /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? c.setRequestHeader("Accept-Charset", "utf-8") : c.overrideMimeType && c.overrideMimeType("text/plain; charset=utf-8"), c.send(null), 4 === !c.readyState || 200 !== c.status ? null : c.responseText
	},
	loadCsb: function(a, b) {
		var c = new XMLHttpRequest,
			d = "load " + a + " failed!";
		c.open("GET", a, !0), c.responseType = "arraybuffer", c.onload = function() {
			var a = c.response;
			a && (window.msg = a), 4 === c.readyState && (200 === c.status ? b(null, c.response) : b({
				status: c.status,
				errorMessage: d
			}, null))
		}, c.onerror = function() {
			b({
				status: c.status,
				errorMessage: d
			}, null)
		}, c.send(null)
	},
	loadJson: function(a, b) {
		this.loadTxt(a, function(c, d) {
			if (c) b(c);
			else {
				try {
					var e = JSON.parse(d)
				} catch (f) {
					throw new Error("parse json [" + a + "] failed : " + f)
				}
				b(null, e)
			}
		})
	},
	_checkIsImageURL: function(a) {
		var b = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(a);
		return null != b
	},
	loadImg: function(a, b, c) {
		var d = {
			isCrossOrigin: !0
		};
		void 0 !== c ? d.isCrossOrigin = null === b.isCrossOrigin ? d.isCrossOrigin : b.isCrossOrigin : void 0 !== b && (c = b);
		var e = this.getRes(a);
		if (e) return c && c(null, e), e;
		e = new Image, d.isCrossOrigin && "file://" !== location.origin && (e.crossOrigin = "Anonymous");
		var f = function() {
				this.removeEventListener("load", f, !1), this.removeEventListener("error", h, !1), c && c(null, e)
			},
			g = this,
			h = function() {
				this.removeEventListener("error", h, !1), e.crossOrigin && "anonymous" === e.crossOrigin.toLowerCase() ? (d.isCrossOrigin = !1, g.release(a), cc.loader.loadImg(a, d, c)) : "function" == typeof c && c("load image failed")
			};
		return cc._addEventListener(e, "load", f), cc._addEventListener(e, "error", h), e.src = a, e
	},
	_loadResIterator: function(a, b, c) {
		var d = this,
			e = null,
			f = a.type;
		f ? (f = "." + f.toLowerCase(), e = a.src ? a.src : a.name + f) : (e = a, f = cc.path.extname(e));
		var g = d.getRes(e);
		if (g) return c(null, g);
		var h = null;
		if (f && (h = d._register[f.toLowerCase()]), !h) return cc.error("loader for [" + f + "] not exists!"), c();
		var i = e;
		if (!cc._urlRegExp.test(e)) {
			var j = h.getBasePath ? h.getBasePath() : d.resPath;
			i = d.getUrl(j, e)
		}
		cc.game.config.noCache && "string" == typeof i && (i += d._noCacheRex.test(i) ? "&_t=" + (new Date - 0) : "?_t=" + (new Date - 0)), h.load(i, e, a, function(a, b) {
			a ? (cc.log(a), d.cache[e] = null, delete d.cache[e], c({
				status: 520,
				errorMessage: a
			}, null)) : (d.cache[e] = b, c(null, b))
		})
	},
	_noCacheRex: /\?/,
	getUrl: function(a, b) {
		var c = this,
			d = c._langPathCache,
			e = cc.path;
		if (void 0 !== a && void 0 === b) {
			b = a;
			var f = e.extname(b);
			f = f ? f.toLowerCase() : "";
			var g = c._register[f];
			a = g && g.getBasePath ? g.getBasePath() : c.resPath
		}
		if (b = cc.path.join(a || "", b), b.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
			if (d[b]) return d[b];
			var h = e.extname(b) || "";
			b = d[b] = b.substring(0, b.length - h.length) + "_" + cc.sys.language + h
		}
		return b
	},
	load: function(a, b, c) {
		var d = this,
			e = arguments.length;
		if (0 === e) throw new Error("arguments error!");
		3 === e ? "function" == typeof b && (b = "function" == typeof c ? {
			trigger: b,
			cb: c
		} : {
			cb: b,
			cbTarget: c
		}) : 2 === e ? "function" == typeof b && (b = {
			cb: b
		}) : 1 === e && (b = {}), a instanceof Array || (a = [a]);
		var f = new cc.AsyncPool(a, 0, function(a, c, e, f) {
			d._loadResIterator(a, c, function(a) {
				var c = Array.prototype.slice.call(arguments, 1);
				b.trigger && b.trigger.call(b.triggerTarget, c[0], f.size, f.finishedSize), e(a, c[0])
			})
		}, b.cb, b.cbTarget);
		return f.flow(), f
	},
	_handleAliases: function(a, b) {
		var c = this,
			d = c._aliases,
			e = [];
		for (var f in a) {
			var g = a[f];
			d[f] = g, e.push(g)
		}
		this.load(e, b)
	},
	loadAliases: function(a, b) {
		var c = this,
			d = c.getRes(a);
		d ? c._handleAliases(d.filenames, b) : c.load(a, function(a, d) {
			c._handleAliases(d[0].filenames, b)
		})
	},
	register: function(a, b) {
		if (a && b) {
			var c = this;
			if ("string" == typeof a) return this._register[a.trim().toLowerCase()] = b;
			for (var d = 0, e = a.length; e > d; d++) c._register["." + a[d].trim().toLowerCase()] = b
		}
	},
	getRes: function(a) {
		return this.cache[a] || this.cache[this._aliases[a]]
	},
	release: function(a) {
		var b = this.cache,
			c = this._aliases;
		delete b[a], delete b[c[a]], delete c[a]
	},
	releaseAll: function() {
		var a = this.cache,
			b = this._aliases;
		for (var c in a) delete a[c];
		for (var c in b) delete b[c]
	}
}, cc.formatStr = function() {
	var a = arguments,
		b = a.length;
	if (1 > b) return "";
	var c = a[0],
		d = !0;
	"object" == typeof c && (d = !1);
	for (var e = 1; b > e; ++e) {
		var f = a[e];
		if (d) for (;;) {
			var g = null;
			if ("number" == typeof f && (g = c.match(/(%d)|(%s)/))) {
				c = c.replace(/(%d)|(%s)/, f);
				break
			}
			g = c.match(/%s/), g ? c = c.replace(/%s/, f) : c += "    " + f;
			break
		} else c += "    " + f
	}
	return c
}, function() {
	var a, b, c = window;
	cc.isUndefined(document.hidden) ? cc.isUndefined(document.mozHidden) ? cc.isUndefined(document.msHidden) ? cc.isUndefined(document.webkitHidden) || (a = "webkitHidden", b = "webkitvisibilitychange") : (a = "msHidden", b = "msvisibilitychange") : (a = "mozHidden", b = "mozvisibilitychange") : (a = "hidden", b = "visibilitychange");
	var d = function() {
			cc.eventManager && cc.game._eventHide && cc.eventManager.dispatchEvent(cc.game._eventHide)
		},
		e = function() {
			cc.eventManager && cc.game._eventShow && cc.eventManager.dispatchEvent(cc.game._eventShow), cc.game._intervalId && (window.cancelAnimationFrame(cc.game._intervalId), cc.game._runMainLoop())
		};
	a ? cc._addEventListener(document, b, function() {
		document[a] ? d() : e()
	}, !1) : (cc._addEventListener(c, "blur", d, !1), cc._addEventListener(c, "focus", e, !1)), navigator.userAgent.indexOf("MicroMessenger") > -1 && (c.onfocus = function() {
		e()
	}), "onpageshow" in window && "onpagehide" in window && (cc._addEventListener(c, "pagehide", d, !1), cc._addEventListener(c, "pageshow", e, !1)), c = null, b = null
}(), cc.log = cc.warn = cc.error = cc.assert = function() {}, cc.create3DContext = function(a, b) {
	for (var c = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], d = null, e = 0; e < c.length; ++e) {
		try {
			d = a.getContext(c[e], b)
		} catch (f) {}
		if (d) break
	}
	return d
}, cc._initSys = function(a, b) {
	cc._RENDER_TYPE_CANVAS = 0, cc._RENDER_TYPE_WEBGL = 1, cc.sys = {};
	var c = cc.sys;
	c.LANGUAGE_ENGLISH = "en", c.LANGUAGE_CHINESE = "zh", c.LANGUAGE_FRENCH = "fr", c.LANGUAGE_ITALIAN = "it", c.LANGUAGE_GERMAN = "de", c.LANGUAGE_SPANISH = "es", c.LANGUAGE_DUTCH = "du", c.LANGUAGE_RUSSIAN = "ru", c.LANGUAGE_KOREAN = "ko", c.LANGUAGE_JAPANESE = "ja", c.LANGUAGE_HUNGARIAN = "hu", c.LANGUAGE_PORTUGUESE = "pt", c.LANGUAGE_ARABIC = "ar", c.LANGUAGE_NORWEGIAN = "no", c.LANGUAGE_POLISH = "pl", c.OS_IOS = "iOS", c.OS_ANDROID = "Android", c.OS_WINDOWS = "Windows", c.OS_MARMALADE = "Marmalade", c.OS_LINUX = "Linux", c.OS_BADA = "Bada", c.OS_BLACKBERRY = "Blackberry", c.OS_OSX = "OS X", c.OS_WP8 = "WP8", c.OS_WINRT = "WINRT", c.OS_UNKNOWN = "Unknown", c.UNKNOWN = -1, c.WIN32 = 0, c.LINUX = 1, c.MACOS = 2, c.ANDROID = 3, c.IPHONE = 4, c.IPAD = 5, c.BLACKBERRY = 6, c.NACL = 7, c.EMSCRIPTEN = 8, c.TIZEN = 9, c.WINRT = 10, c.WP8 = 11, c.MOBILE_BROWSER = 100, c.DESKTOP_BROWSER = 101, c.BROWSER_TYPE_WECHAT = "wechat", c.BROWSER_TYPE_ANDROID = "androidbrowser", c.BROWSER_TYPE_IE = "ie", c.BROWSER_TYPE_QQ = "qqbrowser", c.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser", c.BROWSER_TYPE_UC = "ucbrowser", c.BROWSER_TYPE_360 = "360browser", c.BROWSER_TYPE_BAIDU_APP = "baiduboxapp", c.BROWSER_TYPE_BAIDU = "baidubrowser", c.BROWSER_TYPE_MAXTHON = "maxthon", c.BROWSER_TYPE_OPERA = "opera", c.BROWSER_TYPE_OUPENG = "oupeng", c.BROWSER_TYPE_MIUI = "miuibrowser", c.BROWSER_TYPE_FIREFOX = "firefox", c.BROWSER_TYPE_SAFARI = "safari", c.BROWSER_TYPE_CHROME = "chrome", c.BROWSER_TYPE_LIEBAO = "liebao", c.BROWSER_TYPE_QZONE = "qzone", c.BROWSER_TYPE_SOUGOU = "sogou", c.BROWSER_TYPE_UNKNOWN = "unknown", c.isNative = !1;
	var d = window,
		e = d.navigator,
		f = document,
		g = f.documentElement,
		h = e.userAgent.toLowerCase();
	c.isMobile = -1 !== h.indexOf("mobile") || -1 !== h.indexOf("android"), c.platform = c.isMobile ? c.MOBILE_BROWSER : c.DESKTOP_BROWSER;
	var i = e.language;
	i = i ? i : e.browserLanguage, i = i ? i.split("-")[0] : c.LANGUAGE_ENGLISH, c.language = i;
	var j = h.match(/(iPad|iPhone|iPod)/i) ? !0 : !1,
		k = h.match(/android/i) || e.platform.match(/android/i) ? !0 : !1,
		l = c.OS_UNKNOWN; - 1 !== e.appVersion.indexOf("Win") ? l = c.OS_WINDOWS : j ? l = c.OS_IOS : -1 !== e.appVersion.indexOf("Mac") ? l = c.OS_OSX : -1 !== e.appVersion.indexOf("X11") && -1 === e.appVersion.indexOf("Linux") ? l = c.OS_UNIX : k ? l = c.OS_ANDROID : -1 !== e.appVersion.indexOf("Linux") && (l = c.OS_LINUX), c.os = l;
	var m = c.BROWSER_TYPE_UNKNOWN,
		n = h.match(/sogou|qzone|liebao|micromessenger|qqbrowser|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|trident|oupeng|opera|miuibrowser|firefox/i) || h.match(/chrome|safari/i);
	n && n.length > 0 ? (m = n[0], "micromessenger" === m ? m = c.BROWSER_TYPE_WECHAT : "safari" === m && h.match(/android.*applewebkit/) ? m = c.BROWSER_TYPE_ANDROID : "trident" === m ? m = c.BROWSER_TYPE_IE : "360 aphone" === m && (m = c.BROWSER_TYPE_360)) : h.indexOf("iphone") && h.indexOf("mobile") && (m = c.BROWSER_TYPE_SAFARI);
	var o, p = null;
	switch (m) {
	case c.BROWSER_TYPE_IE:
		p = h.match(/(msie |rv:)([\d.]+)/);
		break;
	case c.BROWSER_TYPE_FIREFOX:
		p = h.match(/(firefox\/|rv:)([\d.]+)/);
		break;
	case c.BROWSER_TYPE_CHROME:
		p = h.match(/chrome\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_BAIDU:
		p = h.match(/baidubrowser\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_UC:
		p = h.match(/ucbrowser\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_QQ:
		p = h.match(/qqbrowser\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_OUPENG:
		p = h.match(/oupeng\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_WECHAT:
		p = h.match(/micromessenger\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_SAFARI:
		p = h.match(/safari\/([\d.]+)/);
		break;
	case c.BROWSER_TYPE_MIUI:
		p = h.match(/miuibrowser\/([\d.]+)/)
	}
	o = p ? p[1] : "", c.browserType = m, c.browserVersion = o;
	var q = window.innerWidth || document.documentElement.clientWidth,
		r = window.innerHeight || document.documentElement.clientHeight,
		s = window.devicePixelRatio || 1;
	c.windowPixelResolution = {
		width: s * q,
		height: s * r
	}, function(a, c) {
		var e = c[b.renderMode] - 0;
		(isNaN(e) || e > 2 || 0 > e) && (e = 0);
		var f = [a.OS_ANDROID],
			g = [],
			h = cc.newElement("canvas");
		cc._renderType = cc._RENDER_TYPE_CANVAS, cc._supportRender = !1;
		var i = d.WebGLRenderingContext;
		if (2 === e || 0 === e && i && -1 === f.indexOf(a.os) && -1 === g.indexOf(a.browserType)) try {
			var j = cc.create3DContext(h, {
				stencil: !0,
				preserveDrawingBuffer: !0
			});
			j && (cc._renderType = cc._RENDER_TYPE_WEBGL, cc._supportRender = !0)
		} catch (k) {}
		if (1 === e || 0 === e && cc._supportRender === !1) try {
			h.getContext("2d"), cc._renderType = cc._RENDER_TYPE_CANVAS, cc._supportRender = !0
		} catch (k) {}
	}(c, a), c._canUseCanvasNewBlendModes = function() {
		var a = document.createElement("canvas");
		a.width = 1, a.height = 1;
		var b = a.getContext("2d");
		b.fillStyle = "#000", b.fillRect(0, 0, 1, 1), b.globalCompositeOperation = "multiply";
		var c = document.createElement("canvas");
		c.width = 1, c.height = 1;
		var d = c.getContext("2d");
		return d.fillStyle = "#fff", d.fillRect(0, 0, 1, 1), b.drawImage(c, 0, 0, 1, 1), 0 === b.getImageData(0, 0, 1, 1).data[0]
	}, c._supportCanvasNewBlendModes = c._canUseCanvasNewBlendModes();
	try {
		var t = c.localStorage = d.localStorage;
		t.setItem("storage", ""), t.removeItem("storage"), t = null
	} catch (u) {
		var v = function() {
				cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option")
			};
		c.localStorage = {
			getItem: v,
			setItem: v,
			removeItem: v,
			clear: v
		}
	}
	var w = c.capabilities = {
		canvas: !0
	};
	cc._renderType === cc._RENDER_TYPE_WEBGL && (w.opengl = !0), (void 0 !== g.ontouchstart || void 0 !== f.ontouchstart || e.msPointerEnabled) && (w.touches = !0), void 0 !== g.onmouseup && (w.mouse = !0), void 0 !== g.onkeyup && (w.keyboard = !0), (d.DeviceMotionEvent || d.DeviceOrientationEvent) && (w.accelerometer = !0), c.garbageCollect = function() {}, c.dumpRoot = function() {}, c.restartVM = function() {}, c.cleanScript = function(a) {}, c.isObjectValid = function(a) {
		return a ? !0 : !1
	}, c.dump = function() {
		var a = this,
			b = "";
		b += "isMobile : " + a.isMobile + "\r\n", b += "language : " + a.language + "\r\n", b += "browserType : " + a.browserType + "\r\n", b += "capabilities : " + JSON.stringify(a.capabilities) + "\r\n", b += "os : " + a.os + "\r\n", b += "platform : " + a.platform + "\r\n", cc.log(b)
	}, c.openURL = function(a) {
		window.open(a)
	}
}, cc.ORIENTATION_PORTRAIT = 0, cc.ORIENTATION_PORTRAIT_UPSIDE_DOWN = 1, cc.ORIENTATION_LANDSCAPE_LEFT = 2, cc.ORIENTATION_LANDSCAPE_RIGHT = 3, cc._drawingUtil = null, cc._renderContext = null, cc._canvas = null, cc._gameDiv = null, cc._rendererInitialized = !1, cc._setupCalled = !1, cc._setup = function(a, b, c) {
	if (!cc._setupCalled) {
		cc._setupCalled = !0;
		var d, e, f, g = window,
			h = cc.$(a) || cc.$("#" + a);
		if (cc.game._setAnimFrame(), "CANVAS" === h.tagName ? (b = b || h.width, c = c || h.height, e = cc.container = cc.newElement("DIV"), d = cc._canvas = h, d.parentNode.insertBefore(e, d), d.appendTo(e), e.setAttribute("id", "Cocos2dGameContainer")) : ("DIV" !== h.tagName && cc.log("Warning: target element is not a DIV or CANVAS"), b = b || h.clientWidth, c = c || h.clientHeight, e = cc.container = h, d = cc._canvas = cc.$(cc.newElement("CANVAS")), h.appendChild(d)), d.addClass("gameCanvas"), d.setAttribute("width", b || 480), d.setAttribute("height", c || 320), d.setAttribute("tabindex", 99), d.style.outline = "none", f = e.style, f.width = (b || 480) + "px", f.height = (c || 320) + "px", f.margin = "0 auto", f.position = "relative", f.overflow = "hidden", e.top = "100%", cc._renderType === cc._RENDER_TYPE_WEBGL && (cc._renderContext = cc.webglContext = cc.create3DContext(d, {
			stencil: !0,
			preserveDrawingBuffer: !0,
			antialias: !cc.sys.isMobile,
			alpha: !0
		})), cc._renderContext ? (g.gl = cc._renderContext, cc._drawingUtil = new cc.DrawingPrimitiveWebGL(cc._renderContext), cc._rendererInitialized = !0, cc.textureCache._initializingRenderer(), cc.shaderCache._init()) : (cc._renderContext = new cc.CanvasContextWrapper(d.getContext("2d")), cc._drawingUtil = cc.DrawingPrimitiveCanvas ? new cc.DrawingPrimitiveCanvas(cc._renderContext) : null), cc._gameDiv = e, cc.log(cc.ENGINE_VERSION), cc._setContextMenuEnable(!1), cc.sys.isMobile) {
			var i = cc.newElement("style");
			i.type = "text/css", document.body.appendChild(i), i.textContent = "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;-webkit-tap-highlight-color:rgba(0,0,0,0);}"
		}
		cc.view = cc.EGLView._getInstance(), cc.inputManager.registerSystemEvent(cc._canvas), cc.director = cc.Director._getInstance(), cc.director.setOpenGLView && cc.director.setOpenGLView(cc.view), cc.winSize = cc.director.getWinSize(), cc.saxParser = new cc.SAXParser, cc.plistParser = new cc.PlistParser
	}
}, cc._checkWebGLRenderMode = function() {
	if (cc._renderType !== cc._RENDER_TYPE_WEBGL) throw new Error("This feature supports WebGL render mode only.")
}, cc._isContextMenuEnable = !1, cc._setContextMenuEnable = function(a) {
	cc._isContextMenuEnable = a, cc._canvas.oncontextmenu = function() {
		return cc._isContextMenuEnable ? void 0 : !1
	}
}, cc.game = {
	DEBUG_MODE_NONE: 0,
	DEBUG_MODE_INFO: 1,
	DEBUG_MODE_WARN: 2,
	DEBUG_MODE_ERROR: 3,
	DEBUG_MODE_INFO_FOR_WEB_PAGE: 4,
	DEBUG_MODE_WARN_FOR_WEB_PAGE: 5,
	DEBUG_MODE_ERROR_FOR_WEB_PAGE: 6,
	EVENT_HIDE: "game_on_hide",
	EVENT_SHOW: "game_on_show",
	EVENT_RESIZE: "game_on_resize",
	_eventHide: null,
	_eventShow: null,
	_onBeforeStartArr: [],
	CONFIG_KEY: {
		engineDir: "engineDir",
		dependencies: "dependencies",
		debugMode: "debugMode",
		showFPS: "showFPS",
		frameRate: "frameRate",
		id: "id",
		renderMode: "renderMode",
		jsList: "jsList",
		classReleaseMode: "classReleaseMode"
	},
	_prepareCalled: !1,
	_prepared: !1,
	_paused: !0,
	_intervalId: null,
	_lastTime: null,
	_frameTime: null,
	config: null,
	onStart: null,
	onStop: null,
	setFrameRate: function(a) {
		var b = this,
			c = b.config,
			d = b.CONFIG_KEY;
		c[d.frameRate] = a, b._intervalId && window.cancelAnimationFrame(b._intervalId), b._paused = !0, b._setAnimFrame(), b._runMainLoop()
	},
	_setAnimFrame: function() {
		this._lastTime = new Date, this._frameTime = 1e3 / cc.game.config[cc.game.CONFIG_KEY.frameRate], cc.sys.os === cc.sys.OS_IOS && cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT || 60 !== cc.game.config[cc.game.CONFIG_KEY.frameRate] ? (window.requestAnimFrame = this._stTime, window.cancelAnimationFrame = this._ctTime) : (window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || this._stTime, window.cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || this._ctTime)
	},
	_stTime: function(a) {
		var b = (new Date).getTime(),
			c = Math.max(0, cc.game._frameTime - (b - cc.game._lastTime)),
			d = window.setTimeout(function() {
				a()
			}, c);
		return cc.game._lastTime = b + c, d
	},
	_ctTime: function(a) {
		window.clearTimeout(a)
	},
	_runMainLoop: function() {
		var a, b = this,
			c = b.config,
			d = b.CONFIG_KEY,
			e = cc.director;
		e.setDisplayStats(c[d.showFPS]), a = function() {
			b._paused || (e.mainLoop(), b._intervalId && window.cancelAnimationFrame(b._intervalId), b._intervalId = window.requestAnimFrame(a))
		}, window.requestAnimFrame(a), b._paused = !1
	},
	restart: function() {
		cc.director.popToSceneStackLevel(0), cc.audioEngine && cc.audioEngine.end(), cc.game.onStart()
	},
	run: function(a) {
		var b = this,
			c = function() {
				a && (b.config[b.CONFIG_KEY.id] = a), b._prepareCalled || b.prepare(function() {
					b._prepared = !0
				}), cc._supportRender && (b._checkPrepare = setInterval(function() {
					b._prepared && (cc._setup(b.config[b.CONFIG_KEY.id]), b._runMainLoop(), b._eventHide = b._eventHide || new cc.EventCustom(b.EVENT_HIDE), b._eventHide.setUserData(b), b._eventShow = b._eventShow || new cc.EventCustom(b.EVENT_SHOW), b._eventShow.setUserData(b), b.onStart(), clearInterval(b._checkPrepare))
				}, 10))
			};
		document.body ? c() : cc._addEventListener(window, "load", function() {
			this.removeEventListener("load", arguments.callee, !1), c()
		}, !1)
	},
	_initConfig: function() {
		var a = this,
			b = a.CONFIG_KEY,
			c = function(a) {
				return a[b.engineDir] = a[b.engineDir] || "frameworks/cocos2d-html5", null == a[b.debugMode] && (a[b.debugMode] = 0), a[b.frameRate] = a[b.frameRate] || 60, null == a[b.renderMode] && (a[b.renderMode] = 1), a
			};
		if (document.ccConfig) a.config = c(document.ccConfig);
		else try {
			for (var d = document.getElementsByTagName("script"), e = 0; e < d.length; e++) {
				var f = d[e].getAttribute("cocos");
				if ("" === f || f) break
			}
			var g, h, i;
			e < d.length && (g = d[e].src, g && (i = /(.*)\//.exec(g)[0], cc.loader.resPath = i, g = cc.path.join(i, "project.json")), h = cc.loader._loadTxtSync(g)), h || (h = cc.loader._loadTxtSync("project.json"));
			var j = JSON.parse(h);
			a.config = c(j || {})
		} catch (k) {
			cc.log("Failed to read or parse project.json"), a.config = c({})
		}
		cc._initSys(a.config, b)
	},
	_jsAddedCache: {},
	_getJsListOfModule: function(a, b, c) {
		var d = this._jsAddedCache;
		if (d[b]) return null;
		c = c || "";
		var e = [],
			f = a[b];
		if (!f) throw new Error("can not find module [" + b + "]");
		for (var g = cc.path, h = 0, i = f.length; i > h; h++) {
			var j = f[h];
			if (!d[j]) {
				var k = g.extname(j);
				if (k)".js" === k.toLowerCase() && e.push(g.join(c, j));
				else {
					var l = this._getJsListOfModule(a, j, c);
					l && (e = e.concat(l))
				}
				d[j] = 1
			}
		}
		return e
	},
	prepare: function(a) {
		var b = this,
			c = b.config,
			d = b.CONFIG_KEY,
			e = c[d.engineDir],
			f = cc.loader;
		if (!cc._supportRender) throw new Error("The renderer doesn't support the renderMode " + c[d.renderMode]);
		b._prepareCalled = !0;
		var g = c[d.jsList] || [];
		if (cc.Class) f.loadJsWithImg("", g, function(c) {
			if (c) throw new Error(c);
			b._prepared = !0, a && a()
		});
		else {
			var h = cc.path.join(e, "moduleConfig.json");
			f.loadJson(h, function(d, f) {
				if (d) throw new Error(d);
				var h = c.modules || [],
					i = f.module,
					j = [];
				cc._renderType === cc._RENDER_TYPE_WEBGL ? h.splice(0, 0, "shaders") : h.indexOf("core") < 0 && h.splice(0, 0, "core");
				for (var k = 0, l = h.length; l > k; k++) {
					var m = b._getJsListOfModule(i, h[k], e);
					m && (j = j.concat(m))
				}
				j = j.concat(g), cc.loader.loadJsWithImg(j, function(c) {
					if (c) throw new Error(c);
					b._prepared = !0, a && a()
				})
			})
		}
	}
}, cc.game._initConfig(), Function.prototype.bind = Function.prototype.bind ||
function(a) {
	if (!cc.isFunction(this)) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	var b = Array.prototype.slice.call(arguments, 1),
		c = this,
		d = function() {},
		e = function() {
			return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
		};
	return d.prototype = this.prototype, e.prototype = new d, e
}, cc._urlRegExp = new RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\¡-\￿0-9]-*)*[a-z\¡-\￿0-9]+)(?:\\.(?:[a-z\¡-\￿0-9]-*)*[a-z\¡-\￿0-9]+)*(?:\\.(?:[a-z\¡-\￿]{2,}))|(?:localhost))(?::\\d{2,5})?(?:/\\S*)?$", "i");
var cc = cc || {};
//if (cc._loadingImage = "data:image/gif;base64,R0lGODlhEAAQALMNAD8/P7+/vyoqKlVVVX9/fxUVFUBAQGBgYMDAwC8vL5CQkP///wAAAP///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAANACwAAAAAEAAQAAAEO5DJSau9OOvNex0IMnDIsiCkiW6g6BmKYlBFkhSUEgQKlQCARG6nEBwOgl+QApMdCIRD7YZ5RjlGpCUCACH5BAUAAA0ALAAAAgAOAA4AAAQ6kLGB0JA4M7QW0hrngRllkYyhKAYqKUGguAws0ypLS8JxCLQDgXAIDg+FRKIA6v0SAECCBpXSkstMBAAh+QQFAAANACwAAAAACgAQAAAEOJDJORAac6K1kDSKYmydpASBUl0mqmRfaGTCcQgwcxDEke+9XO2WkxQSiUIuAQAkls0n7JgsWq8RACH5BAUAAA0ALAAAAAAOAA4AAAQ6kMlplDIzTxWC0oxwHALnDQgySAdBHNWFLAvCukc215JIZihVIZEogDIJACBxnCSXTcmwGK1ar1hrBAAh+QQFAAANACwAAAAAEAAKAAAEN5DJKc4RM+tDyNFTkSQF5xmKYmQJACTVpQSBwrpJNteZSGYoFWjIGCAQA2IGsVgglBOmEyoxIiMAIfkEBQAADQAsAgAAAA4ADgAABDmQSVZSKjPPBEDSGucJxyGA1XUQxAFma/tOpDlnhqIYN6MEAUXvF+zldrMBAjHoIRYLhBMqvSmZkggAIfkEBQAADQAsBgAAAAoAEAAABDeQyUmrnSWlYhMASfeFVbZdjHAcgnUQxOHCcqWylKEohqUEAYVkgEAMfkEJYrFA6HhKJsJCNFoiACH5BAUAAA0ALAIAAgAOAA4AAAQ3kMlJq704611SKloCAEk4lln3DQgyUMJxCBKyLAh1EMRR3wiDQmHY9SQslyIQUMRmlmVTIyRaIgA7", cc._fpsImage = "data:image/png;base64,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", cc._loaderImage = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAlAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM4MDBEMDY2QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM4MDBEMDY1QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTk0OEM4OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTk0OEM5OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQADQkJCQoJDQoKDRMMCwwTFhENDREWGhUVFhUVGhkUFhUVFhQZGR0fIB8dGScnKionJzk4ODg5QEBAQEBAQEBAQAEODAwOEA4RDw8RFA4RDhQVERISERUfFRUXFRUfKB0ZGRkZHSgjJiAgICYjLCwoKCwsNzc1NzdAQEBAQEBAQEBA/8AAEQgAyACgAwEiAAIRAQMRAf/EALAAAAEFAQEAAAAAAAAAAAAAAAQAAgMFBgcBAQEAAwEBAAAAAAAAAAAAAAAAAQMEAgUQAAIBAgIEBwoLBgQGAwAAAAECAwAEEQUhMRIGQVFxsTITFGGBwdEiQlKSMzWRoeFicqKyI1NzFYJjJDQWB9KjVCbxwkNkJWXik3QRAAIBAgMFBQcDBQEAAAAAAAABAhEDIRIEMUFRcTJhwVIUBZGhsSJyEzOB0ULhYpIjUxX/2gAMAwEAAhEDEQA/AMJSpUqAVKlXuFAeUq9wpUB5XuFe4V6ooDzZHDox0CnGMinzwl7Z8NajaHeoO3vmTBZBtp9YUIqTEV5ROxHKnWRnaU8VRMhFBUjpV7hSoSeUq9pUB5Sr2lhQHlKvcK8oBV7hSFSRrtaKAZs07YNPM1pG2xJIAw1jSeandry/8X4m8VCKkWwaWwam7Xl/4v1W8VLtmX/i/VbxUoKkWwakSM407tmX/i/VbxUmzGwjQsjdY41IARie/U0IbZO0kNtCXnOCkEBeFu4KI3Bs7DNb27ya+jDx3kJeEnpJJEcQVbWDsk17u5urd591ucZkWhym2Vnd9RkCDEpFxDRpbw0bunu5mlp2De2FMLYXOD2wB2xbOeraUcYGJ72mlSUiqzzdzMd3Z3mixltA2yzcK/NlHM1DQyRXce1HocdNOEfJXZ88y9ZojOqhiBszIRiHQ8Y4cK5TvHuzLljHNMqxNoDjLFraHHnjPxcNCGVbxEUzYNTx5jZSxhpW6qTzlwJ+DCvO2Zf+L9VvFSgqyHYNLYNTdssPxfibxUu15f8Ai/VPiqCakOwa82DU/a8v/F+JvFTDdWPBL8R8VKCvYRYV5UzoMAy6QdIIqI0B4KJtxiRQwou16QoGUkntH5Tz0RbZbmF2hktraSVBo2lUkY8tDye0flPPXTslVUyiyVRsjqUOA4yMT8dW2ram2m6UVTNq9S7EIyUVJydMTn/6DnP+im9Wl+g5z/opvVrpteEhQWY4AaSTwAVf5WPiZh/9S5/zj7zltzlmYWkfWXNvJDGTgGcYDHirR7i7mSbwXParsFMrgb7w6jKw/wCmnc9I14kF3vpvCljbMyWMOJL4aEiB8qU/ObUK7HYWVrl1pFZWiCOCBQqKOLjPGTrNZZqKbUXVHq2nNwTuJRk1VpbgXN8s7Rk5ym0UQQzhIG2NAjhxHWbI+gCBVjBBFbwxwQqEiiUJGg1BVGAFe7dV28WYLYZFmF2Th1UD7JGjymGyn1iK5OyzIBGB1HgrLZhamzumQAGJwSqnSCh1q3GOCodxt4cxurdcpzuN4cyhiWaF5Bg09udUmnWw1H/jV9nFuJ7Quo+8h8peThFA+047vduyMtk7fYqTl07YFdfUufMPzT5p71UdtlmYXaGS2t3mQHAsgxANdadYJopLe4QS2867EsZ4QfCNYrCFbjdDPmgkYyWFxgVf04ifJf6ScNdRUW1XBb6FU5TjF5EpSSrGu/s5lN+g5z/opvVpfoOc/wCim9WtdHnatvObJXDW7xLGhB8nrPaY9/HCr+tEdPCVaSeDoYLnqF63lzW4/PFSW3ecxbI84VSzWUwUaSdg0DXXK5nvAipnd6qgKvWnQO7pri9ZUEmm3Vl2j1kr8pRlFRyquBNZjGxQ/S56Y1S2fu9OVueon11Szahoou06QoQUXadIVCD2FJJ7R+U89dMydv8Axdn+TH9muZye0flPPXQstlK5Tbka1gUjlC1q0vVLkeb6r+O3Tx9xcY1nt8c0NrZCyiOE1108NYjGv1joo7Js1jzKyScYLIvkzL6LDwHXVJksH9Sb49dKNq0tj1jA6uriOCL+02FWX7iVtZX1/AzaHTyeoauKn2MX9W79zebiZCuR5MjSrhfXuEtwTrUeZH+yNfdrRNcxI6IzhXlJEak6WIGJ2Rw4ChWnChndtlVBLMdQA0k1gbXNMzzDfDLs6mjaPKppJbWwJ1bOwwxw43OnHh71YT3DpfWUJmFlb5jHHDdeXBHIsrRea5TSqvxqG04cNN62vetoCS4tre5mgnkGE9q+3DKOkuI2WX6LDQRRHWDh1UCtwj7QRg2wdl8Djgw1qe7XvW0BQ3kfZ7mSLgU+T9E6RVbnuVrnWVSWqj+Lt8ZbRuHEdKPkYVcZ2MJY5fSGyeVar45+rkWQHAqccalPE5km1htWK5nK4Wnt5FuUBUwOMG4nGkA/BXUrW4S6torlOjMgcd/xVn7rLo7zKs0uEjCNeSvdwoBhgsZxX1l2j36k3Lu+uyprdj5Vs5A+i/lD48a0aaVJOPi7jB6lbzWozpjB48pf1NDXNN4vfl7+Z4BXS65pvF78vfzPAK71XTHmZ/S/yT+jvJ7L3fHytz1E+upbL+Qj5W56jfXWRnsIYKLtekKEFGWvSFQgyjk9o/Keet3YthlMP/5x9msJJ7R+U89biyb/AMXEv7gD6tadL1T+kwepRrC39ZkLDMbiwMvUHRPG0bjlGg8ore/23sxBldxfMPLupNhT8yL/AORNZbdzJ484scytxgLqJY5LZj6Q2sV5G1Vud1mjjyG0ij0NEGSZToKyhjtqw4waztuiXA3qKTbSxltfGhbZlE95ZtZqxVbgiOZhrER9ph3Svk9+pJILZ4Y4DGBFCUMKjRsGPobPFhUfW0NJmljE2xJcIrcI2vFUEln1lRXd6lrazXT9GCNpD+yNqoI7mOVduNw6nzlOIoPOUa6yye1XXcbMR5GdQ3xY0BSbj31/FcTQZirJ+q431q7anbHCTZ72Bw7lbPrKBMcBWNNgbMBBh+bsjBdni0VJ1lARZs6yWiupxCuMDy6KpS2IwOo6DTr3Mre3e5tZZVUM4ZBjqOOJoWO4jkXajcOOMHGgDISvWIrdAkKR80+TzVl908bPPL3LzxOuHdifxVfiTAg92qI/w+/8gGgSyN/mR7XPVlp0lF/3L3mbVKtu5Hjbk/8AHE2Fc03i9+Xv5ngFdKNc13i9+Xv5ngFaNV0x5nn+l/kn9HeEWXu+PlbnqJ9dS2Xu9OVueon11kZ7CGCjLXpCgxRlr0hUIPYUcntH5Tz1s8vb+Bt1/dqPirGSe0flPPWusG/g4Py15q06XqlyMWvVYQ+ruI9xJOqzO9hOto/sP8tbGOFIrmWeM7IuMDMnAXXQJOUjQeOsJk0nY96ip0CYunrjaHx1t+srPJUbXBm2LrFPikwTOb+T+VhbZxGMrDXp83x1QSy2tucJpUjPETp+Cn5/ftaRvKvtp3Kx48HG3erHMzOxZiWZtLMdJNQSbbL71Vk6yynViOkqnEEfOWtPbXi3EQkGg6mXiNckjeSJxJGxR10qw0GtxuxmvbImD4CZMFlA4fRfv0BqesqqzTMZNMEDbIHtHH2QeCiZJSqMQdOGiue53mz3czQwsRbIcNHnkec3c4qAMuriz68gTIToxwOOnlp0MjxMJYW741Gs3RVldtbygE/dMcHX/moDaxTiWNZB53B3arb8/wC+4SOF4sf/AKxU9kcBsfOGHfoUHtG/RbzY5Die5HHhXdvavqiZ9Q8Jdlq4/gbKua7xe/L38zwCuhpf2Uk/Zo50kmwJKIdogDjw1VzzeL35e/meAVp1LTgqY4nn+mRauzqmqwrjzCLL3fHytz1E+upLL+Qj5W56jfXWRnroYKLtekKEFF2vSFQg9hSSe0flPPWosm/hIfoLzVl5PaPynnrRWb/w0X0F5q06XqlyM2sVYx5gmbFre/t71NY2T+0h8VbSO5SWNJUOKSAMp7jDGspmMPaLRlXS6eWve1/FRO7WYdbZm1Y/eW/R7qHxHRXGojlm3ulid6aVbaW+OALvgCLq2Hm9WxHKWqjhj6xsK1e8dm15l4niG1LZkswGsxtrPeOmsvayBJA1VItlWjptLuTdPMo7LtjRDq9naK4+WF9IrUW7BaHOljGqVHB7w2hzVoZt87d8vaNYSLl02CcRsDEbJbj71Uu7UBkvJ7/D7q2QoDxySaAO8MTXdxRVMpRp5XZOWdF/ms7R5XdyKfKWJsO/5PhrG5XlNxmEywW6bTnTxAAcJNbGSMXkM1pjgbiNo1PziPJ+Os7u7m/6ReM00ZOgxSpqYYHT3wRXMKN4ll9zUG4bQfNshu8sZVuEA2hirA4qe/VOwwrVbzbww5mI44UKRRYkbWG0S3JWctbd7u5WFfOOLHiUdJqmaipfLsIsObhWe001lMkMVvJNjhghIALMcBxCs7fxXQmkupx1bXDswGPlaTidVaEyKNXkoo4eBV+Sq7L7Vs9zcBgeyQ4GQ/MB1crmoim2orezqcowTuSeEY48jQ7oZX2PLzdyLhNd6RjrEY6I7+uspvH78vfzPAK6UAAAFGAGgAcArmu8Xvy9/M8ArTfio24RW5nnaG67uou3H/KPuqT2X8hHytz1G+upLL3enK3PUb66ys9RDBRdr0hQgou06QqEGUkntH5Tz1e238vF9BeaqKT2j8p56vbb+Xi+gvNWjTdUuRn1XTHmTh8KrJTJlt8t1CPIY44cGnpJVjTJYkmjaN9Ib4u7V923njTethRauZJV3PaW1rfLIiXEDYg6R4VYc9CXW7thfOZbKdbGZtLW8uPVY/u3GrkNUkM9zlcxUjbhfWOA90cRq4gv4LhdqN+VToNYWmnRm9NNVWNTyHc6VWBv8wt4YeHqm6xyPmroq1Z7WGFLSxTq7WLSuPSdjrkfumq5yHXDUeA92oO2SKpVumNAaoJLMXH3myp0rpJ4uKhc3tbDM5BMri1zAj79j7KTiY8TcdBpcsith0286o+sPCagEX9Pzg4zXUCp6QYse8oouCG3tk6m1BYv05W6T+IdyolxbHDAAa2OgDlNCz3ryN2WxBd5PJMg1t81eId2ukqnLlTBbfcuY+9uJLiRcvtPvHdsHK+cfRHcHDWsyawjyy0WBcDI3lTP6TeIcFV+S5OmXx9bJg1048o8Cj0V8Jq2DVu09nL80up7OxHi+oal3P8AXB/IsZS8T/YOV65zvCcc7vfzPAK3ivWCz445zeH954BXOr6I8yfSfyz+jvCLP3fHytz1G+upLP3fHytz1E+usbPaQ0UXadIUIKLtekKhB7Ckk9o/Keer22/l4/oLzVRSe0flPPV7b/y8X0F5q0abqlyM+q6Y8yQsBTDMor1o8aiaE1pbluMqS3sbLLHIhSRQyngqukhaJ9uBjo+H5aOa3ao2t34qouRlLajTalGP8v0IY8ylXQ+PKPFU/bYXOLPge6CKia0LaxTOxHu1Q7cuBd9yPEJ7TbjXKO8CajbMIF6CNIeNvJHjqIWJ7tSpYkalqVblwIdyG+RGXur0hXYJFxal+Dhq5y3slkv3Y2pD0pTr+QUClpJRUdo9XW4OLrTHtM16cZLLWkeC7y4jvlNEpcRtw1Ux27Ci448NZrTFy3nn3IQWxlgGrDZ3pza7/M8ArZo+ArF5171uvp+CqdV0R5l/psUrs2vB3hdl7vTlbnqJ9dS2Xu+PlbnqJ9dY2eshooq16QoQUXa9IVCD2FLJ7RuU89WNtmUSQqkgYMgw0accKrpPaPynnrZWG4Vi+VWmY5tnMWXG+XrIYnA0rhj0mdcTgdNdwnKDqjmduM1SRR/qlr8/4KX6pa8T/BVzDuLZXudRZblmbxXcPUNPc3KqCIwrbOzgrHEnHjoyD+3eSXkht7DeKG4umDGOJVUklfouThXfmbnZ7Cvy1vt9pmv1W1+d8FL9VteJvgq5yrcOGfLmzHN80iyyETPbptAEFo2ZG8pmUa1OFNn3Ky6W/sbDKM5hv5bx2WTZA+7RF2y52WOPJTzE+z2Dy1vt9pT/AKpacTerS/U7Tib1a04/t7kDXPY03jhN0W6sQ7K7W3q2dnrMccaDy/8At80kuZfqWYxWNtlcvUPPhiGYhWDeUy7IwYU8xPs9g8tb7faUn6pacTerTxm9oOBvVq3v9z927aynuId44LiWKNnjhAXF2UYhRg516qpsryjLr21665zFLSTaK9U2GOA87SwqY37knRU+BzOzags0s1Oyr+BKM6sxwP6tSDPLMen6vy0rvdm3Sxlu7K/S7WDDrFUDUTxgnTU826eXW7KlxmqQuwDBXUKcD+1Xee/wXuKX5XDGWLapSVcOyhEM/seJ/V+WnjeGx4pPV+Wkm6kKZlFay3Jlt7iFpYZY8ASVK6DjtDDA0f8A0Tl340/1f8Ndx8xJVWXB0KbktFFpNzdVXAC/qOwA0CQni2flrO3Vwbm5lnI2TKxbDirX/wBE5d+NcfV/wVR7xZPa5U9utvI8nWhmbbw0YEAYYAVxfhfy5rlKR4Fulu6X7mW1mzT8S4Yis/5CPlbnqJ9dSWfu9OVueon11mZvQ2i7XpChKKtekKhBlNJ7R+U89bDfGTb3a3ZX0Lcj6kdY+T2j8p560288m1kWQr6MJ+ylSAr+2cnV5renjs3H1loX+3j9XvbbtxLN9lqW4UnV5jdnjtXHxihtyZNjeSBu5J9k1BJe7xy7W5CJ/wCzuD/mTVTf2+fq97LJuLrPsNRueS7W6aJ/38x+vLVXuY+xvHaNxbf2GoCezf8A36j/APsSf8w1sLnqczTefJluYoLm5uo5F61sBshItP1cNFYe1f8A3ir/APfE/wCZUe9bB94r5jwuPsrQFhmG4l/Z2M17HdW90tuu3IkTHaCjWdIw0VVZdks9/C06yJFEp2dp+E1bbqybGTZ8vpQD7L1XRv8A7blT96Oda7tpNuuNE37Cq9KSisjyuUoxrStKllHbLlWTXsMs8chuSuwEPDqwoLe5y+YRE/gLzmqRekvKKtd4327yM/ulHxmrHJStySWVRyrjxKI2XC/CTlnlPPKTpTdFbP0L1bgrf5Lp0G3dPhQHwV0S1lzBsns3sESR8Crh9WAJGjSOKuU3E+zdZQ3oJh8IArdZXFDmOTpHa3i2+YrI2KtKy4ricBsBuHHgFXSo440+Wa2qqxjvM9uMoy+WvzWpLCWWWE28HxL6e43ojgkeSCBY1Ri5BGIUDT51cl3vm276BBqSEH4WbxV0tlkyXJcxTMb+OW6uY9mGHrCzDQwwAbTp2uKuTZ9N1uYsfRRR8WPhrm419mSSjRyiqxVK7y23B/ftuTm2oSdJyzNVw3BFn7vTlbnqF9dS2fu9OVueon11lZuQ2iLdsGFD05H2dNQGV0ntG5Tz1dWm9N1b2kVq8EVwsI2UaQaQOKhmitZGLOmk68DhSFvY+gfWNSAg7z3Qvo7yKCKIohiaNR5LKxx8qpxvjcqS0VpbxvwOAcRQPZ7D0G9Y0uz2HoH1jUCpLY7zXlpbm3eKO5QuzjrBqZji3x17PvNcyT288VvDBJbMWUovS2hslW7mFQ9nsPQPrGl2ew9A+saCod/WNxtbYsrfb17WBxx5ddD2281xC88klvDcSXEnWuzrqOGGC9zRUPZ7D0G9Y0uzWHoH1jQVCLreq6ntZbaO3it1mGy7RjTs1X2mYy20ZiCq8ZOODcdEdmsPQb1jS7PYegfWNdJuLqnQiSUlRqpFLmryxtH1Ma7Qw2gNNPOdSt0oI27p007s9h6B9Y0uz2HoH1jXX3Z+I4+1b8IJdX89xLHKQFMXQUahpxoiPN5P+onfU+A0/s9h6DesaXZ7D0D6xpG7OLbUtu0StW5JJx2bBsmbtiSiEk+cxoCWWSaVpZOk2vDVo0VYdnsPQb1jSNvZcCH1jSd2c+p1XAmFqEOmOPEfaH+BQd1ueo211IzrgFUYKNAAqI1WztCpUqVCRUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoD/9k=", 
if(cc._loaderImage = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QNvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6M0Y1NjZBN0NGODk3RTUxMUE3MzY5QUJDRjExMEY0NkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUVCMTgwQkI5OThGMTFFNTk0M0E5REVEQUQ4MEY5MzUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUVCMTgwQkE5OThGMTFFNTk0M0E5REVEQUQ4MEY5MzUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NTc4Njk3MTZDOTlFNTExQjhDNUY4MEUxM0RBNkVBRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRjU2NkE3Q0Y4OTdFNTExQTczNjlBQkNGMTEwRjQ2RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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6LtFG9k9p57dWRjqzxvc4O6JWPJa9p3hZce4vWdYUyUi8aW4wk7dfnQ1raSpIo7oBixmP2cwHrQuPaHFpzHyruYN1XJHi4e42lsXGONe/wC9trzrvCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg1rhbqK4Uxp6yFs0ROIB2tcNjmuGbXDiFMTMchsqAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBB/9k=",cc.loader.loadBinary = function(a, b) {
	var c = this,
		d = this.getXMLHttpRequest(),
		e = "load " + a + " failed!";
	d.open("GET", a, !0), cc.loader.loadBinary._IEFilter ? (d.setRequestHeader("Accept-Charset", "x-user-defined"), d.onreadystatechange = function() {
		if (4 === d.readyState && 200 === d.status) {
			var a = cc._convertResponseBodyToText(d.responseBody);
			b(null, c._str2Uint8Array(a))
		} else b(e)
	}) : (d.overrideMimeType && d.overrideMimeType("text/plain; charset=x-user-defined"), d.onload = function() {
		4 === d.readyState && 200 === d.status ? b(null, c._str2Uint8Array(d.responseText)) : b(e)
	}), d.send(null)
}, cc.loader.loadBinary._IEFilter = /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) && window.IEBinaryToArray_ByteStr && window.IEBinaryToArray_ByteStr_Last, cc.loader._str2Uint8Array = function(a) {
	if (!a) return null;
	for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++) b[c] = 255 & a.charCodeAt(c);
	return b
}, cc.loader.loadBinarySync = function(a) {
	var b = this,
		c = this.getXMLHttpRequest(),
		d = "load " + a + " failed!";
	c.open("GET", a, !1);
	var e = null;
	if (cc.loader.loadBinary._IEFilter) {
		if (c.setRequestHeader("Accept-Charset", "x-user-defined"), c.send(null), 200 !== c.status) return cc.log(d), null;
		var f = cc._convertResponseBodyToText(c.responseBody);
		f && (e = b._str2Uint8Array(f))
	} else {
		if (c.overrideMimeType && c.overrideMimeType("text/plain; charset=x-user-defined"), c.send(null), 200 !== c.status) return cc.log(d), null;
		e = this._str2Uint8Array(c.responseText)
	}
	return e
}, window.Uint8Array = window.Uint8Array || window.Array, cc.loader.loadBinary._IEFilter) {
	var IEBinaryToArray_ByteStr_Script = '<!-- IEBinaryToArray_ByteStr -->\r\nFunction IEBinaryToArray_ByteStr(Binary)\r\n   IEBinaryToArray_ByteStr = CStr(Binary)\r\nEnd Function\r\nFunction IEBinaryToArray_ByteStr_Last(Binary)\r\n   Dim lastIndex\r\n   lastIndex = LenB(Binary)\r\n   if lastIndex mod 2 Then\r\n       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n   Else\r\n       IEBinaryToArray_ByteStr_Last = ""\r\n   End If\r\nEnd Function\r\n',
		myVBScript = cc.newElement("script");
	myVBScript.type = "text/vbscript", myVBScript.textContent = IEBinaryToArray_ByteStr_Script, document.body.appendChild(myVBScript), cc._convertResponseBodyToText = function(a) {
		for (var b = {}, c = 0; 256 > c; c++) for (var d = 0; 256 > d; d++) b[String.fromCharCode(c + 256 * d)] = String.fromCharCode(c) + String.fromCharCode(d);
		var e = IEBinaryToArray_ByteStr(a),
			f = IEBinaryToArray_ByteStr_Last(a);
		return e.replace(/[\s\S]/g, function(a) {
			return b[a]
		}) + f
	}
}
var cc = cc || {},
	ClassManager = {
		id: 0 | 998 * Math.random(),
		instanceId: 0 | 998 * Math.random(),
		compileSuper: function(a, b, c) {
			var d = a.toString(),
				e = d.indexOf("("),
				f = d.indexOf(")"),
				g = d.substring(e + 1, f);
			g = g.trim();
			for (var h = d.indexOf("{"), i = d.lastIndexOf("}"), d = d.substring(h + 1, i); - 1 !== d.indexOf("this._super");) {
				var j = d.indexOf("this._super"),
					k = d.indexOf("(", j),
					l = d.indexOf(")", k),
					m = d.substring(k + 1, l);
				m = m.trim();
				var n = m ? "," : "";
				d = d.substring(0, j) + "ClassManager[" + c + "]." + b + ".call(this" + n + d.substring(k + 1)
			}
			return Function(g, d)
		},
		getNewID: function() {
			return this.id++
		},
		getNewInstanceId: function() {
			return this.instanceId++
		}
	};
switch (ClassManager.compileSuper.ClassManager = ClassManager, function() {
	var a = /\b_super\b/,
		b = cc.game.config,
		c = b[cc.game.CONFIG_KEY.classReleaseMode];
	c && console.log("release Mode"), cc.Class = function() {}, cc.Class.extend = function(b) {
		function d() {
			this.__instanceId = ClassManager.getNewInstanceId(), this.ctor && this.ctor.apply(this, arguments)
		}
		var e = this.prototype,
			f = Object.create(e),
			g = ClassManager.getNewID();
		ClassManager[g] = e;
		var h = {
			writable: !0,
			enumerable: !1,
			configurable: !0
		};
		f.__instanceId = null, d.id = g, h.value = g, Object.defineProperty(f, "__pid", h), d.prototype = f, h.value = d, Object.defineProperty(d.prototype, "constructor", h), this.__getters__ && (d.__getters__ = cc.clone(this.__getters__)), this.__setters__ && (d.__setters__ = cc.clone(this.__setters__));
		for (var i = 0, j = arguments.length; j > i; ++i) {
			var k = arguments[i];
			for (var l in k) {
				var m = "function" == typeof k[l],
					n = "function" == typeof e[l],
					o = a.test(k[l]);
				if (c && m && n && o ? (h.value = ClassManager.compileSuper(k[l], l, g), Object.defineProperty(f, l, h)) : m && n && o ? (h.value = function(a, b) {
					return function() {
						var c = this._super;
						this._super = e[a];
						var d = b.apply(this, arguments);
						return this._super = c, d
					}
				}(l, k[l]), Object.defineProperty(f, l, h)) : m ? (h.value = k[l], Object.defineProperty(f, l, h)) : f[l] = k[l], m) {
					var p, q, r;
					if (this.__getters__ && this.__getters__[l]) {
						r = this.__getters__[l];
						for (var s in this.__setters__) if (this.__setters__[s] === r) {
							q = s;
							break
						}
						cc.defineGetterSetter(f, r, k[l], k[q] ? k[q] : f[q], l, q)
					}
					if (this.__setters__ && this.__setters__[l]) {
						r = this.__setters__[l];
						for (var s in this.__getters__) if (this.__getters__[s] === r) {
							p = s;
							break
						}
						cc.defineGetterSetter(f, r, k[p] ? k[p] : f[p], k[l], p, l)
					}
				}
			}
		}
		return d.extend = cc.Class.extend, d.implement = function(a) {
			for (var b in a) f[b] = a[b]
		}, d
	}
}(), cc.defineGetterSetter = function(a, b, c, d, e, f) {
	if (a.__defineGetter__) c && a.__defineGetter__(b, c), d && a.__defineSetter__(b, d);
	else {
		if (!Object.defineProperty) throw new Error("browser does not support getters");
		var g = {
			enumerable: !1,
			configurable: !0
		};
		c && (g.get = c), d && (g.set = d), Object.defineProperty(a, b, g)
	}
	if (!e && !f) for (var h = null != c, i = void 0 != d, j = Object.getOwnPropertyNames(a), k = 0; k < j.length; k++) {
		var l = j[k];
		if ((a.__lookupGetter__ ? !a.__lookupGetter__(l) : !Object.getOwnPropertyDescriptor(a, l)) && "function" == typeof a[l]) {
			var m = a[l];
			if (h && m === c && (e = l, !i || f)) break;
			if (i && m === d && (f = l, !h || e)) break
		}
	}
	var n = a.constructor;
	e && (n.__getters__ || (n.__getters__ = {}), n.__getters__[e] = b), f && (n.__setters__ || (n.__setters__ = {}), n.__setters__[f] = b)
}, cc.clone = function(a) {
	var b = a.constructor ? new a.constructor : {};
	for (var c in a) {
		var d = a[c];
		"object" != typeof d || !d || d instanceof cc.Node || d instanceof HTMLElement ? b[c] = d : b[c] = cc.clone(d)
	}
	return b
}, cc.inject = function(a, b) {
	for (var c in a) b[c] = a[c]
}, cc.Point = function(a, b) {
	this.x = a || 0, this.y = b || 0
}, cc.p = function(a, b) {
	return void 0 === a ? {
		x: 0,
		y: 0
	} : void 0 === b ? {
		x: a.x,
		y: a.y
	} : {
		x: a,
		y: b
	}
}, cc.pointEqualToPoint = function(a, b) {
	return a && b && a.x === b.x && a.y === b.y
}, cc.Size = function(a, b) {
	this.width = a || 0, this.height = b || 0
}, cc.size = function(a, b) {
	return void 0 === a ? {
		width: 0,
		height: 0
	} : void 0 === b ? {
		width: a.width,
		height: a.height
	} : {
		width: a,
		height: b
	}
}, cc.sizeEqualToSize = function(a, b) {
	return a && b && a.width === b.width && a.height === b.height
}, cc.Rect = function(a, b, c, d) {
	this.x = a || 0, this.y = b || 0, this.width = c || 0, this.height = d || 0
}, cc.rect = function(a, b, c, d) {
	return void 0 === a ? {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	} : void 0 === b ? {
		x: a.x,
		y: a.y,
		width: a.width,
		height: a.height
	} : {
		x: a,
		y: b,
		width: c,
		height: d
	}
}, cc.rectEqualToRect = function(a, b) {
	return a && b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}, cc._rectEqualToZero = function(a) {
	return a && 0 === a.x && 0 === a.y && 0 === a.width && 0 === a.height
}, cc.rectContainsRect = function(a, b) {
	return a && b ? !(a.x >= b.x || a.y >= b.y || a.x + a.width <= b.x + b.width || a.y + a.height <= b.y + b.height) : !1
}, cc.rectGetMaxX = function(a) {
	return a.x + a.width
}, cc.rectGetMidX = function(a) {
	return a.x + a.width / 2
}, cc.rectGetMinX = function(a) {
	return a.x
}, cc.rectGetMaxY = function(a) {
	return a.y + a.height
}, cc.rectGetMidY = function(a) {
	return a.y + a.height / 2
}, cc.rectGetMinY = function(a) {
	return a.y
}, cc.rectContainsPoint = function(a, b) {
	return b.x >= cc.rectGetMinX(a) && b.x <= cc.rectGetMaxX(a) && b.y >= cc.rectGetMinY(a) && b.y <= cc.rectGetMaxY(a)
}, cc.rectIntersectsRect = function(a, b) {
	var c = a.x + a.width,
		d = a.y + a.height,
		e = b.x + b.width,
		f = b.y + b.height;
	return !(c < b.x || e < a.x || d < b.y || f < a.y)
}, cc.rectOverlapsRect = function(a, b) {
	return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y)
}, cc.rectUnion = function(a, b) {
	var c = cc.rect(0, 0, 0, 0);
	return c.x = Math.min(a.x, b.x), c.y = Math.min(a.y, b.y), c.width = Math.max(a.x + a.width, b.x + b.width) - c.x, c.height = Math.max(a.y + a.height, b.y + b.height) - c.y, c
}, cc.rectIntersection = function(a, b) {
	var c = cc.rect(Math.max(cc.rectGetMinX(a), cc.rectGetMinX(b)), Math.max(cc.rectGetMinY(a), cc.rectGetMinY(b)), 0, 0);
	return c.width = Math.min(cc.rectGetMaxX(a), cc.rectGetMaxX(b)) - cc.rectGetMinX(c), c.height = Math.min(cc.rectGetMaxY(a), cc.rectGetMaxY(b)) - cc.rectGetMinY(c), c
}, cc.SAXParser = cc.Class.extend({
	_parser: null,
	_isSupportDOMParser: null,
	ctor: function() {
		window.DOMParser ? (this._isSupportDOMParser = !0, this._parser = new DOMParser) : this._isSupportDOMParser = !1
	},
	parse: function(a) {
		return this._parseXML(a)
	},
	_parseXML: function(a) {
		var b;
		return this._isSupportDOMParser ? b = this._parser.parseFromString(a, "text/xml") : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)), b
	}
}), cc.PlistParser = cc.SAXParser.extend({
	parse: function(a) {
		var b = this._parseXML(a),
			c = b.documentElement;
		if ("plist" !== c.tagName) throw new Error("Not a plist file!");
		for (var d = null, e = 0, f = c.childNodes.length; f > e && (d = c.childNodes[e], 1 !== d.nodeType); e++);
		return b = null, this._parseNode(d)
	},
	_parseNode: function(a) {
		var b = null,
			c = a.tagName;
		if ("dict" === c) b = this._parseDict(a);
		else if ("array" === c) b = this._parseArray(a);
		else if ("string" === c) if (1 === a.childNodes.length) b = a.firstChild.nodeValue;
		else {
			b = "";
			for (var d = 0; d < a.childNodes.length; d++) b += a.childNodes[d].nodeValue
		} else "false" === c ? b = !1 : "true" === c ? b = !0 : "real" === c ? b = parseFloat(a.firstChild.nodeValue) : "integer" === c && (b = parseInt(a.firstChild.nodeValue, 10));
		return b
	},
	_parseArray: function(a) {
		for (var b = [], c = 0, d = a.childNodes.length; d > c; c++) {
			var e = a.childNodes[c];
			1 === e.nodeType && b.push(this._parseNode(e))
		}
		return b
	},
	_parseDict: function(a) {
		for (var b = {}, c = null, d = 0, e = a.childNodes.length; e > d; d++) {
			var f = a.childNodes[d];
			1 === f.nodeType && ("key" === f.tagName ? c = f.firstChild.nodeValue : b[c] = this._parseNode(f))
		}
		return b
	}
}), cc._txtLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadTxt(a, d)
	}
}, cc.loader.register(["txt", "xml", "vsh", "fsh", "atlas"], cc._txtLoader), cc._jsonLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadJson(a, d)
	}
}, cc.loader.register(["json", "ExportJson"], cc._jsonLoader), cc._jsLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadJs(a, d)
	}
}, cc.loader.register(["js"], cc._jsLoader), cc._imgLoader = {
	load: function(a, b, c, d) {
		cc.loader.cache[b] = cc.loader.loadImg(a, function(a, c) {
			return a ? d(a) : (cc.textureCache.handleLoadedTexture(b), void d(null, c))
		})
	}
}, cc.loader.register(["png", "jpg", "bmp", "jpeg", "gif", "ico", "tiff", "webp"], cc._imgLoader), cc._serverImgLoader = {
	load: function(a, b, c, d) {
		cc.loader.cache[b] = cc.loader.loadImg(c.src, function(a, c) {
			return a ? d(a) : (cc.textureCache.handleLoadedTexture(b), void d(null, c))
		})
	}
}, cc.loader.register(["serverImg"], cc._serverImgLoader), cc._plistLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadTxt(a, function(a, b) {
			return a ? d(a) : void d(null, cc.plistParser.parse(b))
		})
	}
}, cc.loader.register(["plist"], cc._plistLoader), cc._fontLoader = {
	TYPE: {
		".eot": "embedded-opentype",
		".ttf": "truetype",
		".ttc": "truetype",
		".woff": "woff",
		".svg": "svg"
	},
	_loadFont: function(a, b, c) {
		var d = document,
			e = cc.path,
			f = this.TYPE,
			g = cc.newElement("style");
		g.type = "text/css", d.body.appendChild(g);
		var h = "";
		if (h += isNaN(a - 0) ? "@font-face { font-family:" + a + "; src:" : "@font-face { font-family:'" + a + "'; src:", b instanceof Array) for (var i = 0, j = b.length; j > i; i++) {
			var k = b[i];
			c = e.extname(k).toLowerCase(), h += "url('" + b[i] + "') format('" + f[c] + "')", h += i === j - 1 ? ";" : ","
		} else c = c.toLowerCase(), h += "url('" + b + "') format('" + f[c] + "');";
		g.textContent += h + "}";
		var l = cc.newElement("div"),
			m = l.style;
		m.fontFamily = a, l.innerHTML = ".", m.position = "absolute", m.left = "-100px", m.top = "-100px", d.body.appendChild(l)
	},
	load: function(a, b, c, d) {
		var e = this,
			f = c.type,
			g = c.name,
			h = c.srcs;
		cc.isString(c) ? (f = cc.path.extname(c), g = cc.path.basename(c, f), e._loadFont(g, c, f)) : e._loadFont(g, h), d(null, !0)
	}
}, cc.loader.register(["font", "eot", "ttf", "woff", "svg", "ttc"], cc._fontLoader), cc._binaryLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadBinary(a, d)
	}
}, cc._csbLoader = {
	load: function(a, b, c, d) {
		cc.loader.loadCsb(a, d)
	}
}, cc.loader.register(["csb"], cc._csbLoader), window.CocosEngine = cc.ENGINE_VERSION = "Cocos2d-JS v3.8", cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 0, cc.DIRECTOR_STATS_POSITION = cc.p(0, 0), cc.DIRECTOR_FPS_INTERVAL = .5, cc.COCOSNODE_RENDER_SUBPIXEL = 1, cc.SPRITEBATCHNODE_RENDER_SUBPIXEL = 1, cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA = 1, cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP = 0, cc.TEXTURE_ATLAS_USE_VAO = 0, cc.TEXTURE_NPOT_SUPPORT = 0, cc.RETINA_DISPLAY_SUPPORT = 1, cc.RETINA_DISPLAY_FILENAME_SUFFIX = "-hd", cc.USE_LA88_LABELS = 1, cc.SPRITE_DEBUG_DRAW = 0, cc.SPRITEBATCHNODE_DEBUG_DRAW = 0, cc.LABELBMFONT_DEBUG_DRAW = 0, cc.LABELATLAS_DEBUG_DRAW = 0, cc.IS_RETINA_DISPLAY_SUPPORTED = 1, cc.DEFAULT_ENGINE = cc.ENGINE_VERSION + "-canvas", cc.ENABLE_STACKABLE_ACTIONS = 1, cc.ENABLE_GL_STATE_CACHE = 1, cc.$ = function(a) {
	var b = this === cc ? document : this,
		c = a instanceof HTMLElement ? a : b.querySelector(a);
	return c && (c.find = c.find || cc.$, c.hasClass = c.hasClass ||
	function(a) {
		return this.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"))
	}, c.addClass = c.addClass ||
	function(a) {
		return this.hasClass(a) || (this.className && (this.className += " "), this.className += a), this
	}, c.removeClass = c.removeClass ||
	function(a) {
		return this.hasClass(a) && (this.className = this.className.replace(a, "")), this
	}, c.remove = c.remove ||
	function() {
		return this.parentNode && this.parentNode.removeChild(this), this
	}, c.appendTo = c.appendTo ||
	function(a) {
		return a.appendChild(this), this
	}, c.prependTo = c.prependTo ||
	function(a) {
		return a.childNodes[0] ? a.insertBefore(this, a.childNodes[0]) : a.appendChild(this), this
	}, c.transforms = c.transforms ||
	function() {
		return this.style[cc.$.trans] = cc.$.translate(this.position) + cc.$.rotate(this.rotation) + cc.$.scale(this.scale) + cc.$.skew(this.skew), this
	}, c.position = c.position || {
		x: 0,
		y: 0
	}, c.rotation = c.rotation || 0, c.scale = c.scale || {
		x: 1,
		y: 1
	}, c.skew = c.skew || {
		x: 0,
		y: 0
	}, c.translates = function(a, b) {
		return this.position.x = a, this.position.y = b, this.transforms(), this
	}, c.rotate = function(a) {
		return this.rotation = a, this.transforms(), this
	}, c.resize = function(a, b) {
		return this.scale.x = a, this.scale.y = b, this.transforms(), this
	}, c.setSkew = function(a, b) {
		return this.skew.x = a, this.skew.y = b, this.transforms(), this
	}), c
}, cc.sys.browserType) {
case cc.sys.BROWSER_TYPE_FIREFOX:
	cc.$.pfx = "Moz", cc.$.hd = !0;
	break;
case cc.sys.BROWSER_TYPE_CHROME:
case cc.sys.BROWSER_TYPE_SAFARI:
	cc.$.pfx = "webkit", cc.$.hd = !0;
	break;
case cc.sys.BROWSER_TYPE_OPERA:
	cc.$.pfx = "O", cc.$.hd = !1;
	break;
case cc.sys.BROWSER_TYPE_IE:
	cc.$.pfx = "ms", cc.$.hd = !1;
	break;
default:
	cc.$.pfx = "webkit", cc.$.hd = !0
}
cc.$.trans = cc.$.pfx + "Transform", cc.$.translate = cc.$.hd ?
function(a) {
	return "translate3d(" + a.x + "px, " + a.y + "px, 0) "
} : function(a) {
	return "translate(" + a.x + "px, " + a.y + "px) "
}, cc.$.rotate = cc.$.hd ?
function(a) {
	return "rotateZ(" + a + "deg) "
} : function(a) {
	return "rotate(" + a + "deg) "
}, cc.$.scale = function(a) {
	return "scale(" + a.x + ", " + a.y + ") "
}, cc.$.skew = function(a) {
	return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)"
}, cc.$new = function(a) {
	return cc.$(document.createElement(a))
}, cc.$.findpos = function(a) {
	var b = 0,
		c = 0;
	do b += a.offsetLeft, c += a.offsetTop;
	while (a = a.offsetParent);
	return {
		x: b,
		y: c
	}
}, cc.INVALID_INDEX = -1, cc.PI = Math.PI, cc.FLT_MAX = parseFloat("3.402823466e+38F"), cc.FLT_MIN = parseFloat("1.175494351e-38F"), cc.RAD = cc.PI / 180, cc.DEG = 180 / cc.PI, cc.UINT_MAX = 4294967295, cc.swap = function(a, b, c) {
	if (!cc.isObject(c) || cc.isUndefined(c.x) || cc.isUndefined(c.y)) cc.log(cc._LogInfos.swap);
	else {
		var d = c[a];
		c[a] = c[b], c[b] = d
	}
}, cc.lerp = function(a, b, c) {
	return a + (b - a) * c
}, cc.rand = function() {
	return 16777215 * Math.random()
}, cc.randomMinus1To1 = function() {
	return 2 * (Math.random() - .5)
}, cc.random0To1 = Math.random, cc.degreesToRadians = function(a) {
	return a * cc.RAD
}, cc.radiansToDegrees = function(a) {
	return a * cc.DEG
}, cc.radiansToDegress = function(a) {
	return cc.log(cc._LogInfos.radiansToDegress), a * cc.DEG
}, cc.REPEAT_FOREVER = Number.MAX_VALUE - 1, cc.nodeDrawSetup = function(a) {
	a._shaderProgram && (a._shaderProgram.use(), a._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4())
}, cc.enableDefaultGLStates = function() {}, cc.disableDefaultGLStates = function() {}, cc.incrementGLDraws = function(a) {
	cc.g_NumberOfDraws += a
}, cc.FLT_EPSILON = 1.192092896e-7, cc.contentScaleFactor = cc.IS_RETINA_DISPLAY_SUPPORTED ?
function() {
	return cc.director.getContentScaleFactor()
} : function() {
	return 1
}, cc.pointPointsToPixels = function(a) {
	var b = cc.contentScaleFactor();
	return cc.p(a.x * b, a.y * b)
}, cc.pointPixelsToPoints = function(a) {
	var b = cc.contentScaleFactor();
	return cc.p(a.x / b, a.y / b)
}, cc._pointPixelsToPointsOut = function(a, b) {
	var c = cc.contentScaleFactor();
	b.x = a.x / c, b.y = a.y / c
}, cc.sizePointsToPixels = function(a) {
	var b = cc.contentScaleFactor();
	return cc.size(a.width * b, a.height * b)
}, cc.sizePixelsToPoints = function(a) {
	var b = cc.contentScaleFactor();
	return cc.size(a.width / b, a.height / b)
}, cc._sizePixelsToPointsOut = function(a, b) {
	var c = cc.contentScaleFactor();
	b.width = a.width / c, b.height = a.height / c
}, cc.rectPixelsToPoints = cc.IS_RETINA_DISPLAY_SUPPORTED ?
function(a) {
	var b = cc.contentScaleFactor();
	return cc.rect(a.x / b, a.y / b, a.width / b, a.height / b)
} : function(a) {
	return a
}, cc.rectPointsToPixels = cc.IS_RETINA_DISPLAY_SUPPORTED ?
function(a) {
	var b = cc.contentScaleFactor();
	return cc.rect(a.x * b, a.y * b, a.width * b, a.height * b)
} : function(a) {
	return a
}, cc.ONE = 1, cc.ZERO = 0, cc.SRC_ALPHA = 770, cc.SRC_ALPHA_SATURATE = 776, cc.SRC_COLOR = 768, cc.DST_ALPHA = 772, cc.DST_COLOR = 774, cc.ONE_MINUS_SRC_ALPHA = 771, cc.ONE_MINUS_SRC_COLOR = 769, cc.ONE_MINUS_DST_ALPHA = 773, cc.ONE_MINUS_DST_COLOR = 775, cc.ONE_MINUS_CONSTANT_ALPHA = 32772, cc.ONE_MINUS_CONSTANT_COLOR = 32770, cc.LINEAR = 9729, cc.REPEAT = 10497, cc.CLAMP_TO_EDGE = 33071, cc.MIRRORED_REPEAT = 33648, cc.BLEND_SRC = cc._renderType === cc._RENDER_TYPE_WEBGL && cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA ? cc.ONE : cc.SRC_ALPHA, cc.BLEND_DST = 771, cc.checkGLErrorDebug = function() {
	if (cc.renderMode === cc._RENDER_TYPE_WEBGL) {
		var a = cc._renderContext.getError();
		a && cc.log(cc._LogInfos.checkGLErrorDebug, a)
	}
}, cc.DEVICE_ORIENTATION_PORTRAIT = 0, cc.DEVICE_ORIENTATION_LANDSCAPE_LEFT = 1, cc.DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2, cc.DEVICE_ORIENTATION_LANDSCAPE_RIGHT = 3, cc.DEVICE_MAX_ORIENTATIONS = 2, cc.VERTEX_ATTRIB_FLAG_NONE = 0, cc.VERTEX_ATTRIB_FLAG_POSITION = 1, cc.VERTEX_ATTRIB_FLAG_COLOR = 2, cc.VERTEX_ATTRIB_FLAG_TEX_COORDS = 4, cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX = cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS, cc.GL_ALL = 0, cc.VERTEX_ATTRIB_POSITION = 0, cc.VERTEX_ATTRIB_COLOR = 1, cc.VERTEX_ATTRIB_TEX_COORDS = 2, cc.VERTEX_ATTRIB_MAX = 3, cc.UNIFORM_PMATRIX = 0, cc.UNIFORM_MVMATRIX = 1, cc.UNIFORM_MVPMATRIX = 2, cc.UNIFORM_TIME = 3, cc.UNIFORM_SINTIME = 4, cc.UNIFORM_COSTIME = 5, cc.UNIFORM_RANDOM01 = 6, cc.UNIFORM_SAMPLER = 7, cc.UNIFORM_MAX = 8, cc.SHADER_POSITION_TEXTURECOLOR = "ShaderPositionTextureColor", cc.SHADER_POSITION_TEXTURECOLORALPHATEST = "ShaderPositionTextureColorAlphaTest", cc.SHADER_POSITION_COLOR = "ShaderPositionColor", cc.SHADER_POSITION_TEXTURE = "ShaderPositionTexture", cc.SHADER_POSITION_TEXTURE_UCOLOR = "ShaderPositionTexture_uColor", cc.SHADER_POSITION_TEXTUREA8COLOR = "ShaderPositionTextureA8Color", cc.SHADER_POSITION_UCOLOR = "ShaderPosition_uColor", cc.SHADER_POSITION_LENGTHTEXTURECOLOR = "ShaderPositionLengthTextureColor", cc.UNIFORM_PMATRIX_S = "CC_PMatrix", cc.UNIFORM_MVMATRIX_S = "CC_MVMatrix", cc.UNIFORM_MVPMATRIX_S = "CC_MVPMatrix", cc.UNIFORM_TIME_S = "CC_Time", cc.UNIFORM_SINTIME_S = "CC_SinTime", cc.UNIFORM_COSTIME_S = "CC_CosTime", cc.UNIFORM_RANDOM01_S = "CC_Random01", cc.UNIFORM_SAMPLER_S = "CC_Texture0", cc.UNIFORM_ALPHA_TEST_VALUE_S = "CC_alpha_value", cc.ATTRIBUTE_NAME_COLOR = "a_color", cc.ATTRIBUTE_NAME_POSITION = "a_position", cc.ATTRIBUTE_NAME_TEX_COORD = "a_texCoord", cc.ITEM_SIZE = 32, cc.CURRENT_ITEM = 3233828865, cc.ZOOM_ACTION_TAG = 3233828866, cc.NORMAL_TAG = 8801, cc.SELECTED_TAG = 8802, cc.DISABLE_TAG = 8803, cc.arrayVerifyType = function(a, b) {
	if (a && a.length > 0) for (var c = 0; c < a.length; c++) if (!(a[c] instanceof b)) return cc.log("element type is wrong!"), !1;
	return !0
}, cc.arrayRemoveObject = function(a, b) {
	for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) {
		a.splice(c, 1);
		break
	}
}, cc.arrayRemoveArray = function(a, b) {
	for (var c = 0, d = b.length; d > c; c++) cc.arrayRemoveObject(a, b[c])
}, cc.arrayAppendObjectsToIndex = function(a, b, c) {
	return a.splice.apply(a, [c, 0].concat(b)), a
}, cc.copyArray = function(a) {
	var b, c = a.length,
		d = new Array(c);
	for (b = 0; c > b; b += 1) d[b] = a[b];
	return d
}, cc._tmp.PrototypeColor = function() {
	var a = cc.color;
	a._getWhite = function() {
		return a(255, 255, 255)
	}, a._getYellow = function() {
		return a(255, 255, 0)
	}, a._getBlue = function() {
		return a(0, 0, 255)
	}, a._getGreen = function() {
		return a(0, 255, 0)
	}, a._getRed = function() {
		return a(255, 0, 0)
	}, a._getMagenta = function() {
		return a(255, 0, 255)
	}, a._getBlack = function() {
		return a(0, 0, 0)
	}, a._getOrange = function() {
		return a(255, 127, 0)
	}, a._getGray = function() {
		return a(166, 166, 166)
	}, a.WHITE, cc.defineGetterSetter(a, "WHITE", a._getWhite), a.YELLOW, cc.defineGetterSetter(a, "YELLOW", a._getYellow), a.BLUE, cc.defineGetterSetter(a, "BLUE", a._getBlue), a.GREEN, cc.defineGetterSetter(a, "GREEN", a._getGreen), a.RED, cc.defineGetterSetter(a, "RED", a._getRed), a.MAGENTA, cc.defineGetterSetter(a, "MAGENTA", a._getMagenta), a.BLACK, cc.defineGetterSetter(a, "BLACK", a._getBlack), a.ORANGE, cc.defineGetterSetter(a, "ORANGE", a._getOrange), a.GRAY, cc.defineGetterSetter(a, "GRAY", a._getGray), cc.BlendFunc._disable = function() {
		return new cc.BlendFunc(cc.ONE, cc.ZERO)
	}, cc.BlendFunc._alphaPremultiplied = function() {
		return new cc.BlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA)
	}, cc.BlendFunc._alphaNonPremultiplied = function() {
		return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA)
	}, cc.BlendFunc._additive = function() {
		return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE)
	}, cc.BlendFunc.DISABLE, cc.defineGetterSetter(cc.BlendFunc, "DISABLE", cc.BlendFunc._disable), cc.BlendFunc.ALPHA_PREMULTIPLIED, cc.defineGetterSetter(cc.BlendFunc, "ALPHA_PREMULTIPLIED", cc.BlendFunc._alphaPremultiplied), cc.BlendFunc.ALPHA_NON_PREMULTIPLIED, cc.defineGetterSetter(cc.BlendFunc, "ALPHA_NON_PREMULTIPLIED", cc.BlendFunc._alphaNonPremultiplied), cc.BlendFunc.ADDITIVE, cc.defineGetterSetter(cc.BlendFunc, "ADDITIVE", cc.BlendFunc._additive)
};
var cc = cc || {};
switch (cc._tmp = cc._tmp || {}, cc._tmp.WebGLColor = function() {
	cc.color = function(a, b, c, d, e, f) {
		if (void 0 === a) return new cc.Color(0, 0, 0, 255, e, f);
		if (cc.isString(a)) {
			var g = cc.hexToColor(a);
			return new cc.Color(g.r, g.g, g.b, g.a)
		}
		return cc.isObject(a) ? new cc.Color(a.r, a.g, a.b, a.a, a.arrayBuffer, a.offset) : new cc.Color(a, b, c, d, e, f)
	}, cc.Color = function(a, b, c, d, e, f) {
		this._arrayBuffer = e || new ArrayBuffer(cc.Color.BYTES_PER_ELEMENT), this._offset = f || 0;
		var g = this._arrayBuffer,
			h = this._offset,
			i = Uint8Array.BYTES_PER_ELEMENT;
		this._rU8 = new Uint8Array(g, h, 1), this._gU8 = new Uint8Array(g, h + i, 1), this._bU8 = new Uint8Array(g, h + 2 * i, 1), this._aU8 = new Uint8Array(g, h + 3 * i, 1), this._rU8[0] = a || 0, this._gU8[0] = b || 0, this._bU8[0] = c || 0, this._aU8[0] = null == d ? 255 : d, void 0 === d && (this.a_undefined = !0)
	}, cc.Color.BYTES_PER_ELEMENT = 4;
	var a = cc.Color.prototype;
	a._getR = function() {
		return this._rU8[0]
	}, a._setR = function(a) {
		this._rU8[0] = 0 > a ? 0 : a
	}, a._getG = function() {
		return this._gU8[0]
	}, a._setG = function(a) {
		this._gU8[0] = 0 > a ? 0 : a
	}, a._getB = function() {
		return this._bU8[0]
	}, a._setB = function(a) {
		this._bU8[0] = 0 > a ? 0 : a
	}, a._getA = function() {
		return this._aU8[0]
	}, a._setA = function(a) {
		this._aU8[0] = 0 > a ? 0 : a
	}, a.r, cc.defineGetterSetter(a, "r", a._getR, a._setR), a.g, cc.defineGetterSetter(a, "g", a._getG, a._setG), a.b, cc.defineGetterSetter(a, "b", a._getB, a._setB), a.a, cc.defineGetterSetter(a, "a", a._getA, a._setA), cc.Vertex2F = function(a, b, c, d) {
		this._arrayBuffer = c || new ArrayBuffer(cc.Vertex2F.BYTES_PER_ELEMENT), this._offset = d || 0, this._xF32 = new Float32Array(this._arrayBuffer, this._offset, 1), this._yF32 = new Float32Array(this._arrayBuffer, this._offset + 4, 1), this._xF32[0] = a || 0, this._yF32[0] = b || 0
	}, cc.Vertex2F.BYTES_PER_ELEMENT = 8, a = cc.Vertex2F.prototype, a._getX = function() {
		return this._xF32[0]
	}, a._setX = function(a) {
		this._xF32[0] = a
	}, a._getY = function() {
		return this._yF32[0]
	}, a._setY = function(a) {
		this._yF32[0] = a
	}, a.x, cc.defineGetterSetter(a, "x", a._getX, a._setX), a.y, cc.defineGetterSetter(a, "y", a._getY, a._setY), cc.Vertex3F = function(a, b, c, d, e) {
		this._arrayBuffer = d || new ArrayBuffer(cc.Vertex3F.BYTES_PER_ELEMENT), this._offset = e || 0;
		var f = this._arrayBuffer,
			g = this._offset;
		this._xF32 = new Float32Array(f, g, 1), this._xF32[0] = a || 0, this._yF32 = new Float32Array(f, g + Float32Array.BYTES_PER_ELEMENT, 1), this._yF32[0] = b || 0, this._zF32 = new Float32Array(f, g + 2 * Float32Array.BYTES_PER_ELEMENT, 1), this._zF32[0] = c || 0
	}, cc.Vertex3F.BYTES_PER_ELEMENT = 12, a = cc.Vertex3F.prototype, a._getX = function() {
		return this._xF32[0]
	}, a._setX = function(a) {
		this._xF32[0] = a
	}, a._getY = function() {
		return this._yF32[0]
	}, a._setY = function(a) {
		this._yF32[0] = a
	}, a._getZ = function() {
		return this._zF32[0]
	}, a._setZ = function(a) {
		this._zF32[0] = a
	}, a.x, cc.defineGetterSetter(a, "x", a._getX, a._setX), a.y, cc.defineGetterSetter(a, "y", a._getY, a._setY), a.z, cc.defineGetterSetter(a, "z", a._getZ, a._setZ), cc.Tex2F = function(a, b, c, d) {
		this._arrayBuffer = c || new ArrayBuffer(cc.Tex2F.BYTES_PER_ELEMENT), this._offset = d || 0, this._uF32 = new Float32Array(this._arrayBuffer, this._offset, 1), this._vF32 = new Float32Array(this._arrayBuffer, this._offset + 4, 1), this._uF32[0] = a || 0, this._vF32[0] = b || 0
	}, cc.Tex2F.BYTES_PER_ELEMENT = 8, a = cc.Tex2F.prototype, a._getU = function() {
		return this._uF32[0]
	}, a._setU = function(a) {
		this._uF32[0] = a
	}, a._getV = function() {
		return this._vF32[0]
	}, a._setV = function(a) {
		this._vF32[0] = a
	}, a.u, cc.defineGetterSetter(a, "u", a._getU, a._setU), a.v, cc.defineGetterSetter(a, "v", a._getV, a._setV), cc.Quad2 = function(a, b, c, d, e, f) {
		this._arrayBuffer = e || new ArrayBuffer(cc.Quad2.BYTES_PER_ELEMENT), this._offset = f || 0;
		var g = this._arrayBuffer,
			h = cc.Vertex2F.BYTES_PER_ELEMENT;
		this._tl = a ? new cc.Vertex2F(a.x, a.y, g, 0) : new cc.Vertex2F(0, 0, g, 0), this._tr = b ? new cc.Vertex2F(b.x, b.y, g, h) : new cc.Vertex2F(0, 0, g, h), this._bl = c ? new cc.Vertex2F(c.x, c.y, g, 2 * h) : new cc.Vertex2F(0, 0, g, 2 * h), this._br = d ? new cc.Vertex2F(d.x, d.y, g, 3 * h) : new cc.Vertex2F(0, 0, g, 3 * h)
	}, cc.Quad2.BYTES_PER_ELEMENT = 32, a = cc.Quad2.prototype, a._getTL = function() {
		return this._tl
	}, a._setTL = function(a) {
		this._tl.x = a.x, this._tl.y = a.y
	}, a._getTR = function() {
		return this._tr
	}, a._setTR = function(a) {
		this._tr.x = a.x, this._tr.y = a.y
	}, a._getBL = function() {
		return this._bl
	}, a._setBL = function(a) {
		this._bl.x = a.x, this._bl.y = a.y
	}, a._getBR = function() {
		return this._br
	}, a._setBR = function(a) {
		this._br.x = a.x, this._br.y = a.y
	}, a.tl, cc.defineGetterSetter(a, "tl", a._getTL, a._setTL), a.tr, cc.defineGetterSetter(a, "tr", a._getTR, a._setTR), a.bl, cc.defineGetterSetter(a, "bl", a._getBL, a._setBL), a.br, cc.defineGetterSetter(a, "br", a._getBR, a._setBR), cc.Quad3 = function(a, b, c, d) {
		this.bl = a || new cc.Vertex3F(0, 0, 0), this.br = b || new cc.Vertex3F(0, 0, 0), this.tl = c || new cc.Vertex3F(0, 0, 0), this.tr = d || new cc.Vertex3F(0, 0, 0)
	}, cc.V3F_C4B_T2F = function(a, b, c, d, e) {
		this._arrayBuffer = d || new ArrayBuffer(cc.V3F_C4B_T2F.BYTES_PER_ELEMENT), this._offset = e || 0;
		var f = this._arrayBuffer,
			g = this._offset,
			h = cc.Vertex3F.BYTES_PER_ELEMENT;
		this._vertices = a ? new cc.Vertex3F(a.x, a.y, a.z, f, g) : new cc.Vertex3F(0, 0, 0, f, g), this._colors = b ? cc.color(b.r, b.g, b.b, b.a, f, g + h) : cc.color(0, 0, 0, 0, f, g + h), this._texCoords = c ? new cc.Tex2F(c.u, c.v, f, g + h + cc.Color.BYTES_PER_ELEMENT) : new cc.Tex2F(0, 0, f, g + h + cc.Color.BYTES_PER_ELEMENT)
	}, cc.V3F_C4B_T2F.BYTES_PER_ELEMENT = 24, a = cc.V3F_C4B_T2F.prototype, a._getVertices = function() {
		return this._vertices
	}, a._setVertices = function(a) {
		var b = this._vertices;
		b.x = a.x, b.y = a.y, b.z = a.z
	}, a._getColor = function() {
		return this._colors
	}, a._setColor = function(a) {
		var b = this._colors;
		b.r = a.r, b.g = a.g, b.b = a.b, b.a = a.a
	}, a._getTexCoords = function() {
		return this._texCoords
	}, a._setTexCoords = function(a) {
		this._texCoords.u = a.u, this._texCoords.v = a.v
	}, a.vertices, cc.defineGetterSetter(a, "vertices", a._getVertices, a._setVertices), a.colors, cc.defineGetterSetter(a, "colors", a._getColor, a._setColor), a.texCoords, cc.defineGetterSetter(a, "texCoords", a._getTexCoords, a._setTexCoords), cc.V3F_C4B_T2F_Quad = function(a, b, c, d, e, f) {
		this._arrayBuffer = e || new ArrayBuffer(cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT), this._offset = f || 0;
		var g = this._arrayBuffer,
			h = this._offset,
			i = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
		this._tl = a ? new cc.V3F_C4B_T2F(a.vertices, a.colors, a.texCoords, g, h) : new cc.V3F_C4B_T2F(null, null, null, g, h), this._bl = b ? new cc.V3F_C4B_T2F(b.vertices, b.colors, b.texCoords, g, h + i) : new cc.V3F_C4B_T2F(null, null, null, g, h + i), this._tr = c ? new cc.V3F_C4B_T2F(c.vertices, c.colors, c.texCoords, g, h + 2 * i) : new cc.V3F_C4B_T2F(null, null, null, g, h + 2 * i), this._br = d ? new cc.V3F_C4B_T2F(d.vertices, d.colors, d.texCoords, g, h + 3 * i) : new cc.V3F_C4B_T2F(null, null, null, g, h + 3 * i)
	}, cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT = 96, a = cc.V3F_C4B_T2F_Quad.prototype, a._getTL = function() {
		return this._tl
	}, a._setTL = function(a) {
		var b = this._tl;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getBL = function() {
		return this._bl
	}, a._setBL = function(a) {
		var b = this._bl;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getTR = function() {
		return this._tr
	}, a._setTR = function(a) {
		var b = this._tr;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getBR = function() {
		return this._br
	}, a._setBR = function(a) {
		var b = this._br;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getArrayBuffer = function() {
		return this._arrayBuffer
	}, a.tl, cc.defineGetterSetter(a, "tl", a._getTL, a._setTL), a.tr, cc.defineGetterSetter(a, "tr", a._getTR, a._setTR), a.bl, cc.defineGetterSetter(a, "bl", a._getBL, a._setBL), a.br, cc.defineGetterSetter(a, "br", a._getBR, a._setBR), a.arrayBuffer, cc.defineGetterSetter(a, "arrayBuffer", a._getArrayBuffer, null), cc.V3F_C4B_T2F_QuadZero = function() {
		return new cc.V3F_C4B_T2F_Quad
	}, cc.V3F_C4B_T2F_QuadCopy = function(a) {
		if (!a) return cc.V3F_C4B_T2F_QuadZero();
		var b = a.tl,
			c = a.bl,
			d = a.tr,
			e = a.br;
		return {
			tl: {
				vertices: {
					x: b.vertices.x,
					y: b.vertices.y,
					z: b.vertices.z
				},
				colors: {
					r: b.colors.r,
					g: b.colors.g,
					b: b.colors.b,
					a: b.colors.a
				},
				texCoords: {
					u: b.texCoords.u,
					v: b.texCoords.v
				}
			},
			bl: {
				vertices: {
					x: c.vertices.x,
					y: c.vertices.y,
					z: c.vertices.z
				},
				colors: {
					r: c.colors.r,
					g: c.colors.g,
					b: c.colors.b,
					a: c.colors.a
				},
				texCoords: {
					u: c.texCoords.u,
					v: c.texCoords.v
				}
			},
			tr: {
				vertices: {
					x: d.vertices.x,
					y: d.vertices.y,
					z: d.vertices.z
				},
				colors: {
					r: d.colors.r,
					g: d.colors.g,
					b: d.colors.b,
					a: d.colors.a
				},
				texCoords: {
					u: d.texCoords.u,
					v: d.texCoords.v
				}
			},
			br: {
				vertices: {
					x: e.vertices.x,
					y: e.vertices.y,
					z: e.vertices.z
				},
				colors: {
					r: e.colors.r,
					g: e.colors.g,
					b: e.colors.b,
					a: e.colors.a
				},
				texCoords: {
					u: e.texCoords.u,
					v: e.texCoords.v
				}
			}
		}
	}, cc.V3F_C4B_T2F_QuadsCopy = function(a) {
		if (!a) return [];
		for (var b = [], c = 0; c < a.length; c++) b.push(cc.V3F_C4B_T2F_QuadCopy(a[c]));
		return b
	}, cc.V2F_C4B_T2F = function(a, b, c, d, e) {
		this._arrayBuffer = d || new ArrayBuffer(cc.V2F_C4B_T2F.BYTES_PER_ELEMENT), this._offset = e || 0;
		var f = this._arrayBuffer,
			g = this._offset,
			h = cc.Vertex2F.BYTES_PER_ELEMENT;
		this._vertices = a ? new cc.Vertex2F(a.x, a.y, f, g) : new cc.Vertex2F(0, 0, f, g), this._colors = b ? cc.color(b.r, b.g, b.b, b.a, f, g + h) : cc.color(0, 0, 0, 0, f, g + h), this._texCoords = c ? new cc.Tex2F(c.u, c.v, f, g + h + cc.Color.BYTES_PER_ELEMENT) : new cc.Tex2F(0, 0, f, g + h + cc.Color.BYTES_PER_ELEMENT)
	}, cc.V2F_C4B_T2F.BYTES_PER_ELEMENT = 20, a = cc.V2F_C4B_T2F.prototype, a._getVertices = function() {
		return this._vertices
	}, a._setVertices = function(a) {
		this._vertices.x = a.x, this._vertices.y = a.y
	}, a._getColor = function() {
		return this._colors
	}, a._setColor = function(a) {
		var b = this._colors;
		b.r = a.r, b.g = a.g, b.b = a.b, b.a = a.a
	}, a._getTexCoords = function() {
		return this._texCoords
	}, a._setTexCoords = function(a) {
		this._texCoords.u = a.u, this._texCoords.v = a.v
	}, a.vertices, cc.defineGetterSetter(a, "vertices", a._getVertices, a._setVertices), a.colors, cc.defineGetterSetter(a, "colors", a._getColor, a._setColor), a.texCoords, cc.defineGetterSetter(a, "texCoords", a._getTexCoords, a._setTexCoords), cc.V2F_C4B_T2F_Triangle = function(a, b, c, d, e) {
		this._arrayBuffer = d || new ArrayBuffer(cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT), this._offset = e || 0;
		var f = this._arrayBuffer,
			g = this._offset,
			h = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
		this._a = a ? new cc.V2F_C4B_T2F(a.vertices, a.colors, a.texCoords, f, g) : new cc.V2F_C4B_T2F(null, null, null, f, g), this._b = b ? new cc.V2F_C4B_T2F(b.vertices, b.colors, b.texCoords, f, g + h) : new cc.V2F_C4B_T2F(null, null, null, f, g + h), this._c = c ? new cc.V2F_C4B_T2F(c.vertices, c.colors, c.texCoords, f, g + 2 * h) : new cc.V2F_C4B_T2F(null, null, null, f, g + 2 * h)
	}, cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT = 60, a = cc.V2F_C4B_T2F_Triangle.prototype, a._getA = function() {
		return this._a
	}, a._setA = function(a) {
		var b = this._a;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getB = function() {
		return this._b
	}, a._setB = function(a) {
		var b = this._b;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a._getC = function() {
		return this._c
	}, a._setC = function(a) {
		var b = this._c;
		b.vertices = a.vertices, b.colors = a.colors, b.texCoords = a.texCoords
	}, a.a, cc.defineGetterSetter(a, "a", a._getA, a._setA), a.b, cc.defineGetterSetter(a, "b", a._getB, a._setB), a.c, cc.defineGetterSetter(a, "c", a._getC, a._setC)
}, cc.Color = function(a, b, c, d) {
	this.r = a || 0, this.g = b || 0, this.b = c || 0, this.a = null == d ? 255 : d
}, cc.color = function(a, b, c, d) {
	return void 0 === a ? {
		r: 0,
		g: 0,
		b: 0,
		a: 255
	} : cc.isString(a) ? cc.hexToColor(a) : cc.isObject(a) ? {
		r: a.r,
		g: a.g,
		b: a.b,
		a: null == a.a ? 255 : a.a
	} : {
		r: a,
		g: b,
		b: c,
		a: null == d ? 255 : d
	}
}, cc.colorEqual = function(a, b) {
	return a.r === b.r && a.g === b.g && a.b === b.b
}, cc.Acceleration = function(a, b, c, d) {
	this.x = a || 0, this.y = b || 0, this.z = c || 0, this.timestamp = d || 0
}, cc.Vertex2F = function(a, b) {
	this.x = a || 0, this.y = b || 0
}, cc.vertex2 = function(a, b) {
	return new cc.Vertex2F(a, b)
}, cc.Vertex3F = function(a, b, c) {
	this.x = a || 0, this.y = b || 0, this.z = c || 0
}, cc.vertex3 = function(a, b, c) {
	return new cc.Vertex3F(a, b, c)
}, cc.Tex2F = function(a, b) {
	this.u = a || 0, this.v = b || 0
}, cc.tex2 = function(a, b) {
	return new cc.Tex2F(a, b)
}, cc.BlendFunc = function(a, b) {
	this.src = a, this.dst = b
}, cc.blendFuncDisable = function() {
	return new cc.BlendFunc(cc.ONE, cc.ZERO)
}, cc.hexToColor = function(a) {
	a = a.replace(/^#?/, "0x");
	var b = parseInt(a),
		c = b >> 16,
		d = (b >> 8) % 256,
		e = b % 256;
	return cc.color(c, d, e)
}, cc.colorToHex = function(a) {
	var b = a.r.toString(16),
		c = a.g.toString(16),
		d = a.b.toString(16);
	return "#" + (a.r < 16 ? "0" + b : b) + (a.g < 16 ? "0" + c : c) + (a.b < 16 ? "0" + d : d)
}, cc.TEXT_ALIGNMENT_LEFT = 0, cc.TEXT_ALIGNMENT_CENTER = 1, cc.TEXT_ALIGNMENT_RIGHT = 2, cc.VERTICAL_TEXT_ALIGNMENT_TOP = 0, cc.VERTICAL_TEXT_ALIGNMENT_CENTER = 1, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM = 2, cc._Dictionary = cc.Class.extend({
	_keyMapTb: null,
	_valueMapTb: null,
	__currId: 0,
	ctor: function() {
		this._keyMapTb = {}, this._valueMapTb = {}, this.__currId = 2 << (0 | 10 * Math.random())
	},
	__getKey: function() {
		return this.__currId++, "key_" + this.__currId
	},
	setObject: function(a, b) {
		if (null != b) {
			var c = this.__getKey();
			this._keyMapTb[c] = b, this._valueMapTb[c] = a
		}
	},
	objectForKey: function(a) {
		if (null == a) return null;
		var b = this._keyMapTb;
		for (var c in b) if (b[c] === a) return this._valueMapTb[c];
		return null
	},
	valueForKey: function(a) {
		return this.objectForKey(a)
	},
	removeObjectForKey: function(a) {
		if (null != a) {
			var b = this._keyMapTb;
			for (var c in b) if (b[c] === a) return delete this._valueMapTb[c], void delete b[c]
		}
	},
	removeObjectsForKeys: function(a) {
		if (null != a) for (var b = 0; b < a.length; b++) this.removeObjectForKey(a[b])
	},
	allKeys: function() {
		var a = [],
			b = this._keyMapTb;
		for (var c in b) a.push(b[c]);
		return a
	},
	removeAllObjects: function() {
		this._keyMapTb = {}, this._valueMapTb = {}
	},
	count: function() {
		return this.allKeys().length
	}
}), cc.FontDefinition = function(a) {
	var b = this;
	if (b.fontName = "Arial", b.fontSize = 12, b.textAlign = cc.TEXT_ALIGNMENT_CENTER, b.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP, b.fillStyle = cc.color(255, 255, 255, 255), b.boundingWidth = 0, b.boundingHeight = 0, b.strokeEnabled = !1, b.strokeStyle = cc.color(255, 255, 255, 255), b.lineWidth = 1, b.lineHeight = "normal", b.fontStyle = "normal", b.fontWeight = "normal", b.shadowEnabled = !1, b.shadowOffsetX = 0, b.shadowOffsetY = 0, b.shadowBlur = 0, b.shadowOpacity = 1, a && a instanceof Object) for (var c in a) b[c] = a[c]
}, cc.FontDefinition.prototype._getCanvasFontStr = function() {
	var a = this.lineHeight.charAt ? this.lineHeight : this.lineHeight + "px";
	return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px/" + a + " '" + this.fontName + "'"
}, cc._renderType === cc._RENDER_TYPE_WEBGL && (cc.assert(cc.isFunction(cc._tmp.WebGLColor), cc._LogInfos.MissingFile, "CCTypesWebGL.js"), cc._tmp.WebGLColor(), delete cc._tmp.WebGLColor), cc.assert(cc.isFunction(cc._tmp.PrototypeColor), cc._LogInfos.MissingFile, "CCTypesPropertyDefine.js"), cc._tmp.PrototypeColor(), delete cc._tmp.PrototypeColor, cc.Touches = [], cc.TouchesIntergerDict = {}, cc.DENSITYDPI_DEVICE = "device-dpi", cc.DENSITYDPI_HIGH = "high-dpi", cc.DENSITYDPI_MEDIUM = "medium-dpi", cc.DENSITYDPI_LOW = "low-dpi", cc.__BrowserGetter = {
	init: function() {
		this.html = document.getElementsByTagName("html")[0]
	},
	availWidth: function(a) {
		return a && a !== this.html ? a.clientWidth : window.innerWidth
	},
	availHeight: function(a) {
		return a && a !== this.html ? a.clientHeight : window.innerHeight
	},
	meta: {
		width: "device-width",
		"user-scalable": "no"
	},
	adaptationType: cc.sys.browserType
}, window.navigator.userAgent.indexOf("OS 8_1_") > -1 && (cc.__BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_MIUI), cc.sys.os === cc.sys.OS_IOS && (cc.__BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_SAFARI), cc.__BrowserGetter.adaptationType) {
case cc.sys.BROWSER_TYPE_SAFARI:
	cc.__BrowserGetter.meta["minimal-ui"] = "true", cc.__BrowserGetter.availWidth = function(a) {
		return a.clientWidth
	}, cc.__BrowserGetter.availHeight = function(a) {
		return a.clientHeight
	};
	break;
case cc.sys.BROWSER_TYPE_CHROME:
	cc.__BrowserGetter.__defineGetter__("target-densitydpi", function() {
		return cc.view._targetDensityDPI
	});
case cc.sys.BROWSER_TYPE_SOUGOU:
case cc.sys.BROWSER_TYPE_UC:
	cc.__BrowserGetter.availWidth = function(a) {
		return a.clientWidth
	}, cc.__BrowserGetter.availHeight = function(a) {
		return a.clientHeight
	};
	break;
case cc.sys.BROWSER_TYPE_MIUI:
	cc.__BrowserGetter.init = function(a) {
		if (!a.__resizeWithBrowserSize) {
			var b = function() {
					a.setDesignResolutionSize(a._designResolutionSize.width, a._designResolutionSize.height, a._resolutionPolicy), window.removeEventListener("resize", b, !1)
				};
			window.addEventListener("resize", b, !1)
		}
	}
}
if (cc.EGLView = cc.Class.extend({
	_delegate: null,
	_frameSize: null,
	_designResolutionSize: null,
	_originalDesignResolutionSize: null,
	_viewPortRect: null,
	_visibleRect: null,
	_retinaEnabled: !1,
	_autoFullScreen: !0,
	_devicePixelRatio: 1,
	_viewName: "",
	_resizeCallback: null,
	_scaleX: 1,
	_originalScaleX: 1,
	_scaleY: 1,
	_originalScaleY: 1,
	_indexBitsUsed: 0,
	_maxTouches: 5,
	_resolutionPolicy: null,
	_rpExactFit: null,
	_rpShowAll: null,
	_rpNoBorder: null,
	_rpFixedHeight: null,
	_rpFixedWidth: null,
	_initialized: !1,
	_captured: !1,
	_wnd: null,
	_hDC: null,
	_hRC: null,
	_supportTouch: !1,
	_contentTranslateLeftTop: null,
	_frame: null,
	_frameZoomFactor: 1,
	__resizeWithBrowserSize: !1,
	_isAdjustViewPort: !0,
	_targetDensityDPI: null,
	ctor: function() {
		var a = this,
			b = document,
			c = cc.ContainerStrategy,
			d = cc.ContentStrategy;
		cc.__BrowserGetter.init(this), a._frame = cc.container.parentNode === b.body ? b.documentElement : cc.container.parentNode, a._frameSize = cc.size(0, 0), a._initFrameSize();
		var e = cc._canvas.width,
			f = cc._canvas.height;
		a._designResolutionSize = cc.size(e, f), a._originalDesignResolutionSize = cc.size(e, f), a._viewPortRect = cc.rect(0, 0, e, f), a._visibleRect = cc.rect(0, 0, e, f), a._contentTranslateLeftTop = {
			left: 0,
			top: 0
		}, a._viewName = "Cocos2dHTML5";
		var g = cc.sys;
		a.enableRetina(g.os === g.OS_IOS || g.os === g.OS_OSX), cc.visibleRect && cc.visibleRect.init(a._visibleRect), a._rpExactFit = new cc.ResolutionPolicy(c.EQUAL_TO_FRAME, d.EXACT_FIT), a._rpShowAll = new cc.ResolutionPolicy(c.PROPORTION_TO_FRAME, d.SHOW_ALL), a._rpNoBorder = new cc.ResolutionPolicy(c.EQUAL_TO_FRAME, d.NO_BORDER), a._rpFixedHeight = new cc.ResolutionPolicy(c.EQUAL_TO_FRAME, d.FIXED_HEIGHT), a._rpFixedWidth = new cc.ResolutionPolicy(c.EQUAL_TO_FRAME, d.FIXED_WIDTH), a._hDC = cc._canvas, a._hRC = cc._renderContext, a._targetDensityDPI = cc.DENSITYDPI_HIGH
	},
	_resizeEvent: function() {
		var a;
		a = this.setDesignResolutionSize ? this : cc.view;
		var b = a._frameSize.width,
			c = a._frameSize.height;
		if (a._initFrameSize(), a._frameSize.width !== b || a._frameSize.height !== c) {
			a._resizeCallback && a._resizeCallback.call();
			var d = a._originalDesignResolutionSize.width,
				e = a._originalDesignResolutionSize.height;
			d > 0 && a.setDesignResolutionSize(d, e, a._resolutionPolicy)
		}
	},
	setTargetDensityDPI: function(a) {
		this._targetDensityDPI = a, this._adjustViewportMeta()
	},
	getTargetDensityDPI: function() {
		return this._targetDensityDPI
	},
	resizeWithBrowserSize: function(a) {
		a ? this.__resizeWithBrowserSize || (this.__resizeWithBrowserSize = !0, cc._addEventListener(window, "resize", this._resizeEvent), cc._addEventListener(window, "orientationchange", this._resizeEvent)) : this.__resizeWithBrowserSize && (this.__resizeWithBrowserSize = !1, window.removeEventListener("resize", this._resizeEvent), window.removeEventListener("orientationchange", this._resizeEvent))
	},
	setResizeCallback: function(a) {
		(cc.isFunction(a) || null == a) && (this._resizeCallback = a)
	},
	_initFrameSize: function() {
		var a = this._frameSize;
		a.width = cc.__BrowserGetter.availWidth(this._frame), a.height = cc.__BrowserGetter.availHeight(this._frame)
	},
	_adjustSizeKeepCanvasSize: function() {
		var a = this._originalDesignResolutionSize.width,
			b = this._originalDesignResolutionSize.height;
		a > 0 && this.setDesignResolutionSize(a, b, this._resolutionPolicy)
	},
	_setViewportMeta: function(a, b) {
		var c = document.getElementById("cocosMetaElement");
		c && document.head.removeChild(c);
		var d, e, f, g = document.getElementsByName("viewport"),
			h = g ? g[0] : null;
		c = cc.newElement("meta"), c.id = "cocosMetaElement", c.name = "viewport", c.content = "", d = h ? h.content : "";
		for (e in a) - 1 == d.indexOf(e) ? d += "," + e + "=" + a[e] : b && (f = new RegExp(e + "s*=s*[^,]+"), d.replace(f, e + "=" + a[e]));
		/^,/.test(d) && (d = d.substr(1)), c.content = d, h && (h.content = d), document.head.appendChild(c)
	},
	_adjustViewportMeta: function() {
		this._isAdjustViewPort && this._setViewportMeta(cc.__BrowserGetter.meta, !1)
	},
	_setScaleXYForRenderTexture: function() {
		var a = cc.contentScaleFactor();
		this._scaleX = a, this._scaleY = a
	},
	_resetScale: function() {
		this._scaleX = this._originalScaleX, this._scaleY = this._originalScaleY
	},
	_adjustSizeToBrowser: function() {},
	initialize: function() {
		this._initialized = !0
	},
	adjustViewPort: function(a) {
		this._isAdjustViewPort = a
	},
	enableRetina: function(a) {
		this._retinaEnabled = a ? !0 : !1
	},
	isRetinaEnabled: function() {
		return this._retinaEnabled
	},
	enableAutoFullScreen: function(a) {
		this._autoFullScreen = a ? !0 : !1
	},
	isAutoFullScreenEnabled: function() {
		return this._autoFullScreen
	},
	end: function() {},
	isOpenGLReady: function() {
		return null !== this._hDC && null !== this._hRC
	},
	setFrameZoomFactor: function(a) {
		this._frameZoomFactor = a, this.centerWindow(), cc.director.setProjection(cc.director.getProjection())
	},
	swapBuffers: function() {},
	setIMEKeyboardState: function(a) {},
	setContentTranslateLeftTop: function(a, b) {
		this._contentTranslateLeftTop = {
			left: a,
			top: b
		}
	},
	getContentTranslateLeftTop: function() {
		return this._contentTranslateLeftTop
	},
	getFrameSize: function() {
		return cc.size(this._frameSize.width, this._frameSize.height)
	},
	setFrameSize: function(a, b) {
		this._frameSize.width = a, this._frameSize.height = b, this._frame.style.width = a + "px", this._frame.style.height = b + "px", this._resizeEvent(), cc.director.setProjection(cc.director.getProjection())
	},
	centerWindow: function() {},
	getVisibleSize: function() {
		return cc.size(this._visibleRect.width, this._visibleRect.height)
	},
	getVisibleOrigin: function() {
		return cc.p(this._visibleRect.x, this._visibleRect.y)
	},
	canSetContentScaleFactor: function() {
		return !0
	},
	getResolutionPolicy: function() {
		return this._resolutionPolicy
	},
	setResolutionPolicy: function(a) {
		var b = this;
		if (a instanceof cc.ResolutionPolicy) b._resolutionPolicy = a;
		else {
			var c = cc.ResolutionPolicy;
			a === c.EXACT_FIT && (b._resolutionPolicy = b._rpExactFit), a === c.SHOW_ALL && (b._resolutionPolicy = b._rpShowAll), a === c.NO_BORDER && (b._resolutionPolicy = b._rpNoBorder), a === c.FIXED_HEIGHT && (b._resolutionPolicy = b._rpFixedHeight), a === c.FIXED_WIDTH && (b._resolutionPolicy = b._rpFixedWidth)
		}
	},
	setDesignResolutionSize: function(a, b, c) {
		if (!(a > 0 || b > 0)) return void cc.log(cc._LogInfos.EGLView_setDesignResolutionSize);
		this.setResolutionPolicy(c);
		var d = this._resolutionPolicy;
		if (!d) return void cc.log(cc._LogInfos.EGLView_setDesignResolutionSize_2);
		d.preApply(this), cc.sys.isMobile && this._adjustViewportMeta(), this._initFrameSize(), this._originalDesignResolutionSize.width = this._designResolutionSize.width = a, this._originalDesignResolutionSize.height = this._designResolutionSize.height = b;
		var e = d.apply(this, this._designResolutionSize);
		if (e.scale && 2 === e.scale.length && (this._scaleX = e.scale[0], this._scaleY = e.scale[1]), e.viewport) {
			var f = this._viewPortRect,
				g = this._visibleRect,
				h = e.viewport;
			f.x = h.x, f.y = h.y, f.width = h.width, f.height = h.height, g.x = -f.x / this._scaleX, g.y = -f.y / this._scaleY, g.width = cc._canvas.width / this._scaleX, g.height = cc._canvas.height / this._scaleY, cc._renderContext.setOffset && cc._renderContext.setOffset(f.x, -f.y)
		}
		var i = cc.director;
		i._winSizeInPoints.width = this._designResolutionSize.width, i._winSizeInPoints.height = this._designResolutionSize.height, d.postApply(this), cc.winSize.width = i._winSizeInPoints.width, cc.winSize.height = i._winSizeInPoints.height, cc._renderType === cc._RENDER_TYPE_WEBGL && (i._createStatsLabel(), i.setGLDefaultValues()), this._originalScaleX = this._scaleX, this._originalScaleY = this._scaleY, cc.DOM && cc.DOM._resetEGLViewDiv(), cc.visibleRect && cc.visibleRect.init(this._visibleRect)
	},
	getDesignResolutionSize: function() {
		return cc.size(this._designResolutionSize.width, this._designResolutionSize.height)
	},
	setRealPixelResolution: function(a, b, c) {
		this._setViewportMeta({
			width: a,
			"user-scalable": "no"
		}, !0), document.body.style.width = a + "px", document.body.style.height = "100%", document.body.style.left = "0px", document.body.style.top = "0px", this.setDesignResolutionSize(a, b, c)
	},
	setViewPortInPoints: function(a, b, c, d) {
		var e = this._frameZoomFactor,
			f = this._scaleX,
			g = this._scaleY;
		cc._renderContext.viewport(a * f * e + this._viewPortRect.x * e, b * g * e + this._viewPortRect.y * e, c * f * e, d * g * e)
	},
	setScissorInPoints: function(a, b, c, d) {
		var e = this._frameZoomFactor,
			f = this._scaleX,
			g = this._scaleY;
		cc._renderContext.scissor(a * f * e + this._viewPortRect.x * e, b * g * e + this._viewPortRect.y * e, c * f * e, d * g * e)
	},
	isScissorEnabled: function() {
		var a = cc._renderContext;
		return a.isEnabled(a.SCISSOR_TEST)
	},
	getScissorRect: function() {
		var a = cc._renderContext,
			b = this._scaleX,
			c = this._scaleY,
			d = a.getParameter(a.SCISSOR_BOX);
		return cc.rect((d[0] - this._viewPortRect.x) / b, (d[1] - this._viewPortRect.y) / c, d[2] / b, d[3] / c)
	},
	setViewName: function(a) {
		null != a && a.length > 0 && (this._viewName = a)
	},
	getViewName: function() {
		return this._viewName
	},
	getViewPortRect: function() {
		return this._viewPortRect
	},
	getScaleX: function() {
		return this._scaleX
	},
	getScaleY: function() {
		return this._scaleY
	},
	getDevicePixelRatio: function() {
		return this._devicePixelRatio
	},
	convertToLocationInView: function(a, b, c) {
		return {
			x: this._devicePixelRatio * (a - c.left),
			y: this._devicePixelRatio * (c.top + c.height - b)
		}
	},
	_convertMouseToLocationInView: function(a, b) {
		var c = this._viewPortRect,
			d = this;
		a.x = (d._devicePixelRatio * (a.x - b.left) - c.x) / d._scaleX, a.y = (d._devicePixelRatio * (b.top + b.height - a.y) - c.y) / d._scaleY
	},
	_convertTouchesWithScale: function(a) {
		for (var b, c, d, e = this._viewPortRect, f = this._scaleX, g = this._scaleY, h = 0; h < a.length; h++) b = a[h], c = b._point, d = b._prevPoint, b._setPoint((c.x - e.x) / f, (c.y - e.y) / g), b._setPrevPoint((d.x - e.x) / f, (d.y - e.y) / g)
	}
}), cc.EGLView._getInstance = function() {
	return this._instance || (this._instance = this._instance || new cc.EGLView, this._instance.initialize()), this._instance
}, cc.ContainerStrategy = cc.Class.extend({
	preApply: function(a) {},
	apply: function(a, b) {},
	postApply: function(a) {},
	_setupContainer: function(a, b, c) {
		var d = a._frame;
		cc.view._autoFullScreen && cc.sys.isMobile && d === document.documentElement && cc.screen.autoFullScreen(d);
		var e = cc._canvas,
			f = cc.container;
		f.style.width = e.style.width = b + "px", f.style.height = e.style.height = c + "px";
		var g = a._devicePixelRatio = 1;
		a.isRetinaEnabled() && (g = a._devicePixelRatio = window.devicePixelRatio || 1), e.width = b * g, e.height = c * g, cc._renderContext.resetCache && cc._renderContext.resetCache();
		var h, i = document.body;
		i && (h = i.style) && (h.paddingTop = h.paddingTop || "0px", h.paddingRight = h.paddingRight || "0px", h.paddingBottom = h.paddingBottom || "0px", h.paddingLeft = h.paddingLeft || "0px", h.borderTop = h.borderTop || "0px", h.borderRight = h.borderRight || "0px", h.borderBottom = h.borderBottom || "0px", h.borderLeft = h.borderLeft || "0px", h.marginTop = h.marginTop || "0px", h.marginRight = h.marginRight || "0px", h.marginBottom = h.marginBottom || "0px", h.marginLeft = h.marginLeft || "0px")
	},
	_fixContainer: function() {
		document.body.insertBefore(cc.container, document.body.firstChild);
		var a = document.body.style;
		a.width = window.innerWidth + "px", a.height = window.innerHeight + "px", a.overflow = "hidden";
		var b = cc.container.style;
		b.position = "fixed", b.left = b.top = "0px", document.body.scrollTop = 0
	}
}), cc.ContentStrategy = cc.Class.extend({
	_result: {
		scale: [1, 1],
		viewport: null
	},
	_buildResult: function(a, b, c, d, e, f) {
		Math.abs(a - c) < 2 && (c = a), Math.abs(b - d) < 2 && (d = b);
		var g = cc.rect(Math.round((a - c) / 2), Math.round((b - d) / 2), c, d);
		return cc._renderType === cc._RENDER_TYPE_CANVAS, this._result.scale = [e, f], this._result.viewport = g, this._result
	},
	preApply: function(a) {},
	apply: function(a, b) {
		return {
			scale: [1, 1]
		}
	},
	postApply: function(a) {}
}), function() {
	var a = cc.ContainerStrategy.extend({
		apply: function(a) {
			this._setupContainer(a, a._frameSize.width, a._frameSize.height)
		}
	}),
		b = cc.ContainerStrategy.extend({
			apply: function(a, b) {
				var c, d, e = a._frameSize.width,
					f = a._frameSize.height,
					g = cc.container.style,
					h = b.width,
					i = b.height,
					j = e / h,
					k = f / i;
				k > j ? (c = e, d = i * j) : (c = h * k, d = f);
				var l = Math.round((e - c) / 2),
					m = Math.round((f - d) / 2);
				c = e - 2 * l, d = f - 2 * m, this._setupContainer(a, c, d), g.marginLeft = l + "px", g.marginRight = l + "px", g.marginTop = m + "px", g.marginBottom = m + "px"
			}
		}),
		c = (a.extend({
			preApply: function(a) {
				this._super(a), a._frame = document.documentElement
			},
			apply: function(a) {
				this._super(a), this._fixContainer()
			}
		}), b.extend({
			preApply: function(a) {
				this._super(a), a._frame = document.documentElement
			},
			apply: function(a, b) {
				this._super(a, b), this._fixContainer()
			}
		}), cc.ContainerStrategy.extend({
			apply: function(a) {
				this._setupContainer(a, cc._canvas.width, cc._canvas.height)
			}
		}));
	cc.ContainerStrategy.EQUAL_TO_FRAME = new a, cc.ContainerStrategy.PROPORTION_TO_FRAME = new b, cc.ContainerStrategy.ORIGINAL_CONTAINER = new c;
	var d = cc.ContentStrategy.extend({
		apply: function(a, b) {
			var c = cc._canvas.width,
				d = cc._canvas.height,
				e = c / b.width,
				f = d / b.height;
			return this._buildResult(c, d, c, d, e, f)
		}
	}),
		e = cc.ContentStrategy.extend({
			apply: function(a, b) {
				var c, d, e = cc._canvas.width,
					f = cc._canvas.height,
					g = b.width,
					h = b.height,
					i = e / g,
					j = f / h,
					k = 0;
				return j > i ? (k = i, c = e, d = h * k) : (k = j, c = g * k, d = f), this._buildResult(e, f, c, d, k, k)
			}
		}),
		f = cc.ContentStrategy.extend({
			apply: function(a, b) {
				var c, d, e, f = cc._canvas.width,
					g = cc._canvas.height,
					h = b.width,
					i = b.height,
					j = f / h,
					k = g / i;
				return k > j ? (c = k, d = h * c, e = g) : (c = j, d = f, e = i * c), this._buildResult(f, g, d, e, c, c)
			}
		}),
		g = cc.ContentStrategy.extend({
			apply: function(a, b) {
				var c = cc._canvas.width,
					d = cc._canvas.height,
					e = b.height,
					f = d / e,
					g = c,
					h = d;
				return this._buildResult(c, d, g, h, f, f)
			},
			postApply: function(a) {
				cc.director._winSizeInPoints = a.getVisibleSize()
			}
		}),
		h = cc.ContentStrategy.extend({
			apply: function(a, b) {
				var c = cc._canvas.width,
					d = cc._canvas.height,
					e = b.width,
					f = c / e,
					g = c,
					h = d;
				return this._buildResult(c, d, g, h, f, f)
			},
			postApply: function(a) {
				cc.director._winSizeInPoints = a.getVisibleSize()
			}
		});
	cc.ContentStrategy.EXACT_FIT = new d, cc.ContentStrategy.SHOW_ALL = new e, cc.ContentStrategy.NO_BORDER = new f, cc.ContentStrategy.FIXED_HEIGHT = new g, cc.ContentStrategy.FIXED_WIDTH = new h
}(), cc.ResolutionPolicy = cc.Class.extend({
	_containerStrategy: null,
	_contentStrategy: null,
	ctor: function(a, b) {
		this.setContainerStrategy(a), this.setContentStrategy(b)
	},
	preApply: function(a) {
		this._containerStrategy.preApply(a), this._contentStrategy.preApply(a)
	},
	apply: function(a, b) {
		return this._containerStrategy.apply(a, b), this._contentStrategy.apply(a, b)
	},
	postApply: function(a) {
		this._containerStrategy.postApply(a), this._contentStrategy.postApply(a)
	},
	setContainerStrategy: function(a) {
		a instanceof cc.ContainerStrategy && (this._containerStrategy = a)
	},
	setContentStrategy: function(a) {
		a instanceof cc.ContentStrategy && (this._contentStrategy = a)
	}
}), cc.ResolutionPolicy.EXACT_FIT = 0, cc.ResolutionPolicy.NO_BORDER = 1, cc.ResolutionPolicy.SHOW_ALL = 2, cc.ResolutionPolicy.FIXED_HEIGHT = 3, cc.ResolutionPolicy.FIXED_WIDTH = 4, cc.ResolutionPolicy.UNKNOWN = 5, cc.screen = {
	_supportsFullScreen: !1,
	_preOnFullScreenChange: null,
	_touchEvent: "",
	_fn: null,
	_fnMap: [
		["requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenEnabled", "fullscreenElement"],
		["requestFullScreen", "exitFullScreen", "fullScreenchange", "fullScreenEnabled", "fullScreenElement"],
		["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement"],
		["mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen", "mozFullScreenElement"],
		["msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "msFullscreenEnabled", "msFullscreenElement"]
	],
	init: function() {
		this._fn = {};
		var a, b, c, d = this._fnMap;
		for (a = 0, l = d.length; a < l; a++) if (b = d[a], b && b[1] in document) {
			for (a = 0, c = b.length; c > a; a++) this._fn[d[0][a]] = b[a];
			break
		}
		this._supportsFullScreen = "undefined" != typeof this._fn.requestFullscreen, this._touchEvent = "ontouchstart" in window ? "touchstart" : "mousedown"
	},
	fullScreen: function() {
		return this._supportsFullScreen ? void 0 === document[this._fn.fullscreenElement] || null === document[this._fn.fullscreenElement] ? !1 : !0 : !1
	},
	requestFullScreen: function(a, b) {
		if (this._supportsFullScreen) {
			if (a = a || document.documentElement, b) {
				var c = this._fn.fullscreenchange;
				this._preOnFullScreenChange && document.removeEventListener(c, this._preOnFullScreenChange), this._preOnFullScreenChange = b, cc._addEventListener(document, c, b, !1)
			}
			return a[this._fn.requestFullscreen]()
		}
	},
	exitFullScreen: function() {
		return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : !0
	},
	autoFullScreen: function(a, b) {
		function c() {
			e.requestFullScreen(a, b), d.removeEventListener(e._touchEvent, c)
		}
		a = a || document.body;
		var d = cc._canvas || a,
			e = this;
		this.requestFullScreen(a, b), cc._addEventListener(d, this._touchEvent, c)
	}
}, cc.screen.init(), cc.visibleRect = {
	topLeft: cc.p(0, 0),
	topRight: cc.p(0, 0),
	top: cc.p(0, 0),
	bottomLeft: cc.p(0, 0),
	bottomRight: cc.p(0, 0),
	bottom: cc.p(0, 0),
	center: cc.p(0, 0),
	left: cc.p(0, 0),
	right: cc.p(0, 0),
	width: 0,
	height: 0,
	init: function(a) {
		var b = this.width = a.width,
			c = this.height = a.height,
			d = a.x,
			e = a.y,
			f = e + c,
			g = d + b;
		this.topLeft.x = d, this.topLeft.y = f, this.topRight.x = g, this.topRight.y = f, this.top.x = d + b / 2, this.top.y = f, this.bottomLeft.x = d, this.bottomLeft.y = e, this.bottomRight.x = g, this.bottomRight.y = e, this.bottom.x = d + b / 2, this.bottom.y = e, this.center.x = d + b / 2, this.center.y = e + c / 2, this.left.x = d, this.left.y = e + c / 2, this.right.x = g, this.right.y = e + c / 2
	}
}, cc.UIInterfaceOrientationLandscapeLeft = -90, cc.UIInterfaceOrientationLandscapeRight = 90, cc.UIInterfaceOrientationPortraitUpsideDown = 180, cc.UIInterfaceOrientationPortrait = 0, cc.inputManager = {
	_mousePressed: !1,
	_isRegisterEvent: !1,
	_preTouchPoint: cc.p(0, 0),
	_prevMousePoint: cc.p(0, 0),
	_preTouchPool: [],
	_preTouchPoolPointer: 0,
	_touches: [],
	_touchesIntegerDict: {},
	_indexBitsUsed: 0,
	_maxTouches: 5,
	_accelEnabled: !1,
	_accelInterval: 1 / 30,
	_accelMinus: 1,
	_accelCurTime: 0,
	_acceleration: null,
	_accelDeviceEvent: null,
	_getUnUsedIndex: function() {
		for (var a = this._indexBitsUsed, b = 0; b < this._maxTouches; b++) {
			if (!(1 & a)) return this._indexBitsUsed |= 1 << b, b;
			a >>= 1
		}
		return -1
	},
	_removeUsedIndexBit: function(a) {
		if (!(0 > a || a >= this._maxTouches)) {
			var b = 1 << a;
			b = ~b, this._indexBitsUsed &= b
		}
	},
	_glView: null,
	handleTouchesBegin: function(a) {
		for (var b, c, d, e, f = [], g = this._touchesIntegerDict, h = 0, i = a.length; i > h; h++) if (b = a[h], e = b.getID(), c = g[e], null == c) {
			var j = this._getUnUsedIndex();
			if (-1 === j) {
				cc.log(cc._LogInfos.inputManager_handleTouchesBegin, j);
				continue
			}
			d = this._touches[j] = new cc.Touch(b._point.x, b._point.y, b.getID()), d._setPrevPoint(b._prevPoint), g[e] = j, f.push(d)
		}
		if (f.length > 0) {
			this._glView._convertTouchesWithScale(f);
			var k = new cc.EventTouch(f);
			k._eventCode = cc.EventTouch.EventCode.BEGAN, cc.eventManager.dispatchEvent(k)
		}
	},
	handleTouchesMove: function(a) {
		for (var b, c, d, e = [], f = this._touches, g = 0, h = a.length; h > g; g++) b = a[g], d = b.getID(), c = this._touchesIntegerDict[d], null != c && f[c] && (f[c]._setPoint(b._point), f[c]._setPrevPoint(b._prevPoint), e.push(f[c]));
		if (e.length > 0) {
			this._glView._convertTouchesWithScale(e);
			var i = new cc.EventTouch(e);
			i._eventCode = cc.EventTouch.EventCode.MOVED, cc.eventManager.dispatchEvent(i)
		}
	},
	handleTouchesEnd: function(a) {
		var b = this.getSetOfTouchesEndOrCancel(a);
		if (b.length > 0) {
			this._glView._convertTouchesWithScale(b);
			var c = new cc.EventTouch(b);
			c._eventCode = cc.EventTouch.EventCode.ENDED, cc.eventManager.dispatchEvent(c)
		}
	},
	handleTouchesCancel: function(a) {
		var b = this.getSetOfTouchesEndOrCancel(a);
		if (b.length > 0) {
			this._glView._convertTouchesWithScale(b);
			var c = new cc.EventTouch(b);
			c._eventCode = cc.EventTouch.EventCode.CANCELLED, cc.eventManager.dispatchEvent(c)
		}
	},
	getSetOfTouchesEndOrCancel: function(a) {
		for (var b, c, d, e = [], f = this._touches, g = this._touchesIntegerDict, h = 0, i = a.length; i > h; h++) b = a[h], d = b.getID(), c = g[d], null != c && f[c] && (f[c]._setPoint(b._point), f[c]._setPrevPoint(b._prevPoint), e.push(f[c]), this._removeUsedIndexBit(c), delete g[d]);
		return e
	},
	getHTMLElementPosition: function(a) {
		var b = document.documentElement,
			c = window,
			d = null;
		return d = cc.isFunction(a.getBoundingClientRect) ? a.getBoundingClientRect() : a instanceof HTMLCanvasElement ? {
			left: 0,
			top: 0,
			width: a.width,
			height: a.height
		} : {
			left: 0,
			top: 0,
			width: parseInt(a.style.width),
			height: parseInt(a.style.height)
		}, {
			left: d.left + c.pageXOffset - b.clientLeft,
			top: d.top + c.pageYOffset - b.clientTop,
			width: d.width,
			height: d.height
		}
	},
	getPreTouch: function(a) {
		for (var b = null, c = this._preTouchPool, d = a.getID(), e = c.length - 1; e >= 0; e--) if (c[e].getID() === d) {
			b = c[e];
			break
		}
		return b || (b = a), b
	},
	setPreTouch: function(a) {
		for (var b = !1, c = this._preTouchPool, d = a.getID(), e = c.length - 1; e >= 0; e--) if (c[e].getID() === d) {
			c[e] = a, b = !0;
			break
		}
		b || (c.length <= 50 ? c.push(a) : (c[this._preTouchPoolPointer] = a, this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50))
	},
	getTouchByXY: function(a, b, c) {
		var d = this._preTouchPoint,
			e = this._glView.convertToLocationInView(a, b, c),
			f = new cc.Touch(e.x, e.y);
		return f._setPrevPoint(d.x, d.y), d.x = e.x, d.y = e.y, f
	},
	getMouseEvent: function(a, b, c) {
		var d = this._prevMousePoint;
		this._glView._convertMouseToLocationInView(a, b);
		var e = new cc.EventMouse(c);
		return e.setLocation(a.x, a.y), e._setPrevCursor(d.x, d.y), d.x = a.x, d.y = a.y, e
	},
	getPointByEvent: function(a, b) {
		return null != a.pageX ? {
			x: a.pageX,
			y: a.pageY
		} : (b.left -= document.body.scrollLeft, b.top -= document.body.scrollTop, {
			x: a.clientX,
			y: a.clientY
		})
	},
	getTouchesByEvent: function(a, b) {
		for (var c, d, e, f = [], g = this._glView, h = this._preTouchPoint, i = a.changedTouches.length, j = 0; i > j; j++) if (c = a.changedTouches[j]) {
			var k;
			k = cc.sys.BROWSER_TYPE_FIREFOX === cc.sys.browserType ? g.convertToLocationInView(c.pageX, c.pageY, b) : g.convertToLocationInView(c.clientX, c.clientY, b), null != c.identifier ? (d = new cc.Touch(k.x, k.y, c.identifier), e = this.getPreTouch(d).getLocation(), d._setPrevPoint(e.x, e.y), this.setPreTouch(d)) : (d = new cc.Touch(k.x, k.y), d._setPrevPoint(h.x, h.y)), h.x = k.x, h.y = k.y, f.push(d)
		}
		return f
	},
	registerSystemEvent: function(a) {
		if (!this._isRegisterEvent) {
			var b = (this._glView = cc.view, this),
				c = "mouse" in cc.sys.capabilities,
				d = "touches" in cc.sys.capabilities,
				e = !1;
			if (cc.sys.isMobile && (e = !0), c && (cc._addEventListener(window, "mousedown", function() {
				b._mousePressed = !0
			}, !1), cc._addEventListener(window, "mouseup", function(c) {
				if (!e) {
					var d = b._mousePressed;
					if (b._mousePressed = !1, d) {
						var f = b.getHTMLElementPosition(a),
							g = b.getPointByEvent(c, f);
						if (!cc.rectContainsPoint(new cc.Rect(f.left, f.top, f.width, f.height), g)) {
							b.handleTouchesEnd([b.getTouchByXY(g.x, g.y, f)]);
							var h = b.getMouseEvent(g, f, cc.EventMouse.UP);
							h.setButton(c.button), cc.eventManager.dispatchEvent(h)
						}
					}
				}
			}, !1), cc._addEventListener(a, "mousedown", function(c) {
				if (!e) {
					b._mousePressed = !0;
					var d = b.getHTMLElementPosition(a),
						f = b.getPointByEvent(c, d);
					b.handleTouchesBegin([b.getTouchByXY(f.x, f.y, d)]);
					var g = b.getMouseEvent(f, d, cc.EventMouse.DOWN);
					g.setButton(c.button), cc.eventManager.dispatchEvent(g), c.stopPropagation(), c.preventDefault(), a.focus()
				}
			}, !1), cc._addEventListener(a, "mouseup", function(c) {
				if (!e) {
					b._mousePressed = !1;
					var d = b.getHTMLElementPosition(a),
						f = b.getPointByEvent(c, d);
					b.handleTouchesEnd([b.getTouchByXY(f.x, f.y, d)]);
					var g = b.getMouseEvent(f, d, cc.EventMouse.UP);
					g.setButton(c.button), cc.eventManager.dispatchEvent(g), c.stopPropagation(), c.preventDefault()
				}
			}, !1), cc._addEventListener(a, "mousemove", function(c) {
				if (!e) {
					var d = b.getHTMLElementPosition(a),
						f = b.getPointByEvent(c, d);
					b.handleTouchesMove([b.getTouchByXY(f.x, f.y, d)]);
					var g = b.getMouseEvent(f, d, cc.EventMouse.MOVE);
					b._mousePressed ? g.setButton(c.button) : g.setButton(null), cc.eventManager.dispatchEvent(g), c.stopPropagation(), c.preventDefault()
				}
			}, !1), cc._addEventListener(a, "mousewheel", function(c) {
				var d = b.getHTMLElementPosition(a),
					e = b.getPointByEvent(c, d),
					f = b.getMouseEvent(e, d, cc.EventMouse.SCROLL);
				f.setButton(c.button), f.setScrollData(0, c.wheelDelta), cc.eventManager.dispatchEvent(f), c.stopPropagation(), c.preventDefault()
			}, !1), cc._addEventListener(a, "DOMMouseScroll", function(c) {
				var d = b.getHTMLElementPosition(a),
					e = b.getPointByEvent(c, d),
					f = b.getMouseEvent(e, d, cc.EventMouse.SCROLL);
				f.setButton(c.button), f.setScrollData(0, -120 * c.detail), cc.eventManager.dispatchEvent(f), c.stopPropagation(), c.preventDefault()
			}, !1)), window.navigator.msPointerEnabled) {
				var f = {
					MSPointerDown: b.handleTouchesBegin,
					MSPointerMove: b.handleTouchesMove,
					MSPointerUp: b.handleTouchesEnd,
					MSPointerCancel: b.handleTouchesCancel
				};
				for (var g in f)!
				function(c, d) {
					cc._addEventListener(a, c, function(c) {
						var e = b.getHTMLElementPosition(a);
						e.left -= document.documentElement.scrollLeft, e.top -= document.documentElement.scrollTop, d.call(b, [b.getTouchByXY(c.clientX, c.clientY, e)]), c.stopPropagation()
					}, !1)
				}(g, f[g])
			}
			d && (cc._addEventListener(a, "touchstart", function(c) {
				if (c.changedTouches) {
					var d = b.getHTMLElementPosition(a);
					d.left -= document.body.scrollLeft, d.top -= document.body.scrollTop, b.handleTouchesBegin(b.getTouchesByEvent(c, d)), c.stopPropagation(), c.preventDefault(), a.focus()
				}
			}, !1), cc._addEventListener(a, "touchmove", function(c) {
				if (c.changedTouches) {
					var d = b.getHTMLElementPosition(a);
					d.left -= document.body.scrollLeft, d.top -= document.body.scrollTop, b.handleTouchesMove(b.getTouchesByEvent(c, d)), c.stopPropagation(), c.preventDefault()
				}
			}, !1), cc._addEventListener(a, "touchend", function(c) {
				if (c.changedTouches) {
					var d = b.getHTMLElementPosition(a);
					d.left -= document.body.scrollLeft, d.top -= document.body.scrollTop, b.handleTouchesEnd(b.getTouchesByEvent(c, d)), c.stopPropagation(), c.preventDefault()
				}
			}, !1), cc._addEventListener(a, "touchcancel", function(c) {
				if (c.changedTouches) {
					var d = b.getHTMLElementPosition(a);
					d.left -= document.body.scrollLeft, d.top -= document.body.scrollTop, b.handleTouchesCancel(b.getTouchesByEvent(c, d)), c.stopPropagation(), c.preventDefault()
				}
			}, !1)), this._registerKeyboardEvent(), this._registerAccelerometerEvent(), this._isRegisterEvent = !0
		}
	},
	_registerKeyboardEvent: function() {},
	_registerAccelerometerEvent: function() {},
	update: function(a) {
		this._accelCurTime > this._accelInterval && (this._accelCurTime -= this._accelInterval, cc.eventManager.dispatchEvent(new cc.EventAcceleration(this._acceleration))), this._accelCurTime += a
	}
}, cc.AffineTransform = function(a, b, c, d, e, f) {
	this.a = a, this.b = b, this.c = c, this.d = d, this.tx = e, this.ty = f
}, cc.affineTransformMake = function(a, b, c, d, e, f) {
	return {
		a: a,
		b: b,
		c: c,
		d: d,
		tx: e,
		ty: f
	}
}, cc.pointApplyAffineTransform = function(a, b, c) {
	var d, e;
	return void 0 === c ? (c = b, d = a.x, e = a.y) : (d = a, e = b), {
		x: c.a * d + c.c * e + c.tx,
		y: c.b * d + c.d * e + c.ty
	}
}, cc._pointApplyAffineTransform = function(a, b, c) {
	return cc.pointApplyAffineTransform(a, b, c)
}, cc.sizeApplyAffineTransform = function(a, b) {
	return {
		width: b.a * a.width + b.c * a.height,
		height: b.b * a.width + b.d * a.height
	}
}, cc.affineTransformMakeIdentity = function() {
	return {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}
}, cc.affineTransformIdentity = function() {
	return {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}
}, cc.rectApplyAffineTransform = function(a, b) {
	var c = cc.rectGetMinY(a),
		d = cc.rectGetMinX(a),
		e = cc.rectGetMaxX(a),
		f = cc.rectGetMaxY(a),
		g = cc.pointApplyAffineTransform(d, c, b),
		h = cc.pointApplyAffineTransform(e, c, b),
		i = cc.pointApplyAffineTransform(d, f, b),
		j = cc.pointApplyAffineTransform(e, f, b),
		k = Math.min(g.x, h.x, i.x, j.x),
		l = Math.max(g.x, h.x, i.x, j.x),
		m = Math.min(g.y, h.y, i.y, j.y),
		n = Math.max(g.y, h.y, i.y, j.y);
	return cc.rect(k, m, l - k, n - m)
}, cc._rectApplyAffineTransformIn = function(a, b) {
	var c = cc.rectGetMinY(a),
		d = cc.rectGetMinX(a),
		e = cc.rectGetMaxX(a),
		f = cc.rectGetMaxY(a),
		g = cc.pointApplyAffineTransform(d, c, b),
		h = cc.pointApplyAffineTransform(e, c, b),
		i = cc.pointApplyAffineTransform(d, f, b),
		j = cc.pointApplyAffineTransform(e, f, b),
		k = Math.min(g.x, h.x, i.x, j.x),
		l = Math.max(g.x, h.x, i.x, j.x),
		m = Math.min(g.y, h.y, i.y, j.y),
		n = Math.max(g.y, h.y, i.y, j.y);
	return a.x = k, a.y = m, a.width = l - k, a.height = n - m, a
}, cc.affineTransformTranslate = function(a, b, c) {
	return {
		a: a.a,
		b: a.b,
		c: a.c,
		d: a.d,
		tx: a.tx + a.a * b + a.c * c,
		ty: a.ty + a.b * b + a.d * c
	}
}, cc.affineTransformScale = function(a, b, c) {
	return {
		a: a.a * b,
		b: a.b * b,
		c: a.c * c,
		d: a.d * c,
		tx: a.tx,
		ty: a.ty
	}
}, cc.affineTransformRotate = function(a, b) {
	var c = Math.sin(b),
		d = Math.cos(b);
	return {
		a: a.a * d + a.c * c,
		b: a.b * d + a.d * c,
		c: a.c * d - a.a * c,
		d: a.d * d - a.b * c,
		tx: a.tx,
		ty: a.ty
	}
}, cc.affineTransformConcat = function(a, b) {
	return {
		a: a.a * b.a + a.b * b.c,
		b: a.a * b.b + a.b * b.d,
		c: a.c * b.a + a.d * b.c,
		d: a.c * b.b + a.d * b.d,
		tx: a.tx * b.a + a.ty * b.c + b.tx,
		ty: a.tx * b.b + a.ty * b.d + b.ty
	}
}, cc.affineTransformConcatIn = function(a, b) {
	var c = a.a,
		d = a.b,
		e = a.c,
		f = a.d,
		g = a.tx,
		h = a.ty;
	return a.a = c * b.a + d * b.c, a.b = c * b.b + d * b.d, a.c = e * b.a + f * b.c, a.d = e * b.b + f * b.d, a.tx = g * b.a + h * b.c + b.tx, a.ty = g * b.b + h * b.d + b.ty, a
}, cc.affineTransformEqualToTransform = function(a, b) {
	return a.a === b.a && a.b === b.b && a.c === b.c && a.d === b.d && a.tx === b.tx && a.ty === b.ty
}, cc.affineTransformInvert = function(a) {
	var b = 1 / (a.a * a.d - a.b * a.c);
	return {
		a: b * a.d,
		b: -b * a.b,
		c: -b * a.c,
		d: b * a.a,
		tx: b * (a.c * a.ty - a.d * a.tx),
		ty: b * (a.b * a.tx - a.a * a.ty)
	}
}, cc.POINT_EPSILON = parseFloat("1.192092896e-07F"), cc.pNeg = function(a) {
	return cc.p(-a.x, -a.y)
}, cc.pAdd = function(a, b) {
	return cc.p(a.x + b.x, a.y + b.y)
}, cc.pSub = function(a, b) {
	return cc.p(a.x - b.x, a.y - b.y)
}, cc.pMult = function(a, b) {
	return cc.p(a.x * b, a.y * b)
}, cc.pMidpoint = function(a, b) {
	return cc.pMult(cc.pAdd(a, b), .5)
}, cc.pDot = function(a, b) {
	return a.x * b.x + a.y * b.y
}, cc.pCross = function(a, b) {
	return a.x * b.y - a.y * b.x
}, cc.pPerp = function(a) {
	return cc.p(-a.y, a.x)
}, cc.pRPerp = function(a) {
	return cc.p(a.y, -a.x)
}, cc.pProject = function(a, b) {
	return cc.pMult(b, cc.pDot(a, b) / cc.pDot(b, b))
}, cc.pRotate = function(a, b) {
	return cc.p(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x)
}, cc.pUnrotate = function(a, b) {
	return cc.p(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y)
}, cc.pLengthSQ = function(a) {
	return cc.pDot(a, a)
}, cc.pDistanceSQ = function(a, b) {
	return cc.pLengthSQ(cc.pSub(a, b))
}, cc.pLength = function(a) {
	return Math.sqrt(cc.pLengthSQ(a))
}, cc.pDistance = function(a, b) {
	return cc.pLength(cc.pSub(a, b))
}, cc.pNormalize = function(a) {
	var b = cc.pLength(a);
	return 0 === b ? cc.p(a) : cc.pMult(a, 1 / b)
}, cc.pForAngle = function(a) {
	return cc.p(Math.cos(a), Math.sin(a))
}, cc.pToAngle = function(a) {
	return Math.atan2(a.y, a.x)
}, cc.clampf = function(a, b, c) {
	if (b > c) {
		var d = b;
		b = c, c = d
	}
	return b > a ? b : c > a ? a : c
}, cc.pClamp = function(a, b, c) {
	return cc.p(cc.clampf(a.x, b.x, c.x), cc.clampf(a.y, b.y, c.y))
}, cc.pFromSize = function(a) {
	return cc.p(a.width, a.height)
}, cc.pCompOp = function(a, b) {
	return cc.p(b(a.x), b(a.y))
}, cc.pLerp = function(a, b, c) {
	return cc.pAdd(cc.pMult(a, 1 - c), cc.pMult(b, c))
}, cc.pFuzzyEqual = function(a, b, c) {
	return a.x - c <= b.x && b.x <= a.x + c && a.y - c <= b.y && b.y <= a.y + c ? !0 : !1
}, cc.pCompMult = function(a, b) {
	return cc.p(a.x * b.x, a.y * b.y)
}, cc.pAngleSigned = function(a, b) {
	var c = cc.pNormalize(a),
		d = cc.pNormalize(b),
		e = Math.atan2(c.x * d.y - c.y * d.x, cc.pDot(c, d));
	return Math.abs(e) < cc.POINT_EPSILON ? 0 : e
}, cc.pAngle = function(a, b) {
	var c = Math.acos(cc.pDot(cc.pNormalize(a), cc.pNormalize(b)));
	return Math.abs(c) < cc.POINT_EPSILON ? 0 : c
}, cc.pRotateByAngle = function(a, b, c) {
	var d = cc.pSub(a, b),
		e = Math.cos(c),
		f = Math.sin(c),
		g = d.x;
	return d.x = g * e - d.y * f + b.x, d.y = g * f + d.y * e + b.y, d
}, cc.pLineIntersect = function(a, b, c, d, e) {
	if (a.x === b.x && a.y === b.y || c.x === d.x && c.y === d.y) return !1;
	var f = b.x - a.x,
		g = b.y - a.y,
		h = d.x - c.x,
		i = d.y - c.y,
		j = a.x - c.x,
		k = a.y - c.y,
		l = i * f - h * g;
	return e.x = h * k - i * j, e.y = f * k - g * j, 0 === l ? 0 === e.x || 0 === e.y ? !0 : !1 : (e.x = e.x / l, e.y = e.y / l, !0)
}, cc.pSegmentIntersect = function(a, b, c, d) {
	var e = cc.p(0, 0);
	return cc.pLineIntersect(a, b, c, d, e) && e.x >= 0 && e.x <= 1 && e.y >= 0 && e.y <= 1 ? !0 : !1
}, cc.pIntersectPoint = function(a, b, c, d) {
	var e = cc.p(0, 0);
	if (cc.pLineIntersect(a, b, c, d, e)) {
		var f = cc.p(0, 0);
		return f.x = a.x + e.x * (b.x - a.x), f.y = a.y + e.x * (b.y - a.y), f
	}
	return cc.p(0, 0)
}, cc.pSameAs = function(a, b) {
	return null != a && null != b ? a.x === b.x && a.y === b.y : !1
}, cc.pZeroIn = function(a) {
	a.x = 0, a.y = 0
}, cc.pIn = function(a, b) {
	a.x = b.x, a.y = b.y
}, cc.pMultIn = function(a, b) {
	a.x *= b, a.y *= b
}, cc.pSubIn = function(a, b) {
	a.x -= b.x, a.y -= b.y
}, cc.pAddIn = function(a, b) {
	a.x += b.x, a.y += b.y
}, cc.pNormalizeIn = function(a) {
	cc.pMultIn(a, 1 / Math.sqrt(a.x * a.x + a.y * a.y))
}, cc.Touch = cc.Class.extend({
	_point: null,
	_prevPoint: null,
	_id: 0,
	_startPointCaptured: !1,
	_startPoint: null,
	ctor: function(a, b, c) {
		this.setTouchInfo(c, a, b)
	},
	getLocation: function() {
		return {
			x: this._point.x,
			y: this._point.y
		}
	},
	getLocationX: function() {
		return this._point.x
	},
	getLocationY: function() {
		return this._point.y
	},
	getPreviousLocation: function() {
		return {
			x: this._prevPoint.x,
			y: this._prevPoint.y
		}
	},
	getStartLocation: function() {
		return {
			x: this._startPoint.x,
			y: this._startPoint.y
		}
	},
	getDelta: function() {
		return cc.pSub(this._point, this._prevPoint)
	},
	getLocationInView: function() {
		return {
			x: this._point.x,
			y: this._point.y
		}
	},
	getPreviousLocationInView: function() {
		return {
			x: this._prevPoint.x,
			y: this._prevPoint.y
		}
	},
	getStartLocationInView: function() {
		return {
			x: this._startPoint.x,
			y: this._startPoint.y
		}
	},
	getID: function() {
		return this._id
	},
	getId: function() {
		return cc.log("getId is deprecated. Please use getID instead."), this._id
	},
	setTouchInfo: function(a, b, c) {
		this._prevPoint = this._point, this._point = cc.p(b || 0, c || 0), this._id = a, this._startPointCaptured || (this._startPoint = cc.p(this._point), this._startPointCaptured = !0)
	},
	_setPoint: function(a, b) {
		void 0 === b ? (this._point.x = a.x, this._point.y = a.y) : (this._point.x = a, this._point.y = b)
	},
	_setPrevPoint: function(a, b) {
		void 0 === b ? this._prevPoint = cc.p(a.x, a.y) : this._prevPoint = cc.p(a || 0, b || 0)
	}
}), cc.Event = cc.Class.extend({
	_type: 0,
	_isStopped: !1,
	_currentTarget: null,
	_setCurrentTarget: function(a) {
		this._currentTarget = a
	},
	ctor: function(a) {
		this._type = a
	},
	getType: function() {
		return this._type
	},
	stopPropagation: function() {
		this._isStopped = !0
	},
	isStopped: function() {
		return this._isStopped
	},
	getCurrentTarget: function() {
		return this._currentTarget
	}
}), cc.Event.TOUCH = 0, cc.Event.KEYBOARD = 1, cc.Event.ACCELERATION = 2, cc.Event.MOUSE = 3, cc.Event.FOCUS = 4, cc.Event.CUSTOM = 6, cc.EventCustom = cc.Event.extend({
	_eventName: null,
	_userData: null,
	ctor: function(a) {
		cc.Event.prototype.ctor.call(this, cc.Event.CUSTOM), this._eventName = a
	},
	setUserData: function(a) {
		this._userData = a
	},
	getUserData: function() {
		return this._userData
	},
	getEventName: function() {
		return this._eventName
	}
}), cc.EventMouse = cc.Event.extend({
	_eventType: 0,
	_button: 0,
	_x: 0,
	_y: 0,
	_prevX: 0,
	_prevY: 0,
	_scrollX: 0,
	_scrollY: 0,
	ctor: function(a) {
		cc.Event.prototype.ctor.call(this, cc.Event.MOUSE), this._eventType = a
	},
	setScrollData: function(a, b) {
		this._scrollX = a, this._scrollY = b
	},
	getScrollX: function() {
		return this._scrollX
	},
	getScrollY: function() {
		return this._scrollY
	},
	setLocation: function(a, b) {
		this._x = a, this._y = b
	},
	getLocation: function() {
		return {
			x: this._x,
			y: this._y
		}
	},
	getLocationInView: function() {
		return {
			x: this._x,
			y: cc.view._designResolutionSize.height - this._y
		}
	},
	_setPrevCursor: function(a, b) {
		this._prevX = a, this._prevY = b
	},
	getDelta: function() {
		return {
			x: this._x - this._prevX,
			y: this._y - this._prevY
		}
	},
	getDeltaX: function() {
		return this._x - this._prevX
	},
	getDeltaY: function() {
		return this._y - this._prevY
	},
	setButton: function(a) {
		this._button = a
	},
	getButton: function() {
		return this._button
	},
	getLocationX: function() {
		return this._x
	},
	getLocationY: function() {
		return this._y
	}
}), cc.EventMouse.NONE = 0, cc.EventMouse.DOWN = 1, cc.EventMouse.UP = 2, cc.EventMouse.MOVE = 3, cc.EventMouse.SCROLL = 4, cc.EventMouse.BUTTON_LEFT = 0, cc.EventMouse.BUTTON_RIGHT = 2, cc.EventMouse.BUTTON_MIDDLE = 1, cc.EventMouse.BUTTON_4 = 3, cc.EventMouse.BUTTON_5 = 4, cc.EventMouse.BUTTON_6 = 5, cc.EventMouse.BUTTON_7 = 6, cc.EventMouse.BUTTON_8 = 7, cc.EventTouch = cc.Event.extend({
	_eventCode: 0,
	_touches: null,
	ctor: function(a) {
		cc.Event.prototype.ctor.call(this, cc.Event.TOUCH), this._touches = a || []
	},
	getEventCode: function() {
		return this._eventCode
	},
	getTouches: function() {
		return this._touches
	},
	_setEventCode: function(a) {
		this._eventCode = a
	},
	_setTouches: function(a) {
		this._touches = a
	}
}), cc.EventTouch.MAX_TOUCHES = 5, cc.EventTouch.EventCode = {
	BEGAN: 0,
	MOVED: 1,
	ENDED: 2,
	CANCELLED: 3
}, cc.EventFocus = cc.Event.extend({
	_widgetGetFocus: null,
	_widgetLoseFocus: null,
	ctor: function(a, b) {
		cc.Event.prototype.ctor.call(this, cc.Event.FOCUS), this._widgetGetFocus = b, this._widgetLoseFocus = a
	}
}), cc.EventListener = cc.Class.extend({
	_onEvent: null,
	_type: 0,
	_listenerID: null,
	_registered: !1,
	_fixedPriority: 0,
	_node: null,
	_paused: !0,
	_isEnabled: !0,
	ctor: function(a, b, c) {
		this._onEvent = c, this._type = a || 0, this._listenerID = b || ""
	},
	_setPaused: function(a) {
		this._paused = a
	},
	_isPaused: function() {
		return this._paused
	},
	_setRegistered: function(a) {
		this._registered = a
	},
	_isRegistered: function() {
		return this._registered
	},
	_getType: function() {
		return this._type
	},
	_getListenerID: function() {
		return this._listenerID
	},
	_setFixedPriority: function(a) {
		this._fixedPriority = a
	},
	_getFixedPriority: function() {
		return this._fixedPriority
	},
	_setSceneGraphPriority: function(a) {
		this._node = a
	},
	_getSceneGraphPriority: function() {
		return this._node
	},
	checkAvailable: function() {
		return null !== this._onEvent
	},
	clone: function() {
		return null
	},
	setEnabled: function(a) {
		this._isEnabled = a
	},
	isEnabled: function() {
		return this._isEnabled
	},
	retain: function() {},
	release: function() {}
}), cc.EventListener.UNKNOWN = 0, cc.EventListener.TOUCH_ONE_BY_ONE = 1, cc.EventListener.TOUCH_ALL_AT_ONCE = 2, cc.EventListener.KEYBOARD = 3, cc.EventListener.MOUSE = 4, cc.EventListener.ACCELERATION = 5, cc.EventListener.ACCELERATION = 6, cc.EventListener.CUSTOM = 8, cc.EventListener.FOCUS = 7, cc._EventListenerCustom = cc.EventListener.extend({
	_onCustomEvent: null,
	ctor: function(a, b) {
		this._onCustomEvent = b;
		var c = this,
			d = function(a) {
				null !== c._onCustomEvent && c._onCustomEvent(a)
			};
		cc.EventListener.prototype.ctor.call(this, cc.EventListener.CUSTOM, a, d)
	},
	checkAvailable: function() {
		return cc.EventListener.prototype.checkAvailable.call(this) && null !== this._onCustomEvent
	},
	clone: function() {
		return new cc._EventListenerCustom(this._listenerID, this._onCustomEvent)
	}
}), cc._EventListenerCustom.create = function(a, b) {
	return new cc._EventListenerCustom(a, b)
}, cc._EventListenerMouse = cc.EventListener.extend({
	onMouseDown: null,
	onMouseUp: null,
	onMouseMove: null,
	onMouseScroll: null,
	ctor: function() {
		var a = this,
			b = function(b) {
				var c = cc.EventMouse;
				switch (b._eventType) {
				case c.DOWN:
					a.onMouseDown && a.onMouseDown(b);
					break;
				case c.UP:
					a.onMouseUp && a.onMouseUp(b);
					break;
				case c.MOVE:
					a.onMouseMove && a.onMouseMove(b);
					break;
				case c.SCROLL:
					a.onMouseScroll && a.onMouseScroll(b)
				}
			};
		cc.EventListener.prototype.ctor.call(this, cc.EventListener.MOUSE, cc._EventListenerMouse.LISTENER_ID, b)
	},
	clone: function() {
		var a = new cc._EventListenerMouse;
		return a.onMouseDown = this.onMouseDown, a.onMouseUp = this.onMouseUp, a.onMouseMove = this.onMouseMove, a.onMouseScroll = this.onMouseScroll, a
	},
	checkAvailable: function() {
		return !0
	}
}), cc._EventListenerMouse.LISTENER_ID = "__cc_mouse", cc._EventListenerMouse.create = function() {
	return new cc._EventListenerMouse
}, cc._EventListenerTouchOneByOne = cc.EventListener.extend({
	_claimedTouches: null,
	swallowTouches: !1,
	onTouchBegan: null,
	onTouchMoved: null,
	onTouchEnded: null,
	onTouchCancelled: null,
	ctor: function() {
		cc.EventListener.prototype.ctor.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, cc._EventListenerTouchOneByOne.LISTENER_ID, null), this._claimedTouches = []
	},
	setSwallowTouches: function(a) {
		this.swallowTouches = a
	},
	isSwallowTouches: function() {
		return this.swallowTouches
	},
	clone: function() {
		var a = new cc._EventListenerTouchOneByOne;
		return a.onTouchBegan = this.onTouchBegan, a.onTouchMoved = this.onTouchMoved, a.onTouchEnded = this.onTouchEnded, a.onTouchCancelled = this.onTouchCancelled, a.swallowTouches = this.swallowTouches, a
	},
	checkAvailable: function() {
		return this.onTouchBegan ? !0 : (cc.log(cc._LogInfos._EventListenerTouchOneByOne_checkAvailable), !1)
	}
}), cc._EventListenerTouchOneByOne.LISTENER_ID = "__cc_touch_one_by_one", cc._EventListenerTouchOneByOne.create = function() {
	return new cc._EventListenerTouchOneByOne
}, cc._EventListenerTouchAllAtOnce = cc.EventListener.extend({
	onTouchesBegan: null,
	onTouchesMoved: null,
	onTouchesEnded: null,
	onTouchesCancelled: null,
	ctor: function() {
		cc.EventListener.prototype.ctor.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, cc._EventListenerTouchAllAtOnce.LISTENER_ID, null)
	},
	clone: function() {
		var a = new cc._EventListenerTouchAllAtOnce;
		return a.onTouchesBegan = this.onTouchesBegan, a.onTouchesMoved = this.onTouchesMoved, a.onTouchesEnded = this.onTouchesEnded, a.onTouchesCancelled = this.onTouchesCancelled, a
	},
	checkAvailable: function() {
		return null === this.onTouchesBegan && null === this.onTouchesMoved && null === this.onTouchesEnded && null === this.onTouchesCancelled ? (cc.log(cc._LogInfos._EventListenerTouchAllAtOnce_checkAvailable), !1) : !0
	}
}), cc._EventListenerTouchAllAtOnce.LISTENER_ID = "__cc_touch_all_at_once", cc._EventListenerTouchAllAtOnce.create = function() {
	return new cc._EventListenerTouchAllAtOnce
}, cc.EventListener.create = function(a) {
	cc.assert(a && a.event, cc._LogInfos.EventListener_create);
	var b = a.event;
	delete a.event;
	var c = null;
	b === cc.EventListener.TOUCH_ONE_BY_ONE ? c = new cc._EventListenerTouchOneByOne : b === cc.EventListener.TOUCH_ALL_AT_ONCE ? c = new cc._EventListenerTouchAllAtOnce : b === cc.EventListener.MOUSE ? c = new cc._EventListenerMouse : b === cc.EventListener.CUSTOM ? (c = new cc._EventListenerCustom(a.eventName, a.callback), delete a.eventName, delete a.callback) : b === cc.EventListener.KEYBOARD ? c = new cc._EventListenerKeyboard : b === cc.EventListener.ACCELERATION ? (c = new cc._EventListenerAcceleration(a.callback), delete a.callback) : b === cc.EventListener.FOCUS && (c = new cc._EventListenerFocus);
	for (var d in a) c[d] = a[d];
	return c
}, cc._EventListenerFocus = cc.EventListener.extend({
	clone: function() {
		var a = new cc._EventListenerFocus;
		return a.onFocusChanged = this.onFocusChanged, a
	},
	checkAvailable: function() {
		return this.onFocusChanged ? !0 : (cc.log("Invalid EventListenerFocus!"), !1)
	},
	onFocusChanged: null,
	ctor: function() {
		var a = function(a) {
				this.onFocusChanged && this.onFocusChanged(a._widgetLoseFocus, a._widgetGetFocus)
			};
		cc.EventListener.prototype.ctor.call(this, cc.EventListener.FOCUS, cc._EventListenerFocus.LISTENER_ID, a)
	}
}), cc._EventListenerFocus.LISTENER_ID = "__cc_focus_event", cc._EventListenerVector = cc.Class.extend({
	_fixedListeners: null,
	_sceneGraphListeners: null,
	gt0Index: 0,
	ctor: function() {
		this._fixedListeners = [], this._sceneGraphListeners = []
	},
	size: function() {
		return this._fixedListeners.length + this._sceneGraphListeners.length
	},
	empty: function() {
		return 0 === this._fixedListeners.length && 0 === this._sceneGraphListeners.length
	},
	push: function(a) {
		0 === a._getFixedPriority() ? this._sceneGraphListeners.push(a) : this._fixedListeners.push(a)
	},
	clearSceneGraphListeners: function() {
		this._sceneGraphListeners.length = 0
	},
	clearFixedListeners: function() {
		this._fixedListeners.length = 0
	},
	clear: function() {
		this._sceneGraphListeners.length = 0, this._fixedListeners.length = 0
	},
	getFixedPriorityListeners: function() {
		return this._fixedListeners
	},
	getSceneGraphPriorityListeners: function() {
		return this._sceneGraphListeners
	}
}), cc.__getListenerID = function(a) {
	var b = cc.Event,
		c = a.getType();
	return c === b.ACCELERATION ? cc._EventListenerAcceleration.LISTENER_ID : c === b.CUSTOM ? a.getEventName() : c === b.KEYBOARD ? cc._EventListenerKeyboard.LISTENER_ID : c === b.MOUSE ? cc._EventListenerMouse.LISTENER_ID : c === b.FOCUS ? cc._EventListenerFocus.LISTENER_ID : (c === b.TOUCH && cc.log(cc._LogInfos.__getListenerID), "")
}, cc.eventManager = {
	DIRTY_NONE: 0,
	DIRTY_FIXED_PRIORITY: 1,
	DIRTY_SCENE_GRAPH_PRIORITY: 2,
	DIRTY_ALL: 3,
	_listenersMap: {},
	_priorityDirtyFlagMap: {},
	_nodeListenersMap: {},
	_nodePriorityMap: {},
	_globalZOrderNodeMap: {},
	_toAddedListeners: [],
	_dirtyNodes: [],
	_inDispatch: 0,
	_isEnabled: !1,
	_nodePriorityIndex: 0,
	_internalCustomListenerIDs: [cc.game.EVENT_HIDE, cc.game.EVENT_SHOW],
	_setDirtyForNode: function(a) {
		null != this._nodeListenersMap[a.__instanceId] && this._dirtyNodes.push(a);
		for (var b = a.getChildren(), c = 0, d = b.length; d > c; c++) this._setDirtyForNode(b[c])
	},
	pauseTarget: function(a, b) {
		var c, d, e = this._nodeListenersMap[a.__instanceId];
		if (e) for (c = 0, d = e.length; d > c; c++) e[c]._setPaused(!0);
		if (b === !0) {
			var f = a.getChildren();
			for (c = 0, d = f.length; d > c; c++) this.pauseTarget(f[c], !0)
		}
	},
	resumeTarget: function(a, b) {
		var c, d, e = this._nodeListenersMap[a.__instanceId];
		if (e) for (c = 0, d = e.length; d > c; c++) e[c]._setPaused(!1);
		if (this._setDirtyForNode(a), b === !0) {
			var f = a.getChildren();
			for (c = 0, d = f.length; d > c; c++) this.resumeTarget(f[c], !0)
		}
	},
	_addListener: function(a) {
		0 === this._inDispatch ? this._forceAddEventListener(a) : this._toAddedListeners.push(a)
	},
	_forceAddEventListener: function(a) {
		var b = a._getListenerID(),
			c = this._listenersMap[b];
		if (c || (c = new cc._EventListenerVector, this._listenersMap[b] = c), c.push(a), 0 === a._getFixedPriority()) {
			this._setDirty(b, this.DIRTY_SCENE_GRAPH_PRIORITY);
			var d = a._getSceneGraphPriority();
			null === d && cc.log(cc._LogInfos.eventManager__forceAddEventListener), this._associateNodeAndEventListener(d, a), d.isRunning() && this.resumeTarget(d)
		} else this._setDirty(b, this.DIRTY_FIXED_PRIORITY)
	},
	_getListeners: function(a) {
		return this._listenersMap[a]
	},
	_updateDirtyFlagForSceneGraph: function() {
		if (0 !== this._dirtyNodes.length) {
			for (var a, b, c = this._dirtyNodes, d = this._nodeListenersMap, e = 0, f = c.length; f > e; e++) if (a = d[c[e].__instanceId]) for (var g = 0, h = a.length; h > g; g++) b = a[g], b && this._setDirty(b._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
			this._dirtyNodes.length = 0
		}
	},
	_removeAllListenersInVector: function(a) {
		if (a) for (var b, c = 0; c < a.length;) b = a[c], b._setRegistered(!1), null != b._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(b._getSceneGraphPriority(), b), b._setSceneGraphPriority(null)), 0 === this._inDispatch ? cc.arrayRemoveObject(a, b) : ++c
	},
	_removeListenersForListenerID: function(a) {
		var b, c = this._listenersMap[a];
		if (c) {
			var d = c.getFixedPriorityListeners(),
				e = c.getSceneGraphPriorityListeners();
			this._removeAllListenersInVector(e), this._removeAllListenersInVector(d), delete this._priorityDirtyFlagMap[a], this._inDispatch || (c.clear(), delete this._listenersMap[a])
		}
		var f, g = this._toAddedListeners;
		for (b = 0; b < g.length;) f = g[b], f && f._getListenerID() === a ? cc.arrayRemoveObject(g, f) : ++b
	},
	_sortEventListeners: function(a) {
		var b = this.DIRTY_NONE,
			c = this._priorityDirtyFlagMap;
		if (c[a] && (b = c[a]), b !== this.DIRTY_NONE && (c[a] = this.DIRTY_NONE, b & this.DIRTY_FIXED_PRIORITY && this._sortListenersOfFixedPriority(a), b & this.DIRTY_SCENE_GRAPH_PRIORITY)) {
			var d = cc.director.getRunningScene();
			d ? this._sortListenersOfSceneGraphPriority(a, d) : c[a] = this.DIRTY_SCENE_GRAPH_PRIORITY
		}
	},
	_sortListenersOfSceneGraphPriority: function(a, b) {
		var c = this._getListeners(a);
		if (c) {
			var d = c.getSceneGraphPriorityListeners();
			d && 0 !== d.length && (this._nodePriorityIndex = 0, this._nodePriorityMap = {}, this._visitTarget(b, !0), c.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes))
		}
	},
	_sortEventListenersOfSceneGraphPriorityDes: function(a, b) {
		var c = cc.eventManager._nodePriorityMap,
			d = a._getSceneGraphPriority(),
			e = b._getSceneGraphPriority();
		return b && e && c[e.__instanceId] ? a && d && c[d.__instanceId] ? c[b._getSceneGraphPriority().__instanceId] - c[a._getSceneGraphPriority().__instanceId] : 1 : -1
	},
	_sortListenersOfFixedPriority: function(a) {
		var b = this._listenersMap[a];
		if (b) {
			var c = b.getFixedPriorityListeners();
			if (c && 0 !== c.length) {
				c.sort(this._sortListenersOfFixedPriorityAsc);
				for (var d = 0, e = c.length; e > d && !(c[d]._getFixedPriority() >= 0);)++d;
				b.gt0Index = d
			}
		}
	},
	_sortListenersOfFixedPriorityAsc: function(a, b) {
		return a._getFixedPriority() - b._getFixedPriority()
	},
	_onUpdateListeners: function(a) {
		var b = this._listenersMap[a];
		if (b) {
			var c, d, e = b.getFixedPriorityListeners(),
				f = b.getSceneGraphPriorityListeners();
			if (f) for (c = 0; c < f.length;) d = f[c], d._isRegistered() ? ++c : cc.arrayRemoveObject(f, d);
			if (e) for (c = 0; c < e.length;) d = e[c], d._isRegistered() ? ++c : cc.arrayRemoveObject(e, d);
			f && 0 === f.length && b.clearSceneGraphListeners(), e && 0 === e.length && b.clearFixedListeners()
		}
	},
	_updateListeners: function(a) {
		var b = this._inDispatch;
		if (cc.assert(b > 0, cc._LogInfos.EventManager__updateListeners), !(b > 1)) {
			a.getType() === cc.Event.TOUCH ? (this._onUpdateListeners(cc._EventListenerTouchOneByOne.LISTENER_ID), this._onUpdateListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID)) : this._onUpdateListeners(cc.__getListenerID(a)), cc.assert(1 === b, cc._LogInfos.EventManager__updateListeners_2);
			var c = this._listenersMap,
				d = this._priorityDirtyFlagMap;
			for (var e in c) c[e].empty() && (delete d[e], delete c[e]);
			var f = this._toAddedListeners;
			if (0 !== f.length) {
				for (var g = 0, h = f.length; h > g; g++) this._forceAddEventListener(f[g]);
				this._toAddedListeners.length = 0
			}
		}
	},
	_onTouchEventCallback: function(a, b) {
		if (!a._isRegistered) return !1;
		var c = b.event,
			d = b.selTouch;
		c._setCurrentTarget(a._node);
		var e, f = !1,
			g = c.getEventCode(),
			h = cc.EventTouch.EventCode;
		return g === h.BEGAN ? a.onTouchBegan && (f = a.onTouchBegan(d, c), f && a._registered && a._claimedTouches.push(d)) : a._claimedTouches.length > 0 && -1 !== (e = a._claimedTouches.indexOf(d)) && (f = !0, g === h.MOVED && a.onTouchMoved ? a.onTouchMoved(d, c) : g === h.ENDED ? (a.onTouchEnded && a.onTouchEnded(d, c), a._registered && a._claimedTouches.splice(e, 1)) : g === h.CANCELLED && (a.onTouchCancelled && a.onTouchCancelled(d, c), a._registered && a._claimedTouches.splice(e, 1))), c.isStopped() ? (cc.eventManager._updateListeners(c), !0) : f && a._registered && a.swallowTouches ? (b.needsMutableSet && b.touches.splice(d, 1), !0) : !1
	},
	_dispatchTouchEvent: function(a) {
		this._sortEventListeners(cc._EventListenerTouchOneByOne.LISTENER_ID), this._sortEventListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID);
		var b = this._getListeners(cc._EventListenerTouchOneByOne.LISTENER_ID),
			c = this._getListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID);
		if (null !== b || null !== c) {
			var d = a.getTouches(),
				e = cc.copyArray(d),
				f = {
					event: a,
					needsMutableSet: b && c,
					touches: e,
					selTouch: null
				};
			if (b) for (var g = 0; g < d.length; g++) if (f.selTouch = d[g], this._dispatchEventToListeners(b, this._onTouchEventCallback, f), a.isStopped()) return;
			c && e.length > 0 && (this._dispatchEventToListeners(c, this._onTouchesEventCallback, {
				event: a,
				touches: e
			}), a.isStopped()) || this._updateListeners(a)
		}
	},
	_onTouchesEventCallback: function(a, b) {
		if (!a._registered) return !1;
		var c = cc.EventTouch.EventCode,
			d = b.event,
			e = b.touches,
			f = d.getEventCode();
		return d._setCurrentTarget(a._node), f === c.BEGAN && a.onTouchesBegan ? a.onTouchesBegan(e, d) : f === c.MOVED && a.onTouchesMoved ? a.onTouchesMoved(e, d) : f === c.ENDED && a.onTouchesEnded ? a.onTouchesEnded(e, d) : f === c.CANCELLED && a.onTouchesCancelled && a.onTouchesCancelled(e, d), d.isStopped() ? (cc.eventManager._updateListeners(d), !0) : !1
	},
	_associateNodeAndEventListener: function(a, b) {
		var c = this._nodeListenersMap[a.__instanceId];
		c || (c = [], this._nodeListenersMap[a.__instanceId] = c), c.push(b)
	},
	_dissociateNodeAndEventListener: function(a, b) {
		var c = this._nodeListenersMap[a.__instanceId];
		c && (cc.arrayRemoveObject(c, b), 0 === c.length && delete this._nodeListenersMap[a.__instanceId])
	},
	_dispatchEventToListeners: function(a, b, c) {
		var d, e, f = !1,
			g = a.getFixedPriorityListeners(),
			h = a.getSceneGraphPriorityListeners(),
			i = 0;
		if (g && 0 !== g.length) for (; i < a.gt0Index; ++i) if (e = g[i], e.isEnabled() && !e._isPaused() && e._isRegistered() && b(e, c)) {
			f = !0;
			break
		}
		if (h && !f) for (d = 0; d < h.length; d++) if (e = h[d], e.isEnabled() && !e._isPaused() && e._isRegistered() && b(e, c)) {
			f = !0;
			break
		}
		if (g && !f) for (; i < g.length; ++i) if (e = g[i], e.isEnabled() && !e._isPaused() && e._isRegistered() && b(e, c)) {
			f = !0;
			break
		}
	},
	_setDirty: function(a, b) {
		var c = this._priorityDirtyFlagMap;
		null == c[a] ? c[a] = b : c[a] = b | c[a]
	},
	_visitTarget: function(a, b) {
		var c = a.getChildren(),
			d = 0,
			e = c.length,
			f = this._globalZOrderNodeMap,
			g = this._nodeListenersMap;
		if (e > 0) {
			for (var h; e > d && (h = c[d], h && h.getLocalZOrder() < 0); d++) this._visitTarget(h, !1);
			for (null != g[a.__instanceId] && (f[a.getGlobalZOrder()] || (f[a.getGlobalZOrder()] = []), f[a.getGlobalZOrder()].push(a.__instanceId)); e > d; d++) h = c[d], h && this._visitTarget(h, !1)
		} else null != g[a.__instanceId] && (f[a.getGlobalZOrder()] || (f[a.getGlobalZOrder()] = []), f[a.getGlobalZOrder()].push(a.__instanceId));
		if (b) {
			var i = [];
			for (var j in f) i.push(j);
			i.sort(this._sortNumberAsc);
			var k, l, m = i.length,
				n = this._nodePriorityMap;
			for (d = 0; m > d; d++) for (k = f[i[d]], l = 0; l < k.length; l++) n[k[l]] = ++this._nodePriorityIndex;
			this._globalZOrderNodeMap = {}
		}
	},
	_sortNumberAsc: function(a, b) {
		return a - b
	},
	addListener: function(a, b) {
		if (cc.assert(a && b, cc._LogInfos.eventManager_addListener_2), a instanceof cc.EventListener) {
			if (a._isRegistered()) return void cc.log(cc._LogInfos.eventManager_addListener_4)
		} else cc.assert(!cc.isNumber(b), cc._LogInfos.eventManager_addListener_3), a = cc.EventListener.create(a);
		if (a.checkAvailable()) {
			if (cc.isNumber(b)) {
				if (0 === b) return void cc.log(cc._LogInfos.eventManager_addListener);
				a._setSceneGraphPriority(null), a._setFixedPriority(b), a._setRegistered(!0), a._setPaused(!1), this._addListener(a)
			} else a._setSceneGraphPriority(b), a._setFixedPriority(0), a._setRegistered(!0), this._addListener(a);
			return a
		}
	},
	addCustomListener: function(a, b) {
		var c = new cc._EventListenerCustom(a, b);
		return this.addListener(c, 1), c
	},
	removeListener: function(a) {
		if (null != a) {
			var b, c = this._listenersMap;
			for (var d in c) {
				var e = c[d],
					f = e.getFixedPriorityListeners(),
					g = e.getSceneGraphPriorityListeners();
				if (b = this._removeListenerInVector(g, a), b ? this._setDirty(a._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY) : (b = this._removeListenerInVector(f, a), b && this._setDirty(a._getListenerID(), this.DIRTY_FIXED_PRIORITY)), e.empty() && (delete this._priorityDirtyFlagMap[a._getListenerID()], delete c[d]), b) break
			}
			if (!b) for (var h = this._toAddedListeners, i = 0, j = h.length; j > i; i++) {
				var k = h[i];
				if (k === a) {
					cc.arrayRemoveObject(h, k), k._setRegistered(!1);
					break
				}
			}
		}
	},
	_removeListenerInCallback: function(a, b) {
		if (null == a) return !1;
		for (var c = 0, d = a.length; d > c; c++) {
			var e = a[c];
			if (e._onCustomEvent === b || e._onEvent === b) return e._setRegistered(!1), null != e._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(e._getSceneGraphPriority(), e), e._setSceneGraphPriority(null)), 0 === this._inDispatch && cc.arrayRemoveObject(a, e), !0
		}
		return !1
	},
	_removeListenerInVector: function(a, b) {
		if (null == a) return !1;
		for (var c = 0, d = a.length; d > c; c++) {
			var e = a[c];
			if (e === b) return e._setRegistered(!1), null != e._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(e._getSceneGraphPriority(), e), e._setSceneGraphPriority(null)), 0 === this._inDispatch && cc.arrayRemoveObject(a, e), !0
		}
		return !1
	},
	removeListeners: function(a, b) {
		var c = this;
		if (a instanceof cc.Node) {
			delete c._nodePriorityMap[a.__instanceId], cc.arrayRemoveObject(c._dirtyNodes, a);
			var d, e = c._nodeListenersMap[a.__instanceId];
			if (e) {
				var f = cc.copyArray(e);
				for (d = 0; d < f.length; d++) c.removeListener(f[d]);
				f.length = 0
			}
			var g = c._toAddedListeners;
			for (d = 0; d < g.length;) {
				var h = g[d];
				h._getSceneGraphPriority() === a ? (h._setSceneGraphPriority(null), h._setRegistered(!1), g.splice(d, 1)) : ++d
			}
			if (b === !0) {
				var i, j = a.getChildren();
				for (d = 0, i = j.length; i > d; d++) c.removeListeners(j[d], !0)
			}
		} else a === cc.EventListener.TOUCH_ONE_BY_ONE ? c._removeListenersForListenerID(cc._EventListenerTouchOneByOne.LISTENER_ID) : a === cc.EventListener.TOUCH_ALL_AT_ONCE ? c._removeListenersForListenerID(cc._EventListenerTouchAllAtOnce.LISTENER_ID) : a === cc.EventListener.MOUSE ? c._removeListenersForListenerID(cc._EventListenerMouse.LISTENER_ID) : a === cc.EventListener.ACCELERATION ? c._removeListenersForListenerID(cc._EventListenerAcceleration.LISTENER_ID) : a === cc.EventListener.KEYBOARD ? c._removeListenersForListenerID(cc._EventListenerKeyboard.LISTENER_ID) : cc.log(cc._LogInfos.eventManager_removeListeners)
	},
	removeCustomListeners: function(a) {
		this._removeListenersForListenerID(a)
	},
	removeAllListeners: function() {
		var a = this._listenersMap,
			b = this._internalCustomListenerIDs;
		for (var c in a) - 1 === b.indexOf(c) && this._removeListenersForListenerID(c)
	},
	setPriority: function(a, b) {
		if (null != a) {
			var c = this._listenersMap;
			for (var d in c) {
				var e = c[d],
					f = e.getFixedPriorityListeners();
				if (f) {
					var g = f.indexOf(a);
					if (-1 !== g) return null != a._getSceneGraphPriority() && cc.log(cc._LogInfos.eventManager_setPriority), void(a._getFixedPriority() !== b && (a._setFixedPriority(b), this._setDirty(a._getListenerID(), this.DIRTY_FIXED_PRIORITY)))
				}
			}
		}
	},
	setEnabled: function(a) {
		this._isEnabled = a
	},
	isEnabled: function() {
		return this._isEnabled
	},
	dispatchEvent: function(a) {
		if (this._isEnabled) {
			if (this._updateDirtyFlagForSceneGraph(), this._inDispatch++, !a || !a.getType) throw new Error("event is undefined");
			if (a.getType() === cc.Event.TOUCH) return this._dispatchTouchEvent(a), void this._inDispatch--;
			var b = cc.__getListenerID(a);
			this._sortEventListeners(b);
			var c = this._listenersMap[b];
			null != c && this._dispatchEventToListeners(c, this._onListenerCallback, a), this._updateListeners(a), this._inDispatch--
		}
	},
	_onListenerCallback: function(a, b) {
		return b._setCurrentTarget(a._getSceneGraphPriority()), a._onEvent(b), b.isStopped()
	},
	dispatchCustomEvent: function(a, b) {
		var c = new cc.EventCustom(a);
		c.setUserData(b), this.dispatchEvent(c)
	}
}, cc.EventHelper = function() {}, cc.EventHelper.prototype = {
	constructor: cc.EventHelper,
	apply: function(a) {
		a.addEventListener = cc.EventHelper.prototype.addEventListener, a.hasEventListener = cc.EventHelper.prototype.hasEventListener, a.removeEventListener = cc.EventHelper.prototype.removeEventListener, a.dispatchEvent = cc.EventHelper.prototype.dispatchEvent
	},
	addEventListener: function(a, b, c) {
		if ("load" === a && this._textureLoaded) return void setTimeout(function() {
			b.call(c)
		}, 0);
		void 0 === this._listeners && (this._listeners = {});
		var d = this._listeners;
		void 0 === d[a] && (d[a] = []), this.hasEventListener(a, b, c) || d[a].push({
			callback: b,
			eventTarget: c
		})
	},
	hasEventListener: function(a, b, c) {
		if (void 0 === this._listeners) return !1;
		var d = this._listeners;
		if (void 0 !== d[a]) for (var e = 0, f = d.length; f > e; e++) {
			var g = d[e];
			if (g.callback === b && g.eventTarget === c) return !0
		}
		return !1
	},
	removeEventListener: function(a, b) {
		if (void 0 !== this._listeners) {
			var c = this._listeners,
				d = c[a];
			if (void 0 !== d) for (var e = 0; e < d.length;) {
				var f = d[e];
				f.eventTarget === b ? d.splice(e, 1) : e++
			}
		}
	},
	dispatchEvent: function(a, b) {
		if (void 0 !== this._listeners) {
			null == b && (b = !0);
			var c = this._listeners,
				d = c[a];
			if (void 0 !== d) {
				for (var e = [], f = d.length, g = 0; f > g; g++) e[g] = d[g];
				for (g = 0; f > g; g++) e[g].callback.call(e[g].eventTarget, this);
				b && (d.length = 0)
			}
		}
	}
}, cc._tmp.PrototypeCCNode = function() {
	var a = cc.Node.prototype;
	cc.defineGetterSetter(a, "x", a.getPositionX, a.setPositionX), cc.defineGetterSetter(a, "y", a.getPositionY, a.setPositionY), a.width, cc.defineGetterSetter(a, "width", a._getWidth, a._setWidth), a.height, cc.defineGetterSetter(a, "height", a._getHeight, a._setHeight), a.anchorX, cc.defineGetterSetter(a, "anchorX", a._getAnchorX, a._setAnchorX), a.anchorY, cc.defineGetterSetter(a, "anchorY", a._getAnchorY, a._setAnchorY), a.skewX, cc.defineGetterSetter(a, "skewX", a.getSkewX, a.setSkewX), a.skewY, cc.defineGetterSetter(a, "skewY", a.getSkewY, a.setSkewY), a.zIndex, cc.defineGetterSetter(a, "zIndex", a.getLocalZOrder, a.setLocalZOrder), a.vertexZ, cc.defineGetterSetter(a, "vertexZ", a.getVertexZ, a.setVertexZ), a.rotation, cc.defineGetterSetter(a, "rotation", a.getRotation, a.setRotation), a.rotationX, cc.defineGetterSetter(a, "rotationX", a.getRotationX, a.setRotationX), a.rotationY, cc.defineGetterSetter(a, "rotationY", a.getRotationY, a.setRotationY), a.scale, cc.defineGetterSetter(a, "scale", a.getScale, a.setScale), a.scaleX, cc.defineGetterSetter(a, "scaleX", a.getScaleX, a.setScaleX), a.scaleY, cc.defineGetterSetter(a, "scaleY", a.getScaleY, a.setScaleY), a.children, cc.defineGetterSetter(a, "children", a.getChildren), a.childrenCount, cc.defineGetterSetter(a, "childrenCount", a.getChildrenCount), a.parent, cc.defineGetterSetter(a, "parent", a.getParent, a.setParent), a.visible, cc.defineGetterSetter(a, "visible", a.isVisible, a.setVisible), a.running, cc.defineGetterSetter(a, "running", a.isRunning), a.ignoreAnchor, cc.defineGetterSetter(a, "ignoreAnchor", a.isIgnoreAnchorPointForPosition, a.ignoreAnchorPointForPosition), a.tag, a.userData, a.userObject, a.arrivalOrder, a.actionManager, cc.defineGetterSetter(a, "actionManager", a.getActionManager, a.setActionManager), a.scheduler, cc.defineGetterSetter(a, "scheduler", a.getScheduler, a.setScheduler), a.shaderProgram, cc.defineGetterSetter(a, "shaderProgram", a.getShaderProgram, a.setShaderProgram), a.opacity, cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity), a.opacityModifyRGB, cc.defineGetterSetter(a, "opacityModifyRGB", a.isOpacityModifyRGB), a.cascadeOpacity, cc.defineGetterSetter(a, "cascadeOpacity", a.isCascadeOpacityEnabled, a.setCascadeOpacityEnabled), a.color, cc.defineGetterSetter(a, "color", a.getColor, a.setColor), a.cascadeColor, cc.defineGetterSetter(a, "cascadeColor", a.isCascadeColorEnabled, a.setCascadeColorEnabled)
}, cc.NODE_TAG_INVALID = -1, cc.s_globalOrderOfArrival = 1, cc.Node = cc.Class.extend({
	_localZOrder: 0,
	_globalZOrder: 0,
	_vertexZ: 0,
	_rotationX: 0,
	_rotationY: 0,
	_scaleX: 1,
	_scaleY: 1,
	_position: null,
	_normalizedPosition: null,
	_usingNormalizedPosition: !1,
	_normalizedPositionDirty: !1,
	_skewX: 0,
	_skewY: 0,
	_children: null,
	_visible: !0,
	_anchorPoint: null,
	_contentSize: null,
	_running: !1,
	_parent: null,
	_ignoreAnchorPointForPosition: !1,
	tag: cc.NODE_TAG_INVALID,
	userData: null,
	userObject: null,
	_reorderChildDirty: !1,
	_shaderProgram: null,
	arrivalOrder: 0,
	_actionManager: null,
	_scheduler: null,
	_eventDispatcher: null,
	_additionalTransformDirty: !1,
	_additionalTransform: null,
	_componentContainer: null,
	_isTransitionFinished: !1,
	_className: "Node",
	_showNode: !1,
	_name: "",
	_realOpacity: 255,
	_realColor: null,
	_cascadeColorEnabled: !1,
	_cascadeOpacityEnabled: !1,
	_renderCmd: null,
	_camera: null,
	ctor: function() {
		this._initNode(), this._initRendererCmd()
	},
	_initNode: function() {
		var a = this;
		a._anchorPoint = cc.p(0, 0), a._contentSize = cc.size(0, 0), a._position = cc.p(0, 0), a._normalizedPosition = cc.p(0, 0), a._children = [];
		var b = cc.director;
		a._actionManager = b.getActionManager(), a._scheduler = b.getScheduler(), a._additionalTransform = cc.affineTransformMakeIdentity(), cc.ComponentContainer && (a._componentContainer = new cc.ComponentContainer(a)), this._realOpacity = 255, this._realColor = cc.color(255, 255, 255, 255), this._cascadeColorEnabled = !1, this._cascadeOpacityEnabled = !1
	},
	init: function() {
		return !0
	},
	_arrayMakeObjectsPerformSelector: function(a, b) {
		if (a && 0 !== a.length) {
			var c, d, e = a.length,
				f = cc.Node._stateCallbackType;
			switch (b) {
			case f.onEnter:
				for (c = 0; e > c; c++) d = a[c], d && d.onEnter();
				break;
			case f.onExit:
				for (c = 0; e > c; c++) d = a[c], d && d.onExit();
				break;
			case f.onEnterTransitionDidFinish:
				for (c = 0; e > c; c++) d = a[c], d && d.onEnterTransitionDidFinish();
				break;
			case f.cleanup:
				for (c = 0; e > c; c++) d = a[c], d && d.cleanup();
				break;
			case f.updateTransform:
				for (c = 0; e > c; c++) d = a[c], d && d.updateTransform();
				break;
			case f.onExitTransitionDidStart:
				for (c = 0; e > c; c++) d = a[c], d && d.onExitTransitionDidStart();
				break;
			case f.sortAllChildren:
				for (c = 0; e > c; c++) d = a[c], d && d.sortAllChildren();
				break;
			default:
				cc.assert(0, cc._LogInfos.Node__arrayMakeObjectsPerformSelector)
			}
		}
	},
	attr: function(a) {
		for (var b in a) this[b] = a[b]
	},
	getSkewX: function() {
		return this._skewX
	},
	setSkewX: function(a) {
		this._skewX = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getSkewY: function() {
		return this._skewY
	},
	setSkewY: function(a) {
		this._skewY = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	setLocalZOrder: function(a) {
		this._localZOrder = a, this._parent && this._parent.reorderChild(this, a), cc.eventManager._setDirtyForNode(this)
	},
	_setLocalZOrder: function(a) {
		this._localZOrder = a
	},
	getLocalZOrder: function() {
		return this._localZOrder
	},
	getZOrder: function() {
		return cc.log(cc._LogInfos.Node_getZOrder), this.getLocalZOrder()
	},
	setZOrder: function(a) {
		cc.log(cc._LogInfos.Node_setZOrder), this.setLocalZOrder(a)
	},
	setGlobalZOrder: function(a) {
		this._globalZOrder !== a && (this._globalZOrder = a, cc.eventManager._setDirtyForNode(this))
	},
	getGlobalZOrder: function() {
		return this._globalZOrder
	},
	getVertexZ: function() {
		return this._vertexZ
	},
	setVertexZ: function(a) {
		this._vertexZ = a
	},
	getRotation: function() {
		return this._rotationX !== this._rotationY && cc.log(cc._LogInfos.Node_getRotation), this._rotationX
	},
	setRotation: function(a) {
		this._rotationX = this._rotationY = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getRotationX: function() {
		return this._rotationX
	},
	setRotationX: function(a) {
		this._rotationX = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getRotationY: function() {
		return this._rotationY
	},
	setRotationY: function(a) {
		this._rotationY = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getScale: function() {
		return this._scaleX !== this._scaleY && cc.log(cc._LogInfos.Node_getScale), this._scaleX
	},
	setScale: function(a, b) {
		this._scaleX = a, this._scaleY = b || 0 === b ? b : a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getScaleX: function() {
		return this._scaleX
	},
	setScaleX: function(a) {
		this._scaleX = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getScaleY: function() {
		return this._scaleY
	},
	setScaleY: function(a) {
		this._scaleY = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	setPosition: function(a, b) {
		var c = this._position;
		if (void 0 === b) {
			if (c.x === a.x && c.y === a.y) return;
			c.x = a.x, c.y = a.y
		} else {
			if (c.x === a && c.y === b) return;
			c.x = a, c.y = b
		}
		this._usingNormalizedPosition = !1, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	setNormalizedPosition: function(a, b) {
		var c = this._normalizedPosition;
		void 0 === b ? (c.x = a.x, c.y = a.y) : (c.x = a, c.y = b), this._normalizedPositionDirty = this._usingNormalizedPosition = !0, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getPosition: function() {
		return cc.p(this._position)
	},
	getNormalizedPosition: function() {
		return cc.p(this._normalizedPosition)
	},
	getPositionX: function() {
		return this._position.x
	},
	setPositionX: function(a) {
		this._position.x = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getPositionY: function() {
		return this._position.y
	},
	setPositionY: function(a) {
		this._position.y = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	getChildrenCount: function() {
		return this._children.length
	},
	getChildren: function() {
		return this._children
	},
	isVisible: function() {
		return this._visible
	},
	setVisible: function(a) {
		this._visible !== a && (this._visible = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty), cc.renderer.childrenOrderDirty = !0)
	},
	getAnchorPoint: function() {
		return cc.p(this._anchorPoint)
	},
	setAnchorPoint: function(a, b) {
		var c = this._anchorPoint;
		if (void 0 === b) {
			if (a.x === c.x && a.y === c.y) return;
			c.x = a.x, c.y = a.y
		} else {
			if (a === c.x && b === c.y) return;
			c.x = a, c.y = b
		}
		this._renderCmd._updateAnchorPointInPoint()
	},
	_getAnchorX: function() {
		return this._anchorPoint.x
	},
	_setAnchorX: function(a) {
		this._anchorPoint.x !== a && (this._anchorPoint.x = a, this._renderCmd._updateAnchorPointInPoint())
	},
	_getAnchorY: function() {
		return this._anchorPoint.y
	},
	_setAnchorY: function(a) {
		this._anchorPoint.y !== a && (this._anchorPoint.y = a, this._renderCmd._updateAnchorPointInPoint())
	},
	getAnchorPointInPoints: function() {
		return this._renderCmd.getAnchorPointInPoints()
	},
	_getWidth: function() {
		return this._contentSize.width
	},
	_setWidth: function(a) {
		this._contentSize.width = a, this._renderCmd._updateAnchorPointInPoint()
	},
	_getHeight: function() {
		return this._contentSize.height
	},
	_setHeight: function(a) {
		this._contentSize.height = a, this._renderCmd._updateAnchorPointInPoint()
	},
	getContentSize: function() {
		return cc.size(this._contentSize)
	},
	setContentSize: function(a, b) {
		var c = this._contentSize;
		if (void 0 === b) {
			if (a.width === c.width && a.height === c.height) return;
			c.width = a.width, c.height = a.height
		} else {
			if (a === c.width && b === c.height) return;
			c.width = a, c.height = b
		}
		this._renderCmd._updateAnchorPointInPoint()
	},
	isRunning: function() {
		return this._running
	},
	getParent: function() {
		return this._parent
	},
	setParent: function(a) {
		this._parent = a
	},
	isIgnoreAnchorPointForPosition: function() {
		return this._ignoreAnchorPointForPosition
	},
	ignoreAnchorPointForPosition: function(a) {
		a !== this._ignoreAnchorPointForPosition && (this._ignoreAnchorPointForPosition = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty))
	},
	getTag: function() {
		return this.tag
	},
	setTag: function(a) {
		this.tag = a
	},
	setName: function(a) {
		this._name = a
	},
	getName: function() {
		return this._name
	},
	getUserData: function() {
		return this.userData
	},
	setUserData: function(a) {
		this.userData = a
	},
	getUserObject: function() {
		return this.userObject
	},
	setUserObject: function(a) {
		this.userObject !== a && (this.userObject = a)
	},
	getOrderOfArrival: function() {
		return this.arrivalOrder
	},
	setOrderOfArrival: function(a) {
		this.arrivalOrder = a
	},
	getActionManager: function() {
		return this._actionManager || (this._actionManager = cc.director.getActionManager()), this._actionManager
	},
	setActionManager: function(a) {
		this._actionManager !== a && (this.stopAllActions(), this._actionManager = a)
	},
	getScheduler: function() {
		return this._scheduler || (this._scheduler = cc.director.getScheduler()), this._scheduler
	},
	setScheduler: function(a) {
		this._scheduler !== a && (this.unscheduleAllCallbacks(), this._scheduler = a)
	},
	boundingBox: function() {
		return cc.log(cc._LogInfos.Node_boundingBox), this.getBoundingBox()
	},
	getBoundingBox: function() {
		var a = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
		return cc._rectApplyAffineTransformIn(a, this.getNodeToParentTransform())
	},
	cleanup: function() {
		this.stopAllActions(), this.unscheduleAllCallbacks(), cc.eventManager.removeListeners(this), this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.cleanup)
	},
	getChildByTag: function(a) {
		var b = this._children;
		if (null !== b) for (var c = 0; c < b.length; c++) {
			var d = b[c];
			if (d && d.tag === a) return d
		}
		return null
	},
	getChildByName: function(a) {
		if (!a) return cc.log("Invalid name"), null;
		for (var b = this._children, c = 0, d = b.length; d > c; c++) if (b[c]._name === a) return b[c];
		return null
	},
	addChild: function(a, b, c) {
		b = void 0 === b ? a._localZOrder : b;
		var d, e = !1;
		cc.isUndefined(c) ? (c = void 0, d = a._name) : cc.isString(c) ? (d = c, c = void 0) : cc.isNumber(c) && (e = !0, d = ""), cc.assert(a, cc._LogInfos.Node_addChild_3), cc.assert(null === a._parent, "child already added. It can't be added again"), this._addChildHelper(a, b, c, d, e)
	},
	_addChildHelper: function(a, b, c, d, e) {
		this._children || (this._children = []), this._insertChild(a, b), e ? a.setTag(c) : a.setName(d), a.setParent(this), a.setOrderOfArrival(cc.s_globalOrderOfArrival++), this._running && (a.onEnter(), this._isTransitionFinished && a.onEnterTransitionDidFinish()), this._cascadeColorEnabled && a._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty), this._cascadeOpacityEnabled && a._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty)
	},
	removeFromParent: function(a) {
		this._parent && (void 0 === a && (a = !0), this._parent.removeChild(this, a))
	},
	removeFromParentAndCleanup: function(a) {
		cc.log(cc._LogInfos.Node_removeFromParentAndCleanup), this.removeFromParent(a)
	},
	removeChild: function(a, b) {
		0 !== this._children.length && (void 0 === b && (b = !0), this._children.indexOf(a) > -1 && this._detachChild(a, b), cc.renderer.childrenOrderDirty = !0)
	},
	removeChildByTag: function(a, b) {
		a === cc.NODE_TAG_INVALID && cc.log(cc._LogInfos.Node_removeChildByTag);
		var c = this.getChildByTag(a);
		c ? this.removeChild(c, b) : cc.log(cc._LogInfos.Node_removeChildByTag_2, a)
	},
	removeAllChildrenWithCleanup: function(a) {
		this.removeAllChildren(a)
	},
	removeAllChildren: function(a) {
		var b = this._children;
		if (null !== b) {
			void 0 === a && (a = !0);
			for (var c = 0; c < b.length; c++) {
				var d = b[c];
				d && (this._running && (d.onExitTransitionDidStart(), d.onExit()), a && d.cleanup(), d.parent = null, d._renderCmd.detachFromParent())
			}
			this._children.length = 0, cc.renderer.childrenOrderDirty = !0
		}
	},
	_detachChild: function(a, b) {
		this._running && (a.onExitTransitionDidStart(), a.onExit()), b && a.cleanup(), a.parent = null, a._renderCmd.detachFromParent(), cc.arrayRemoveObject(this._children, a)
	},
	_insertChild: function(a, b) {
		cc.renderer.childrenOrderDirty = this._reorderChildDirty = !0, this._children.push(a), a._setLocalZOrder(b)
	},
	setNodeDirty: function() {
		this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	reorderChild: function(a, b) {
		cc.assert(a, cc._LogInfos.Node_reorderChild), cc.renderer.childrenOrderDirty = this._reorderChildDirty = !0, a.arrivalOrder = cc.s_globalOrderOfArrival, cc.s_globalOrderOfArrival++, a._setLocalZOrder(b)
	},
	sortAllChildren: function() {
		if (this._reorderChildDirty) {
			var a, b, c, d = this._children,
				e = d.length;
			for (a = 1; e > a; a++) {
				for (c = d[a], b = a - 1; b >= 0;) {
					if (c._localZOrder < d[b]._localZOrder) d[b + 1] = d[b];
					else {
						if (!(c._localZOrder === d[b]._localZOrder && c.arrivalOrder < d[b].arrivalOrder)) break;
						d[b + 1] = d[b]
					}
					b--
				}
				d[b + 1] = c
			}
			this._reorderChildDirty = !1
		}
	},
	draw: function(a) {},
	transformAncestors: function() {
		null !== this._parent && (this._parent.transformAncestors(), this._parent.transform())
	},
	onEnter: function() {
		this._isTransitionFinished = !1, this._running = !0, this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.onEnter), this.resume()
	},
	onEnterTransitionDidFinish: function() {
		this._isTransitionFinished = !0, this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.onEnterTransitionDidFinish)
	},
	onExitTransitionDidStart: function() {
		this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.onExitTransitionDidStart)
	},
	onExit: function() {
		this._running = !1, this.pause(), this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.onExit), this.removeAllComponents()
//      $(".jinDu").html("100%");
//      $(".p0").removeClass("prM1").addClass("prM2");
//      $(".loadJin").animate({"width":280+"px"},800);
//      var timerJd = setTimeout(function(){
//      	$(".gameP").show();
//      	$(".loadP").animate({"margin-top":-1000+"px"});
//        	$("body").css("position","relative");
//      },1000);
//      console.log("ok");
	},
	runAction: function(a) {
		return cc.assert(a, cc._LogInfos.Node_runAction), this.actionManager.addAction(a, this, !this._running), a
	},
	stopAllActions: function() {
		this.actionManager && this.actionManager.removeAllActionsFromTarget(this)
	},
	stopAction: function(a) {
		this.actionManager.removeAction(a)
	},
	stopActionByTag: function(a) {
		return a === cc.ACTION_TAG_INVALID ? void cc.log(cc._LogInfos.Node_stopActionByTag) : void this.actionManager.removeActionByTag(a, this)
	},
	getActionByTag: function(a) {
		return a === cc.ACTION_TAG_INVALID ? (cc.log(cc._LogInfos.Node_getActionByTag), null) : this.actionManager.getActionByTag(a, this)
	},
	getNumberOfRunningActions: function() {
		return this.actionManager.numberOfRunningActionsInTarget(this)
	},
	scheduleUpdate: function() {
		this.scheduleUpdateWithPriority(0)
	},
	scheduleUpdateWithPriority: function(a) {
		this.scheduler.scheduleUpdate(this, a, !this._running)
	},
	unscheduleUpdate: function() {
		this.scheduler.unscheduleUpdate(this)
	},
	schedule: function(a, b, c, d, e) {
		var f = arguments.length;
		"function" == typeof a ? 1 === f ? (b = 0, c = cc.REPEAT_FOREVER, d = 0, e = this.__instanceId) : 2 === f ? "number" == typeof b ? (c = cc.REPEAT_FOREVER, d = 0, e = this.__instanceId) : (e = b, b = 0, c = cc.REPEAT_FOREVER, d = 0) : 3 === f ? ("string" == typeof c ? (e = c, c = cc.REPEAT_FOREVER) : e = this.__instanceId, d = 0) : 4 === f && (e = this.__instanceId) : 1 === f ? (b = 0, c = cc.REPEAT_FOREVER, d = 0) : 2 === f && (c = cc.REPEAT_FOREVER, d = 0), cc.assert(a, cc._LogInfos.Node_schedule), cc.assert(b >= 0, cc._LogInfos.Node_schedule_2), b = b || 0, c = null == c ? cc.REPEAT_FOREVER : c, d = d || 0, this.scheduler.schedule(a, this, b, c, d, !this._running, e)
	},
	scheduleOnce: function(a, b, c) {
		void 0 === c && (c = this.__instanceId), this.schedule(a, 0, 0, b, c)
	},
	unschedule: function(a) {
		a && this.scheduler.unschedule(a, this)
	},
	unscheduleAllCallbacks: function() {
		this.scheduler.unscheduleAllForTarget(this)
	},
	resumeSchedulerAndActions: function() {
		cc.log(cc._LogInfos.Node_resumeSchedulerAndActions), this.resume()
	},
	resume: function() {
		this.scheduler.resumeTarget(this), this.actionManager && this.actionManager.resumeTarget(this), cc.eventManager.resumeTarget(this)
	},
	pauseSchedulerAndActions: function() {
		cc.log(cc._LogInfos.Node_pauseSchedulerAndActions), this.pause()
	},
	pause: function() {
		this.scheduler.pauseTarget(this), this.actionManager && this.actionManager.pauseTarget(this), cc.eventManager.pauseTarget(this)
	},
	setAdditionalTransform: function(a) {
		return void 0 === a ? this._additionalTransformDirty = !1 : (this._additionalTransform = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty), void(this._additionalTransformDirty = !0))
	},
	getParentToNodeTransform: function() {
		this._renderCmd.getParentToNodeTransform()
	},
	parentToNodeTransform: function() {
		return this.getParentToNodeTransform()
	},
	getNodeToWorldTransform: function() {
		for (var a = this.getNodeToParentTransform(), b = this._parent; null !== b; b = b.parent) a = cc.affineTransformConcat(a, b.getNodeToParentTransform());
		return a
	},
	nodeToWorldTransform: function() {
		return this.getNodeToWorldTransform()
	},
	getWorldToNodeTransform: function() {
		return cc.affineTransformInvert(this.getNodeToWorldTransform())
	},
	worldToNodeTransform: function() {
		return this.getWorldToNodeTransform()
	},
	convertToNodeSpace: function(a) {
		return cc.pointApplyAffineTransform(a, this.getWorldToNodeTransform())
	},
	convertToWorldSpace: function(a) {
		return a = a || cc.p(0, 0), cc.pointApplyAffineTransform(a, this.getNodeToWorldTransform())
	},
	convertToNodeSpaceAR: function(a) {
		return cc.pSub(this.convertToNodeSpace(a), this._renderCmd.getAnchorPointInPoints())
	},
	convertToWorldSpaceAR: function(a) {
		a = a || cc.p(0, 0);
		var b = cc.pAdd(a, this._renderCmd.getAnchorPointInPoints());
		return this.convertToWorldSpace(b)
	},
	_convertToWindowSpace: function(a) {
		var b = this.convertToWorldSpace(a);
		return cc.director.convertToUI(b)
	},
	convertTouchToNodeSpace: function(a) {
		var b = a.getLocation();
		return this.convertToNodeSpace(b)
	},
	convertTouchToNodeSpaceAR: function(a) {
		var b = cc.director.convertToGL(a.getLocation());
		return this.convertToNodeSpaceAR(b)
	},
	update: function(a) {
		this._componentContainer && !this._componentContainer.isEmpty() && this._componentContainer.visit(a)
	},
	updateTransform: function() {
		this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.updateTransform)
	},
	retain: function() {},
	release: function() {},
	getComponent: function(a) {
		return this._componentContainer ? this._componentContainer.getComponent(a) : null
	},
	addComponent: function(a) {
		this._componentContainer && this._componentContainer.add(a)
	},
	removeComponent: function(a) {
		return this._componentContainer ? this._componentContainer.remove(a) : !1
	},
	removeAllComponents: function() {
		this._componentContainer && this._componentContainer.removeAll()
	},
	grid: null,
	visit: function(a) {
		this._renderCmd.visit(a)
	},
	transform: function(a, b) {
		this._renderCmd.transform(a, b)
	},
	nodeToParentTransform: function() {
		return this.getNodeToParentTransform()
	},
	getNodeToParentTransform: function(a) {
		var b = this._renderCmd.getNodeToParentTransform();
		if (a) {
			for (var c = {
				a: b.a,
				b: b.b,
				c: b.c,
				d: b.d,
				tx: b.tx,
				ty: b.ty
			}, d = this._parent; null != d && d != a; d = d.getParent()) cc.affineTransformConcatIn(c, d.getNodeToParentTransform());
			return c
		}
		return b
	},
	getNodeToParentAffineTransform: function(a) {
		return this.getNodeToParentTransform(a)
	},
	getCamera: function() {
		return this._camera || (this._camera = new cc.Camera), this._camera
	},
	getGrid: function() {
		return this.grid
	},
	setGrid: function(a) {
		this.grid = a
	},
	getShaderProgram: function() {
		return this._renderCmd.getShaderProgram()
	},
	setShaderProgram: function(a) {
		this._renderCmd.setShaderProgram(a)
	},
	getGLServerState: function() {
		return 0
	},
	setGLServerState: function(a) {},
	getBoundingBoxToWorld: function() {
		var a = cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
			b = this.getNodeToWorldTransform();
		if (a = cc.rectApplyAffineTransform(a, b), !this._children) return a;
		for (var c = this._children, d = 0; d < c.length; d++) {
			var e = c[d];
			if (e && e._visible) {
				var f = e._getBoundingBoxToCurrentNode(b);
				f && (a = cc.rectUnion(a, f))
			}
		}
		return a
	},
	_getBoundingBoxToCurrentNode: function(a) {
		var b = cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
			c = void 0 === a ? this.getNodeToParentTransform() : cc.affineTransformConcat(this.getNodeToParentTransform(), a);
		if (b = cc.rectApplyAffineTransform(b, c), !this._children) return b;
		for (var d = this._children, e = 0; e < d.length; e++) {
			var f = d[e];
			if (f && f._visible) {
				var g = f._getBoundingBoxToCurrentNode(c);
				g && (b = cc.rectUnion(b, g))
			}
		}
		return b
	},
	getOpacity: function() {
		return this._realOpacity
	},
	getDisplayedOpacity: function() {
		return this._renderCmd.getDisplayedOpacity()
	},
	setOpacity: function(a) {
		this._realOpacity = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty)
	},
	updateDisplayedOpacity: function(a) {
		this._renderCmd._updateDisplayOpacity(a)
	},
	isCascadeOpacityEnabled: function() {
		return this._cascadeOpacityEnabled
	},
	setCascadeOpacityEnabled: function(a) {
		this._cascadeOpacityEnabled !== a && (this._cascadeOpacityEnabled = a, this._renderCmd.setCascadeOpacityEnabledDirty())
	},
	getColor: function() {
		var a = this._realColor;
		return cc.color(a.r, a.g, a.b, a.a)
	},
	getDisplayedColor: function() {
		return this._renderCmd.getDisplayedColor()
	},
	setColor: function(a) {
		var b = this._realColor;
		b.r = a.r, b.g = a.g, b.b = a.b, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty)
	},
	updateDisplayedColor: function(a) {
		this._renderCmd._updateDisplayColor(a)
	},
	isCascadeColorEnabled: function() {
		return this._cascadeColorEnabled
	},
	setCascadeColorEnabled: function(a) {
		this._cascadeColorEnabled !== a && (this._cascadeColorEnabled = a, this._renderCmd.setCascadeColorEnabledDirty())
	},
	setOpacityModifyRGB: function(a) {},
	isOpacityModifyRGB: function() {
		return !1
	},
	_initRendererCmd: function() {
		this._renderCmd = cc.renderer.getRenderCmd(this)
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.Node.CanvasRenderCmd(this) : new cc.Node.WebGLRenderCmd(this)
	},
	enumerateChildren: function(a, b) {
		cc.assert(a && 0 != a.length, "Invalid name"), cc.assert(null != b, "Invalid callback function");
		var c = a.length,
			d = 0,
			e = c,
			f = !1;
		c > 2 && "/" === a[0] && "/" === a[1] && (f = !0, d = 2, e -= 2);
		var g = !1;
		c > 3 && "/" === a[c - 3] && "." === a[c - 2] && "." === a[c - 1] && (g = !0, e -= 3);
		var h = a.substr(d, e);
		g && (h = "[[:alnum:]]+/" + h), f ? this.doEnumerateRecursive(this, h, b) : this.doEnumerate(h, b)
	},
	doEnumerateRecursive: function(a, b, c) {
		var d = !1;
		if (a.doEnumerate(b, c)) d = !0;
		else for (var e, f = a.getChildren(), g = f.length, h = 0; g > h; h++) if (e = f[h], this.doEnumerateRecursive(e, b, c)) {
			d = !0;
			break
		}
	},
	doEnumerate: function(a, b) {
		var c = a.indexOf("/"),
			d = a,
			e = !1; - 1 !== c && (d = a.substr(0, c), e = !0);
		for (var f, g = !1, h = this._children, i = h.length, j = 0; i > j; j++) if (f = h[j], -1 !== f._name.indexOf(d)) if (e) {
			if (g = f.doEnumerate(a, b)) break
		} else if (b(f)) {
			g = !0;
			break
		}
		return g
	}
}), cc.Node.create = function() {
	return new cc.Node
}, cc.Node._stateCallbackType = {
	onEnter: 1,
	onExit: 2,
	cleanup: 3,
	onEnterTransitionDidFinish: 4,
	updateTransform: 5,
	onExitTransitionDidStart: 6,
	sortAllChildren: 7
}, cc.assert(cc.isFunction(cc._tmp.PrototypeCCNode), cc._LogInfos.MissingFile, "BaseNodesPropertyDefine.js"), cc._tmp.PrototypeCCNode(), delete cc._tmp.PrototypeCCNode, cc.CustomRenderCmd = function(a, b) {
	this._needDraw = !0, this._target = a, this._callback = b, this.rendering = function(a, b, c) {
		this._callback && this._callback.call(this._target, a, b, c)
	}
}, cc.Node._dirtyFlags = {
	transformDirty: 1,
	visibleDirty: 2,
	colorDirty: 4,
	opacityDirty: 8,
	cacheDirty: 16,
	orderDirty: 32,
	textDirty: 64,
	gradientDirty: 128,
	all: 255
}, cc.Node.RenderCmd = function(a) {
	this._dirtyFlag = 1, this._node = a, this._needDraw = !1, this._anchorPointInPoints = new cc.Point(0, 0), this._transform = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}, this._worldTransform = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}, this._inverse = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}, this._displayedOpacity = 255, this._displayedColor = cc.color(255, 255, 255, 255), this._cascadeColorEnabledDirty = !1, this._cascadeOpacityEnabledDirty = !1, this._curLevel = -1
}, cc.Node.RenderCmd.prototype = {
	constructor: cc.Node.RenderCmd,
	getAnchorPointInPoints: function() {
		return cc.p(this._anchorPointInPoints)
	},
	getDisplayedColor: function() {
		var a = this._displayedColor;
		return cc.color(a.r, a.g, a.b, a.a)
	},
	getDisplayedOpacity: function() {
		return this._displayedOpacity
	},
	setCascadeColorEnabledDirty: function() {
		this._cascadeColorEnabledDirty = !0, this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty)
	},
	setCascadeOpacityEnabledDirty: function() {
		this._cascadeOpacityEnabledDirty = !0, this.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty)
	},
	getParentToNodeTransform: function() {
		return this._dirtyFlag & cc.Node._dirtyFlags.transformDirty && (this._inverse = cc.affineTransformInvert(this.getNodeToParentTransform())), this._inverse
	},
	detachFromParent: function() {},
	_updateAnchorPointInPoint: function() {
		var a = this._anchorPointInPoints,
			b = this._node._contentSize,
			c = this._node._anchorPoint;
		a.x = b.width * c.x, a.y = b.height * c.y, this.setDirtyFlag(cc.Node._dirtyFlags.transformDirty)
	},
	setDirtyFlag: function(a) {
		0 === this._dirtyFlag && 0 !== a && cc.renderer.pushDirtyNode(this), this._dirtyFlag |= a
	},
	getParentRenderCmd: function() {
		return this._node && this._node._parent && this._node._parent._renderCmd ? this._node._parent._renderCmd : null
	},
	_updateDisplayColor: function(a) {
		var b, c, d, e, f = this._node,
			g = this._displayedColor,
			h = f._realColor;
		if (this._cascadeColorEnabledDirty && !f._cascadeColorEnabled) {
			g.r = h.r, g.g = h.g, g.b = h.b;
			var i = new cc.Color(255, 255, 255, 255);
			for (d = f._children, b = 0, c = d.length; c > b; b++) e = d[b], e && e._renderCmd && e._renderCmd._updateDisplayColor(i);
			this._cascadeColorEnabledDirty = !1
		} else {
			if (void 0 === a) {
				var j = f._parent;
				a = j && j._cascadeColorEnabled ? j.getDisplayedColor() : cc.color.WHITE
			}
			if (g.r = 0 | h.r * a.r / 255, g.g = 0 | h.g * a.g / 255, g.b = 0 | h.b * a.b / 255, f._cascadeColorEnabled) for (d = f._children, b = 0, c = d.length; c > b; b++) e = d[b], e && e._renderCmd && (e._renderCmd._updateDisplayColor(g), e._renderCmd._updateColor())
		}
		this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.colorDirty ^ this._dirtyFlag
	},
	_updateDisplayOpacity: function(a) {
		var b, c, d, e, f = this._node;
		if (this._cascadeOpacityEnabledDirty && !f._cascadeOpacityEnabled) {
			for (this._displayedOpacity = f._realOpacity, d = f._children, b = 0, c = d.length; c > b; b++) e = d[b], e && e._renderCmd && e._renderCmd._updateDisplayOpacity(255);
			this._cascadeOpacityEnabledDirty = !1
		} else {
			if (void 0 === a) {
				var g = f._parent;
				a = 255, g && g._cascadeOpacityEnabled && (a = g.getDisplayedOpacity())
			}
			if (this._displayedOpacity = f._realOpacity * a / 255, f._cascadeOpacityEnabled) for (d = f._children, b = 0, c = d.length; c > b; b++) e = d[b], e && e._renderCmd && (e._renderCmd._updateDisplayOpacity(this._displayedOpacity), e._renderCmd._updateColor())
		}
		this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.opacityDirty ^ this._dirtyFlag
	},
	_syncDisplayColor: function(a) {
		var b = this._node,
			c = this._displayedColor,
			d = b._realColor;
		if (void 0 === a) {
			var e = b._parent;
			a = e && e._cascadeColorEnabled ? e.getDisplayedColor() : cc.color.WHITE
		}
		c.r = 0 | d.r * a.r / 255, c.g = 0 | d.g * a.g / 255, c.b = 0 | d.b * a.b / 255
	},
	_syncDisplayOpacity: function(a) {
		var b = this._node;
		if (void 0 === a) {
			var c = b._parent;
			a = 255, c && c._cascadeOpacityEnabled && (a = c.getDisplayedOpacity())
		}
		this._displayedOpacity = b._realOpacity * a / 255
	},
	_updateColor: function() {},
	updateStatus: function() {
		var a = cc.Node._dirtyFlags,
			b = this._dirtyFlag,
			c = b & a.colorDirty,
			d = b & a.opacityDirty;
		c && this._updateDisplayColor(), d && this._updateDisplayOpacity(), (c || d) && this._updateColor(), b & a.transformDirty && (this.transform(this.getParentRenderCmd(), !0), this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag)
	}
}, function() {
	cc.Node.CanvasRenderCmd = function(a) {
		cc.Node.RenderCmd.call(this, a), this._cachedParent = null, this._cacheDirty = !1
	};
	var a = cc.Node.CanvasRenderCmd.prototype = Object.create(cc.Node.RenderCmd.prototype);
	a.constructor = cc.Node.CanvasRenderCmd, a.transform = function(a, b) {
		var c = this.getNodeToParentTransform(),
			d = this._worldTransform;
		if (this._cacheDirty = !0, a) {
			var e = a._worldTransform;
			d.a = c.a * e.a + c.b * e.c, d.b = c.a * e.b + c.b * e.d, d.c = c.c * e.a + c.d * e.c, d.d = c.c * e.b + c.d * e.d, d.tx = e.a * c.tx + e.c * c.ty + e.tx, d.ty = e.d * c.ty + e.ty + e.b * c.tx
		} else d.a = c.a, d.b = c.b, d.c = c.c, d.d = c.d, d.tx = c.tx, d.ty = c.ty;
		if (b) {
			var f = this._node._children;
			if (!f || 0 === f.length) return;
			var g, h;
			for (g = 0, h = f.length; h > g; g++) f[g]._renderCmd.transform(this, b)
		}
	}, a.getNodeToParentTransform = function() {
		var a = this._node,
			b = !1;
		if (a._usingNormalizedPosition && a._parent) {
			var c = a._parent._contentSize;
			a._position.x = a._normalizedPosition.x * c.width, a._position.y = a._normalizedPosition.y * c.height, a._normalizedPositionDirty = !1, b = !0
		}
		if (b || this._dirtyFlag & cc.Node._dirtyFlags.transformDirty) {
			var d = this._transform;
			d.tx = a._position.x, d.ty = a._position.y;
			var e = 1,
				f = 0,
				g = 0,
				h = 1;
			if (a._rotationX) {
				var i = .017453292519943295 * a._rotationX;
				g = Math.sin(i), h = Math.cos(i)
			}
			if (a._rotationY) {
				var j = .017453292519943295 * a._rotationY;
				e = Math.cos(j), f = -Math.sin(j)
			}
			d.a = e, d.b = f, d.c = g, d.d = h;
			var k = a._scaleX,
				l = a._scaleY,
				m = this._anchorPointInPoints.x,
				n = this._anchorPointInPoints.y,
				o = 1e-6 > k && k > -1e-6 ? 1e-6 : k,
				p = 1e-6 > l && l > -1e-6 ? 1e-6 : l;
			if ((1 !== k || 1 !== l) && (e = d.a *= o, f = d.b *= o, g = d.c *= p, h = d.d *= p), a._skewX || a._skewY) {
				var q = Math.tan(-a._skewX * Math.PI / 180),
					r = Math.tan(-a._skewY * Math.PI / 180);
				q === 1 / 0 && (q = 99999999), r === 1 / 0 && (r = 99999999);
				var s = n * q,
					t = m * r;
				d.a = e - g * r, d.b = f - h * r, d.c = g - e * q, d.d = h - f * q, d.tx += e * s + g * t, d.ty += f * s + h * t
			}
			d.tx -= e * m + g * n, d.ty -= f * m + h * n, a._ignoreAnchorPointForPosition && (d.tx += m, d.ty += n), a._additionalTransformDirty && (this._transform = cc.affineTransformConcat(d, a._additionalTransform))
		}
		return this._transform
	}, a.visit = function(a) {
		var b = this._node;
		if (b._visible) {
			a = a || this.getParentRenderCmd(), a && (this._curLevel = a._curLevel + 1);
			var c, d, e = b._children;
			this._syncStatus(a);
			var f = e.length;
			if (f > 0) {
				for (b.sortAllChildren(), c = 0; f > c && (d = e[c], d._localZOrder < 0); c++) d._renderCmd.visit(this);
				for (cc.renderer.pushRenderCommand(this); f > c; c++) e[c]._renderCmd.visit(this)
			} else cc.renderer.pushRenderCommand(this);
			this._dirtyFlag = 0
		}
	}, a._syncStatus = function(a) {
		var b = cc.Node._dirtyFlags,
			c = this._dirtyFlag,
			d = a ? a._node : null;
		d && d._cascadeColorEnabled && a._dirtyFlag & b.colorDirty && (c |= b.colorDirty), d && d._cascadeOpacityEnabled && a._dirtyFlag & b.opacityDirty && (c |= b.opacityDirty), a && a._dirtyFlag & b.transformDirty && (c |= b.transformDirty);
		var e = c & b.colorDirty,
			f = c & b.opacityDirty,
			g = c & b.transformDirty;
		this._dirtyFlag = c, e && this._syncDisplayColor(), f && this._syncDisplayOpacity(), e && this._updateColor(), g && this.transform(a)
	}, a.setDirtyFlag = function(a, b) {
		cc.Node.RenderCmd.prototype.setDirtyFlag.call(this, a, b), this._setCacheDirty(b), this._cachedParent && this._cachedParent.setDirtyFlag(a, !0)
	}, a._setCacheDirty = function() {
		if (this._cacheDirty === !1) {
			this._cacheDirty = !0;
			var a = this._cachedParent;
			a && a !== this && a._setNodeDirtyForCache && a._setNodeDirtyForCache()
		}
	}, a._setCachedParent = function(a) {
		if (this._cachedParent !== a) {
			this._cachedParent = a;
			for (var b = this._node._children, c = 0, d = b.length; d > c; c++) b[c]._renderCmd._setCachedParent(a)
		}
	}, a.detachFromParent = function() {
		this._cachedParent = null;
		for (var a, b = this._node._children, c = 0, d = b.length; d > c; c++) a = b[c], a && a._renderCmd && a._renderCmd.detachFromParent()
	}, a.setShaderProgram = function(a) {}, a.getShaderProgram = function() {
		return null
	}, cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc = function(a) {
		return a ? a.src === cc.SRC_ALPHA && a.dst === cc.ONE || a.src === cc.ONE && a.dst === cc.ONE ? "lighter" : a.src === cc.ZERO && a.dst === cc.SRC_ALPHA ? "destination-in" : a.src === cc.ZERO && a.dst === cc.ONE_MINUS_SRC_ALPHA ? "destination-out" : "source-over" : "source-over"
	}
}(), cc._tmp.PrototypeTexture2D = function() {
	var a = cc.Texture2D;
	a.PVRImagesHavePremultipliedAlpha = function(a) {
		cc.PVRHaveAlphaPremultiplied_ = a
	}, a.PIXEL_FORMAT_RGBA8888 = 2, a.PIXEL_FORMAT_RGB888 = 3, a.PIXEL_FORMAT_RGB565 = 4, a.PIXEL_FORMAT_A8 = 5, a.PIXEL_FORMAT_I8 = 6, a.PIXEL_FORMAT_AI88 = 7, a.PIXEL_FORMAT_RGBA4444 = 8, a.PIXEL_FORMAT_RGB5A1 = 7, a.PIXEL_FORMAT_PVRTC4 = 9, a.PIXEL_FORMAT_PVRTC2 = 10, a.PIXEL_FORMAT_DEFAULT = a.PIXEL_FORMAT_RGBA8888, a.defaultPixelFormat = a.PIXEL_FORMAT_DEFAULT;
	var b = cc.Texture2D._M = {};
	b[a.PIXEL_FORMAT_RGBA8888] = "RGBA8888", b[a.PIXEL_FORMAT_RGB888] = "RGB888", b[a.PIXEL_FORMAT_RGB565] = "RGB565", b[a.PIXEL_FORMAT_A8] = "A8", b[a.PIXEL_FORMAT_I8] = "I8", b[a.PIXEL_FORMAT_AI88] = "AI88", b[a.PIXEL_FORMAT_RGBA4444] = "RGBA4444", b[a.PIXEL_FORMAT_RGB5A1] = "RGB5A1", b[a.PIXEL_FORMAT_PVRTC4] = "PVRTC4", b[a.PIXEL_FORMAT_PVRTC2] = "PVRTC2";
	var c = cc.Texture2D._B = {};
	c[a.PIXEL_FORMAT_RGBA8888] = 32, c[a.PIXEL_FORMAT_RGB888] = 24, c[a.PIXEL_FORMAT_RGB565] = 16, c[a.PIXEL_FORMAT_A8] = 8, c[a.PIXEL_FORMAT_I8] = 8, c[a.PIXEL_FORMAT_AI88] = 16, c[a.PIXEL_FORMAT_RGBA4444] = 16, c[a.PIXEL_FORMAT_RGB5A1] = 16, c[a.PIXEL_FORMAT_PVRTC4] = 4, c[a.PIXEL_FORMAT_PVRTC2] = 3;
	var d = cc.Texture2D.prototype;
	d.name, cc.defineGetterSetter(d, "name", d.getName), d.pixelFormat, cc.defineGetterSetter(d, "pixelFormat", d.getPixelFormat), d.pixelsWidth, cc.defineGetterSetter(d, "pixelsWidth", d.getPixelsWide), d.pixelsHeight, cc.defineGetterSetter(d, "pixelsHeight", d.getPixelsHigh), d.width, cc.defineGetterSetter(d, "width", d._getWidth), d.height, cc.defineGetterSetter(d, "height", d._getHeight)
}, cc._tmp.PrototypeTextureAtlas = function() {
	var a = cc.TextureAtlas.prototype;
	a.totalQuads, cc.defineGetterSetter(a, "totalQuads", a.getTotalQuads), a.capacity, cc.defineGetterSetter(a, "capacity", a.getCapacity), a.quads, cc.defineGetterSetter(a, "quads", a.getQuads, a.setQuads)
}, cc._tmp.WebGLTexture2D = function() {
	cc.Texture2D = cc.Class.extend({
		_pVRHaveAlphaPremultiplied: !0,
		_pixelFormat: null,
		_pixelsWide: 0,
		_pixelsHigh: 0,
		_name: "",
		_contentSize: null,
		maxS: 0,
		maxT: 0,
		_hasPremultipliedAlpha: !1,
		_hasMipmaps: !1,
		shaderProgram: null,
		_textureLoaded: !1,
		_htmlElementObj: null,
		_webTextureObj: null,
		url: null,
		ctor: function() {
			this._contentSize = cc.size(0, 0), this._pixelFormat = cc.Texture2D.defaultPixelFormat
		},
		releaseTexture: function() {
			this._webTextureObj && cc._renderContext.deleteTexture(this._webTextureObj), cc.loader.release(this.url)
		},
		getPixelFormat: function() {
			return this._pixelFormat
		},
		getPixelsWide: function() {
			return this._pixelsWide
		},
		getPixelsHigh: function() {
			return this._pixelsHigh
		},
		getName: function() {
			return this._webTextureObj
		},
		getContentSize: function() {
			return cc.size(this._contentSize.width / cc.contentScaleFactor(), this._contentSize.height / cc.contentScaleFactor())
		},
		_getWidth: function() {
			return this._contentSize.width / cc.contentScaleFactor()
		},
		_getHeight: function() {
			return this._contentSize.height / cc.contentScaleFactor()
		},
		getContentSizeInPixels: function() {
			return this._contentSize
		},
		getMaxS: function() {
			return this.maxS
		},
		setMaxS: function(a) {
			this.maxS = a
		},
		getMaxT: function() {
			return this.maxT
		},
		setMaxT: function(a) {
			this.maxT = a
		},
		getShaderProgram: function() {
			return this.shaderProgram
		},
		setShaderProgram: function(a) {
			this.shaderProgram = a
		},
		hasPremultipliedAlpha: function() {
			return this._hasPremultipliedAlpha
		},
		hasMipmaps: function() {
			return this._hasMipmaps
		},
		description: function() {
			var a = this;
			return "<cc.Texture2D | Name = " + a._name + " | Dimensions = " + a._pixelsWide + " x " + a._pixelsHigh + " | Coordinates = (" + a.maxS + ", " + a.maxT + ")>"
		},
		releaseData: function(a) {
			a = null
		},
		keepData: function(a, b) {
			return a
		},
		initWithData: function(a, b, c, d, e) {
			var f = this,
				g = cc.Texture2D,
				h = cc._renderContext,
				i = h.RGBA,
				j = h.UNSIGNED_BYTE,
				k = cc.Texture2D._B[b],
				l = c * k / 8;
			switch (l % 8 === 0 ? h.pixelStorei(h.UNPACK_ALIGNMENT, 8) : l % 4 === 0 ? h.pixelStorei(h.UNPACK_ALIGNMENT, 4) : l % 2 === 0 ? h.pixelStorei(h.UNPACK_ALIGNMENT, 2) : h.pixelStorei(h.UNPACK_ALIGNMENT, 1), f._webTextureObj = h.createTexture(), cc.glBindTexture2D(f), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.LINEAR), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.LINEAR), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE), b) {
			case g.PIXEL_FORMAT_RGBA8888:
				i = h.RGBA;
				break;
			case g.PIXEL_FORMAT_RGB888:
				i = h.RGB;
				break;
			case g.PIXEL_FORMAT_RGBA4444:
				j = h.UNSIGNED_SHORT_4_4_4_4;
				break;
			case g.PIXEL_FORMAT_RGB5A1:
				j = h.UNSIGNED_SHORT_5_5_5_1;
				break;
			case g.PIXEL_FORMAT_RGB565:
				j = h.UNSIGNED_SHORT_5_6_5;
				break;
			case g.PIXEL_FORMAT_AI88:
				i = h.LUMINANCE_ALPHA;
				break;
			case g.PIXEL_FORMAT_A8:
				i = h.ALPHA;
				break;
			case g.PIXEL_FORMAT_I8:
				i = h.LUMINANCE;
				break;
			default:
				cc.assert(0, cc._LogInfos.Texture2D_initWithData)
			}
			return h.texImage2D(h.TEXTURE_2D, 0, i, c, d, 0, i, j, a), f._contentSize.width = e.width, f._contentSize.height = e.height, f._pixelsWide = c, f._pixelsHigh = d, f._pixelFormat = b, f.maxS = e.width / c, f.maxT = e.height / d, f._hasPremultipliedAlpha = !1, f._hasMipmaps = !1, f.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE), f._textureLoaded = !0, !0
		},
		drawAtPoint: function(a) {
			var b = this,
				c = [0, b.maxT, b.maxS, b.maxT, 0, 0, b.maxS, 0],
				d = b._pixelsWide * b.maxS,
				e = b._pixelsHigh * b.maxT,
				f = [a.x, a.y, 0, d + a.x, a.y, 0, a.x, e + a.y, 0, d + a.x, e + a.y, 0];
			cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS), b._shaderProgram.use(), b._shaderProgram.setUniformsForBuiltins(), cc.glBindTexture2D(b);
			var g = cc._renderContext;
			g.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, g.FLOAT, !1, 0, f), g.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, g.FLOAT, !1, 0, c), g.drawArrays(g.TRIANGLE_STRIP, 0, 4)
		},
		drawInRect: function(a) {
			var b = this,
				c = [0, b.maxT, b.maxS, b.maxT, 0, 0, b.maxS, 0],
				d = [a.x, a.y, a.x + a.width, a.y, a.x, a.y + a.height, a.x + a.width, a.y + a.height];
			cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS), b._shaderProgram.use(), b._shaderProgram.setUniformsForBuiltins(), cc.glBindTexture2D(b);
			var e = cc._renderContext;
			e.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, e.FLOAT, !1, 0, d), e.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, e.FLOAT, !1, 0, c), e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
		},
		initWithImage: function(a) {
			if (null == a) return cc.log(cc._LogInfos.Texture2D_initWithImage), !1;
			var b = a.getWidth(),
				c = a.getHeight(),
				d = cc.configuration.getMaxTextureSize();
			return b > d || c > d ? (cc.log(cc._LogInfos.Texture2D_initWithImage_2, b, c, d, d), !1) : (this._textureLoaded = !0, this._initPremultipliedATextureWithImage(a, b, c))
		},
		initWithElement: function(a) {
			a && (this._webTextureObj = cc._renderContext.createTexture(), this._htmlElementObj = a, this._textureLoaded = !0)
		},
		getHtmlElementObj: function() {
			return this._htmlElementObj
		},
		isLoaded: function() {
			return this._textureLoaded
		},
		handleLoadedTexture: function(a) {
			a = void 0 === a ? !1 : a;
			var b = this;
			if (cc._rendererInitialized) {
				if (!b._htmlElementObj) {
					var c = cc.loader.getRes(b.url);
					if (!c) return;
					b.initWithElement(c)
				}
				if (b._htmlElementObj.width && b._htmlElementObj.height) {
					var d = cc._renderContext;
					cc.glBindTexture2D(b), d.pixelStorei(d.UNPACK_ALIGNMENT, 4), a && d.pixelStorei(d.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), d.texImage2D(d.TEXTURE_2D, 0, d.RGBA, d.RGBA, d.UNSIGNED_BYTE, b._htmlElementObj), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.LINEAR), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, d.LINEAR), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE), b.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE), cc.glBindTexture2D(null), a && d.pixelStorei(d.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
					var e = b._htmlElementObj.width,
						f = b._htmlElementObj.height;
					b._pixelsWide = b._contentSize.width = e, b._pixelsHigh = b._contentSize.height = f, b._pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888, b.maxS = 1, b.maxT = 1, b._hasPremultipliedAlpha = a, b._hasMipmaps = !1, b.dispatchEvent("load")
				}
			}
		},
		initWithString: function(a, b, c, d, e, f) {
			return cc.log(cc._LogInfos.Texture2D_initWithString), null
		},
		initWithETCFile: function(a) {
			return cc.log(cc._LogInfos.Texture2D_initWithETCFile_2), !1
		},
		initWithPVRFile: function(a) {
			return cc.log(cc._LogInfos.Texture2D_initWithPVRFile_2), !1
		},
		initWithPVRTCData: function(a, b, c, d, e, f) {
			return cc.log(cc._LogInfos.Texture2D_initWithPVRTCData_2), !1
		},
		setTexParameters: function(a, b, c, d) {
			var e = this,
				f = cc._renderContext;
			void 0 !== b && (a = {
				minFilter: a,
				magFilter: b,
				wrapS: c,
				wrapT: d
			}), cc.assert(e._pixelsWide === cc.NextPOT(e._pixelsWide) && e._pixelsHigh === cc.NextPOT(e._pixelsHigh) || a.wrapS === f.CLAMP_TO_EDGE && a.wrapT === f.CLAMP_TO_EDGE, "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures"), cc.glBindTexture2D(e), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, a.minFilter), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, a.magFilter), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, a.wrapS), f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, a.wrapT)
		},
		setAntiAliasTexParameters: function() {
			var a = cc._renderContext;
			cc.glBindTexture2D(this), this._hasMipmaps ? a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_NEAREST) : a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR)
		},
		setAliasTexParameters: function() {
			var a = cc._renderContext;
			cc.glBindTexture2D(this), this._hasMipmaps ? a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST_MIPMAP_NEAREST) : a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST)
		},
		generateMipmap: function() {
			var a = this;
			cc.assert(a._pixelsWide === cc.NextPOT(a._pixelsWide) && a._pixelsHigh === cc.NextPOT(a._pixelsHigh), "Mimpap texture only works in POT textures"), cc.glBindTexture2D(a), cc._renderContext.generateMipmap(cc._renderContext.TEXTURE_2D), a._hasMipmaps = !0
		},
		stringForFormat: function() {
			return cc.Texture2D._M[this._pixelFormat]
		},
		bitsPerPixelForFormat: function(a) {
			a = a || this._pixelFormat;
			var b = cc.Texture2D._B[a];
			return null != b ? b : (cc.log(cc._LogInfos.Texture2D_bitsPerPixelForFormat, a), -1)
		},
		_initPremultipliedATextureWithImage: function(a, b, c) {
			var d, e = cc.Texture2D,
				f = a.getData(),
				g = null,
				h = null,
				i = a.hasAlpha(),
				j = cc.size(a.getWidth(), a.getHeight()),
				k = e.defaultPixelFormat,
				l = a.getBitsPerComponent();
			i || (l >= 8 ? k = e.PIXEL_FORMAT_RGB888 : (cc.log(cc._LogInfos.Texture2D__initPremultipliedATextureWithImage), k = e.PIXEL_FORMAT_RGB565));
			var m = b * c;
			if (k === e.PIXEL_FORMAT_RGB565) if (i) for (f = new Uint16Array(b * c), g = a.getData(), d = 0; m > d; ++d) f[d] = (g[d] >> 0 & 255) >> 3 << 11 | (g[d] >> 8 & 255) >> 2 << 5 | (g[d] >> 16 & 255) >> 3 << 0;
			else for (f = new Uint16Array(b * c), h = a.getData(), d = 0; m > d; ++d) f[d] = (255 & h[d]) >> 3 << 11 | (255 & h[d]) >> 2 << 5 | (255 & h[d]) >> 3 << 0;
			else if (k === e.PIXEL_FORMAT_RGBA4444) for (f = new Uint16Array(b * c), g = a.getData(), d = 0; m > d; ++d) f[d] = (g[d] >> 0 & 255) >> 4 << 12 | (g[d] >> 8 & 255) >> 4 << 8 | (g[d] >> 16 & 255) >> 4 << 4 | (g[d] >> 24 & 255) >> 4 << 0;
			else if (k === e.PIXEL_FORMAT_RGB5A1) for (f = new Uint16Array(b * c), g = a.getData(), d = 0; m > d; ++d) f[d] = (g[d] >> 0 & 255) >> 3 << 11 | (g[d] >> 8 & 255) >> 3 << 6 | (g[d] >> 16 & 255) >> 3 << 1 | (g[d] >> 24 & 255) >> 7 << 0;
			else if (k === e.PIXEL_FORMAT_A8) for (f = new Uint8Array(b * c), g = a.getData(), d = 0; m > d; ++d) f[d] = g >> 24 & 255;
			if (i && k === e.PIXEL_FORMAT_RGB888) for (g = a.getData(), f = new Uint8Array(b * c * 3), d = 0; m > d; ++d) f[3 * d] = g >> 0 & 255, f[3 * d + 1] = g >> 8 & 255, f[3 * d + 2] = g >> 16 & 255;
			return this.initWithData(f, k, b, c, j), f != a.getData() && (f = null), this._hasPremultipliedAlpha = a.isPremultipliedAlpha(), !0
		},
		addLoadedEventListener: function(a, b) {
			this.addEventListener("load", a, b)
		},
		removeLoadedEventListener: function(a) {
			this.removeEventListener("load", a)
		}
	})
}, cc._tmp.WebGLTextureAtlas = function() {
	var a = cc.TextureAtlas.prototype;
	a._setupVBO = function() {
		var a = this,
			b = cc._renderContext;
		a._buffersVBO[0] = b.createBuffer(), a._buffersVBO[1] = b.createBuffer(), a._quadsWebBuffer = b.createBuffer(), a._mapBuffers()
	}, a._mapBuffers = function() {
		var a = this,
			b = cc._renderContext;
		b.bindBuffer(b.ARRAY_BUFFER, a._quadsWebBuffer), b.bufferData(b.ARRAY_BUFFER, a._quadsArrayBuffer, b.DYNAMIC_DRAW), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, a._buffersVBO[1]), b.bufferData(b.ELEMENT_ARRAY_BUFFER, a._indices, b.STATIC_DRAW)
	}, a.drawNumberOfQuads = function(a, b) {
		var c = this;
		if (b = b || 0, 0 !== a && c.texture && c.texture.isLoaded()) {
			var d = cc._renderContext;
			cc.glBindTexture2D(c.texture), cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX), d.bindBuffer(d.ARRAY_BUFFER, c._quadsWebBuffer), c.dirty && (d.bufferData(d.ARRAY_BUFFER, c._quadsArrayBuffer, d.DYNAMIC_DRAW), c.dirty = !1), d.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, d.FLOAT, !1, 24, 0), d.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, d.UNSIGNED_BYTE, !0, 24, 12), d.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, d.FLOAT, !1, 24, 16), d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, c._buffersVBO[1]), cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP ? d.drawElements(d.TRIANGLE_STRIP, 6 * a, d.UNSIGNED_SHORT, 6 * b * c._indices.BYTES_PER_ELEMENT) : d.drawElements(d.TRIANGLES, 6 * a, d.UNSIGNED_SHORT, 6 * b * c._indices.BYTES_PER_ELEMENT), cc.g_NumberOfDraws++
		}
	}
}, cc._tmp.WebGLTextureCache = function() {
	var a = cc.textureCache;
	a.handleLoadedTexture = function(a) {
		var b, c, d = this._textures;
		cc._rendererInitialized || (d = this._loadedTexturesBefore), b = d[a], b || (b = d[a] = new cc.Texture2D, b.url = a), c = cc.path.extname(a), ".png" === c ? b.handleLoadedTexture(!0) : b.handleLoadedTexture()
	}, a.addImage = function(a, b, c) {
		cc.assert(a, cc._LogInfos.Texture2D_addImage_2);
		var d = this._textures;
		cc._rendererInitialized || (d = this._loadedTexturesBefore);
		var e = d[a] || d[cc.loader._aliases[a]];
		if (e) return e.isLoaded() ? (b && b.call(c, e), e) : (e.addEventListener("load", function() {
			b && b.call(c, e)
		}, c), e);
		e = d[a] = new cc.Texture2D, e.url = a;
		var f = cc.loader._checkIsImageURL(a) ? cc.loader.load : cc.loader.loadImg;
		return f.call(cc.loader, a, function(e, f) {
			if (e) return b && b.call(c, e);
			cc.textureCache.handleLoadedTexture(a);
			var g = d[a];
			b && b.call(c, g)
		}), e
	}, a.addImageAsync = a.addImage, a = null
}, cc.ALIGN_CENTER = 51, cc.ALIGN_TOP = 19, cc.ALIGN_TOP_RIGHT = 18, cc.ALIGN_RIGHT = 50, cc.ALIGN_BOTTOM_RIGHT = 34, cc.ALIGN_BOTTOM = 35, cc.ALIGN_BOTTOM_LEFT = 33, cc.ALIGN_LEFT = 49, cc.ALIGN_TOP_LEFT = 17, cc.PVRHaveAlphaPremultiplied_ = !1, cc._renderType === cc._RENDER_TYPE_CANVAS ? (cc.Texture2D = cc.Class.extend({
	_contentSize: null,
	_textureLoaded: !1,
	_htmlElementObj: null,
	url: null,
	_pattern: null,
	ctor: function() {
		this._contentSize = cc.size(0, 0), this._textureLoaded = !1, this._htmlElementObj = null, this._pattern = ""
	},
	getPixelsWide: function() {
		return this._contentSize.width
	},
	getPixelsHigh: function() {
		return this._contentSize.height
	},
	getContentSize: function() {
		var a = cc.contentScaleFactor();
		return cc.size(this._contentSize.width / a, this._contentSize.height / a)
	},
	_getWidth: function() {
		return this._contentSize.width / cc.contentScaleFactor()
	},
	_getHeight: function() {
		return this._contentSize.height / cc.contentScaleFactor()
	},
	getContentSizeInPixels: function() {
		return this._contentSize
	},
	initWithElement: function(a) {
		a && (this._htmlElementObj = a, this._contentSize.width = a.width, this._contentSize.height = a.height, this._textureLoaded = !0)
	},
	getHtmlElementObj: function() {
		return this._htmlElementObj
	},
	isLoaded: function() {
		return this._textureLoaded
	},
	handleLoadedTexture: function() {
		var a = this;
		if (!a._textureLoaded) {
			if (!a._htmlElementObj) {
				var b = cc.loader.getRes(a.url);
				if (!b) return;
				a.initWithElement(b)
			}
			var c = a._htmlElementObj;
			a._contentSize.width = c.width, a._contentSize.height = c.height, a.dispatchEvent("load")
		}
	},
	description: function() {
		return "<cc.Texture2D | width = " + this._contentSize.width + " height " + this._contentSize.height + ">"
	},
	initWithData: function(a, b, c, d, e) {
		return !1
	},
	initWithImage: function(a) {
		return !1
	},
	initWithString: function(a, b, c, d, e, f) {
		return !1
	},
	releaseTexture: function() {
		cc.loader.release(this.url)
	},
	getName: function() {
		return null
	},
	getMaxS: function() {
		return 1
	},
	setMaxS: function(a) {},
	getMaxT: function() {
		return 1
	},
	setMaxT: function(a) {},
	getPixelFormat: function() {
		return null
	},
	getShaderProgram: function() {
		return null
	},
	setShaderProgram: function(a) {},
	hasPremultipliedAlpha: function() {
		return !1
	},
	hasMipmaps: function() {
		return !1
	},
	releaseData: function(a) {
		a = null
	},
	keepData: function(a, b) {
		return a
	},
	drawAtPoint: function(a) {},
	drawInRect: function(a) {},
	initWithETCFile: function(a) {
		return cc.log(cc._LogInfos.Texture2D_initWithETCFile), !1
	},
	initWithPVRFile: function(a) {
		return cc.log(cc._LogInfos.Texture2D_initWithPVRFile), !1
	},
	initWithPVRTCData: function(a, b, c, d, e, f) {
		return cc.log(cc._LogInfos.Texture2D_initWithPVRTCData), !1
	},
	setTexParameters: function(a, b, c, d) {
		return void 0 !== b && (a = {
			minFilter: a,
			magFilter: b,
			wrapS: c,
			wrapT: d
		}), a.wrapS === cc.REPEAT && a.wrapT === cc.REPEAT ? void(this._pattern = "repeat") : a.wrapS === cc.REPEAT ? void(this._pattern = "repeat-x") : a.wrapT === cc.REPEAT ? void(this._pattern = "repeat-y") : void(this._pattern = "")
	},
	setAntiAliasTexParameters: function() {},
	setAliasTexParameters: function() {},
	generateMipmap: function() {},
	stringForFormat: function() {
		return ""
	},
	bitsPerPixelForFormat: function(a) {
		return -1
	},
	addLoadedEventListener: function(a, b) {
		this.addEventListener("load", a, b)
	},
	removeLoadedEventListener: function(a) {
		this.removeEventListener("load", a)
	},
	_grayElementObj: null,
	_backupElement: null,
	_isGray: !1,
	_switchToGray: function(a) {
		this._textureLoaded && this._isGray !== a && (this._isGray = a, this._isGray ? (this._backupElement = this._htmlElementObj, this._grayElementObj || (this._grayElementObj = cc.Texture2D._generateGrayTexture(this._htmlElementObj)), this._htmlElementObj = this._grayElementObj) : null !== this._backupElement && (this._htmlElementObj = this._backupElement))
	}
}), cc.Texture2D._generateGrayTexture = function(a, b, c) {
	if (null === a) return null;
	c = c || cc.newElement("canvas"), b = b || cc.rect(0, 0, a.width, a.height), c.width = b.width, c.height = b.height;
	var d = c.getContext("2d");
	d.drawImage(a, b.x, b.y, b.width, b.height, 0, 0, b.width, b.height);
	for (var e = d.getImageData(0, 0, b.width, b.height), f = e.data, g = 0, h = f.length; h > g; g += 4) f[g] = f[g + 1] = f[g + 2] = .34 * f[g] + .5 * f[g + 1] + .16 * f[g + 2];
	return d.putImageData(e, 0, 0), c
}) : (cc.assert(cc.isFunction(cc._tmp.WebGLTexture2D), cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTexture2D(), delete cc._tmp.WebGLTexture2D), cc.EventHelper.prototype.apply(cc.Texture2D.prototype), cc.assert(cc.isFunction(cc._tmp.PrototypeTexture2D), cc._LogInfos.MissingFile, "TexturesPropertyDefine.js"), cc._tmp.PrototypeTexture2D(), delete cc._tmp.PrototypeTexture2D, cc.textureCache = {
	_textures: {},
	_textureColorsCache: {},
	_textureKeySeq: 0 | 1e3 * Math.random(),
	_loadedTexturesBefore: {},
	_initializingRenderer: function() {
		var a, b = this._loadedTexturesBefore,
			c = this._textures;
		for (a in b) {
			var d = b[a];
			d.handleLoadedTexture(), c[a] = d
		}
		this._loadedTexturesBefore = {}
	},
	addPVRTCImage: function(a) {
		cc.log(cc._LogInfos.textureCache_addPVRTCImage)
	},
	addETCImage: function(a) {
		cc.log(cc._LogInfos.textureCache_addETCImage)
	},
	description: function() {
		return "<TextureCache | Number of textures = " + this._textures.length + ">"
	},
	textureForKey: function(a) {
		return cc.log(cc._LogInfos.textureCache_textureForKey), this.getTextureForKey(a)
	},
	getTextureForKey: function(a) {
		return this._textures[a] || this._textures[cc.loader._aliases[a]]
	},
	getKeyByTexture: function(a) {
		for (var b in this._textures) if (this._textures[b] === a) return b;
		return null
	},
	_generalTextureKey: function() {
		return this._textureKeySeq++, "_textureKey_" + this._textureKeySeq
	},
	getTextureColors: function(a) {
		var b = this.getKeyByTexture(a);
		return b || (b = a instanceof HTMLImageElement ? a.src : this._generalTextureKey()), this._textureColorsCache[b] || (this._textureColorsCache[b] = cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor(a)), this._textureColorsCache[b]
	},
	addPVRImage: function(a) {
		cc.log(cc._LogInfos.textureCache_addPVRImage)
	},
	removeAllTextures: function() {
		var a = this._textures;
		for (var b in a) a[b] && a[b].releaseTexture();
		this._textures = {}
	},
	removeTexture: function(a) {
		if (a) {
			var b = this._textures;
			for (var c in b) b[c] === a && (b[c].releaseTexture(), delete b[c])
		}
	},
	removeTextureForKey: function(a) {
		null != a && this._textures[a] && delete this._textures[a]
	},
	cacheImage: function(a, b) {
		if (b instanceof cc.Texture2D) return void(this._textures[a] = b);
		var c = new cc.Texture2D;
		c.initWithElement(b), c.handleLoadedTexture(), this._textures[a] = c
	},
	addUIImage: function(a, b) {
		if (cc.assert(a, cc._LogInfos.textureCache_addUIImage_2), b && this._textures[b]) return this._textures[b];
		var c = new cc.Texture2D;
		return c.initWithImage(a), null != b ? this._textures[b] = c : cc.log(cc._LogInfos.textureCache_addUIImage), c
	},
	dumpCachedTextureInfo: function() {
		var a = 0,
			b = 0,
			c = this._textures;
		for (var d in c) {
			var e = c[d];
			a++, e.getHtmlElementObj() instanceof HTMLImageElement ? cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo, d, e.getHtmlElementObj().src, e.pixelsWidth, e.pixelsHeight) : cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_2, d, e.pixelsWidth, e.pixelsHeight), b += e.pixelsWidth * e.pixelsHeight * 4
		}
		var f = this._textureColorsCache;
		for (d in f) {
			var g = f[d];
			for (var h in g) {
				var i = g[h];
				a++, cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_2, d, i.width, i.height), b += i.width * i.height * 4
			}
		}
		cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_3, a, b / 1024, (b / 1048576).toFixed(2))
	},
	_clear: function() {
		this._textures = {}, this._textureColorsCache = {}, this._textureKeySeq = 0 | 1e3 * Math.random(), this._loadedTexturesBefore = {}
	}
}, cc._renderType === cc._RENDER_TYPE_CANVAS) {
	var _p = cc.textureCache;
	_p.handleLoadedTexture = function(a) {
		var b = this._textures,
			c = b[a];
		c || (c = b[a] = new cc.Texture2D, c.url = a), c.handleLoadedTexture()
	}, _p.addImage = function(a, b, c) {
		cc.assert(a, cc._LogInfos.Texture2D_addImage);
		var d = this._textures,
			e = d[a] || d[cc.loader._aliases[a]];
		if (e) return e.isLoaded() ? (b && b.call(c, e), e) : (e.addEventListener("load", function() {
			b && b.call(c, e)
		}, c), e);
		e = d[a] = new cc.Texture2D, e.url = a;
		var f = cc.loader._checkIsImageURL(a) ? cc.loader.load : cc.loader.loadImg;
		return f.call(cc.loader, a, function(e, f) {
			if (e) return b && b.call(c, e);
			cc.textureCache.handleLoadedTexture(a);
			var g = d[a];
			b && b.call(c, g)
		}), e
	}, _p.addImageAsync = _p.addImage, _p = null
} else cc.assert(cc.isFunction(cc._tmp.WebGLTextureCache), cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTextureCache(), delete cc._tmp.WebGLTextureCache;
if (cc.Scene = cc.Node.extend({
	_className: "Scene",
	ctor: function() {
		cc.Node.prototype.ctor.call(this), this._ignoreAnchorPointForPosition = !0, this.setAnchorPoint(.5, .5), this.setContentSize(cc.director.getWinSize())
	}
}), cc.Scene.create = function() {
	return new cc.Scene
}, cc.LoaderScene = cc.Scene.extend({
	_interval: null,
	_label: null,
	_className: "LoaderScene",
	cb: null,
	target: null,
	init: function() {
		var a = this,
			b = 160,
			c = 200,
			d = a._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
		a.addChild(d, 0);
		var e = 24,
			f = -c / 2 + 100;
		cc._loaderImage && (cc.loader.loadImg(cc._loaderImage, {
			isCrossOrigin: !1
		}, function(d, e) {
			b = e.width, c = e.height, a._initStage(e, cc.visibleRect.center)
		}), e = 14, f = -c / 2 - 10);
		var g = a._label = new cc.LabelTTF("Loading... 0%", "Arial", e);
		return g.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, f))), g.setColor(cc.color(180, 180, 180)), d.addChild(this._label, 10), !0
	},
	_initStage: function(a, b) {
		var c = this,
			d = c._texture2d = new cc.Texture2D;
		d.initWithElement(a), d.handleLoadedTexture();
		var e = c._logo = new cc.Sprite(d);
		e.setScale(cc.contentScaleFactor()), e.x = b.x, e.y = b.y, c._bgLayer.addChild(e, 10)
	},
	onEnter: function() {
		var a = this;
		cc.Node.prototype.onEnter.call(a), a.schedule(a._startLoading, .3)
	},
	onExit: function() {
		cc.Node.prototype.onExit.call(this);
		var a = "Loading... 0%";
		this._label.setString(a)
	},
	initWithResources: function(a, b, c) {
		cc.isString(a) && (a = [a]), this.resources = a || [], this.cb = b, this.target = c
	},
	_startLoading: function() {
		var a = this;
		a.unschedule(a._startLoading);
		var b = a.resources;
		cc.loader.load(b, function(b, c, d) {
			var e = d / c * 100 | 0;
			e = Math.min(e, 100), a._label.setString("Loading... " + e + "%")
		}, function() {
			a.cb && a.cb.call(a.target)
		})
	}
}), cc.LoaderScene.preload = function(a, b, c) {
	var d = cc;
	return d.loaderScene || (d.loaderScene = new cc.LoaderScene, d.loaderScene.init()), d.loaderScene.initWithResources(a, b, c), cc.director.runScene(d.loaderScene), d.loaderScene
}, cc.Layer = cc.Node.extend({
	_className: "Layer",
	ctor: function() {
		var a = cc.Node.prototype;
		a.ctor.call(this), this._ignoreAnchorPointForPosition = !0, a.setAnchorPoint.call(this, .5, .5), a.setContentSize.call(this, cc.winSize)
	},
	init: function() {
		var a = this;
		return a._ignoreAnchorPointForPosition = !0, a.setAnchorPoint(.5, .5), a.setContentSize(cc.winSize), a._cascadeColorEnabled = !1, a._cascadeOpacityEnabled = !1, !0
	},
	bake: function() {
		this._renderCmd.bake()
	},
	unbake: function() {
		this._renderCmd.unbake()
	},
	isBaked: function() {
		return this._renderCmd._isBaked
	},
	addChild: function(a, b, c) {
		cc.Node.prototype.addChild.call(this, a, b, c), this._renderCmd._bakeForAddChild(a)
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.Layer.CanvasRenderCmd(this) : new cc.Layer.WebGLRenderCmd(this)
	}
}), cc.Layer.create = function() {
	return new cc.Layer
}, cc.LayerColor = cc.Layer.extend({
	_blendFunc: null,
	_className: "LayerColor",
	getBlendFunc: function() {
		return this._blendFunc
	},
	changeWidthAndHeight: function(a, b) {
		this.width = a, this.height = b
	},
	changeWidth: function(a) {
		this.width = a
	},
	changeHeight: function(a) {
		this.height = a
	},
	setOpacityModifyRGB: function(a) {},
	isOpacityModifyRGB: function() {
		return !1
	},
	ctor: function(a, b, c) {
		cc.Layer.prototype.ctor.call(this), this._blendFunc = new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA), cc.LayerColor.prototype.init.call(this, a, b, c)
	},
	init: function(a, b, c) {
		cc._renderType !== cc._RENDER_TYPE_CANVAS && (this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR));
		var d = cc.director.getWinSize();
		a = a || cc.color(0, 0, 0, 255), b = void 0 === b ? d.width : b, c = void 0 === c ? d.height : c;
		var e = this._realColor;
		return e.r = a.r, e.g = a.g, e.b = a.b, this._realOpacity = a.a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty), cc.LayerColor.prototype.setContentSize.call(this, b, c), !0
	},
	setBlendFunc: function(a, b) {
		var c = this._blendFunc;
		void 0 === b ? (c.src = a.src, c.dst = a.dst) : (c.src = a, c.dst = b), this._renderCmd.updateBlendFunc(c)
	},
	_setWidth: function(a) {
		cc.Node.prototype._setWidth.call(this, a), this._renderCmd._updateSquareVerticesWidth(a)
	},
	_setHeight: function(a) {
		cc.Node.prototype._setHeight.call(this, a), this._renderCmd._updateSquareVerticesHeight(a)
	},
	setContentSize: function(a, b) {
		cc.Layer.prototype.setContentSize.call(this, a, b), this._renderCmd._updateSquareVertices(a, b)
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.LayerColor.CanvasRenderCmd(this) : new cc.LayerColor.WebGLRenderCmd(this)
	}
}), cc.LayerColor.create = function(a, b, c) {
	return new cc.LayerColor(a, b, c)
}, function() {
	var a = cc.LayerColor.prototype;
	cc.defineGetterSetter(a, "width", a._getWidth, a._setWidth), cc.defineGetterSetter(a, "height", a._getHeight, a._setHeight)
}(), cc.LayerGradient = cc.LayerColor.extend({
	_endColor: null,
	_startOpacity: 255,
	_endOpacity: 255,
	_alongVector: null,
	_compressedInterpolation: !1,
	_className: "LayerGradient",
	_colorStops: [],
	ctor: function(a, b, c, d) {
		cc.LayerColor.prototype.ctor.call(this), this._endColor = cc.color(0, 0, 0, 255), this._alongVector = cc.p(0, -1), this._startOpacity = 255, this._endOpacity = 255, d && d instanceof Array ? (this._colorStops = d, d.splice(0, 0, {
			p: 0,
			color: a || cc.color.BLACK
		}), d.push({
			p: 1,
			color: b || cc.color.BLACK
		})) : this._colorStops = [{
			p: 0,
			color: a || cc.color.BLACK
		}, {
			p: 1,
			color: b || cc.color.BLACK
		}], cc.LayerGradient.prototype.init.call(this, a, b, c, d)
	},
	init: function(a, b, c, d) {
		a = a || cc.color(0, 0, 0, 255), b = b || cc.color(0, 0, 0, 255), c = c || cc.p(0, -1);
		var e = this,
			f = e._endColor;
		return e._startOpacity = a.a, f.r = b.r, f.g = b.g, f.b = b.b, e._endOpacity = b.a, e._alongVector = c, e._compressedInterpolation = !0, cc.LayerColor.prototype.init.call(e, cc.color(a.r, a.g, a.b, 255)), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty | cc.Node._dirtyFlags.gradientDirty), !0
	},
	setContentSize: function(a, b) {
		cc.LayerColor.prototype.setContentSize.call(this, a, b), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty)
	},
	_setWidth: function(a) {
		cc.LayerColor.prototype._setWidth.call(this, a), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty)
	},
	_setHeight: function(a) {
		cc.LayerColor.prototype._setHeight.call(this, a), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty)
	},
	getStartColor: function() {
		return cc.color(this._realColor)
	},
	setStartColor: function(a) {
		this.color = a;
		var b = this._colorStops;
		if (b && b.length > 0) {
			var c = b[0].color;
			c.r = a.r, c.g = a.g, c.b = a.b
		}
	},
	setEndColor: function(a) {
		var b = this._endColor;
		b.r = a.r, b.g = a.g, b.b = a.b;
		var c = this._colorStops;
		if (c && c.length > 0) {
			var d = c[c.length - 1].color;
			d.r = a.r, d.g = a.g, d.b = a.b
		}
		this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty)
	},
	getEndColor: function() {
		return cc.color(this._endColor)
	},
	setStartOpacity: function(a) {
		this._startOpacity = a;
		var b = this._colorStops;
		b && b.length > 0 && (b[0].color.a = a), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty)
	},
	getStartOpacity: function() {
		return this._startOpacity
	},
	setEndOpacity: function(a) {
		this._endOpacity = a;
		var b = this._colorStops;
		b && b.length > 0 && (b[b.length - 1].color.a = a), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty)
	},
	getEndOpacity: function() {
		return this._endOpacity
	},
	setVector: function(a) {
		this._alongVector.x = a.x, this._alongVector.y = a.y, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty)
	},
	getVector: function() {
		return cc.p(this._alongVector.x, this._alongVector.y)
	},
	isCompressedInterpolation: function() {
		return this._compressedInterpolation
	},
	setCompressedInterpolation: function(a) {
		this._compressedInterpolation = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty)
	},
	getColorStops: function() {
		return this._colorStops
	},
	setColorStops: function(a) {
		this._colorStops = a, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty | cc.Node._dirtyFlags.gradientDirty)
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.LayerGradient.CanvasRenderCmd(this) : new cc.LayerGradient.WebGLRenderCmd(this)
	}
}), cc.LayerGradient.create = function(a, b, c, d) {
	return new cc.LayerGradient(a, b, c, d)
}, function() {
	var a = cc.LayerGradient.prototype;
	a.startColor, cc.defineGetterSetter(a, "startColor", a.getStartColor, a.setStartColor), a.endColor, cc.defineGetterSetter(a, "endColor", a.getEndColor, a.setEndColor), a.startOpacity, cc.defineGetterSetter(a, "startOpacity", a.getStartOpacity, a.setStartOpacity), a.endOpacity, cc.defineGetterSetter(a, "endOpacity", a.getEndOpacity, a.setEndOpacity), a.vector, cc.defineGetterSetter(a, "vector", a.getVector, a.setVector), a.colorStops, cc.defineGetterSetter(a, "colorStops", a.getColorStops, a.setColorStops)
}(), cc.LayerMultiplex = cc.Layer.extend({
	_enabledLayer: 0,
	_layers: null,
	_className: "LayerMultiplex",
	ctor: function(a) {
		cc.Layer.prototype.ctor.call(this), a instanceof Array ? cc.LayerMultiplex.prototype.initWithLayers.call(this, a) : cc.LayerMultiplex.prototype.initWithLayers.call(this, Array.prototype.slice.call(arguments))
	},
	initWithLayers: function(a) {
		return a.length > 0 && null == a[a.length - 1] && cc.log(cc._LogInfos.LayerMultiplex_initWithLayers), this._layers = a, this._enabledLayer = 0, this.addChild(this._layers[this._enabledLayer]), !0
	},
	switchTo: function(a) {
		return a >= this._layers.length ? void cc.log(cc._LogInfos.LayerMultiplex_switchTo) : (this.removeChild(this._layers[this._enabledLayer], !0), this._enabledLayer = a, void this.addChild(this._layers[a]))
	},
	switchToAndReleaseMe: function(a) {
		return a >= this._layers.length ? void cc.log(cc._LogInfos.LayerMultiplex_switchToAndReleaseMe) : (this.removeChild(this._layers[this._enabledLayer], !0), this._layers[this._enabledLayer] = null, this._enabledLayer = a, void this.addChild(this._layers[a]))
	},
	addLayer: function(a) {
		return a ? void this._layers.push(a) : void cc.log(cc._LogInfos.LayerMultiplex_addLayer)
	}
}), cc.LayerMultiplex.create = function() {
	return new cc.LayerMultiplex(Array.prototype.slice.call(arguments))
}, function() {
	cc.Layer.CanvasRenderCmd = function(a) {
		cc.Node.CanvasRenderCmd.call(this, a), this._isBaked = !1, this._bakeSprite = null, this._updateCache = 2
	};
	var a = cc.Layer.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
	a.constructor = cc.Layer.CanvasRenderCmd, a._setCacheDirty = function(a) {
		if (a && 0 === this._updateCache && (this._updateCache = 2), this._cacheDirty === !1) {
			this._cacheDirty = !0;
			var b = this._cachedParent;
			b && b !== this && b._setNodeDirtyForCache && b._setNodeDirtyForCache()
		}
	}, a.transform = function(a, b) {
		var c = this._worldTransform,
			d = c.a,
			e = c.b,
			f = c.c,
			g = c.d;
		c.tx, c.ty;
		cc.Node.CanvasRenderCmd.prototype.transform.call(this, a, b), c.a === d && c.b === e && c.c === f && c.d === g || 0 !== this._updateCache || (this._updateCache = 2)
	}, a.bake = function() {
		if (!this._isBaked) {
			this._needDraw = !0, cc.renderer.childrenOrderDirty = !0, this._isBaked = this._cacheDirty = !0, 0 === this._updateCache && (this._updateCache = 2);
			for (var a = this._node._children, b = 0, c = a.length; c > b; b++) a[b]._renderCmd._setCachedParent(this);
			this._bakeSprite || (this._bakeSprite = new cc.BakeSprite, this._bakeSprite.setAnchorPoint(0, 0))
		}
	}, a.unbake = function() {
		if (this._isBaked) {
			cc.renderer.childrenOrderDirty = !0, this._needDraw = !1, this._isBaked = !1, this._cacheDirty = !0, 0 === this._updateCache && (this._updateCache = 2);
			for (var a = this._node._children, b = 0, c = a.length; c > b; b++) a[b]._renderCmd._setCachedParent(null)
		}
	}, a.isBaked = function() {
		return this._isBaked
	}, a.rendering = function() {
		if (this._cacheDirty) {
			var a = this._node,
				b = a._children,
				c = this._bakeSprite;
			this.transform(this.getParentRenderCmd(), !0);
			var d = this._getBoundingBoxForBake();
			d.width = 0 | d.width + .5, d.height = 0 | d.height + .5;
			var e = c.getCacheContext(),
				f = e.getContext();
			if (c.setPosition(d.x, d.y), this._updateCache > 0) {
				c.resetCanvasSize(d.width, d.height), e.setOffset(0 - d.x, f.canvas.height - d.height + d.y), a.sortAllChildren(), cc.renderer._turnToCacheMode(this.__instanceId);
				for (var g = 0, h = b.length; h > g; g++) b[g].visit(this);
				cc.renderer._renderingToCacheCanvas(e, this.__instanceId), c.transform(), this._updateCache--
			}
			this._cacheDirty = !1
		}
	}, a.visit = function(a) {
		if (!this._isBaked) return void cc.Node.CanvasRenderCmd.prototype.visit.call(this, a);
		var b = this._node,
			c = b._children,
			d = c.length;
		b._visible && 0 !== d && (this._syncStatus(a), cc.renderer.pushRenderCommand(this), this._cacheDirty = !0, 0 === this._updateCache && (this._updateCache = 2), this._bakeSprite.visit(this), this._dirtyFlag = 0)
	}, a._bakeForAddChild = function(a) {
		a._parent === this._node && this._isBaked && a._renderCmd._setCachedParent(this)
	}, a._getBoundingBoxForBake = function() {
		var a = null,
			b = this._node;
		if (!b._children || 0 === b._children.length) return cc.rect(0, 0, 10, 10);
		for (var c = b.getNodeToWorldTransform(), d = b._children, e = 0, f = d.length; f > e; e++) {
			var g = d[e];
			if (g && g._visible) if (a) {
				var h = g._getBoundingBoxToCurrentNode(c);
				h && (a = cc.rectUnion(a, h))
			} else a = g._getBoundingBoxToCurrentNode(c)
		}
		return a
	}
}(), function() {
	cc.LayerColor.CanvasRenderCmd = function(a) {
		cc.Layer.CanvasRenderCmd.call(this, a), this._needDraw = !0, this._blendFuncStr = "source-over", this._bakeRenderCmd = new cc.CustomRenderCmd(this, this._bakeRendering)
	};
	var a = cc.LayerColor.CanvasRenderCmd.prototype = Object.create(cc.Layer.CanvasRenderCmd.prototype);
	a.constructor = cc.LayerColor.CanvasRenderCmd, a.unbake = function() {
		cc.Layer.CanvasRenderCmd.prototype.unbake.call(this), this._needDraw = !0
	}, a.rendering = function(a, b, c) {
		var d = a || cc._renderContext,
			e = d.getContext(),
			f = this._node,
			g = this._displayedColor,
			h = this._displayedOpacity / 255,
			i = f._contentSize.width,
			j = f._contentSize.height;
		0 !== h && (d.setCompositeOperation(this._blendFuncStr), d.setGlobalAlpha(h), d.setFillStyle("rgba(" + (0 | g.r) + "," + (0 | g.g) + "," + (0 | g.b) + ", 1)"), d.setTransform(this._worldTransform, b, c), e.fillRect(0, 0, i * b, -j * c), cc.g_NumberOfDraws++)
	}, a.updateBlendFunc = function(a) {
		this._blendFuncStr = cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(a)
	}, a._updateSquareVertices = a._updateSquareVerticesWidth = a._updateSquareVerticesHeight = function() {}, a._bakeRendering = function() {
		if (this._cacheDirty) {
			var a, b = this._node,
				c = this._bakeSprite,
				d = b._children,
				e = d.length;
			this.transform(this.getParentRenderCmd(), !0);
			var f = this._getBoundingBoxForBake();
			f.width = 0 | f.width + .5, f.height = 0 | f.height + .5;
			var g = c.getCacheContext(),
				h = g.getContext();
			if (c.setPosition(f.x, f.y), this._updateCache > 0) {
				h.fillStyle = g._currentFillStyle, c.resetCanvasSize(f.width, f.height), g.setOffset(0 - f.x, h.canvas.height - f.height + f.y);
				var i;
				if (cc.renderer._turnToCacheMode(this.__instanceId), e > 0) {
					for (b.sortAllChildren(), a = 0; e > a && (i = d[a], i._localZOrder < 0); a++) i._renderCmd.visit(this);
					for (cc.renderer.pushRenderCommand(this); e > a; a++) d[a]._renderCmd.visit(this)
				} else cc.renderer.pushRenderCommand(this);
				cc.renderer._renderingToCacheCanvas(g, this.__instanceId), c.transform(), this._updateCache--
			}
			this._cacheDirty = !1
		}
	}, a.visit = function(a) {
		if (!this._isBaked) return void cc.Node.CanvasRenderCmd.prototype.visit.call(this);
		var b = this._node;
		b._visible && (this._syncStatus(a), cc.renderer.pushRenderCommand(this._bakeRenderCmd), this._bakeSprite._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty), this._bakeSprite.visit(this), this._dirtyFlag = 0)
	}, a._getBoundingBoxForBake = function() {
		var a = this._node,
			b = cc.rect(0, 0, a._contentSize.width, a._contentSize.height),
			c = a.getNodeToWorldTransform();
		if (b = cc.rectApplyAffineTransform(b, a.getNodeToWorldTransform()), !a._children || 0 === a._children.length) return b;
		for (var d = a._children, e = 0; e < d.length; e++) {
			var f = d[e];
			if (f && f._visible) {
				var g = f._getBoundingBoxToCurrentNode(c);
				b = cc.rectUnion(b, g)
			}
		}
		return b
	}
}(), function() {
	cc.LayerGradient.RenderCmd = {
		updateStatus: function() {
			var a = cc.Node._dirtyFlags,
				b = this._dirtyFlag,
				c = b & a.colorDirty,
				d = b & a.opacityDirty;
			c && this._updateDisplayColor(), d && this._updateDisplayOpacity(), (c || d || b & a.gradientDirty) && this._updateColor(), b & a.transformDirty && this.transform(this.getParentRenderCmd(), !0), this._dirtyFlag = 0
		}
	}
}(), function() {
	cc.LayerGradient.CanvasRenderCmd = function(a) {
		cc.LayerColor.CanvasRenderCmd.call(this, a), this._needDraw = !0, this._startPoint = cc.p(0, 0), this._endPoint = cc.p(0, 0), this._startStopStr = null, this._endStopStr = null
	};
	var a = cc.LayerGradient.CanvasRenderCmd.prototype = Object.create(cc.LayerColor.CanvasRenderCmd.prototype);
	cc.inject(cc.LayerGradient.RenderCmd, a), a.constructor = cc.LayerGradient.CanvasRenderCmd, a.rendering = function(a, b, c) {
		var d = a || cc._renderContext,
			e = d.getContext(),
			f = this._node,
			g = this._displayedOpacity / 255;
		if (0 !== g) {
			var h = f._contentSize.width,
				i = f._contentSize.height;
			d.setCompositeOperation(this._blendFuncStr), d.setGlobalAlpha(g);
			var j = e.createLinearGradient(this._startPoint.x * b, this._startPoint.y * c, this._endPoint.x * b, this._endPoint.y * c);
			if (f._colorStops) for (var k = 0; k < f._colorStops.length; k++) {
				var l = f._colorStops[k];
				j.addColorStop(l.p, this._colorStopsStr[k])
			} else j.addColorStop(0, this._startStopStr), j.addColorStop(1, this._endStopStr);
			d.setFillStyle(j), d.setTransform(this._worldTransform, b, c), e.fillRect(0, 0, h * b, -i * c), cc.g_NumberOfDraws++
		}
	}, a._syncStatus = function(a) {
		var b = cc.Node._dirtyFlags,
			c = this._dirtyFlag,
			d = a ? a._node : null;
		d && d._cascadeColorEnabled && a._dirtyFlag & b.colorDirty && (c |= b.colorDirty), d && d._cascadeOpacityEnabled && a._dirtyFlag & b.opacityDirty && (c |= b.opacityDirty), a && a._dirtyFlag & b.transformDirty && (c |= b.transformDirty);
		var e = c & b.colorDirty,
			f = c & b.opacityDirty;
		this._dirtyFlag = c, e && this._syncDisplayColor(), f && this._syncDisplayOpacity(), c & b.transformDirty && this.transform(a), (e || f || c & b.gradientDirty) && this._updateColor()
	}, a._updateColor = function() {
		var a = this._node,
			b = a._contentSize,
			c = .5 * b.width,
			d = .5 * b.height;
		this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.gradientDirty ^ this._dirtyFlag;
		var e = cc.pAngleSigned(cc.p(0, -1), a._alongVector),
			f = cc.pRotateByAngle(cc.p(0, -1), cc.p(0, 0), e),
			g = Math.min(Math.abs(1 / f.x), Math.abs(1 / f.y));
		this._startPoint.x = c * (-f.x * g) + c, this._startPoint.y = d * (f.y * g) - d, this._endPoint.x = c * (f.x * g) + c, this._endPoint.y = d * (-f.y * g) - d;
		var h = this._displayedColor,
			i = a._endColor,
			j = a._startOpacity / 255,
			k = a._endOpacity / 255;
		if (this._startStopStr = "rgba(" + Math.round(h.r) + "," + Math.round(h.g) + "," + Math.round(h.b) + "," + j.toFixed(4) + ")", this._endStopStr = "rgba(" + Math.round(i.r) + "," + Math.round(i.g) + "," + Math.round(i.b) + "," + k.toFixed(4) + ")", a._colorStops) {
			this._startOpacity = 0, this._endOpacity = 0, this._colorStopsStr = [];
			for (var l = 0; l < a._colorStops.length; l++) {
				var m = a._colorStops[l].color,
					n = null == m.a ? 1 : m.a / 255;
				this._colorStopsStr.push("rgba(" + Math.round(m.r) + "," + Math.round(m.g) + "," + Math.round(m.b) + "," + n.toFixed(4) + ")")
			}
		}
	}
}(), cc._tmp.PrototypeSprite = function() {
	var a = cc.Sprite.prototype;
	cc.defineGetterSetter(a, "opacityModifyRGB", a.isOpacityModifyRGB, a.setOpacityModifyRGB), cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity), cc.defineGetterSetter(a, "color", a.getColor, a.setColor), a.dirty, a.flippedX, cc.defineGetterSetter(a, "flippedX", a.isFlippedX, a.setFlippedX), a.flippedY, cc.defineGetterSetter(a, "flippedY", a.isFlippedY, a.setFlippedY), a.offsetX, cc.defineGetterSetter(a, "offsetX", a._getOffsetX), a.offsetY, cc.defineGetterSetter(a, "offsetY", a._getOffsetY), a.atlasIndex, a.texture, cc.defineGetterSetter(a, "texture", a.getTexture, a.setTexture), a.textureRectRotated, cc.defineGetterSetter(a, "textureRectRotated", a.isTextureRectRotated), a.textureAtlas, a.batchNode, cc.defineGetterSetter(a, "batchNode", a.getBatchNode, a.setBatchNode), a.quad, cc.defineGetterSetter(a, "quad", a.getQuad)
}, cc.Sprite = cc.Node.extend({
	dirty: !1,
	atlasIndex: 0,
	textureAtlas: null,
	_batchNode: null,
	_recursiveDirty: null,
	_hasChildren: null,
	_shouldBeHidden: !1,
	_transformToBatch: null,
	_blendFunc: null,
	_texture: null,
	_rect: null,
	_rectRotated: !1,
	_offsetPosition: null,
	_unflippedOffsetPositionFromCenter: null,
	_opacityModifyRGB: !1,
	_flippedX: !1,
	_flippedY: !1,
	_textureLoaded: !1,
	_className: "Sprite",
	ctor: function(a, b, c) {
		var d = this;
		cc.Node.prototype.ctor.call(d), d._shouldBeHidden = !1, d._offsetPosition = cc.p(0, 0), d._unflippedOffsetPositionFromCenter = cc.p(0, 0), d._blendFunc = {
			src: cc.BLEND_SRC,
			dst: cc.BLEND_DST
		}, d._rect = cc.rect(0, 0, 0, 0), d._softInit(a, b, c)
	},
	textureLoaded: function() {
		return this._textureLoaded
	},
	addLoadedEventListener: function(a, b) {
		this.addEventListener("load", a, b)
	},
	isDirty: function() {
		return this.dirty
	},
	setDirty: function(a) {
		this.dirty = a
	},
	isTextureRectRotated: function() {
		return this._rectRotated
	},
	getAtlasIndex: function() {
		return this.atlasIndex
	},
	setAtlasIndex: function(a) {
		this.atlasIndex = a
	},
	getTextureRect: function() {
		return cc.rect(this._rect)
	},
	getTextureAtlas: function() {
		return this.textureAtlas
	},
	setTextureAtlas: function(a) {
		this.textureAtlas = a
	},
	getOffsetPosition: function() {
		return cc.p(this._offsetPosition)
	},
	_getOffsetX: function() {
		return this._offsetPosition.x
	},
	_getOffsetY: function() {
		return this._offsetPosition.y
	},
	getBlendFunc: function() {
		return this._blendFunc
	},
	initWithSpriteFrame: function(a) {
		cc.assert(a, cc._LogInfos.Sprite_initWithSpriteFrame), a.textureLoaded() || (this._textureLoaded = !1, a.addEventListener("load", this._renderCmd._spriteFrameLoadedCallback, this));
		var b = cc._renderType === cc._RENDER_TYPE_CANVAS ? !1 : a._rotated,
			c = this.initWithTexture(a.getTexture(), a.getRect(), b);
		return this.setSpriteFrame(a), c
	},
	initWithSpriteFrameName: function(a) {
		cc.assert(a, cc._LogInfos.Sprite_initWithSpriteFrameName);
		var b = cc.spriteFrameCache.getSpriteFrame(a);
		return cc.assert(b, a + cc._LogInfos.Sprite_initWithSpriteFrameName1), this.initWithSpriteFrame(b)
	},
	useBatchNode: function(a) {
		this.textureAtlas = a.getTextureAtlas(), this._batchNode = a
	},
	setVertexRect: function(a) {
		var b = this._rect;
		b.x = a.x, b.y = a.y, b.width = a.width, b.height = a.height
	},
	sortAllChildren: function() {
		if (this._reorderChildDirty) {
			var a, b, c, d = this._children,
				e = d.length;
			for (a = 1; e > a; a++) {
				for (c = d[a], b = a - 1; b >= 0;) {
					if (c._localZOrder < d[b]._localZOrder) d[b + 1] = d[b];
					else {
						if (!(c._localZOrder === d[b]._localZOrder && c.arrivalOrder < d[b].arrivalOrder)) break;
						d[b + 1] = d[b]
					}
					b--
				}
				d[b + 1] = c
			}
			this._batchNode && this._arrayMakeObjectsPerformSelector(d, cc.Node._stateCallbackType.sortAllChildren), this._reorderChildDirty = !1
		}
	},
	reorderChild: function(a, b) {
		return cc.assert(a, cc._LogInfos.Sprite_reorderChild_2), -1 === this._children.indexOf(a) ? void cc.log(cc._LogInfos.Sprite_reorderChild) : void(b !== a.zIndex && (this._batchNode && !this._reorderChildDirty && (this._setReorderChildDirtyRecursively(), this._batchNode.reorderBatch(!0)), cc.Node.prototype.reorderChild.call(this, a, b)))
	},
	removeChild: function(a, b) {
		this._batchNode && this._batchNode.removeSpriteFromAtlas(a), cc.Node.prototype.removeChild.call(this, a, b)
	},
	setVisible: function(a) {
		cc.Node.prototype.setVisible.call(this, a), this._renderCmd.setDirtyRecursively(!0)
	},
	removeAllChildren: function(a) {
		var b = this._children,
			c = this._batchNode;
		if (c && null != b) for (var d = 0, e = b.length; e > d; d++) c.removeSpriteFromAtlas(b[d]);
		cc.Node.prototype.removeAllChildren.call(this, a), this._hasChildren = !1
	},
	ignoreAnchorPointForPosition: function(a) {
		return this._batchNode ? void cc.log(cc._LogInfos.Sprite_ignoreAnchorPointForPosition) : void cc.Node.prototype.ignoreAnchorPointForPosition.call(this, a)
	},
	setFlippedX: function(a) {
		this._flippedX !== a && (this._flippedX = a, this.setTextureRect(this._rect, this._rectRotated, this._contentSize), this.setNodeDirty(!0))
	},
	setFlippedY: function(a) {
		this._flippedY !== a && (this._flippedY = a, this.setTextureRect(this._rect, this._rectRotated, this._contentSize), this.setNodeDirty(!0))
	},
	isFlippedX: function() {
		return this._flippedX
	},
	isFlippedY: function() {
		return this._flippedY
	},
	setOpacityModifyRGB: function(a) {
		this._opacityModifyRGB !== a && (this._opacityModifyRGB = a, this._renderCmd._setColorDirty())
	},
	isOpacityModifyRGB: function() {
		return this._opacityModifyRGB
	},
	setDisplayFrameWithAnimationName: function(a, b) {
		cc.assert(a, cc._LogInfos.Sprite_setDisplayFrameWithAnimationName_3);
		var c = cc.animationCache.getAnimation(a);
		if (!c) return void cc.log(cc._LogInfos.Sprite_setDisplayFrameWithAnimationName);
		var d = c.getFrames()[b];
		return d ? void this.setSpriteFrame(d.getSpriteFrame()) : void cc.log(cc._LogInfos.Sprite_setDisplayFrameWithAnimationName_2)
	},
	getBatchNode: function() {
		return this._batchNode
	},
	_setReorderChildDirtyRecursively: function() {
		if (!this._reorderChildDirty) {
			this._reorderChildDirty = !0;
			for (var a = this._parent; a && a !== this._batchNode;) a._setReorderChildDirtyRecursively(), a = a.parent
		}
	},
	getTexture: function() {
		return this._texture
	},
	_softInit: function(a, b, c) {
		if (void 0 === a) cc.Sprite.prototype.init.call(this);
		else if (cc.isString(a)) if ("#" === a[0]) {
			var d = a.substr(1, a.length - 1),
				e = cc.spriteFrameCache.getSpriteFrame(d);
			e ? this.initWithSpriteFrame(e) : cc.log("%s does not exist", a)
		} else cc.Sprite.prototype.init.call(this, a, b);
		else if ("object" == typeof a) if (a instanceof cc.Texture2D) this.initWithTexture(a, b, c);
		else if (a instanceof cc.SpriteFrame) this.initWithSpriteFrame(a);
		else if (a instanceof HTMLImageElement || a instanceof HTMLCanvasElement) {
			var f = new cc.Texture2D;
			f.initWithElement(a), f.handleLoadedTexture(), this.initWithTexture(f)
		}
	},
	getQuad: function() {
		return this._renderCmd.getQuad()
	},
	setBlendFunc: function(a, b) {
		var c = this._blendFunc;
		void 0 === b ? (c.src = a.src, c.dst = a.dst) : (c.src = a, c.dst = b), this._renderCmd.updateBlendFunc(c)
	},
	init: function() {
		var a = this;
		return arguments.length > 0 ? a.initWithFile(arguments[0], arguments[1]) : (cc.Node.prototype.init.call(a), a.dirty = a._recursiveDirty = !1, a._blendFunc.src = cc.BLEND_SRC, a._blendFunc.dst = cc.BLEND_DST, a.texture = null, a._flippedX = a._flippedY = !1, a.anchorX = .5, a.anchorY = .5, a._offsetPosition.x = 0, a._offsetPosition.y = 0, a._hasChildren = !1, this._renderCmd._init(), a.setTextureRect(cc.rect(0, 0, 0, 0), !1, cc.size(0, 0)), !0)
	},
	initWithFile: function(a, b) {
		cc.assert(a, cc._LogInfos.Sprite_initWithFile);
		var c = cc.textureCache.getTextureForKey(a);
		if (c) {
			if (!b) {
				var d = c.getContentSize();
				b = cc.rect(0, 0, d.width, d.height)
			}
			return this.initWithTexture(c, b)
		}
		return c = cc.textureCache.addImage(a), this.initWithTexture(c, b || cc.rect(0, 0, c._contentSize.width, c._contentSize.height))
	},
	initWithTexture: function(a, b, c, d) {
		var e = this;
		if (cc.assert(0 !== arguments.length, cc._LogInfos.CCSpriteBatchNode_initWithTexture), c = c || !1, a = this._renderCmd._handleTextureForRotatedTexture(a, b, c, d), !cc.Node.prototype.init.call(e)) return !1;
		e._batchNode = null, e._recursiveDirty = !1, e.dirty = !1, e._opacityModifyRGB = !0, e._blendFunc.src = cc.BLEND_SRC, e._blendFunc.dst = cc.BLEND_DST, e._flippedX = e._flippedY = !1, e.setAnchorPoint(.5, .5), e._offsetPosition.x = 0, e._offsetPosition.y = 0, e._hasChildren = !1, this._renderCmd._init();
		var f = a.isLoaded();
		return e._textureLoaded = f, f ? (b || (b = cc.rect(0, 0, a.width, a.height)), this._renderCmd._checkTextureBoundary(a, b, c), e.setTexture(a), e.setTextureRect(b, c), e.setBatchNode(null), !0) : (e._rectRotated = c, b && (e._rect.x = b.x, e._rect.y = b.y, e._rect.width = b.width, e._rect.height = b.height), e.texture && e.texture.removeEventListener("load", e), a.addEventListener("load", e._renderCmd._textureLoadedCallback, e), e.texture = a, !0)
	},
	setTextureRect: function(a, b, c, d) {
		var e = this;
		e._rectRotated = b || !1, e.setContentSize(c || a), e.setVertexRect(a), e._renderCmd._setTextureCoords(a, d);
		var f = e._unflippedOffsetPositionFromCenter.x,
			g = e._unflippedOffsetPositionFromCenter.y;
		e._flippedX && (f = -f), e._flippedY && (g = -g);
		var h = e._rect;
		e._offsetPosition.x = f + (e._contentSize.width - h.width) / 2, e._offsetPosition.y = g + (e._contentSize.height - h.height) / 2, e._batchNode ? e.dirty = !0 : this._renderCmd._resetForBatchNode()
	},
	updateTransform: function() {
		this._renderCmd.updateTransform()
	},
	addChild: function(a, b, c) {
		cc.assert(a, cc._LogInfos.CCSpriteBatchNode_addChild_2), null == b && (b = a._localZOrder), null == c && (c = a.tag), this._renderCmd._setBatchNodeForAddChild(a) && (cc.Node.prototype.addChild.call(this, a, b, c), this._hasChildren = !0)
	},
	setSpriteFrame: function(a) {
		var b = this;
		cc.isString(a) && (a = cc.spriteFrameCache.getSpriteFrame(a), cc.assert(a, cc._LogInfos.Sprite_setSpriteFrame)), this.setNodeDirty(!0);
		var c = a.getOffset();
		b._unflippedOffsetPositionFromCenter.x = c.x, b._unflippedOffsetPositionFromCenter.y = c.y;
		var d = a.getTexture(),
			e = a.textureLoaded();
		e ? (d !== b._texture && (b.texture = d), b.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize())) : (b._textureLoaded = !1, a.addEventListener("load", function(a) {
			b._textureLoaded = !0;
			var c = a.getTexture();
			c !== b._texture && (b.texture = c), b.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize()), b.dispatchEvent("load"), b.setColor(b.color)
		}, b)), this._renderCmd._updateForSetSpriteFrame(d)
	},
	setDisplayFrame: function(a) {
		cc.log(cc._LogInfos.Sprite_setDisplayFrame), this.setSpriteFrame(a)
	},
	isFrameDisplayed: function(a) {
		return this._renderCmd.isFrameDisplayed(a)
	},
	displayFrame: function() {
		return this.getSpriteFrame()
	},
	getSpriteFrame: function() {
		return new cc.SpriteFrame(this._texture, cc.rectPointsToPixels(this._rect), this._rectRotated, cc.pointPointsToPixels(this._unflippedOffsetPositionFromCenter), cc.sizePointsToPixels(this._contentSize))
	},
	setBatchNode: function(a) {
		var b = this;
		b._batchNode = a, b._batchNode ? (b._transformToBatch = cc.affineTransformIdentity(), b.textureAtlas = b._batchNode.getTextureAtlas()) : (b.atlasIndex = cc.Sprite.INDEX_NOT_INITIALIZED, b.textureAtlas = null, b._recursiveDirty = !1, b.dirty = !1, this._renderCmd._resetForBatchNode())
	},
	setTexture: function(a) {
		if (!a) return this._renderCmd._setTexture(null);
		var b = this._texture;
		cc.isString(a) ? (a = cc.textureCache.addImage(a), a._textureLoaded ? (this._renderCmd._setTexture(a), this._changeRectWithTexture(a, b), this.setColor(this._realColor), this._textureLoaded = !0) : a.addEventListener("load", function() {
			this._renderCmd._setTexture(a), this._changeRectWithTexture(a, b), this.setColor(this._realColor), this._textureLoaded = !0
		}, this)) : (cc.assert(a instanceof cc.Texture2D, cc._LogInfos.Sprite_setTexture_2), this._changeRectWithTexture(a, b), this._renderCmd._setTexture(a))
	},
	_changeRectWithTexture: function(a, b) {
		var c = cc.rect(0, 0, a._contentSize.width, a._contentSize.height),
			d = b ? b._contentSize : cc.size(),
			e = this._contentSize,
			f = c.width,
			g = c.height,
			h = d.width,
			i = d.height,
			j = e.width,
			k = e.height;
		if (c && (f || g)) {
			var l = this._rect;
			if (b && 0 !== j && 0 !== k && (0 !== l.height || 0 !== l.width)) {
				if (!a.url) return;
				if (j !== h && k !== i && h === f && i === g) return
			}
			c.x = c.x || 0, c.y = c.y || 0, c.width = c.width || 0, c.height = c.height || 0, this.setTextureRect(c)
		}
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.Sprite.CanvasRenderCmd(this) : new cc.Sprite.WebGLRenderCmd(this)
	}
}), cc.Sprite.create = function(a, b, c) {
	return new cc.Sprite(a, b, c)
}, cc.Sprite.createWithTexture = cc.Sprite.create, cc.Sprite.createWithSpriteFrameName = cc.Sprite.create, cc.Sprite.createWithSpriteFrame = cc.Sprite.create, cc.Sprite.INDEX_NOT_INITIALIZED = -1, cc.EventHelper.prototype.apply(cc.Sprite.prototype), cc.assert(cc.isFunction(cc._tmp.PrototypeSprite), cc._LogInfos.MissingFile, "SpritesPropertyDefine.js"), cc._tmp.PrototypeSprite(), delete cc._tmp.PrototypeSprite, function() {
	cc.Sprite.CanvasRenderCmd = function(a) {
		cc.Node.CanvasRenderCmd.call(this, a), this._needDraw = !0, this._textureCoord = {
			renderX: 0,
			renderY: 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			validRect: !1
		}, this._blendFuncStr = "source-over", this._colorized = !1, this._originalTexture = null
	};
	var a = cc.Sprite.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
	a.constructor = cc.Sprite.CanvasRenderCmd, a._init = function() {}, a.setDirtyRecursively = function(a) {}, a._resetForBatchNode = function() {}, a._setTexture = function(a) {
		var b = this._node;
		b._texture !== a && (a ? (a.getHtmlElementObj() instanceof HTMLImageElement && (this._originalTexture = a), b._textureLoaded = a._textureLoaded) : b._textureLoaded = !1, b._texture = a)
	}, a._setColorDirty = function() {
		this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty)
	}, a.isFrameDisplayed = function(a) {
		var b = this._node;
		return a.getTexture() !== b._texture ? !1 : cc.rectEqualToRect(a.getRect(), b._rect)
	}, a.updateBlendFunc = function(a) {
		this._blendFuncStr = cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(a)
	}, a._setBatchNodeForAddChild = function(a) {
		return !0
	}, a._handleTextureForRotatedTexture = function(a, b, c, d) {
		if (c && a.isLoaded()) {
			var e = a.getHtmlElementObj();
			e = cc.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(e, b, d);
			var f = new cc.Texture2D;
			f.initWithElement(e), f.handleLoadedTexture(), a = f, b.x = b.y = 0, this._node._rect = cc.rect(0, 0, b.width, b.height)
		}
		return a
	}, a._checkTextureBoundary = function(a, b, c) {
		if (a && a.url) {
			var d = b.x + b.width,
				e = b.y + b.height;
			d > a.width && cc.error(cc._LogInfos.RectWidth, a.url), e > a.height && cc.error(cc._LogInfos.RectHeight, a.url)
		}
		this._node._originalTexture = a
	}, a.rendering = function(a, b, c) {
		var d = this._node,
			e = this._textureCoord,
			f = this._displayedOpacity / 255;
		if ((!d._texture || 0 !== e.width && 0 !== e.height && d._texture._textureLoaded) && 0 !== f) {
			var g, h = a || cc._renderContext,
				i = h.getContext(),
				j = d._offsetPosition.x,
				k = d._rect.height,
				l = d._rect.width,
				m = -d._offsetPosition.y - k;
			if (h.setTransform(this._worldTransform, b, c), h.setCompositeOperation(this._blendFuncStr), h.setGlobalAlpha(f), (d._flippedX || d._flippedY) && h.save(), d._flippedX && (j = -j - l, i.scale(-1, 1)), d._flippedY && (m = d._offsetPosition.y, i.scale(1, -1)), d._texture) g = d._texture._htmlElementObj, "" !== d._texture._pattern ? (h.setFillStyle(i.createPattern(g, d._texture._pattern)), i.fillRect(j * b, m * c, l * b, k * c)) : this._colorized ? i.drawImage(g, 0, 0, e.width, e.height, j * b, m * c, l * b, k * c) : i.drawImage(g, e.renderX, e.renderY, e.width, e.height, j * b, m * c, l * b, k * c);
			else {
				var n = d._contentSize;
				if (e.validRect) {
					var o = this._displayedColor;
					h.setFillStyle("rgba(" + o.r + "," + o.g + "," + o.b + ",1)"), i.fillRect(j * b, m * c, n.width * b, n.height * c)
				}
			}(d._flippedX || d._flippedY) && h.restore(), cc.g_NumberOfDraws++
		}
	}, cc.sys._supportCanvasNewBlendModes ? a._updateColor = function() {
		var a = this._node,
			b = this._displayedColor;
		if (255 === b.r && 255 === b.g && 255 === b.b) return void this._setOriginalTexture();
		var c, d = a._texture,
			e = this._textureCoord;
		if (d && e.validRect && this._originalTexture) {
			if (c = d.getHtmlElementObj(), !c) return;
			this._colorized = !0, c instanceof HTMLCanvasElement && !this._rectRotated && !this._newTextureWhenChangeColor && this._originalTexture._htmlElementObj !== c ? cc.Sprite.CanvasRenderCmd._generateTintImageWithMultiply(this._originalTexture._htmlElementObj, b, e, c) : (c = cc.Sprite.CanvasRenderCmd._generateTintImageWithMultiply(this._originalTexture._htmlElementObj, b, e), d = new cc.Texture2D, d.initWithElement(c), d.handleLoadedTexture(), a.setTexture(d))
		}
	} : a._updateColor = function() {
		var a = this._node,
			b = this._displayedColor;
		if (255 === b.r && 255 === b.g && 255 === b.b) return void this._setOriginalTexture();
		var c, d = a._texture,
			e = this._textureCoord;
		if (d && e.validRect && this._originalTexture) {
			if (c = d.getHtmlElementObj(), !c) return;
			var f = cc.textureCache.getTextureColors(this._originalTexture.getHtmlElementObj());
			f && (this._colorized = !0, c instanceof HTMLCanvasElement && !this._rectRotated && !this._newTextureWhenChangeColor ? cc.Sprite.CanvasRenderCmd._generateTintImage(c, f, b, e, c) : (c = cc.Sprite.CanvasRenderCmd._generateTintImage(c, f, b, e), d = new cc.Texture2D, d.initWithElement(c), d.handleLoadedTexture(), a.texture = d))
		}
	}, a._setOriginalTexture = function() {
		if (this._colorized) {
			this._colorized = !1;
			var a = this._node,
				b = cc.rect(a._rect),
				c = cc.size(a._contentSize),
				d = a._rectRotated;
			a.setTexture(this._originalTexture), a.setTextureRect(b, d, c)
		}
	}, a.getQuad = function() {
		return null
	}, a._updateForSetSpriteFrame = function(a, b) {
		if (this._originalTexture = a, this._colorized = !1, this._textureCoord.renderX = this._textureCoord.x, this._textureCoord.renderY = this._textureCoord.y, b = b || a._textureLoaded) {
			var c = this._node.getColor();
			(255 !== c.r || 255 !== c.g || 255 !== c.b) && this._updateColor()
		}
	}, a.updateTransform = function() {
		var a = this,
			b = this._node;
		if (b.dirty) {
			var c = b._parent;
			!b._visible || c && c !== b._batchNode && c._shouldBeHidden ? b._shouldBeHidden = !0 : (b._shouldBeHidden = !1, c && c !== b._batchNode ? b._transformToBatch = cc.affineTransformConcat(a.getNodeToParentTransform(), c._transformToBatch) : b._transformToBatch = a.getNodeToParentTransform()), b._recursiveDirty = !1, b.dirty = !1
		}
		b._hasChildren && b._arrayMakeObjectsPerformSelector(b._children, cc.Node._stateCallbackType.updateTransform)
	}, a._updateDisplayColor = function(a) {
		cc.Node.CanvasRenderCmd.prototype._updateDisplayColor.call(this, a)
	}, a._spriteFrameLoadedCallback = function(a) {
		var b = this;
		b.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize()), b._renderCmd._updateColor(), b.dispatchEvent("load")
	}, a._textureLoadedCallback = function(a) {
		var b = this;
		if (!b._textureLoaded) {
			b._textureLoaded = !0;
			var c = b._rect,
				d = this._renderCmd;
			c ? cc._rectEqualToZero(c) && (c.width = a.width, c.height = a.height) : c = cc.rect(0, 0, a.width, a.height), d._originalTexture = a, b.texture = a, b.setTextureRect(c, b._rectRotated);
			var e = d._displayedColor;
			(255 !== e.r || 255 !== e.g || 255 !== e.b) && d._updateColor(), b.setBatchNode(b._batchNode), b.dispatchEvent("load")
		}
	}, a._setTextureCoords = function(a, b) {
		void 0 === b && (b = !0);
		var c = this._textureCoord,
			d = b ? cc.contentScaleFactor() : 1;
		c.renderX = c.x = 0 | a.x * d, c.renderY = c.y = 0 | a.y * d, c.width = 0 | a.width * d, c.height = 0 | a.height * d, c.validRect = !(0 === c.width || 0 === c.height || c.x < 0 || c.y < 0)
	}, cc.Sprite.CanvasRenderCmd._generateTintImageWithMultiply = function(a, b, c, d) {
		d = d || cc.newElement("canvas"), c = c || cc.rect(0, 0, a.width, a.height);
		var e = d.getContext("2d");
		return d.width !== c.width || d.height !== c.height ? (d.width = c.width, d.height = c.height) : e.globalCompositeOperation = "source-over", e.fillStyle = "rgb(" + (0 | b.r) + "," + (0 | b.g) + "," + (0 | b.b) + ")", e.fillRect(0, 0, c.width, c.height), e.globalCompositeOperation = "multiply", e.drawImage(a, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height), e.globalCompositeOperation = "destination-atop", e.drawImage(a, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height), d
	}, cc.Sprite.CanvasRenderCmd._generateTintImage = function(a, b, c, d, e) {
		d || (d = cc.rect(0, 0, a.width, a.height));
		var f, g = c.r / 255,
			h = c.g / 255,
			i = c.b / 255,
			j = Math.min(d.width, b[0].width),
			k = Math.min(d.height, b[0].height),
			l = e;
		l ? (f = l.getContext("2d"), f.clearRect(0, 0, j, k)) : (l = cc.newElement("canvas"), l.width = j, l.height = k, f = l.getContext("2d")), f.save(), f.globalCompositeOperation = "lighter";
		var m = f.globalAlpha;
		return g > 0 && (f.globalAlpha = g * m, f.drawImage(b[0], d.x, d.y, j, k, 0, 0, j, k)), h > 0 && (f.globalAlpha = h * m, f.drawImage(b[1], d.x, d.y, j, k, 0, 0, j, k)), i > 0 && (f.globalAlpha = i * m, f.drawImage(b[2], d.x, d.y, j, k, 0, 0, j, k)), 1 > g + h + i && (f.globalAlpha = m, f.drawImage(b[3], d.x, d.y, j, k, 0, 0, j, k)), f.restore(), l
	}, cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor = function(a) {
		function b() {
			var b = cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor,
				d = a.width,
				e = a.height;
			c[0].width = d, c[0].height = e, c[1].width = d, c[1].height = e, c[2].width = d, c[2].height = e, c[3].width = d, c[3].height = e, b.canvas.width = d, b.canvas.height = e;
			var f = b.canvas.getContext("2d");
			f.drawImage(a, 0, 0), b.tempCanvas.width = d, b.tempCanvas.height = e;
			for (var g = f.getImageData(0, 0, d, e).data, h = 0; 4 > h; h++) {
				var i = c[h].getContext("2d");
				i.getImageData(0, 0, d, e).data, b.tempCtx.drawImage(a, 0, 0);
				for (var j = b.tempCtx.getImageData(0, 0, d, e), k = j.data, l = 0; l < g.length; l += 4) k[l] = 0 === h ? g[l] : 0, k[l + 1] = 1 === h ? g[l + 1] : 0, k[l + 2] = 2 === h ? g[l + 2] : 0, k[l + 3] = g[l + 3];
				i.putImageData(j, 0, 0)
			}
			a.onload = null
		}
		if (a.channelCache) return a.channelCache;
		var c = [cc.newElement("canvas"), cc.newElement("canvas"), cc.newElement("canvas"), cc.newElement("canvas")];
		try {
			b()
		} catch (d) {
			a.onload = b
		}
		return a.channelCache = c, c
	}, cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor.canvas = cc.newElement("canvas"), cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor.tempCanvas = cc.newElement("canvas"), cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor.tempCtx = cc.Sprite.CanvasRenderCmd._generateTextureCacheForColor.tempCanvas.getContext("2d"), cc.Sprite.CanvasRenderCmd._cutRotateImageToCanvas = function(a, b, c) {
		if (!a) return null;
		if (!b) return a;
		c = null == c ? !0 : c;
		var d = cc.newElement("canvas");
		d.width = b.width, d.height = b.height;
		var e = d.getContext("2d");
		return e.translate(d.width / 2, d.height / 2), c ? e.rotate(-1.5707963267948966) : e.rotate(1.5707963267948966), e.drawImage(a, b.x, b.y, b.height, b.width, -b.height / 2, -b.width / 2, b.height, b.width), d
	}
}(), cc.BakeSprite = cc.Sprite.extend({
	_cacheCanvas: null,
	_cacheContext: null,
	ctor: function() {
		cc.Sprite.prototype.ctor.call(this);
		var a = document.createElement("canvas");
		a.width = a.height = 10, this._cacheCanvas = a, this._cacheContext = new cc.CanvasContextWrapper(a.getContext("2d"));
		var b = new cc.Texture2D;
		b.initWithElement(a), b.handleLoadedTexture(), this.setTexture(b)
	},
	getCacheContext: function() {
		return this._cacheContext
	},
	getCacheCanvas: function() {
		return this._cacheCanvas
	},
	resetCanvasSize: function(a, b) {
		var c = this._cacheCanvas,
			d = this._cacheContext,
			e = d._context.strokeStyle,
			f = d._context.fillStyle;
		void 0 === b && (b = a.height, a = a.width), c.width = a, c.height = b, e !== d._context.strokeStyle && (d._context.strokeStyle = e), f !== d._context.fillStyle && (d._context.fillStyle = f), this.getTexture().handleLoadedTexture(), this.setTextureRect(cc.rect(0, 0, a, b), !1, null, !1)
	}
}), cc.AnimationFrame = cc.Class.extend({
	_spriteFrame: null,
	_delayPerUnit: 0,
	_userInfo: null,
	ctor: function(a, b, c) {
		this._spriteFrame = a || null, this._delayPerUnit = b || 0, this._userInfo = c || null
	},
	clone: function() {
		var a = new cc.AnimationFrame;
		return a.initWithSpriteFrame(this._spriteFrame.clone(), this._delayPerUnit, this._userInfo), a
	},
	copyWithZone: function(a) {
		return cc.clone(this)
	},
	copy: function(a) {
		var b = new cc.AnimationFrame;
		return b.initWithSpriteFrame(this._spriteFrame.clone(), this._delayPerUnit, this._userInfo), b
	},
	initWithSpriteFrame: function(a, b, c) {
		return this._spriteFrame = a, this._delayPerUnit = b, this._userInfo = c, !0
	},
	getSpriteFrame: function() {
		return this._spriteFrame
	},
	setSpriteFrame: function(a) {
		this._spriteFrame = a
	},
	getDelayUnits: function() {
		return this._delayPerUnit
	},
	setDelayUnits: function(a) {
		this._delayPerUnit = a
	},
	getUserInfo: function() {
		return this._userInfo
	},
	setUserInfo: function(a) {
		this._userInfo = a
	}
}), cc.AnimationFrame.create = function(a, b, c) {
	return new cc.AnimationFrame(a, b, c)
}, cc.Animation = cc.Class.extend({
	_frames: null,
	_loops: 0,
	_restoreOriginalFrame: !1,
	_duration: 0,
	_delayPerUnit: 0,
	_totalDelayUnits: 0,
	ctor: function(a, b, c) {
		if (this._frames = [], void 0 === a) this.initWithSpriteFrames(null, 0);
		else {
			var d = a[0];
			d && (d instanceof cc.SpriteFrame ? this.initWithSpriteFrames(a, b, c) : d instanceof cc.AnimationFrame && this.initWithAnimationFrames(a, b, c))
		}
	},
	getFrames: function() {
		return this._frames
	},
	setFrames: function(a) {
		this._frames = a
	},
	addSpriteFrame: function(a) {
		var b = new cc.AnimationFrame;
		b.initWithSpriteFrame(a, 1, null), this._frames.push(b), this._totalDelayUnits++
	},
	addSpriteFrameWithFile: function(a) {
		var b = cc.textureCache.addImage(a),
			c = cc.rect(0, 0, 0, 0);
		c.width = b.width, c.height = b.height;
		var d = new cc.SpriteFrame(b, c);
		this.addSpriteFrame(d)
	},
	addSpriteFrameWithTexture: function(a, b) {
		var c = new cc.SpriteFrame(a, b);
		this.addSpriteFrame(c)
	},
	initWithAnimationFrames: function(a, b, c) {
		cc.arrayVerifyType(a, cc.AnimationFrame), this._delayPerUnit = b, this._loops = void 0 === c ? 1 : c, this._totalDelayUnits = 0;
		var d = this._frames;
		d.length = 0;
		for (var e = 0; e < a.length; e++) {
			var f = a[e];
			d.push(f), this._totalDelayUnits += f.getDelayUnits()
		}
		return !0
	},
	clone: function() {
		var a = new cc.Animation;
		return a.initWithAnimationFrames(this._copyFrames(), this._delayPerUnit, this._loops), a.setRestoreOriginalFrame(this._restoreOriginalFrame), a
	},
	copyWithZone: function(a) {
		var b = new cc.Animation;
		return b.initWithAnimationFrames(this._copyFrames(), this._delayPerUnit, this._loops), b.setRestoreOriginalFrame(this._restoreOriginalFrame), b
	},
	_copyFrames: function() {
		for (var a = [], b = 0; b < this._frames.length; b++) a.push(this._frames[b].clone());
		return a
	},
	copy: function(a) {
		return this.copyWithZone(null)
	},
	getLoops: function() {
		return this._loops
	},
	setLoops: function(a) {
		this._loops = a
	},
	setRestoreOriginalFrame: function(a) {
		this._restoreOriginalFrame = a
	},
	getRestoreOriginalFrame: function() {
		return this._restoreOriginalFrame
	},
	getDuration: function() {
		return this._totalDelayUnits * this._delayPerUnit
	},
	getDelayPerUnit: function() {
		return this._delayPerUnit
	},
	setDelayPerUnit: function(a) {
		this._delayPerUnit = a
	},
	getTotalDelayUnits: function() {
		return this._totalDelayUnits
	},
	initWithSpriteFrames: function(a, b, c) {
		cc.arrayVerifyType(a, cc.SpriteFrame), this._loops = void 0 === c ? 1 : c, this._delayPerUnit = b || 0, this._totalDelayUnits = 0;
		var d = this._frames;
		if (d.length = 0, a) {
			for (var e = 0; e < a.length; e++) {
				var f = a[e],
					g = new cc.AnimationFrame;
				g.initWithSpriteFrame(f, 1, null), d.push(g)
			}
			this._totalDelayUnits += a.length
		}
		return !0
	},
	retain: function() {},
	release: function() {}
}), cc.Animation.create = function(a, b, c) {
	return new cc.Animation(a, b, c)
}, cc.Animation.createWithAnimationFrames = cc.Animation.create, cc.animationCache = {
	_animations: {},
	addAnimation: function(a, b) {
		this._animations[b] = a
	},
	removeAnimation: function(a) {
		a && this._animations[a] && delete this._animations[a]
	},
	getAnimation: function(a) {
		return this._animations[a] ? this._animations[a] : null
	},
	_addAnimationsWithDictionary: function(a, b) {
		var c = a.animations;
		if (!c) return void cc.log(cc._LogInfos.animationCache__addAnimationsWithDictionary);
		var d = 1,
			e = a.properties;
		if (e) {
			d = null != e.format ? parseInt(e.format) : d;
			for (var f = e.spritesheets, g = cc.spriteFrameCache, h = cc.path, i = 0; i < f.length; i++) g.addSpriteFrames(h.changeBasename(b, f[i]))
		}
		switch (d) {
		case 1:
			this._parseVersion1(c);
			break;
		case 2:
			this._parseVersion2(c);
			break;
		default:
			cc.log(cc._LogInfos.animationCache__addAnimationsWithDictionary_2)
		}
	},
	addAnimations: function(a) {
		cc.assert(a, cc._LogInfos.animationCache_addAnimations_2);
		var b = cc.loader.getRes(a);
		return b ? void this._addAnimationsWithDictionary(b, a) : void cc.log(cc._LogInfos.animationCache_addAnimations)
	},
	_parseVersion1: function(a) {
		var b = cc.spriteFrameCache;
		for (var c in a) {
			var d = a[c],
				e = d.frames,
				f = parseFloat(d.delay) || 0,
				g = null;
			if (e) {
				for (var h = [], i = 0; i < e.length; i++) {
					var j = b.getSpriteFrame(e[i]);
					if (j) {
						var k = new cc.AnimationFrame;
						k.initWithSpriteFrame(j, 1, null), h.push(k)
					} else cc.log(cc._LogInfos.animationCache__parseVersion1_2, c, e[i])
				}
				0 !== h.length ? (h.length !== e.length && cc.log(cc._LogInfos.animationCache__parseVersion1_4, c), g = new cc.Animation(h, f, 1), cc.animationCache.addAnimation(g, c)) : cc.log(cc._LogInfos.animationCache__parseVersion1_3, c)
			} else cc.log(cc._LogInfos.animationCache__parseVersion1, c)
		}
	},
	_parseVersion2: function(a) {
		var b = cc.spriteFrameCache;
		for (var c in a) {
			var d = a[c],
				e = d.loop,
				f = parseInt(d.loops),
				g = e ? cc.REPEAT_FOREVER : isNaN(f) ? 1 : f,
				h = d.restoreOriginalFrame && 1 == d.restoreOriginalFrame ? !0 : !1,
				i = d.frames;
			if (i) {
				for (var j = [], k = 0; k < i.length; k++) {
					var l = i[k],
						m = l.spriteframe,
						n = b.getSpriteFrame(m);
					if (n) {
						var o = parseFloat(l.delayUnits) || 0,
							p = l.notification,
							q = new cc.AnimationFrame;
						q.initWithSpriteFrame(n, o, p), j.push(q)
					} else cc.log(cc._LogInfos.animationCache__parseVersion2_2, c, m)
				}
				var r = parseFloat(d.delayPerUnit) || 0,
					s = new cc.Animation;
				s.initWithAnimationFrames(j, r, g), s.setRestoreOriginalFrame(h), cc.animationCache.addAnimation(s, c)
			} else cc.log(cc._LogInfos.animationCache__parseVersion2, c)
		}
	},
	_clear: function() {
		this._animations = {}
	}
}, cc.SpriteFrame = cc.Class.extend({
	_offset: null,
	_originalSize: null,
	_rectInPixels: null,
	_rotated: !1,
	_rect: null,
	_offsetInPixels: null,
	_originalSizeInPixels: null,
	_texture: null,
	_textureFilename: "",
	_textureLoaded: !1,
	ctor: function(a, b, c, d, e) {
		this._offset = cc.p(0, 0), this._offsetInPixels = cc.p(0, 0), this._originalSize = cc.size(0, 0), this._rotated = !1, this._originalSizeInPixels = cc.size(0, 0), this._textureFilename = "", this._texture = null, this._textureLoaded = !1, void 0 !== a && void 0 !== b && (void 0 === c || void 0 === d || void 0 === e ? this.initWithTexture(a, b) : this.initWithTexture(a, b, c, d, e))
	},
	textureLoaded: function() {
		return this._textureLoaded
	},
	addLoadedEventListener: function(a, b) {
		this.addEventListener("load", a, b)
	},
	getRectInPixels: function() {
		var a = this._rectInPixels;
		return cc.rect(a.x, a.y, a.width, a.height)
	},
	setRectInPixels: function(a) {
		this._rectInPixels || (this._rectInPixels = cc.rect(0, 0, 0, 0)), this._rectInPixels.x = a.x, this._rectInPixels.y = a.y, this._rectInPixels.width = a.width, this._rectInPixels.height = a.height, this._rect = cc.rectPixelsToPoints(a)
	},
	isRotated: function() {
		return this._rotated
	},
	setRotated: function(a) {
		this._rotated = a
	},
	getRect: function() {
		var a = this._rect;
		return cc.rect(a.x, a.y, a.width, a.height)
	},
	setRect: function(a) {
		this._rect || (this._rect = cc.rect(0, 0, 0, 0)), this._rect.x = a.x, this._rect.y = a.y, this._rect.width = a.width, this._rect.height = a.height, this._rectInPixels = cc.rectPointsToPixels(this._rect)
	},
	getOffsetInPixels: function() {
		return cc.p(this._offsetInPixels)
	},
	setOffsetInPixels: function(a) {
		this._offsetInPixels.x = a.x, this._offsetInPixels.y = a.y, cc._pointPixelsToPointsOut(this._offsetInPixels, this._offset)
	},
	getOriginalSizeInPixels: function() {
		return cc.size(this._originalSizeInPixels)
	},
	setOriginalSizeInPixels: function(a) {
		this._originalSizeInPixels.width = a.width, this._originalSizeInPixels.height = a.height
	},
	getOriginalSize: function() {
		return cc.size(this._originalSize)
	},
	setOriginalSize: function(a) {
		this._originalSize.width = a.width, this._originalSize.height = a.height
	},
	getTexture: function() {
		if (this._texture) return this._texture;
		if ("" !== this._textureFilename) {
			var a = cc.textureCache.addImage(this._textureFilename);
			return a && (this._textureLoaded = a.isLoaded()), a
		}
		return null
	},
	setTexture: function(a) {
		if (this._texture !== a) {
			var b = a.isLoaded();
			this._textureLoaded = b, this._texture = a, b || a.addEventListener("load", function(a) {
				if (this._textureLoaded = !0, this._rotated && cc._renderType === cc._RENDER_TYPE_CANVAS) {
					var b = a.getHtmlElementObj();
					b = cc.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(b, this.getRect());
					var c = new cc.Texture2D;
					c.initWithElement(b), c.handleLoadedTexture(), this.setTexture(c);
					var d = this.getRect();
					this.setRect(cc.rect(0, 0, d.width, d.height))
				}
				var e = this._rect;
				if (0 === e.width && 0 === e.height) {
					var f = a.width,
						g = a.height;
					this._rect.width = f, this._rect.height = g, this._rectInPixels = cc.rectPointsToPixels(this._rect), this._originalSizeInPixels.width = this._rectInPixels.width, this._originalSizeInPixels.height = this._rectInPixels.height, this._originalSize.width = f, this._originalSize.height = g
				}
				this.dispatchEvent("load")
			}, this)
		}
	},
	getOffset: function() {
		return cc.p(this._offset)
	},
	setOffset: function(a) {
		this._offset.x = a.x, this._offset.y = a.y
	},
	clone: function() {
		var a = new cc.SpriteFrame;
		return a.initWithTexture(this._textureFilename, this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels), a.setTexture(this._texture), a
	},
	copyWithZone: function() {
		var a = new cc.SpriteFrame;
		return a.initWithTexture(this._textureFilename, this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels), a.setTexture(this._texture), a
	},
	copy: function() {
		return this.copyWithZone()
	},
	initWithTexture: function(a, b, c, d, e) {
		if (2 === arguments.length && (b = cc.rectPointsToPixels(b)), d = d || cc.p(0, 0), e = e || b, c = c || !1, cc.isString(a) ? (this._texture = null, this._textureFilename = a) : a instanceof cc.Texture2D && this.setTexture(a), a = this.getTexture(), this._rectInPixels = b, b = this._rect = cc.rectPixelsToPoints(b), a && a.url && a.isLoaded()) {
			var f, g;
			c ? (f = b.x + b.height, g = b.y + b.width) : (f = b.x + b.width, g = b.y + b.height), f > a.getPixelsWide() && cc.error(cc._LogInfos.RectWidth, a.url), g > a.getPixelsHigh() && cc.error(cc._LogInfos.RectHeight, a.url)
		}
		return this._offsetInPixels.x = d.x, this._offsetInPixels.y = d.y, cc._pointPixelsToPointsOut(d, this._offset), this._originalSizeInPixels.width = e.width, this._originalSizeInPixels.height = e.height, cc._sizePixelsToPointsOut(e, this._originalSize), this._rotated = c, !0
	}
}), cc.EventHelper.prototype.apply(cc.SpriteFrame.prototype), cc.SpriteFrame.create = function(a, b, c, d, e) {
	return new cc.SpriteFrame(a, b, c, d, e)
}, cc.SpriteFrame.createWithTexture = cc.SpriteFrame.create, cc.SpriteFrame._frameWithTextureForCanvas = function(a, b, c, d, e) {
	var f = new cc.SpriteFrame;
	return f._texture = a, f._rectInPixels = b, f._rect = cc.rectPixelsToPoints(b), f._offsetInPixels.x = d.x, f._offsetInPixels.y = d.y, cc._pointPixelsToPointsOut(f._offsetInPixels, f._offset), f._originalSizeInPixels.width = e.width, f._originalSizeInPixels.height = e.height, cc._sizePixelsToPointsOut(f._originalSizeInPixels, f._originalSize), f._rotated = c, f
}, cc.spriteFrameCache = {
	_CCNS_REG1: /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/,
	_CCNS_REG2: /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/,
	_spriteFrames: {},
	_spriteFramesAliases: {},
	_frameConfigCache: {},
	_rectFromString: function(a) {
		var b = this._CCNS_REG2.exec(a);
		return b ? cc.rect(parseFloat(b[1]), parseFloat(b[2]), parseFloat(b[3]), parseFloat(b[4])) : cc.rect(0, 0, 0, 0)
	},
	_pointFromString: function(a) {
		var b = this._CCNS_REG1.exec(a);
		return b ? cc.p(parseFloat(b[1]), parseFloat(b[2])) : cc.p(0, 0)
	},
	_sizeFromString: function(a) {
		var b = this._CCNS_REG1.exec(a);
		return b ? cc.size(parseFloat(b[1]), parseFloat(b[2])) : cc.size(0, 0)
	},
	_getFrameConfig: function(a) {
		var b = cc.loader.getRes(a);
		return cc.assert(b, cc._LogInfos.spriteFrameCache__getFrameConfig_2, a), cc.loader.release(a), b._inited ? (this._frameConfigCache[a] = b, b) : (this._frameConfigCache[a] = this._parseFrameConfig(b), this._frameConfigCache[a])
	},
	_getFrameConfigByJsonObject: function(a, b) {
		return cc.assert(b, cc._LogInfos.spriteFrameCache__getFrameConfig_2, a), this._frameConfigCache[a] = this._parseFrameConfig(b), this._frameConfigCache[a]
	},
	_parseFrameConfig: function(a) {
		var b = a.frames,
			c = a.metadata || a.meta,
			d = {},
			e = {},
			f = 0;
		if (c) {
			var g = c.format;
			f = g.length <= 1 ? parseInt(g) : g, e.image = c.textureFileName || c.textureFileName || c.image
		}
		for (var h in b) {
			var i = b[h];
			if (i) {
				var j = {};
				if (0 == f) {
					j.rect = cc.rect(i.x, i.y, i.width, i.height), j.rotated = !1, j.offset = cc.p(i.offsetX, i.offsetY);
					var k = i.originalWidth,
						l = i.originalHeight;
					k && l || cc.log(cc._LogInfos.spriteFrameCache__getFrameConfig), k = Math.abs(k), l = Math.abs(l), j.size = cc.size(k, l)
				} else if (1 == f || 2 == f) j.rect = this._rectFromString(i.frame), j.rotated = i.rotated || !1, j.offset = this._pointFromString(i.offset), j.size = this._sizeFromString(i.sourceSize);
				else if (3 == f) {
					var m = this._sizeFromString(i.spriteSize),
						n = this._rectFromString(i.textureRect);
					m && (n = cc.rect(n.x, n.y, m.width, m.height)), j.rect = n, j.rotated = i.textureRotated || !1, j.offset = this._pointFromString(i.spriteOffset), j.size = this._sizeFromString(i.spriteSourceSize), j.aliases = i.aliases
				} else {
					var o = i.frame,
						p = i.sourceSize;
					h = i.filename || h, j.rect = cc.rect(o.x, o.y, o.w, o.h), j.rotated = i.rotated || !1, j.offset = cc.p(0, 0), j.size = cc.size(p.w, p.h)
				}
				d[h] = j
			}
		}
		return {
			_inited: !0,
			frames: d,
			meta: e
		}
	},
	_addSpriteFramesByObject: function(a, b, c) {
		if (cc.assert(a, cc._LogInfos.spriteFrameCache_addSpriteFrames_2), b && b.frames) {
			var d = this._frameConfigCache[a] || this._getFrameConfigByJsonObject(a, b);
			this._createSpriteFrames(a, d, c)
		}
	},
	_createSpriteFrames: function(a, b, c) {
		var d = b.frames,
			e = b.meta;
		if (c) c instanceof cc.Texture2D || (cc.isString(c) ? c = cc.textureCache.addImage(c) : cc.assert(0, cc._LogInfos.spriteFrameCache_addSpriteFrames_3));
		else {
			var f = cc.path.changeBasename(a, e.image || ".png");
			c = cc.textureCache.addImage(f)
		}
		var g = this._spriteFramesAliases,
			h = this._spriteFrames;
		for (var i in d) {
			var j = d[i],
				k = h[i];
			if (!k) {
				k = new cc.SpriteFrame(c, j.rect, j.rotated, j.offset, j.size);
				var l = j.aliases;
				if (l) for (var m = 0, n = l.length; n > m; m++) {
					var o = l[m];
					g[o] && cc.log(cc._LogInfos.spriteFrameCache_addSpriteFrames, o), g[o] = i
				}
				if (cc._renderType === cc._RENDER_TYPE_CANVAS && k.isRotated()) {
					var p = k.getTexture();
					if (p.isLoaded()) {
						var q = k.getTexture().getHtmlElementObj();
						q = cc.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(q, k.getRectInPixels());
						var r = new cc.Texture2D;
						r.initWithElement(q), r.handleLoadedTexture(), k.setTexture(r);
						var s = k._rect;
						k.setRect(cc.rect(0, 0, s.width, s.height))
					}
				}
				h[i] = k
			}
		}
	},
	addSpriteFrames: function(a, b) {
		cc.assert(a, cc._LogInfos.spriteFrameCache_addSpriteFrames_2);
		var c = this._frameConfigCache[a] || cc.loader.getRes(a);
		if (c && c.frames) {
			var d = this._frameConfigCache[a] || this._getFrameConfig(a);
			this._createSpriteFrames(a, d, b)
		}
	},
	_checkConflict: function(a) {
		var b = a.frames;
		for (var c in b) this._spriteFrames[c] && cc.log(cc._LogInfos.spriteFrameCache__checkConflict, c)
	},
	addSpriteFrame: function(a, b) {
		this._spriteFrames[b] = a
	},
	removeSpriteFrames: function() {
		this._spriteFrames = {}, this._spriteFramesAliases = {}
	},
	removeSpriteFrameByName: function(a) {
		a && (this._spriteFramesAliases[a] && delete this._spriteFramesAliases[a], this._spriteFrames[a] && delete this._spriteFrames[a])
	},
	removeSpriteFramesFromFile: function(a) {
		var b = this,
			c = b._spriteFrames,
			d = b._spriteFramesAliases,
			e = b._frameConfigCache[a];
		if (e) {
			var f = e.frames;
			for (var g in f) if (c[g]) {
				delete c[g];
				for (var h in d) d[h] === g && delete d[h]
			}
		}
	},
	removeSpriteFramesFromTexture: function(a) {
		var b = this,
			c = b._spriteFrames,
			d = b._spriteFramesAliases;
		for (var e in c) {
			var f = c[e];
			if (f && f.getTexture() === a) {
				delete c[e];
				for (var g in d) d[g] === e && delete d[g]
			}
		}
	},
	getSpriteFrame: function(a) {
		var b = this,
			c = b._spriteFrames[a];
		if (!c) {
			var d = b._spriteFramesAliases[a];
			d && (c = b._spriteFrames[d.toString()], c || delete b._spriteFramesAliases[a])
		}
		return c
	},
	_clear: function() {
		this._spriteFrames = {}, this._spriteFramesAliases = {}, this._frameConfigCache = {}
	}
}, cc.g_NumberOfDraws = 0, cc.GLToClipTransform = function(a) {
	cc.kmGLGetMatrix(cc.KM_GL_PROJECTION, a);
	var b = new cc.math.Matrix4;
	cc.kmGLGetMatrix(cc.KM_GL_MODELVIEW, b), a.multiply(b)
}, cc.Director = cc.Class.extend({
	_landscape: !1,
	_nextDeltaTimeZero: !1,
	_paused: !1,
	_purgeDirectorInNextLoop: !1,
	_sendCleanupToScene: !1,
	_animationInterval: 0,
	_oldAnimationInterval: 0,
	_projection: 0,
	_accumDt: 0,
	_contentScaleFactor: 1,
	_displayStats: !1,
	_deltaTime: 0,
	_frameRate: 0,
	_FPSLabel: null,
	_SPFLabel: null,
	_drawsLabel: null,
	_winSizeInPoints: null,
	_lastUpdate: null,
	_nextScene: null,
	_notificationNode: null,
	_openGLView: null,
	_scenesStack: null,
	_projectionDelegate: null,
	_runningScene: null,
	_frames: 0,
	_totalFrames: 0,
	_secondsPerFrame: 0,
	_dirtyRegion: null,
	_scheduler: null,
	_actionManager: null,
	_eventProjectionChanged: null,
	_eventAfterDraw: null,
	_eventAfterVisit: null,
	_eventAfterUpdate: null,
	ctor: function() {
		var a = this;
		a._lastUpdate = Date.now(), cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
			a._lastUpdate = Date.now()
		})
	},
	init: function() {
		return this._oldAnimationInterval = this._animationInterval = 1 / cc.defaultFPS, this._scenesStack = [], this._projection = cc.Director.PROJECTION_DEFAULT, this._projectionDelegate = null, this._accumDt = 0, this._frameRate = 0, this._displayStats = !1, this._totalFrames = this._frames = 0, this._lastUpdate = Date.now(), this._paused = !1, this._purgeDirectorInNextLoop = !1, this._winSizeInPoints = cc.size(0, 0), this._openGLView = null, this._contentScaleFactor = 1, this._scheduler = new cc.Scheduler, cc.ActionManager ? (this._actionManager = new cc.ActionManager, this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1)) : this._actionManager = null, this._eventAfterDraw = new cc.EventCustom(cc.Director.EVENT_AFTER_DRAW), this._eventAfterDraw.setUserData(this), this._eventAfterVisit = new cc.EventCustom(cc.Director.EVENT_AFTER_VISIT), this._eventAfterVisit.setUserData(this), this._eventAfterUpdate = new cc.EventCustom(cc.Director.EVENT_AFTER_UPDATE), this._eventAfterUpdate.setUserData(this), this._eventProjectionChanged = new cc.EventCustom(cc.Director.EVENT_PROJECTION_CHANGED), this._eventProjectionChanged.setUserData(this), !0
	},
	calculateDeltaTime: function() {
		var a = Date.now();
		this._nextDeltaTimeZero ? (this._deltaTime = 0, this._nextDeltaTimeZero = !1) : this._deltaTime = (a - this._lastUpdate) / 1e3, cc.game.config[cc.game.CONFIG_KEY.debugMode] > 0 && this._deltaTime > .2 && (this._deltaTime = 1 / 60), this._lastUpdate = a
	},
	convertToGL: null,
	convertToUI: null,
	drawScene: function() {
		var a = cc.renderer;
		this.calculateDeltaTime(), this._paused || (this._scheduler.update(this._deltaTime), cc.eventManager.dispatchEvent(this._eventAfterUpdate)), a.clear(), this._nextScene && this.setNextScene(), this._beforeVisitScene && this._beforeVisitScene(), this._runningScene && (a.childrenOrderDirty === !0 ? (cc.renderer.clearRenderCommands(), this._runningScene._renderCmd._curLevel = 0, this._runningScene.visit(), a.resetFlag()) : a.transformDirty() === !0 && a.transform(), cc.eventManager.dispatchEvent(this._eventAfterVisit)), this._notificationNode && this._notificationNode.visit(), this._displayStats && this._showStats(), this._afterVisitScene && this._afterVisitScene(), a.rendering(cc._renderContext), cc.eventManager.dispatchEvent(this._eventAfterDraw), this._totalFrames++, this._displayStats && this._calculateMPF()
	},
	_beforeVisitScene: null,
	_afterVisitScene: null,
	end: function() {
		this._purgeDirectorInNextLoop = !0
	},
	getContentScaleFactor: function() {
		return this._contentScaleFactor
	},
	getNotificationNode: function() {
		return this._notificationNode
	},
	getWinSize: function() {
		return cc.size(this._winSizeInPoints)
	},
	getWinSizeInPixels: function() {
		return cc.size(this._winSizeInPoints.width * this._contentScaleFactor, this._winSizeInPoints.height * this._contentScaleFactor)
	},
	getVisibleSize: null,
	getVisibleOrigin: null,
	getZEye: null,
	pause: function() {
		this._paused || (this._oldAnimationInterval = this._animationInterval, this.setAnimationInterval(.25), this._paused = !0)
	},
	popScene: function() {
		cc.assert(this._runningScene, cc._LogInfos.Director_popScene), this._scenesStack.pop();
		var a = this._scenesStack.length;
		0 === a ? this.end() : (this._sendCleanupToScene = !0, this._nextScene = this._scenesStack[a - 1])
	},
	purgeCachedData: function() {
		cc.animationCache._clear(), cc.spriteFrameCache._clear(), cc.textureCache._clear()
	},
	purgeDirector: function() {
		this.getScheduler().unscheduleAll(), cc.eventManager && cc.eventManager.setEnabled(!1), this._runningScene && (this._runningScene.onExitTransitionDidStart(), this._runningScene.onExit(), this._runningScene.cleanup()), this._runningScene = null, this._nextScene = null, this._scenesStack.length = 0, this.stopAnimation(), this.purgeCachedData(), cc.checkGLErrorDebug()
	},
	pushScene: function(a) {
		cc.assert(a, cc._LogInfos.Director_pushScene), this._sendCleanupToScene = !1, this._scenesStack.push(a), this._nextScene = a
	},
	runScene: function(a) {
		if (cc.assert(a, cc._LogInfos.Director_pushScene), this._runningScene) {
			var b = this._scenesStack.length;
			0 === b ? (this._sendCleanupToScene = !0, this._scenesStack[b] = a, this._nextScene = a) : (this._sendCleanupToScene = !0, this._scenesStack[b - 1] = a, this._nextScene = a)
		} else this.pushScene(a), this.startAnimation()
	},
	resume: function() {
		this._paused && (this.setAnimationInterval(this._oldAnimationInterval), this._lastUpdate = Date.now(), this._lastUpdate || cc.log(cc._LogInfos.Director_resume), this._paused = !1, this._deltaTime = 0)
	},
	setContentScaleFactor: function(a) {
		a !== this._contentScaleFactor && (this._contentScaleFactor = a, this._createStatsLabel())
	},
	setDepthTest: null,
	setClearColor: null,
	setDefaultValues: function() {},
	setNextDeltaTimeZero: function(a) {
		this._nextDeltaTimeZero = a
	},
	setNextScene: function() {
		var a = !1,
			b = !1;
		if (cc.TransitionScene && (a = this._runningScene ? this._runningScene instanceof cc.TransitionScene : !1, b = this._nextScene ? this._nextScene instanceof cc.TransitionScene : !1), !b) {
			var c = this._runningScene;
			c && (c.onExitTransitionDidStart(), c.onExit()), this._sendCleanupToScene && c && c.cleanup()
		}
		this._runningScene = this._nextScene, cc.renderer.childrenOrderDirty = !0, this._nextScene = null, a || null === this._runningScene || (this._runningScene.onEnter(), this._runningScene.onEnterTransitionDidFinish())
	},
	setNotificationNode: function(a) {
		this._notificationNode = a, a || (cc.renderer.childrenOrderDirty = !0)
	},
	getDelegate: function() {
		return this._projectionDelegate
	},
	setDelegate: function(a) {
		this._projectionDelegate = a
	},
	setOpenGLView: null,
	setProjection: null,
	setViewport: null,
	getOpenGLView: null,
	getProjection: null,
	setAlphaBlending: null,
	_showStats: function() {
		this._frames++, this._accumDt += this._deltaTime, this._FPSLabel && this._SPFLabel && this._drawsLabel ? (this._accumDt > cc.DIRECTOR_FPS_INTERVAL && (this._SPFLabel.string = this._secondsPerFrame.toFixed(3), this._frameRate = this._frames / this._accumDt, this._frames = 0, this._accumDt = 0, this._FPSLabel.string = this._frameRate.toFixed(1), this._drawsLabel.string = (0 | cc.g_NumberOfDraws).toString()), this._FPSLabel.visit(), this._SPFLabel.visit(), this._drawsLabel.visit()) : this._createStatsLabel(), cc.g_NumberOfDraws = 0
	},
	isSendCleanupToScene: function() {
		return this._sendCleanupToScene
	},
	getRunningScene: function() {
		return this._runningScene
	},
	getAnimationInterval: function() {
		return this._animationInterval
	},
	isDisplayStats: function() {
		return this._displayStats
	},
	setDisplayStats: function(a) {
		this._displayStats = a
	},
	getSecondsPerFrame: function() {
		return this._secondsPerFrame
	},
	isNextDeltaTimeZero: function() {
		return this._nextDeltaTimeZero
	},
	isPaused: function() {
		return this._paused
	},
	getTotalFrames: function() {
		return this._totalFrames
	},
	popToRootScene: function() {
		this.popToSceneStackLevel(1)
	},
	popToSceneStackLevel: function(a) {
		cc.assert(this._runningScene, cc._LogInfos.Director_popToSceneStackLevel_2);
		var b = this._scenesStack,
			c = b.length;
		if (0 === c) return void this.end();
		if (!(a > c)) {
			for (; c > a;) {
				var d = b.pop();
				d.running && (d.onExitTransitionDidStart(), d.onExit()), d.cleanup(), c--
			}
			this._nextScene = b[b.length - 1], this._sendCleanupToScene = !1
		}
	},
	getScheduler: function() {
		return this._scheduler
	},
	setScheduler: function(a) {
		this._scheduler !== a && (this._scheduler = a)
	},
	getActionManager: function() {
		return this._actionManager
	},
	setActionManager: function(a) {
		this._actionManager !== a && (this._actionManager = a)
	},
	getDeltaTime: function() {
		return this._deltaTime
	},
	_createStatsLabel: null,
	_calculateMPF: function() {
		var a = Date.now();
		this._secondsPerFrame = (a - this._lastUpdate) / 1e3
	}
}), cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed", cc.Director.EVENT_AFTER_DRAW = "director_after_draw", cc.Director.EVENT_AFTER_VISIT = "director_after_visit", cc.Director.EVENT_AFTER_UPDATE = "director_after_update", cc.DisplayLinkDirector = cc.Director.extend({
	invalid: !1,
	startAnimation: function() {
		this._nextDeltaTimeZero = !0, this.invalid = !1
	},
	mainLoop: function() {
		this._purgeDirectorInNextLoop ? (this._purgeDirectorInNextLoop = !1, this.purgeDirector()) : this.invalid || this.drawScene()
	},
	stopAnimation: function() {
		this.invalid = !0
	},
	setAnimationInterval: function(a) {
		this._animationInterval = a, this.invalid || (this.stopAnimation(), this.startAnimation())
	}
}), cc.Director.sharedDirector = null, cc.Director.firstUseDirector = !0, cc.Director._getInstance = function() {
	return cc.Director.firstUseDirector && (cc.Director.firstUseDirector = !1, cc.Director.sharedDirector = new cc.DisplayLinkDirector, cc.Director.sharedDirector.init()), cc.Director.sharedDirector
}, cc.defaultFPS = 60, cc.Director.PROJECTION_2D = 0, cc.Director.PROJECTION_3D = 1, cc.Director.PROJECTION_CUSTOM = 3, cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_3D, cc._renderType === cc._RENDER_TYPE_CANVAS) {
	var _p = cc.Director.prototype;
	_p.setProjection = function(a) {
		this._projection = a, cc.eventManager.dispatchEvent(this._eventProjectionChanged)
	}, _p.setDepthTest = function() {}, _p.setClearColor = function(a) {
		cc.renderer._clearColor = a, cc.renderer._clearFillStyle = "rgb(" + a.r + "," + a.g + "," + a.b + ")"
	}, _p.setOpenGLView = function(a) {
		this._winSizeInPoints.width = cc._canvas.width, this._winSizeInPoints.height = cc._canvas.height, this._openGLView = a || cc.view, cc.eventManager && cc.eventManager.setEnabled(!0)
	}, _p._createStatsLabel = function() {
		var a = this,
			b = 0;
		b = a._winSizeInPoints.width > a._winSizeInPoints.height ? 0 | a._winSizeInPoints.height / 320 * 24 : 0 | a._winSizeInPoints.width / 320 * 24, a._FPSLabel = new cc.LabelTTF("000.0", "Arial", b), a._SPFLabel = new cc.LabelTTF("0.000", "Arial", b), a._drawsLabel = new cc.LabelTTF("0000", "Arial", b);
		var c = cc.DIRECTOR_STATS_POSITION;
		a._drawsLabel.setPosition(a._drawsLabel.width / 2 + c.x, 5 * a._drawsLabel.height / 2 + c.y), a._SPFLabel.setPosition(a._SPFLabel.width / 2 + c.x, 3 * a._SPFLabel.height / 2 + c.y), a._FPSLabel.setPosition(a._FPSLabel.width / 2 + c.x, a._FPSLabel.height / 2 + c.y)
	}, _p.getVisibleSize = function() {
		return this.getWinSize()
	}, _p.getVisibleOrigin = function() {
		return cc.p(0, 0)
	}
} else cc.Director._fpsImage = new Image, cc._addEventListener(cc.Director._fpsImage, "load", function() {
	cc.Director._fpsImageLoaded = !0
}), cc._fpsImage && (cc.Director._fpsImage.src = cc._fpsImage);
cc.PRIORITY_NON_SYSTEM = cc.PRIORITY_SYSTEM + 1, cc.ListEntry = function(a, b, c, d, e, f, g) {
	this.prev = a, this.next = b, this.callback = c, this.target = d, this.priority = e, this.paused = f, this.markedForDeletion = g
}, cc.HashUpdateEntry = function(a, b, c, d, e) {
	this.list = a, this.entry = b, this.target = c, this.callback = d, this.hh = e
}, cc.HashTimerEntry = cc.hashSelectorEntry = function(a, b, c, d, e, f, g) {
	var h = this;
	h.timers = a, h.target = b, h.timerIndex = c, h.currentTimer = d, h.currentTimerSalvaged = e, h.paused = f, h.hh = g
}, cc.Timer = cc.Class.extend({
	_scheduler: null,
	_elapsed: 0,
	_runForever: !1,
	_useDelay: !1,
	_timesExecuted: 0,
	_repeat: 0,
	_delay: 0,
	_interval: 0,
	getInterval: function() {
		return this._interval
	},
	setInterval: function(a) {
		this._interval = a
	},
	setupTimerWithInterval: function(a, b, c) {
		this._elapsed = -1, this._interval = a, this._delay = c, this._useDelay = this._delay > 0, this._repeat = b, this._runForever = this._repeat === cc.REPEAT_FOREVER
	},
	trigger: function() {
		return 0
	},
	cancel: function() {
		return 0
	},
	ctor: function() {
		this._scheduler = null, this._elapsed = -1, this._runForever = !1, this._useDelay = !1, this._timesExecuted = 0, this._repeat = 0, this._delay = 0, this._interval = 0
	},
	update: function(a) {
		-1 === this._elapsed ? (this._elapsed = 0, this._timesExecuted = 0) : (this._elapsed += a, this._runForever && !this._useDelay ? this._elapsed >= this._interval && (this.trigger(), this._elapsed = 0) : (this._useDelay ? this._elapsed >= this._delay && (this.trigger(), this._elapsed -= this._delay, this._timesExecuted += 1, this._useDelay = !1) : this._elapsed >= this._interval && (this.trigger(), this._elapsed = 0, this._timesExecuted += 1), !this._runForever && this._timesExecuted > this._repeat && this.cancel()))
	}
}), cc.TimerTargetSelector = cc.Timer.extend({
	_target: null,
	_selector: null,
	ctor: function() {
		this._target = null, this._selector = null
	},
	initWithSelector: function(a, b, c, d, e, f) {
		return this._scheduler = a, this._target = c, this._selector = b, this.setupTimerWithInterval(d, e, f), !0
	},
	getSelector: function() {
		return this._selector
	},
	trigger: function() {
		this._target && this._selector && this._target.call(this._selector, this._elapsed)
	},
	cancel: function() {
		this._scheduler.unschedule(this._selector, this._target)
	}
}), cc.TimerTargetCallback = cc.Timer.extend({
	_target: null,
	_callback: null,
	_key: null,
	ctor: function() {
		this._target = null, this._callback = null
	},
	initWithCallback: function(a, b, c, d, e, f, g) {
		return this._scheduler = a, this._target = c, this._callback = b, this._key = d, this.setupTimerWithInterval(e, f, g), !0
	},
	getCallback: function() {
		return this._callback
	},
	getKey: function() {
		return this._key
	},
	trigger: function() {
		this._callback && this._callback.call(this._target, this._elapsed)
	},
	cancel: function() {
		this._scheduler.unschedule(this._callback, this._target)
	}
}), cc.Scheduler = cc.Class.extend({
	_timeScale: 1,
	_updatesNegList: null,
	_updates0List: null,
	_updatesPosList: null,
	_hashForTimers: null,
	_arrayForTimers: null,
	_hashForUpdates: null,
	_currentTarget: null,
	_currentTargetSalvaged: !1,
	_updateHashLocked: !1,
	ctor: function() {
		this._timeScale = 1, this._updatesNegList = [], this._updates0List = [], this._updatesPosList = [], this._hashForUpdates = {}, this._hashForTimers = {}, this._currentTarget = null, this._currentTargetSalvaged = !1, this._updateHashLocked = !1, this._arrayForTimers = []
	},
	_schedulePerFrame: function(a, b, c, d) {
		var e = this._hashForUpdates[b.__instanceId];
		if (e && e.entry) {
			if (e.entry.priority === c) return e.entry.markedForDeletion = !1, void(e.entry.paused = d);
			if (this._updateHashLocked) return cc.log("warning: you CANNOT change update priority in scheduled function"), e.entry.markedForDeletion = !1, void(e.entry.paused = d);
			this.unscheduleUpdate(b)
		}
		0 === c ? this._appendIn(this._updates0List, a, b, d) : 0 > c ? this._priorityIn(this._updatesNegList, a, b, c, d) : this._priorityIn(this._updatesPosList, a, b, c, d)
	},
	_removeHashElement: function(a) {
		delete this._hashForTimers[a.target.__instanceId], cc.arrayRemoveObject(this._arrayForTimers, a), a.Timer = null, a.target = null, a = null
	},
	_removeUpdateFromHash: function(a) {
		var b = this,
			c = b._hashForUpdates[a.target.__instanceId];
		c && (cc.arrayRemoveObject(c.list, c.entry), delete b._hashForUpdates[c.target.__instanceId], c.entry = null, c.target = null)
	},
	_priorityIn: function(a, b, c, d, e) {
		var f = this,
			g = new cc.ListEntry(null, null, b, c, d, e, !1);
		if (a) {
			for (var h = a.length - 1, i = 0; h >= i; i++) if (d < a[i].priority) {
				h = i;
				break
			}
			a.splice(i, 0, g)
		} else a = [], a.push(g);
		return f._hashForUpdates[c.__instanceId] = new cc.HashUpdateEntry(a, g, c, null), a
	},
	_appendIn: function(a, b, c, d) {
		var e = this,
			f = new cc.ListEntry(null, null, b, c, 0, d, !1);
		a.push(f), e._hashForUpdates[c.__instanceId] = new cc.HashUpdateEntry(a, f, c, null, null)
	},
	setTimeScale: function(a) {
		this._timeScale = a
	},
	getTimeScale: function() {
		return this._timeScale
	},
	update: function(a) {
		this._updateHashLocked = !0, 1 !== this._timeScale && (a *= this._timeScale);
		var b, c, d, e;
		for (b = 0, c = this._updatesNegList, d = c.length; d > b; b++) e = c[b], e.paused || e.markedForDeletion || e.callback(a);
		for (b = 0, c = this._updates0List, d = c.length; d > b; b++) e = c[b], e.paused || e.markedForDeletion || e.callback(a);
		for (b = 0, c = this._updatesPosList, d = c.length; d > b; b++) e = c[b], e.paused || e.markedForDeletion || e.callback(a);
		var f, g = this._arrayForTimers;
		for (b = 0; b < g.length; b++) {
			if (f = g[b], this._currentTarget = f, this._currentTargetSalvaged = !1, !f.paused) for (f.timerIndex = 0; f.timerIndex < f.timers.length; ++f.timerIndex) f.currentTimer = f.timers[f.timerIndex], f.currentTimerSalvaged = !1, f.currentTimer.update(a), f.currentTimer = null;
			this._currentTargetSalvaged && 0 === this._currentTarget.timers.length && this._removeHashElement(this._currentTarget)
		}
		for (b = 0, c = this._updatesNegList; b < c.length;) e = c[b], e.markedForDeletion ? this._removeUpdateFromHash(e) : b++;
		for (b = 0, c = this._updates0List; b < c.length;) e = c[b], e.markedForDeletion ? this._removeUpdateFromHash(e) : b++;
		for (b = 0, c = this._updatesPosList; b < c.length;) e = c[b], e.markedForDeletion ? this._removeUpdateFromHash(e) : b++;
		this._updateHashLocked = !1, this._currentTarget = null
	},
	scheduleCallbackForTarget: function(a, b, c, d, e, f) {
		this.schedule(b, a, c, d, e, f, a.__instanceId + "")
	},
	schedule: function(a, b, c, d, e, f, g) {
		var h = !1;
		if ("function" != typeof a) {
			var i = a;
			h = !0
		}
		h === !1 ? 5 === arguments.length && (g = e, f = d, e = 0, d = cc.REPEAT_FOREVER) : 4 === arguments.length && (f = d, d = cc.REPEAT_FOREVER, e = 0), cc.assert(b, cc._LogInfos.Scheduler_scheduleCallbackForTarget_3), h === !1 && cc.assert(g, "key should not be empty!");
		var j = this._hashForTimers[b.__instanceId];
		j ? cc.assert(j.paused === f, "") : (j = new cc.HashTimerEntry(null, b, 0, null, null, f, null), this._arrayForTimers.push(j), this._hashForTimers[b.__instanceId] = j);
		var k, l;
		if (null == j.timers) j.timers = [];
		else if (h === !1) {
			for (l = 0; l < j.timers.length; l++) if (k = j.timers[l], a === k._callback) return cc.log(cc._LogInfos.Scheduler_scheduleCallbackForTarget, k.getInterval().toFixed(4), c.toFixed(4)), void(k._interval = c)
		} else for (l = 0; l < j.timers.length; ++l) if (k = j.timers[l], k && i === k.getSelector()) return cc.log("CCScheduler#scheduleSelector. Selector already scheduled. Updating interval from: %.4f to %.4f", k.getInterval(), c), void k.setInterval(c);
		h === !1 ? (k = new cc.TimerTargetCallback, k.initWithCallback(this, a, b, g, c, d, e), j.timers.push(k)) : (k = new cc.TimerTargetSelector, k.initWithSelector(this, i, b, c, d, e), j.timers.push(k))
	},
	scheduleUpdate: function(a, b, c) {
		this._schedulePerFrame(function(b) {
			a.update(b)
		}, a, b, c)
	},
	_getUnscheduleMark: function(a, b) {
		switch (typeof a) {
		case "number":
		case "string":
			return a === b.getKey();
		case "function":
			return a === b._callback;
		default:
			return a === b.getSelector()
		}
	},
	unschedule: function(a, b) {
		if (b && a) {
			var c = this,
				d = c._hashForTimers[b.__instanceId];
			if (d) for (var e = d.timers, f = 0, g = e.length; g > f; f++) {
				var h = e[f];
				if (this._getUnscheduleMark(a, h)) return h !== d.currentTimer || d.currentTimerSalvaged || (d.currentTimerSalvaged = !0), e.splice(f, 1), d.timerIndex >= f && d.timerIndex--, void(0 === e.length && (c._currentTarget === d ? c._currentTargetSalvaged = !0 : c._removeHashElement(d)))
			}
		}
	},
	unscheduleUpdate: function(a) {
		if (null != a) {
			var b = this._hashForUpdates[a.__instanceId];
			b && (this._updateHashLocked ? b.entry.markedForDeletion = !0 : this._removeUpdateFromHash(b.entry))
		}
	},
	unscheduleAllForTarget: function(a) {
		if (null != a) {
			var b = this._hashForTimers[a.__instanceId];
			b && (b.timers.indexOf(b.currentTimer) > -1 && !b.currentTimerSalvaged && (b.currentTimerSalvaged = !0), b.timers.length = 0, this._currentTarget === b ? this._currentTargetSalvaged = !0 : this._removeHashElement(b)), this.unscheduleUpdate(a)
		}
	},
	unscheduleAll: function() {
		this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM)
	},
	unscheduleAllWithMinPriority: function(a) {
		var b, c, d = this._arrayForTimers;
		for (b = d.length - 1; b >= 0; b--) c = d[b], this.unscheduleAllForTarget(c.target);
		var e, f = 0;
		if (0 > a) for (b = 0; b < this._updatesNegList.length;) f = this._updatesNegList.length, e = this._updatesNegList[b], e && e.priority >= a && this.unscheduleUpdate(e.target), f == this._updatesNegList.length && b++;
		if (0 >= a) for (b = 0; b < this._updates0List.length;) f = this._updates0List.length, e = this._updates0List[b], e && this.unscheduleUpdate(e.target), f == this._updates0List.length && b++;
		for (b = 0; b < this._updatesPosList.length;) f = this._updatesPosList.length, e = this._updatesPosList[b], e && e.priority >= a && this.unscheduleUpdate(e.target), f == this._updatesPosList.length && b++
	},
	isScheduled: function(a, b) {
		cc.assert(a, "Argument key must not be empty"), cc.assert(b, "Argument target must be non-nullptr");
		var c = this._hashForUpdates[b.__instanceId];
		if (!c) return !1;
		if (null == c.timers) return !1;
		for (var d = c.timers, e = 0; e < d.length; ++e) {
			var f = d[e];
			if (a === f.getKey()) return !0
		}
		return !1
	},
	pauseAllTargets: function() {
		return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM)
	},
	pauseAllTargetsWithMinPriority: function(a) {
		var b, c, d, e = [],
			f = this,
			g = f._arrayForTimers;
		for (c = 0, d = g.length; d > c; c++) b = g[c], b && (b.paused = !0, e.push(b.target));
		var h;
		if (0 > a) for (c = 0; c < this._updatesNegList.length; c++) h = this._updatesNegList[c], h && h.priority >= a && (h.paused = !0, e.push(h.target));
		if (0 >= a) for (c = 0; c < this._updates0List.length; c++) h = this._updates0List[c], h && (h.paused = !0, e.push(h.target));
		for (c = 0; c < this._updatesPosList.length; c++) h = this._updatesPosList[c], h && h.priority >= a && (h.paused = !0, e.push(h.target));
		return e
	},
	resumeTargets: function(a) {
		if (a) for (var b = 0; b < a.length; b++) this.resumeTarget(a[b])
	},
	pauseTarget: function(a) {
		cc.assert(a, cc._LogInfos.Scheduler_pauseTarget);
		var b = this,
			c = b._hashForTimers[a.__instanceId];
		c && (c.paused = !0);
		var d = b._hashForUpdates[a.__instanceId];
		d && (d.entry.paused = !0)
	},
	resumeTarget: function(a) {
		cc.assert(a, cc._LogInfos.Scheduler_resumeTarget);
		var b = this,
			c = b._hashForTimers[a.__instanceId];
		c && (c.paused = !1);
		var d = b._hashForUpdates[a.__instanceId];
		d && (d.entry.paused = !1)
	},
	isTargetPaused: function(a) {
		cc.assert(a, cc._LogInfos.Scheduler_isTargetPaused);
		var b = this._hashForTimers[a.__instanceId];
		if (b) return b.paused;
		var c = this._hashForUpdates[a.__instanceId];
		return c ? c.entry.paused : !1
	},
	scheduleUpdateForTarget: function(a, b, c) {
		this.scheduleUpdate(a, b, c)
	},
	unscheduleCallbackForTarget: function(a, b) {
		this.unschedule(b, a)
	},
	unscheduleUpdateForTarget: function(a) {
		this.unscheduleUpdate(a)
	},
	unscheduleAllCallbacksForTarget: function(a) {
		this.unschedule(a.__instanceId + "", a)
	},
	unscheduleAllCallbacks: function() {
		this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM)
	},
	unscheduleAllCallbacksWithMinPriority: function(a) {
		this.unscheduleAllWithMinPriority(a)
	}
}), cc.Scheduler.PRIORITY_SYSTEM = -2147483648, cc._tmp.PrototypeLabelTTF = function() {
	var a = cc.LabelTTF.prototype;
	cc.defineGetterSetter(a, "color", a.getColor, a.setColor), cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity), a.string, cc.defineGetterSetter(a, "string", a.getString, a.setString), a.textAlign, cc.defineGetterSetter(a, "textAlign", a.getHorizontalAlignment, a.setHorizontalAlignment), a.verticalAlign, cc.defineGetterSetter(a, "verticalAlign", a.getVerticalAlignment, a.setVerticalAlignment), a.fontSize, cc.defineGetterSetter(a, "fontSize", a.getFontSize, a.setFontSize), a.fontName, cc.defineGetterSetter(a, "fontName", a.getFontName, a.setFontName), a.font, cc.defineGetterSetter(a, "font", a._getFont, a._setFont), a.boundingSize, a.boundingWidth, cc.defineGetterSetter(a, "boundingWidth", a._getBoundingWidth, a._setBoundingWidth), a.boundingHeight, cc.defineGetterSetter(a, "boundingHeight", a._getBoundingHeight, a._setBoundingHeight), a.fillStyle, cc.defineGetterSetter(a, "fillStyle", a._getFillStyle, a.setFontFillColor), a.strokeStyle, cc.defineGetterSetter(a, "strokeStyle", a._getStrokeStyle, a._setStrokeStyle), a.lineWidth, cc.defineGetterSetter(a, "lineWidth", a._getLineWidth, a._setLineWidth), a.shadowOffset, a.shadowOffsetX, cc.defineGetterSetter(a, "shadowOffsetX", a._getShadowOffsetX, a._setShadowOffsetX), a.shadowOffsetY, cc.defineGetterSetter(a, "shadowOffsetY", a._getShadowOffsetY, a._setShadowOffsetY), a.shadowOpacity, cc.defineGetterSetter(a, "shadowOpacity", a._getShadowOpacity, a._setShadowOpacity), a.shadowBlur, cc.defineGetterSetter(a, "shadowBlur", a._getShadowBlur, a._setShadowBlur)
}, cc.LabelTTF = cc.Sprite.extend({
	_dimensions: null,
	_hAlignment: cc.TEXT_ALIGNMENT_CENTER,
	_vAlignment: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
	_fontName: null,
	_fontSize: 0,
	_string: "",
	_originalText: null,
	_shadowEnabled: !1,
	_shadowOffset: null,
	_shadowOpacity: 0,
	_shadowBlur: 0,
	_shadowColor: null,
	_strokeEnabled: !1,
	_strokeColor: null,
	_strokeSize: 0,
	_textFillColor: null,
	_strokeShadowOffsetX: 0,
	_strokeShadowOffsetY: 0,
	_needUpdateTexture: !1,
	_lineWidths: null,
	_className: "LabelTTF",
	_fontStyle: "normal",
	_fontWeight: "normal",
	_lineHeight: "normal",
	initWithString: function(a, b, c, d, e, f) {
		var g;
		return g = a ? a + "" : "", c = c || 16, d = d || cc.size(0, 0), e = e || cc.TEXT_ALIGNMENT_LEFT, f = f || cc.VERTICAL_TEXT_ALIGNMENT_TOP, this._opacityModifyRGB = !1, this._dimensions = cc.size(d.width, d.height), this._fontName = b || "Arial", this._hAlignment = e, this._vAlignment = f, this._fontSize = c, this._renderCmd._setFontStyle(this._fontName, c, this._fontStyle, this._fontWeight), this.string = g, this._renderCmd._setColorsString(), this._renderCmd._updateTexture(), this._setUpdateTextureDirty(), !0
	},
	_setUpdateTextureDirty: function() {
		this._needUpdateTexture = !0, this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.textDirty)
	},
	ctor: function(a, b, c, d, e, f) {
		cc.Sprite.prototype.ctor.call(this), this._dimensions = cc.size(0, 0), this._hAlignment = cc.TEXT_ALIGNMENT_LEFT, this._vAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP, this._opacityModifyRGB = !1, this._fontName = "Arial", this._shadowEnabled = !1, this._shadowOffset = cc.p(0, 0), this._shadowOpacity = 0, this._shadowBlur = 0, this._strokeEnabled = !1, this._strokeColor = cc.color(255, 255, 255, 255), this._strokeSize = 0, this._textFillColor = cc.color(255, 255, 255, 255), this._strokeShadowOffsetX = 0, this._strokeShadowOffsetY = 0, this._needUpdateTexture = !1, this._lineWidths = [], this._renderCmd._setColorsString(), this._textureLoaded = !0, b && b instanceof cc.FontDefinition ? this.initWithStringAndTextDefinition(a, b) : cc.LabelTTF.prototype.initWithString.call(this, a, b, c, d, e, f)
	},
	init: function() {
		return this.initWithString(" ", this._fontName, this._fontSize)
	},
	description: function() {
		return "<cc.LabelTTF | FontName =" + this._fontName + " FontSize = " + this._fontSize.toFixed(1) + ">"
	},
	getLineHeight: function() {
		return !this._lineHeight || this._lineHeight.charAt ? this._renderCmd._getFontClientHeight() : this._lineHeight || this._renderCmd._getFontClientHeight()
	},
	setLineHeight: function(a) {
		this._lineHeight = a
	},
	getString: function() {
		return this._string
	},
	getHorizontalAlignment: function() {
		return this._hAlignment
	},
	getVerticalAlignment: function() {
		return this._vAlignment
	},
	getDimensions: function() {
		return cc.size(this._dimensions)
	},
	getFontSize: function() {
		return this._fontSize
	},
	getFontName: function() {
		return this._fontName
	},
	initWithStringAndTextDefinition: function(a, b) {
		return this._updateWithTextDefinition(b, !1), this.string = a, !0
	},
	setTextDefinition: function(a) {
		a && this._updateWithTextDefinition(a, !0)
	},
	getTextDefinition: function() {
		return this._prepareTextDefinition(!1)
	},
	enableShadow: function(a, b, c, d) {
		null != a.r && null != a.g && null != a.b && null != a.a ? this._enableShadow(a, b, c) : this._enableShadowNoneColor(a, b, c, d)
	},
	_enableShadowNoneColor: function(a, b, c, d) {
		c = c || .5, !1 === this._shadowEnabled && (this._shadowEnabled = !0);
		var e = this._shadowOffset;
		(e && e.x !== a || e._y !== b) && (e.x = a, e.y = b), this._shadowOpacity !== c && (this._shadowOpacity = c), this._renderCmd._setColorsString(), this._shadowBlur !== d && (this._shadowBlur = d), this._setUpdateTextureDirty()
	},
	_enableShadow: function(a, b, c) {
		this._shadowColor || (this._shadowColor = cc.color(255, 255, 255, 128)), this._shadowColor.r = a.r, this._shadowColor.g = a.g, this._shadowColor.b = a.b;
		var d, e, f, g;
		d = b.width || b.x || 0, e = b.height || b.y || 0, f = null != a.a ? a.a / 255 : .5, g = c, this._enableShadowNoneColor(d, e, f, g)
	},
	_getShadowOffsetX: function() {
		return this._shadowOffset.x
	},
	_setShadowOffsetX: function(a) {
		!1 === this._shadowEnabled && (this._shadowEnabled = !0), this._shadowOffset.x !== a && (this._shadowOffset.x = a, this._setUpdateTextureDirty())
	},
	_getShadowOffsetY: function() {
		return this._shadowOffset._y
	},
	_setShadowOffsetY: function(a) {
		!1 === this._shadowEnabled && (this._shadowEnabled = !0), this._shadowOffset._y !== a && (this._shadowOffset._y = a, this._setUpdateTextureDirty())
	},
	_getShadowOffset: function() {
		return cc.p(this._shadowOffset.x, this._shadowOffset.y)
	},
	_setShadowOffset: function(a) {
		!1 === this._shadowEnabled && (this._shadowEnabled = !0), (this._shadowOffset.x !== a.x || this._shadowOffset.y !== a.y) && (this._shadowOffset.x = a.x, this._shadowOffset.y = a.y, this._setUpdateTextureDirty())
	},
	_getShadowOpacity: function() {
		return this._shadowOpacity
	},
	_setShadowOpacity: function(a) {
		!1 === this._shadowEnabled && (this._shadowEnabled = !0), this._shadowOpacity !== a && (this._shadowOpacity = a, this._renderCmd._setColorsString(), this._setUpdateTextureDirty())
	},
	_getShadowBlur: function() {
		return this._shadowBlur
	},
	_setShadowBlur: function(a) {
		!1 === this._shadowEnabled && (this._shadowEnabled = !0), this._shadowBlur !== a && (this._shadowBlur = a, this._setUpdateTextureDirty())
	},
	disableShadow: function() {
		this._shadowEnabled && (this._shadowEnabled = !1, this._setUpdateTextureDirty())
	},
	enableStroke: function(a, b) {
		this._strokeEnabled === !1 && (this._strokeEnabled = !0);
		var c = this._strokeColor;
		(c.r !== a.r || c.g !== a.g || c.b !== a.b) && (c.r = a.r, c.g = a.g, c.b = a.b, this._renderCmd._setColorsString()), this._strokeSize !== b && (this._strokeSize = b || 0), this._setUpdateTextureDirty()
	},
	_getStrokeStyle: function() {
		return this._strokeColor
	},
	_setStrokeStyle: function(a) {
		this._strokeEnabled === !1 && (this._strokeEnabled = !0);
		var b = this._strokeColor;
		(b.r !== a.r || b.g !== a.g || b.b !== a.b) && (b.r = a.r, b.g = a.g, b.b = a.b, this._renderCmd._setColorsString(), this._setUpdateTextureDirty())
	},
	_getLineWidth: function() {
		return this._strokeSize
	},
	_setLineWidth: function(a) {
		this._strokeEnabled === !1 && (this._strokeEnabled = !0), this._strokeSize !== a && (this._strokeSize = a || 0, this._setUpdateTextureDirty())
	},
	disableStroke: function() {
		this._strokeEnabled && (this._strokeEnabled = !1, this._setUpdateTextureDirty())
	},
	setFontFillColor: function(a) {
		var b = this._textFillColor;
		(b.r !== a.r || b.g !== a.g || b.b !== a.b) && (b.r = a.r, b.g = a.g, b.b = a.b, this._renderCmd._setColorsString(), this._needUpdateTexture = !0)
	},
	_getFillStyle: function() {
		return this._textFillColor
	},
	_updateWithTextDefinition: function(a, b) {
		a.fontDimensions ? (this._dimensions.width = a.boundingWidth, this._dimensions.height = a.boundingHeight) : (this._dimensions.width = 0, this._dimensions.height = 0), this._hAlignment = a.textAlign, this._vAlignment = a.verticalAlign, this._fontName = a.fontName, this._fontSize = a.fontSize || 12, a.lineHeight ? this._lineHeight = a.lineHeight : this._lineHeight = this._fontSize, this._renderCmd._setFontStyle(a), a.shadowEnabled && this.enableShadow(a.shadowOffsetX, a.shadowOffsetY, a.shadowOpacity, a.shadowBlur), a.strokeEnabled && this.enableStroke(a.strokeStyle, a.lineWidth), this.setFontFillColor(a.fillStyle), b && this._renderCmd._updateTexture();
		var c = cc.Node._dirtyFlags;
		this._renderCmd.setDirtyFlag(c.colorDirty | c.opacityDirty | c.textDirty)
	},
	_prepareTextDefinition: function(a) {
		var b = new cc.FontDefinition;
		if (a ? (b.fontSize = this._fontSize, b.boundingWidth = cc.contentScaleFactor() * this._dimensions.width, b.boundingHeight = cc.contentScaleFactor() * this._dimensions.height) : (b.fontSize = this._fontSize, b.boundingWidth = this._dimensions.width, b.boundingHeight = this._dimensions.height), b.fontName = this._fontName, b.textAlign = this._hAlignment, b.verticalAlign = this._vAlignment, this._strokeEnabled) {
			b.strokeEnabled = !0;
			var c = this._strokeColor;
			b.strokeStyle = cc.color(c.r, c.g, c.b), b.lineWidth = this._strokeSize
		} else b.strokeEnabled = !1;
		this._shadowEnabled ? (b.shadowEnabled = !0, b.shadowBlur = this._shadowBlur, b.shadowOpacity = this._shadowOpacity, b.shadowOffsetX = (a ? cc.contentScaleFactor() : 1) * this._shadowOffset.x, b.shadowOffsetY = (a ? cc.contentScaleFactor() : 1) * this._shadowOffset.y) : b._shadowEnabled = !1;
		var d = this._textFillColor;
		return b.fillStyle = cc.color(d.r, d.g, d.b), b
	},
	setString: function(a) {
		a = String(a), this._originalText !== a && (this._originalText = a + "", this._updateString(), this._setUpdateTextureDirty(), this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty))
	},
	_updateString: function() {
		this._string && "" !== this._string || this._string === this._originalText || (cc.renderer.childrenOrderDirty = !0), this._string = this._originalText
	},
	setHorizontalAlignment: function(a) {
		a !== this._hAlignment && (this._hAlignment = a, this._setUpdateTextureDirty())
	},
	setVerticalAlignment: function(a) {
		a !== this._vAlignment && (this._vAlignment = a, this._setUpdateTextureDirty())
	},
	setDimensions: function(a, b) {
		var c;
		void 0 === b ? (c = a.width, b = a.height) : c = a, (c !== this._dimensions.width || b !== this._dimensions.height) && (this._dimensions.width = c, this._dimensions.height = b, this._updateString(), this._setUpdateTextureDirty())
	},
	_getBoundingWidth: function() {
		return this._dimensions.width
	},
	_setBoundingWidth: function(a) {
		a !== this._dimensions.width && (this._dimensions.width = a, this._updateString(), this._setUpdateTextureDirty())
	},
	_getBoundingHeight: function() {
		return this._dimensions.height
	},
	_setBoundingHeight: function(a) {
		a !== this._dimensions.height && (this._dimensions.height = a, this._updateString(), this._setUpdateTextureDirty())
	},
	setFontSize: function(a) {
		this._fontSize !== a && (this._fontSize = a, this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight), this._setUpdateTextureDirty())
	},
	setFontName: function(a) {
		this._fontName && this._fontName !== a && (this._fontName = a, this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight), this._setUpdateTextureDirty())
	},
	_getFont: function() {
		return this._renderCmd._getFontStyle()
	},
	_setFont: function(a) {
		var b = cc.LabelTTF._fontStyleRE.exec(a);
		b && (this._fontSize = parseInt(b[1]), this._fontName = b[2], this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight), this._setUpdateTextureDirty())
	},
	getContentSize: function() {
		return this._needUpdateTexture && this._renderCmd._updateTTF(), cc.Sprite.prototype.getContentSize.call(this)
	},
	_getWidth: function() {
		return this._needUpdateTexture && this._renderCmd._updateTTF(), cc.Sprite.prototype._getWidth.call(this)
	},
	_getHeight: function() {
		return this._needUpdateTexture && this._renderCmd._updateTTF(), cc.Sprite.prototype._getHeight.call(this)
	},
	setTextureRect: function(a, b, c) {
		cc.Sprite.prototype.setTextureRect.call(this, a, b, c, !1)
	},
	_createRenderCmd: function() {
		return cc._renderType === cc._RENDER_TYPE_CANVAS ? new cc.LabelTTF.CanvasRenderCmd(this) : new cc.LabelTTF.WebGLRenderCmd(this)
	},
	_setFontStyle: function(a) {
		this._fontStyle !== a && (this._fontStyle = a, this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight), this._setUpdateTextureDirty())
	},
	_getFontStyle: function() {
		return this._fontStyle
	},
	_setFontWeight: function(a) {
		this._fontWeight !== a && (this._fontWeight = a, this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight), this._setUpdateTextureDirty())
	},
	_getFontWeight: function() {
		return this._fontWeight
	}
}), cc.assert(cc.isFunction(cc._tmp.PrototypeLabelTTF), cc._LogInfos.MissingFile, "LabelTTFPropertyDefine.js"), cc._tmp.PrototypeLabelTTF(), delete cc._tmp.PrototypeLabelTTF, cc.LabelTTF._fontStyleRE = /^(\d+)px\s+['"]?([\w\s\d]+)['"]?$/, cc.LabelTTF.create = function(a, b, c, d, e, f) {
	return new cc.LabelTTF(a, b, c, d, e, f)
}, cc.LabelTTF.createWithFontDefinition = cc.LabelTTF.create, cc.USE_LA88_LABELS ? cc.LabelTTF._SHADER_PROGRAM = cc.SHADER_POSITION_TEXTURECOLOR : cc.LabelTTF._SHADER_PROGRAM = cc.SHADER_POSITION_TEXTUREA8COLOR, cc.LabelTTF.__labelHeightDiv = cc.newElement("div"), cc.LabelTTF.__labelHeightDiv.style.fontFamily = "Arial", cc.LabelTTF.__labelHeightDiv.style.position = "absolute", cc.LabelTTF.__labelHeightDiv.style.left = "-100px", cc.LabelTTF.__labelHeightDiv.style.top = "-100px", cc.LabelTTF.__labelHeightDiv.style.lineHeight = "normal", document.body ? document.body.appendChild(cc.LabelTTF.__labelHeightDiv) : cc._addEventListener(window, "load", function() {
	this.removeEventListener("load", arguments.callee, !1), document.body.appendChild(cc.LabelTTF.__labelHeightDiv)
}, !1), cc.LabelTTF.__getFontHeightByDiv = function(a, b) {
	if (a instanceof cc.FontDefinition) {
		var c = a,
			d = cc.LabelTTF.__fontHeightCache[c._getCanvasFontStr()];
		if (d > 0) return d;
		var e = cc.LabelTTF.__labelHeightDiv;
		return e.innerHTML = "ajghl~!", e.style.fontFamily = c.fontName, e.style.fontSize = c.fontSize + "px", e.style.fontStyle = c.fontStyle, e.style.fontWeight = c.fontWeight, d = e.clientHeight, cc.LabelTTF.__fontHeightCache[c._getCanvasFontStr()] = d, e.innerHTML = "", d
	}
	var d = cc.LabelTTF.__fontHeightCache[a + "." + b];
	if (d > 0) return d;
	var e = cc.LabelTTF.__labelHeightDiv;
	return e.innerHTML = "ajghl~!", e.style.fontFamily = a, e.style.fontSize = b + "px", d = e.clientHeight, cc.LabelTTF.__fontHeightCache[a + "." + b] = d, e.innerHTML = "", d
}, cc.LabelTTF.__fontHeightCache = {}, cc.LabelTTF._textAlign = ["left", "center", "right"], cc.LabelTTF._textBaseline = ["top", "middle", "bottom"], cc.LabelTTF.wrapInspection = !0, cc.LabelTTF._wordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+|\S)/, cc.LabelTTF._symbolRex = /^[!,.:;}\]%\?>、‘“》？。，！]/, cc.LabelTTF._lastWordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+|\S)$/, cc.LabelTTF._lastEnglish = /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+$/, cc.LabelTTF._firsrEnglish = /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]/, function() {
	cc.LabelTTF.RenderCmd = function() {
		this._fontClientHeight = 18, this._fontStyleStr = "", this._shadowColorStr = "rgba(128, 128, 128, 0.5)", this._strokeColorStr = "", this._fillColorStr = "rgba(255,255,255,1)", this._labelCanvas = null, this._labelContext = null, this._lineWidths = [], this._strings = [], this._isMultiLine = !1
	};
	var a = cc.LabelTTF.RenderCmd.prototype;
	a.constructor = cc.LabelTTF.RenderCmd, a._getLabelContext = function() {
		if (this._labelContext) return this._labelContext;
		var a = this._node;
		if (!this._labelCanvas) {
			var b = cc.newElement("canvas");
			b.width = 1, b.height = 1;
			var c = new cc.Texture2D;
			c.initWithElement(b), a.setTexture(c), this._labelCanvas = b
		}
		return this._labelContext = this._labelCanvas.getContext("2d"), this._labelContext
	}, a._setFontStyle = function(a, b, c, d) {
		a instanceof cc.FontDefinition ? (this._fontStyleStr = a._getCanvasFontStr(), this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(a)) : (this._fontStyleStr = c + " " + d + " " + b + "px '" + a + "'", this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(a, b))
	}, a._getFontStyle = function() {
		return this._fontStyleStr
	}, a._getFontClientHeight = function() {
		return this._fontClientHeight
	}, a._updateTexture = function() {
		this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.textDirty ^ this._dirtyFlag;
		var a = this._node,
			b = this._getLabelContext(),
			c = this._labelCanvas,
			d = a._contentSize;
		if (0 === a._string.length) return c.width = 1, c.height = d.height || 1, a._texture && a._texture.handleLoadedTexture(), a.setTextureRect(cc.rect(0, 0, 1, d.height)), !0;
		b.font = this._fontStyleStr, this._updateTTF();
		var e = d.width,
			f = d.height,
			g = c.width === e && c.height === f;
		return c.width = e, c.height = f, g && b.clearRect(0, 0, e, f), this._drawTTFInCanvas(b), a._texture && a._texture.handleLoadedTexture(), a.setTextureRect(cc.rect(0, 0, e, f)), !0
	}, a._measureConfig = function() {
		this._getLabelContext().font = this._fontStyleStr
	}, a._measure = function(a) {
		return this._getLabelContext().measureText(a).width
	}, a._updateTTF = function() {
		var a, b, c = this._node,
			d = c._dimensions.width,
			e = this._lineWidths;
		if (e.length = 0, this._isMultiLine = !1, this._measureConfig(), 0 !== d) for (this._strings = c._string.split("\n"), a = 0; a < this._strings.length; a++) this._checkWarp(this._strings, a, d);
		else for (this._strings = c._string.split("\n"), a = 0, b = this._strings.length; b > a; a++) e.push(this._measure(this._strings[a]));
		this._strings.length > 1 && (this._isMultiLine = !0);
		var f, g = 0,
			h = 0;
		if (c._strokeEnabled && (g = h = 2 * c._strokeSize), c._shadowEnabled) {
			var i = c._shadowOffset;
			g += 2 * Math.abs(i.x), h += 2 * Math.abs(i.y)
		}
		f = 0 === d ? this._isMultiLine ? cc.size(Math.ceil(Math.max.apply(Math, e) + g), Math.ceil(this._fontClientHeight * this._strings.length + h)) : cc.size(Math.ceil(this._measure(c._string) + g), Math.ceil(this._fontClientHeight + h)) : 0 === c._dimensions.height ? this._isMultiLine ? cc.size(Math.ceil(d + g), Math.ceil(c.getLineHeight() * this._strings.length + h)) : cc.size(Math.ceil(d + g), Math.ceil(c.getLineHeight() + h)) : cc.size(Math.ceil(d + g), Math.ceil(c._dimensions.height + h)), "normal" !== c._getFontStyle() && (f.width = Math.ceil(f.width + .3 * c._fontSize)), c.setContentSize(f), c._strokeShadowOffsetX = g, c._strokeShadowOffsetY = h;
		var j = c._anchorPoint;
		this._anchorPointInPoints.x = .5 * g + (f.width - g) * j.x, this._anchorPointInPoints.y = .5 * h + (f.height - h) * j.y
	}, a._drawTTFInCanvas = function(a) {
		if (a) {
			var b = this._node,
				c = b._strokeShadowOffsetX,
				d = b._strokeShadowOffsetY,
				e = b._contentSize.height - d,
				f = b._vAlignment,
				g = b._hAlignment,
				h = b._strokeSize;
			a.setTransform(1, 0, 0, 1, .5 * c, e + .5 * d), a.font !== this._fontStyleStr && (a.font = this._fontStyleStr), a.fillStyle = this._fillColorStr;
			var i = 0,
				j = 0,
				k = b._strokeEnabled;
			if (k && (a.lineWidth = 2 * h, a.strokeStyle = this._strokeColorStr), b._shadowEnabled) {
				var l = b._shadowOffset;
				a.shadowColor = this._shadowColorStr, a.shadowOffsetX = l.x, a.shadowOffsetY = -l.y, a.shadowBlur = b._shadowBlur
			}
			a.textBaseline = cc.LabelTTF._textBaseline[f], a.textAlign = cc.LabelTTF._textAlign[g];
			var m = b._contentSize.width - c,
				n = b.getLineHeight(),
				o = (n - this._fontClientHeight) / 2;
			if (i += g === cc.TEXT_ALIGNMENT_RIGHT ? m : g === cc.TEXT_ALIGNMENT_CENTER ? m / 2 : 0, this._isMultiLine) {
				var p = this._strings.length;
				f === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM ? j = n - 2 * o + e - n * p : f === cc.VERTICAL_TEXT_ALIGNMENT_CENTER && (j = (n - 2 * o) / 2 + (e - n * p) / 2);
				for (var q = 0; p > q; q++) {
					var r = this._strings[q],
						s = -e + (n * q + o) + j;
					k && a.strokeText(r, i, s), a.fillText(r, i, s)
				}
			} else f === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM || (j -= f === cc.VERTICAL_TEXT_ALIGNMENT_TOP ? e : .5 * e), k && a.strokeText(b._string, i, j), a.fillText(b._string, i, j)
		}
	}, a._checkWarp = function(a, b, c) {
		var d = a[b],
			e = this._measure(d);
		if (e > c && d.length > 1) {
			for (var f, g = d.length * (c / e) | 0, h = d.substr(g), i = e - this._measure(h), j = 0, k = 0; i > c && k++ < 100;) g *= c / i, g = 0 | g, h = d.substr(g), i = e - this._measure(h);
			for (k = 0; c > i && k++ < 100;) {
				if (h) {
					var l = cc.LabelTTF._wordRex.exec(h);
					j = l ? l[0].length : 1, f = h
				}
				g += j, h = d.substr(g), i = e - this._measure(h)
			}
			g -= j, 0 === g && (g = 1, f = f.substr(1));
			var m, n = d.substr(0, g);
			cc.LabelTTF.wrapInspection && cc.LabelTTF._symbolRex.test(f || h) && (m = cc.LabelTTF._lastWordRex.exec(n), g -= m ? m[0].length : 0, f = d.substr(g), n = d.substr(0, g)), cc.LabelTTF._firsrEnglish.test(f) && (m = cc.LabelTTF._lastEnglish.exec(n), m && n !== m[0] && (g -= m[0].length, f = d.substr(g), n = d.substr(0, g))), a[b] = f || h, a.splice(b, 0, n)
		}
	}
}(), function() {
	cc.LabelTTF.CanvasRenderCmd = function(a) {
		cc.Sprite.CanvasRenderCmd.call(this, a), cc.LabelTTF.RenderCmd.call(this)
	}, cc.LabelTTF.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype), cc.inject(cc.LabelTTF.RenderCmd.prototype, cc.LabelTTF.CanvasRenderCmd.prototype);
	var a = cc.LabelTTF.CanvasRenderCmd.prototype;
	a.constructor = cc.LabelTTF.CanvasRenderCmd, a.updateStatus = function() {
		var a = cc.Node._dirtyFlags,
			b = this._dirtyFlag,
			c = b & a.colorDirty,
			d = b & a.opacityDirty;
		c && this._updateDisplayColor(), d && this._updateDisplayOpacity(), c ? this._updateColor() : b & a.textDirty && this._updateTexture(), this._dirtyFlag & a.transformDirty && (this.transform(this.getParentRenderCmd(), !0), this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag)
	}, a._syncStatus = function(a) {
		var b = cc.Node._dirtyFlags,
			c = this._dirtyFlag,
			d = a ? a._node : null;
		d && d._cascadeColorEnabled && a._dirtyFlag & b.colorDirty && (c |= b.colorDirty), d && d._cascadeOpacityEnabled && a._dirtyFlag & b.opacityDirty && (c |= b.opacityDirty), a && a._dirtyFlag & b.transformDirty && (c |= b.transformDirty);
		var e = c & b.colorDirty,
			f = c & b.opacityDirty;
		this._dirtyFlag = c, e && this._syncDisplayColor(), f && this._syncDisplayOpacity(), e ? this._updateColor() : c & b.textDirty && this._updateTexture(), c & b.transformDirty && this.transform(a)
	}, a._setColorsString = function() {
		var a = this._displayedColor,
			b = this._node,
			c = b._shadowColor || this._displayedColor,
			d = b._strokeColor,
			e = b._textFillColor,
			f = a.r / 255,
			g = a.g / 255,
			h = a.b / 255;
		this._shadowColorStr = "rgba(" + (0 | f * c.r) + "," + (0 | g * c.g) + "," + (0 | h * c.b) + "," + b._shadowOpacity + ")", this._fillColorStr = "rgba(" + (0 | f * e.r) + "," + (0 | g * e.g) + "," + (0 | h * e.b) + ", 1)", this._strokeColorStr = "rgba(" + (0 | f * d.r) + "," + (0 | g * d.g) + "," + (0 | h * d.b) + ", 1)"
	}, a._updateColor = function() {
		this._setColorsString(), this._updateTexture()
	}
}();
var cc = cc || {};
cc._tmp = cc._tmp || {}, cc.associateWithNative = function(a, b) {}, cc.KEY = {
	none: 0,
	back: 6,
	menu: 18,
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	pause: 19,
	capslock: 20,
	escape: 27,
	space: 32,
	pageup: 33,
	pagedown: 34,
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	select: 41,
	insert: 45,
	Delete: 46,
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	num0: 96,
	num1: 97,
	num2: 98,
	num3: 99,
	num4: 100,
	num5: 101,
	num6: 102,
	num7: 103,
	num8: 104,
	num9: 105,
	"*": 106,
	"+": 107,
	"-": 109,
	numdel: 110,
	"/": 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	numlock: 144,
	scrolllock: 145,
	";": 186,
	semicolon: 186,
	equal: 187,
	"=": 187,
	",": 188,
	comma: 188,
	dash: 189,
	".": 190,
	period: 190,
	forwardslash: 191,
	grave: 192,
	"[": 219,
	openbracket: 219,
	backslash: 220,
	"]": 221,
	closebracket: 221,
	quote: 222,
	dpadLeft: 1e3,
	dpadRight: 1001,
	dpadUp: 1003,
	dpadDown: 1004,
	dpadCenter: 1005
}, cc.FMT_JPG = 0, cc.FMT_PNG = 1, cc.FMT_TIFF = 2, cc.FMT_RAWDATA = 3, cc.FMT_WEBP = 4, cc.FMT_UNKNOWN = 5, cc.getImageFormatByData = function(a) {
	return a.length > 8 && 137 === a[0] && 80 === a[1] && 78 === a[2] && 71 === a[3] && 13 === a[4] && 10 === a[5] && 26 === a[6] && 10 === a[7] ? cc.FMT_PNG : a.length > 2 && (73 === a[0] && 73 === a[1] || 77 === a[0] && 77 === a[1] || 255 === a[0] && 216 === a[1]) ? cc.FMT_TIFF : cc.FMT_UNKNOWN
}, cc.inherits = function(a, b) {
	function c() {}
	c.prototype = b.prototype, a.superClass_ = b.prototype, a.prototype = new c, a.prototype.constructor = a
}, cc.base = function(a, b, c) {
	var d = arguments.callee.caller;
	if (d.superClass_) return ret = d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1)), ret;
	for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor) if (g.prototype[b] === d) f = !0;
	else if (f) return g.prototype[b].apply(a, e);
	if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
	throw Error("cc.base called from a method of one name to a method of a different name")
}, cc.rendererCanvas = {
	childrenOrderDirty: !0,
	_transformNodePool: [],
	_renderCmds: [],
	_isCacheToCanvasOn: !1,
	_cacheToCanvasCmds: {},
	_cacheInstanceIds: [],
	_currentID: 0,
	_clearColor: cc.color(),
	_clearFillStyle: "rgb(0, 0, 0)",
	getRenderCmd: function(a) {
		return a._createRenderCmd()
	},
	rendering: function(a) {
		var b, c, d = this._renderCmds,
			e = cc.view.getScaleX(),
			f = cc.view.getScaleY(),
			g = a || cc._renderContext;
		for (g.computeRealOffsetY(), b = 0, c = d.length; c > b; b++) d[b].rendering(g, e, f)
	},
	_renderingToCacheCanvas: function(a, b, c, d) {
		a || cc.log("The context of RenderTexture is invalid."), c = cc.isUndefined(c) ? 1 : c, d = cc.isUndefined(d) ? 1 : d, b = b || this._currentID;
		var e, f, g = this._cacheToCanvasCmds[b];
		for (a.computeRealOffsetY(), e = 0, f = g.length; f > e; e++) g[e].rendering(a, c, d);
		g.length = 0;
		var h = this._cacheInstanceIds;
		delete this._cacheToCanvasCmds[b], cc.arrayRemoveObject(h, b), 0 === h.length ? this._isCacheToCanvasOn = !1 : this._currentID = h[h.length - 1]
	},
	_turnToCacheMode: function(a) {
		this._isCacheToCanvasOn = !0, a = a || 0, this._cacheToCanvasCmds[a] = [], -1 === this._cacheInstanceIds.indexOf(a) && this._cacheInstanceIds.push(a), this._currentID = a
	},
	_turnToNormalMode: function() {
		this._isCacheToCanvasOn = !1
	},
	resetFlag: function() {
		this.childrenOrderDirty = !1, this._transformNodePool.length = 0
	},
	transform: function() {
		var a = this._transformNodePool;
		a.sort(this._sortNodeByLevelAsc);
		for (var b = 0, c = a.length; c > b; b++) 0 !== a[b]._dirtyFlag && a[b].updateStatus();
		a.length = 0
	},
	transformDirty: function() {
		return this._transformNodePool.length > 0
	},
	_sortNodeByLevelAsc: function(a, b) {
		return a._curLevel - b._curLevel
	},
	pushDirtyNode: function(a) {
		this._transformNodePool.push(a)
	},
	clear: function() {
		var a = cc._canvas,
			b = cc._renderContext.getContext(),
			c = cc._renderContext;
		b.setTransform(1, 0, 0, 1, 0, 0), 255 !== this._clearColor.a && b.clearRect(0, 0, a.width, a.height), c.setFillStyle(this._clearFillStyle), c.setGlobalAlpha(this._clearColor.a), b.fillRect(0, 0, a.width, a.height)
	},
	clearRenderCommands: function() {
		this._renderCmds.length = 0
	},
	pushRenderCommand: function(a) {
		if (a._needDraw) if (this._isCacheToCanvasOn) {
			var b = this._currentID,
				c = this._cacheToCanvasCmds,
				d = c[b]; - 1 === d.indexOf(a) && d.push(a)
		} else - 1 === this._renderCmds.indexOf(a) && this._renderCmds.push(a)
	}
}, cc._renderType === cc._RENDER_TYPE_CANVAS && (cc.renderer = cc.rendererCanvas), function() {
	cc.CanvasContextWrapper = function(a) {
		this._context = a, this._saveCount = 0, this._currentAlpha = a.globalAlpha, this._currentCompositeOperation = a.globalCompositeOperation, this._currentFillStyle = a.fillStyle, this._currentStrokeStyle = a.strokeStyle, this._offsetX = 0, this._offsetY = 0, this._realOffsetY = this.height, this._armatureMode = 0
	};
	var a = cc.CanvasContextWrapper.prototype;
	a.resetCache = function() {
		var a = this._context;
		this._currentAlpha = a.globalAlpha, this._currentCompositeOperation = a.globalCompositeOperation, this._currentFillStyle = a.fillStyle, this._currentStrokeStyle = a.strokeStyle, this._realOffsetY = this._context.canvas.height + this._offsetY
	}, a.setOffset = function(a, b) {
		this._offsetX = a, this._offsetY = b, this._realOffsetY = this._context.canvas.height + this._offsetY
	}, a.computeRealOffsetY = function() {
		this._realOffsetY = this._context.canvas.height + this._offsetY
	}, a.setViewScale = function(a, b) {
		this._scaleX = a, this._scaleY = b
	}, a.getContext = function() {
		return this._context
	}, a.save = function() {
		this._context.save(), this._saveCount++
	}, a.restore = function() {
		this._context.restore(), this._saveCount--
	}, a.setGlobalAlpha = function(a) {
		this._saveCount > 0 ? this._context.globalAlpha = a : this._currentAlpha !== a && (this._currentAlpha = a, this._context.globalAlpha = a)
	}, a.setCompositeOperation = function(a) {
		this._saveCount > 0 ? this._context.globalCompositeOperation = a : this._currentCompositeOperation !== a && (this._currentCompositeOperation = a, this._context.globalCompositeOperation = a)
	}, a.setFillStyle = function(a) {
		this._saveCount > 0 ? this._context.fillStyle = a : this._currentFillStyle !== a && (this._currentFillStyle = a, this._context.fillStyle = a)
	}, a.setStrokeStyle = function(a) {
		this._saveCount > 0 ? this._context.strokeStyle = a : this._currentStrokeStyle !== a && (this._currentStrokeStyle = a, this._context.strokeStyle = a)
	}, a.setTransform = function(a, b, c) {
		this._armatureMode > 0 ? (this.restore(), this.save(), this._context.transform(a.a, -a.b, -a.c, a.d, a.tx * b, -(a.ty * c))) : this._context.setTransform(a.a, -a.b, -a.c, a.d, this._offsetX + a.tx * b, this._realOffsetY - a.ty * c)
	}, a._switchToArmatureMode = function(a, b, c, d) {
		a ? (this._armatureMode++, this._context.setTransform(b.a, b.c, b.b, b.d, this._offsetX + b.tx * c, this._realOffsetY - b.ty * d), this.save()) : (this._armatureMode--, this.restore())
	}
}();
cc._LogInfos = {
	ActionManager_addAction: "cc.ActionManager.addAction(): action must be non-null",
	ActionManager_removeAction: "cocos2d: removeAction: Target not found",
	ActionManager_removeActionByTag: "cc.ActionManager.removeActionByTag(): an invalid tag",
	ActionManager_removeActionByTag_2: "cc.ActionManager.removeActionByTag(): target must be non-null",
	ActionManager_getActionByTag: "cc.ActionManager.getActionByTag(): an invalid tag",
	ActionManager_getActionByTag_2: "cocos2d : getActionByTag(tag = %s): Action not found",
	configuration_dumpInfo: "cocos2d: **** WARNING **** CC_ENABLE_PROFILERS is defined. Disable it when you finish profiling (from ccConfig.js)",
	configuration_loadConfigFile: "Expected 'data' dict, but not found. Config file: %s",
	configuration_loadConfigFile_2: "Please load the resource first : %s",
	Director_resume: "cocos2d: Director: Error in gettimeofday",
	Director_setProjection: "cocos2d: Director: unrecognized projection",
	Director_popToSceneStackLevel: "cocos2d: Director: unrecognized projection",
	Director_popToSceneStackLevel_2: "cocos2d: Director: Error in gettimeofday",
	Director_popScene: "running scene should not null",
	Director_pushScene: "the scene should not null",
	arrayVerifyType: "element type is wrong!",
	Scheduler_scheduleCallbackForTarget: "CCSheduler#scheduleCallback. Callback already scheduled. Updating interval from:%s to %s",
	Scheduler_scheduleCallbackForTarget_2: "cc.scheduler.scheduleCallbackForTarget(): callback_fn should be non-null.",
	Scheduler_scheduleCallbackForTarget_3: "cc.scheduler.scheduleCallbackForTarget(): target should be non-null.",
	Scheduler_pauseTarget: "cc.Scheduler.pauseTarget():target should be non-null",
	Scheduler_resumeTarget: "cc.Scheduler.resumeTarget():target should be non-null",
	Scheduler_isTargetPaused: "cc.Scheduler.isTargetPaused():target should be non-null",
	Node_getZOrder: "getZOrder is deprecated. Please use getLocalZOrder instead.",
	Node_setZOrder: "setZOrder is deprecated. Please use setLocalZOrder instead.",
	Node_getRotation: "RotationX != RotationY. Don't know which one to return",
	Node_getScale: "ScaleX != ScaleY. Don't know which one to return",
	Node_addChild: "An Node can't be added as a child of itself.",
	Node_addChild_2: "child already added. It can't be added again",
	Node_addChild_3: "child must be non-null",
	Node_removeFromParentAndCleanup: "removeFromParentAndCleanup is deprecated. Use removeFromParent instead",
	Node_boundingBox: "boundingBox is deprecated. Use getBoundingBox instead",
	Node_removeChildByTag: "argument tag is an invalid tag",
	Node_removeChildByTag_2: "cocos2d: removeChildByTag(tag = %s): child not found!",
	Node_removeAllChildrenWithCleanup: "removeAllChildrenWithCleanup is deprecated. Use removeAllChildren instead",
	Node_stopActionByTag: "cc.Node.stopActionBy(): argument tag an invalid tag",
	Node_getActionByTag: "cc.Node.getActionByTag(): argument tag is an invalid tag",
	Node_resumeSchedulerAndActions: "resumeSchedulerAndActions is deprecated, please use resume instead.",
	Node_pauseSchedulerAndActions: "pauseSchedulerAndActions is deprecated, please use pause instead.",
	Node__arrayMakeObjectsPerformSelector: "Unknown callback function",
	Node_reorderChild: "child must be non-null",
	Node_runAction: "cc.Node.runAction(): action must be non-null",
	Node_schedule: "callback function must be non-null",
	Node_schedule_2: "interval must be positive",
	Node_initWithTexture: "cocos2d: Could not initialize cc.AtlasNode. Invalid Texture.",
	AtlasNode_updateAtlasValues: "cc.AtlasNode.updateAtlasValues(): Shall be overridden in subclasses",
	AtlasNode_initWithTileFile: "",
	AtlasNode__initWithTexture: "cocos2d: Could not initialize cc.AtlasNode. Invalid Texture.",
	_EventListenerKeyboard_checkAvailable: "cc._EventListenerKeyboard.checkAvailable(): Invalid EventListenerKeyboard!",
	_EventListenerTouchOneByOne_checkAvailable: "cc._EventListenerTouchOneByOne.checkAvailable(): Invalid EventListenerTouchOneByOne!",
	_EventListenerTouchAllAtOnce_checkAvailable: "cc._EventListenerTouchAllAtOnce.checkAvailable(): Invalid EventListenerTouchAllAtOnce!",
	_EventListenerAcceleration_checkAvailable: "cc._EventListenerAcceleration.checkAvailable(): _onAccelerationEvent must be non-nil",
	EventListener_create: "Invalid parameter.",
	__getListenerID: "Don't call this method if the event is for touch.",
	eventManager__forceAddEventListener: "Invalid scene graph priority!",
	eventManager_addListener: "0 priority is forbidden for fixed priority since it's used for scene graph based priority.",
	eventManager_removeListeners: "Invalid listener type!",
	eventManager_setPriority: "Can't set fixed priority with scene graph based listener.",
	eventManager_addListener_2: "Invalid parameters.",
	eventManager_addListener_3: "listener must be a cc.EventListener object when adding a fixed priority listener",
	eventManager_addListener_4: "The listener has been registered, please don't register it again.",
	LayerMultiplex_initWithLayers: "parameters should not be ending with null in Javascript",
	LayerMultiplex_switchTo: "Invalid index in MultiplexLayer switchTo message",
	LayerMultiplex_switchToAndReleaseMe: "Invalid index in MultiplexLayer switchTo message",
	LayerMultiplex_addLayer: "cc.Layer.addLayer(): layer should be non-null",
	EGLView_setDesignResolutionSize: "Resolution not valid",
	EGLView_setDesignResolutionSize_2: "should set resolutionPolicy",
	inputManager_handleTouchesBegin: "The touches is more than MAX_TOUCHES, nUnusedIndex = %s",
	swap: "cc.swap is being modified from original macro, please check usage",
	checkGLErrorDebug: "WebGL error %s",
	animationCache__addAnimationsWithDictionary: "cocos2d: cc.AnimationCache: No animations were found in provided dictionary.",
	animationCache__addAnimationsWithDictionary_2: "cc.AnimationCache. Invalid animation format",
	animationCache_addAnimations: "cc.AnimationCache.addAnimations(): File could not be found",
	animationCache__parseVersion1: "cocos2d: cc.AnimationCache: Animation '%s' found in dictionary without any frames - cannot add to animation cache.",
	animationCache__parseVersion1_2: "cocos2d: cc.AnimationCache: Animation '%s' refers to frame '%s' which is not currently in the cc.SpriteFrameCache. This frame will not be added to the animation.",
	animationCache__parseVersion1_3: "cocos2d: cc.AnimationCache: None of the frames for animation '%s' were found in the cc.SpriteFrameCache. Animation is not being added to the Animation Cache.",
	animationCache__parseVersion1_4: "cocos2d: cc.AnimationCache: An animation in your dictionary refers to a frame which is not in the cc.SpriteFrameCache. Some or all of the frames for the animation '%s' may be missing.",
	animationCache__parseVersion2: "cocos2d: CCAnimationCache: Animation '%s' found in dictionary without any frames - cannot add to animation cache.",
	animationCache__parseVersion2_2: "cocos2d: cc.AnimationCache: Animation '%s' refers to frame '%s' which is not currently in the cc.SpriteFrameCache. This frame will not be added to the animation.",
	animationCache_addAnimations_2: "cc.AnimationCache.addAnimations(): Invalid texture file name",
	Sprite_reorderChild: "cc.Sprite.reorderChild(): this child is not in children list",
	Sprite_ignoreAnchorPointForPosition: "cc.Sprite.ignoreAnchorPointForPosition(): it is invalid in cc.Sprite when using SpriteBatchNode",
	Sprite_setDisplayFrameWithAnimationName: "cc.Sprite.setDisplayFrameWithAnimationName(): Frame not found",
	Sprite_setDisplayFrameWithAnimationName_2: "cc.Sprite.setDisplayFrameWithAnimationName(): Invalid frame index",
	Sprite_setDisplayFrame: "setDisplayFrame is deprecated, please use setSpriteFrame instead.",
	Sprite__updateBlendFunc: "cc.Sprite._updateBlendFunc(): _updateBlendFunc doesn't work when the sprite is rendered using a cc.CCSpriteBatchNode",
	Sprite_initWithSpriteFrame: "cc.Sprite.initWithSpriteFrame(): spriteFrame should be non-null",
	Sprite_initWithSpriteFrameName: "cc.Sprite.initWithSpriteFrameName(): spriteFrameName should be non-null",
	Sprite_initWithSpriteFrameName1: " is null, please check.",
	Sprite_initWithFile: "cc.Sprite.initWithFile(): filename should be non-null",
	Sprite_setDisplayFrameWithAnimationName_3: "cc.Sprite.setDisplayFrameWithAnimationName(): animationName must be non-null",
	Sprite_reorderChild_2: "cc.Sprite.reorderChild(): child should be non-null",
	Sprite_addChild: "cc.Sprite.addChild(): cc.Sprite only supports cc.Sprites as children when using cc.SpriteBatchNode",
	Sprite_addChild_2: "cc.Sprite.addChild(): cc.Sprite only supports a sprite using same texture as children when using cc.SpriteBatchNode",
	Sprite_addChild_3: "cc.Sprite.addChild(): child should be non-null",
	Sprite_setTexture: "cc.Sprite.texture setter: Batched sprites should use the same texture as the batchnode",
	Sprite_updateQuadFromSprite: "cc.SpriteBatchNode.updateQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children",
	Sprite_insertQuadFromSprite: "cc.SpriteBatchNode.insertQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children",
	Sprite_addChild_4: "cc.SpriteBatchNode.addChild(): cc.SpriteBatchNode only supports cc.Sprites as children",
	Sprite_addChild_5: "cc.SpriteBatchNode.addChild(): cc.Sprite is not using the same texture",
	Sprite_initWithTexture: "Sprite.initWithTexture(): Argument must be non-nil ",
	Sprite_setSpriteFrame: "Invalid spriteFrameName",
	Sprite_setTexture_2: "Invalid argument: cc.Sprite.texture setter expects a CCTexture2D.",
	Sprite_updateQuadFromSprite_2: "cc.SpriteBatchNode.updateQuadFromSprite(): sprite should be non-null",
	Sprite_insertQuadFromSprite_2: "cc.SpriteBatchNode.insertQuadFromSprite(): sprite should be non-null",
	SpriteBatchNode_addSpriteWithoutQuad: "cc.SpriteBatchNode.addQuadFromSprite(): SpriteBatchNode only supports cc.Sprites as children",
	SpriteBatchNode_increaseAtlasCapacity: "cocos2d: CCSpriteBatchNode: resizing TextureAtlas capacity from %s to %s.",
	SpriteBatchNode_increaseAtlasCapacity_2: "cocos2d: WARNING: Not enough memory to resize the atlas",
	SpriteBatchNode_reorderChild: "cc.SpriteBatchNode.addChild(): Child doesn't belong to Sprite",
	SpriteBatchNode_removeChild: "cc.SpriteBatchNode.addChild(): sprite batch node should contain the child",
	SpriteBatchNode_addSpriteWithoutQuad_2: "cc.SpriteBatchNode.addQuadFromSprite(): child should be non-null",
	SpriteBatchNode_reorderChild_2: "cc.SpriteBatchNode.addChild(): child should be non-null",
	spriteFrameCache__getFrameConfig: "cocos2d: WARNING: originalWidth/Height not found on the cc.SpriteFrame. AnchorPoint won't work as expected. Regenrate the .plist",
	spriteFrameCache_addSpriteFrames: "cocos2d: WARNING: an alias with name %s already exists",
	spriteFrameCache__checkConflict: "cocos2d: WARNING: Sprite frame: %s has already been added by another source, please fix name conflit",
	spriteFrameCache_getSpriteFrame: "cocos2d: cc.SpriteFrameCahce: Frame %s not found",
	spriteFrameCache__getFrameConfig_2: "Please load the resource first : %s",
	spriteFrameCache_addSpriteFrames_2: "cc.SpriteFrameCache.addSpriteFrames(): plist should be non-null",
	spriteFrameCache_addSpriteFrames_3: "Argument must be non-nil",
	CCSpriteBatchNode_updateQuadFromSprite: "cc.SpriteBatchNode.updateQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children",
	CCSpriteBatchNode_insertQuadFromSprite: "cc.SpriteBatchNode.insertQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children",
	CCSpriteBatchNode_addChild: "cc.SpriteBatchNode.addChild(): cc.SpriteBatchNode only supports cc.Sprites as children",
	CCSpriteBatchNode_initWithTexture: "Sprite.initWithTexture(): Argument must be non-nil ",
	CCSpriteBatchNode_addChild_2: "cc.Sprite.addChild(): child should be non-null",
	CCSpriteBatchNode_setSpriteFrame: "Invalid spriteFrameName",
	CCSpriteBatchNode_setTexture: "Invalid argument: cc.Sprite texture setter expects a CCTexture2D.",
	CCSpriteBatchNode_updateQuadFromSprite_2: "cc.SpriteBatchNode.updateQuadFromSprite(): sprite should be non-null",
	CCSpriteBatchNode_insertQuadFromSprite_2: "cc.SpriteBatchNode.insertQuadFromSprite(): sprite should be non-null",
	CCSpriteBatchNode_addChild_3: "cc.SpriteBatchNode.addChild(): child should be non-null",
	TextureAtlas_initWithFile: "cocos2d: Could not open file: %s",
	TextureAtlas_insertQuad: "cc.TextureAtlas.insertQuad(): invalid totalQuads",
	TextureAtlas_initWithTexture: "cc.TextureAtlas.initWithTexture():texture should be non-null",
	TextureAtlas_updateQuad: "cc.TextureAtlas.updateQuad(): quad should be non-null",
	TextureAtlas_updateQuad_2: "cc.TextureAtlas.updateQuad(): Invalid index",
	TextureAtlas_insertQuad_2: "cc.TextureAtlas.insertQuad(): Invalid index",
	TextureAtlas_insertQuads: "cc.TextureAtlas.insertQuad(): Invalid index + amount",
	TextureAtlas_insertQuadFromIndex: "cc.TextureAtlas.insertQuadFromIndex(): Invalid newIndex",
	TextureAtlas_insertQuadFromIndex_2: "cc.TextureAtlas.insertQuadFromIndex(): Invalid fromIndex",
	TextureAtlas_removeQuadAtIndex: "cc.TextureAtlas.removeQuadAtIndex(): Invalid index",
	TextureAtlas_removeQuadsAtIndex: "cc.TextureAtlas.removeQuadsAtIndex(): index + amount out of bounds",
	TextureAtlas_moveQuadsFromIndex: "cc.TextureAtlas.moveQuadsFromIndex(): move is out of bounds",
	TextureAtlas_moveQuadsFromIndex_2: "cc.TextureAtlas.moveQuadsFromIndex(): Invalid newIndex",
	TextureAtlas_moveQuadsFromIndex_3: "cc.TextureAtlas.moveQuadsFromIndex(): Invalid oldIndex",
	textureCache_addPVRTCImage: "TextureCache:addPVRTCImage does not support on HTML5",
	textureCache_addETCImage: "TextureCache:addPVRTCImage does not support on HTML5",
	textureCache_textureForKey: "textureForKey is deprecated. Please use getTextureForKey instead.",
	textureCache_addPVRImage: "addPVRImage does not support on HTML5",
	textureCache_addUIImage: "cocos2d: Couldn't add UIImage in TextureCache",
	textureCache_dumpCachedTextureInfo: "cocos2d: '%s' id=%s %s x %s",
	textureCache_dumpCachedTextureInfo_2: "cocos2d: '%s' id= HTMLCanvasElement %s x %s",
	textureCache_dumpCachedTextureInfo_3: "cocos2d: TextureCache dumpDebugInfo: %s textures, HTMLCanvasElement for %s KB (%s MB)",
	textureCache_addUIImage_2: "cc.Texture.addUIImage(): image should be non-null",
	Texture2D_initWithETCFile: "initWithETCFile does not support on HTML5",
	Texture2D_initWithPVRFile: "initWithPVRFile does not support on HTML5",
	Texture2D_initWithPVRTCData: "initWithPVRTCData does not support on HTML5",
	Texture2D_addImage: "cc.Texture.addImage(): path should be non-null",
	Texture2D_initWithImage: "cocos2d: cc.Texture2D. Can't create Texture. UIImage is nil",
	Texture2D_initWithImage_2: "cocos2d: WARNING: Image (%s x %s) is bigger than the supported %s x %s",
	Texture2D_initWithString: "initWithString isn't supported on cocos2d-html5",
	Texture2D_initWithETCFile_2: "initWithETCFile does not support on HTML5",
	Texture2D_initWithPVRFile_2: "initWithPVRFile does not support on HTML5",
	Texture2D_initWithPVRTCData_2: "initWithPVRTCData does not support on HTML5",
	Texture2D_bitsPerPixelForFormat: "bitsPerPixelForFormat: %s, cannot give useful result, it's a illegal pixel format",
	Texture2D__initPremultipliedATextureWithImage: "cocos2d: cc.Texture2D: Using RGB565 texture since image has no alpha",
	Texture2D_addImage_2: "cc.Texture.addImage(): path should be non-null",
	Texture2D_initWithData: "NSInternalInconsistencyException",
	MissingFile: "Missing file: %s",
	radiansToDegress: "cc.radiansToDegress() should be called cc.radiansToDegrees()",
	RectWidth: "Rect width exceeds maximum margin: %s",
	RectHeight: "Rect height exceeds maximum margin: %s",
	EventManager__updateListeners: "If program goes here, there should be event in dispatch.",
	EventManager__updateListeners_2: "_inDispatch should be 1 here."
}, cc._logToWebPage = function(a) {
	if (cc._canvas) {
		var b = cc._logList,
			c = document;
		if (!b) {
			var d = c.createElement("Div"),
				e = d.style;
			d.setAttribute("id", "logInfoDiv"), cc._canvas.parentNode.appendChild(d), d.setAttribute("width", "200"), d.setAttribute("height", cc._canvas.height), e.zIndex = "99999", e.position = "absolute", e.top = "0", e.left = "0", b = cc._logList = c.createElement("textarea");
			var f = b.style;
			b.setAttribute("rows", "20"), b.setAttribute("cols", "30"), b.setAttribute("disabled", !0), d.appendChild(b), f.backgroundColor = "transparent", f.borderBottom = "1px solid #cccccc", f.borderRightWidth = "0px", f.borderLeftWidth = "0px", f.borderTopWidth = "0px", f.borderTopStyle = "none", f.borderRightStyle = "none", f.borderLeftStyle = "none", f.padding = "0px", f.margin = 0
		}
		b.value = b.value + a + "\r\n", b.scrollTop = b.scrollHeight
	}
}, cc._formatString = function(a) {
	if (!cc.isObject(a)) return a;
	try {
		return JSON.stringify(a)
	} catch (b) {
		return ""
	}
}, cc._initDebugSetting = function(a) {
	var b = cc.game;
	if (a !== b.DEBUG_MODE_NONE) {
		var c;
		a > b.DEBUG_MODE_ERROR ? (c = cc._logToWebPage.bind(cc), cc.error = function() {
			c("ERROR :  " + cc.formatStr.apply(cc, arguments))
		}, cc.assert = function(a, b) {
			if (!a && b) {
				for (var d = 2; d < arguments.length; d++) b = b.replace(/(%s)|(%d)/, cc._formatString(arguments[d]));
				c("Assert: " + b)
			}
		}, a !== b.DEBUG_MODE_ERROR_FOR_WEB_PAGE && (cc.warn = function() {
			c("WARN :  " + cc.formatStr.apply(cc, arguments))
		}), a === b.DEBUG_MODE_INFO_FOR_WEB_PAGE && (cc.log = function() {
			c(cc.formatStr.apply(cc, arguments))
		})) : console && console.log.apply && (cc.error = function() {
			return console.error.apply(console, arguments)
		}, cc.assert = function(a, b) {
			if (!a && b) {
				for (var c = 2; c < arguments.length; c++) b = b.replace(/(%s)|(%d)/, cc._formatString(arguments[c]));
				throw new Error(b)
			}
		}, a !== b.DEBUG_MODE_ERROR && (cc.warn = function() {
			return console.warn.apply(console, arguments)
		}), a === b.DEBUG_MODE_INFO && (cc.log = function() {
			return console.log.apply(console, arguments)
		}))
	}
}, cc._initDebugSetting(cc.game.config[cc.game.CONFIG_KEY.debugMode]);
cc.HashElement = cc.Class.extend({
	actions: null,
	target: null,
	actionIndex: 0,
	currentAction: null,
	currentActionSalvaged: !1,
	paused: !1,
	hh: null,
	ctor: function() {
		this.actions = [], this.target = null, this.actionIndex = 0, this.currentAction = null, this.currentActionSalvaged = !1, this.paused = !1, this.hh = null
	}
}), cc.ActionManager = cc.Class.extend({
	_hashTargets: null,
	_arrayTargets: null,
	_currentTarget: null,
	_currentTargetSalvaged: !1,
	_searchElementByTarget: function(a, b) {
		for (var c = 0; c < a.length; c++) if (b === a[c].target) return a[c];
		return null
	},
	ctor: function() {
		this._hashTargets = {}, this._arrayTargets = [], this._currentTarget = null, this._currentTargetSalvaged = !1
	},
	addAction: function(a, b, c) {
		if (!a) throw new Error("cc.ActionManager.addAction(): action must be non-null");
		if (!b) throw new Error("cc.ActionManager.addAction(): action must be non-null");
		var d = this._hashTargets[b.__instanceId];
		d || (d = new cc.HashElement, d.paused = c, d.target = b, this._hashTargets[b.__instanceId] = d, this._arrayTargets.push(d)), this._actionAllocWithHashElement(d), d.actions.push(a), a.startWithTarget(b)
	},
	removeAllActions: function() {
		for (var a = this._arrayTargets, b = 0; b < a.length; b++) {
			var c = a[b];
			c && this.removeAllActionsFromTarget(c.target, !0)
		}
	},
	removeAllActionsFromTarget: function(a, b) {
		if (null != a) {
			var c = this._hashTargets[a.__instanceId];
			c && (-1 === c.actions.indexOf(c.currentAction) || c.currentActionSalvaged || (c.currentActionSalvaged = !0), c.actions.length = 0, this._currentTarget !== c || b ? this._deleteHashElement(c) : this._currentTargetSalvaged = !0)
		}
	},
	removeAction: function(a) {
		if (null != a) {
			var b = a.getOriginalTarget(),
				c = this._hashTargets[b.__instanceId];
			if (c) {
				for (var d = 0; d < c.actions.length; d++) if (c.actions[d] === a) {
					c.actions.splice(d, 1);
					break
				}
			} else cc.log(cc._LogInfos.ActionManager_removeAction)
		}
	},
	removeActionByTag: function(a, b) {
		a === cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_addAction), cc.assert(b, cc._LogInfos.ActionManager_addAction);
		var c = this._hashTargets[b.__instanceId];
		if (c) for (var d = c.actions.length, e = 0; d > e; ++e) {
			var f = c.actions[e];
			if (f && f.getTag() === a && f.getOriginalTarget() === b) {
				this._removeActionAtIndex(e, c);
				break
			}
		}
	},
	getActionByTag: function(a, b) {
		a === cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_getActionByTag);
		var c = this._hashTargets[b.__instanceId];
		if (c) {
			if (null != c.actions) for (var d = 0; d < c.actions.length; ++d) {
				var e = c.actions[d];
				if (e && e.getTag() === a) return e
			}
			cc.log(cc._LogInfos.ActionManager_getActionByTag_2, a)
		}
		return null
	},
	numberOfRunningActionsInTarget: function(a) {
		var b = this._hashTargets[a.__instanceId];
		return b && b.actions ? b.actions.length : 0
	},
	pauseTarget: function(a) {
		var b = this._hashTargets[a.__instanceId];
		b && (b.paused = !0)
	},
	resumeTarget: function(a) {
		var b = this._hashTargets[a.__instanceId];
		b && (b.paused = !1)
	},
	pauseAllRunningActions: function() {
		for (var a = [], b = this._arrayTargets, c = 0; c < b.length; c++) {
			var d = b[c];
			d && !d.paused && (d.paused = !0, a.push(d.target))
		}
		return a
	},
	resumeTargets: function(a) {
		if (a) for (var b = 0; b < a.length; b++) a[b] && this.resumeTarget(a[b])
	},
	purgeSharedManager: function() {
		cc.director.getScheduler().unscheduleUpdate(this)
	},
	_removeActionAtIndex: function(a, b) {
		var c = b.actions[a];
		c !== b.currentAction || b.currentActionSalvaged || (b.currentActionSalvaged = !0), b.actions.splice(a, 1), b.actionIndex >= a && b.actionIndex--, 0 === b.actions.length && (this._currentTarget === b ? this._currentTargetSalvaged = !0 : this._deleteHashElement(b))
	},
	_deleteHashElement: function(a) {
		var b = !1;
		return a && (this._hashTargets[a.target.__instanceId] && (delete this._hashTargets[a.target.__instanceId], cc.arrayRemoveObject(this._arrayTargets, a), b = !0), a.actions = null, a.target = null), b
	},
	_actionAllocWithHashElement: function(a) {
		null == a.actions && (a.actions = [])
	},
	update: function(a) {
		for (var b, c = this._arrayTargets, d = 0; d < c.length; d++) {
			if (this._currentTarget = c[d], b = this._currentTarget, !b.paused) for (b.actionIndex = 0; b.actionIndex < (b.actions ? b.actions.length : 0); b.actionIndex++) if (b.currentAction = b.actions[b.actionIndex], b.currentAction) {
				if (b.currentActionSalvaged = !1, b.currentAction.step(a * (b.currentAction._speedMethod ? b.currentAction._speed : 1)), b.currentActionSalvaged) b.currentAction = null;
				else if (b.currentAction.isDone()) {
					b.currentAction.stop();
					var e = b.currentAction;
					b.currentAction = null, this.removeAction(e)
				}
				b.currentAction = null
			}
			this._currentTargetSalvaged && 0 === b.actions.length && this._deleteHashElement(b) && d--
		}
	}
}), cc.ACTION_TAG_INVALID = -1, cc.Action = cc.Class.extend({
	originalTarget: null,
	target: null,
	tag: cc.ACTION_TAG_INVALID,
	ctor: function() {
		this.originalTarget = null, this.target = null, this.tag = cc.ACTION_TAG_INVALID
	},
	copy: function() {
		return cc.log("copy is deprecated. Please use clone instead."), this.clone()
	},
	clone: function() {
		var a = new cc.Action;
		return a.originalTarget = null, a.target = null, a.tag = this.tag, a
	},
	isDone: function() {
		return !0
	},
	startWithTarget: function(a) {
		this.originalTarget = a, this.target = a
	},
	stop: function() {
		this.target = null
	},
	step: function(a) {
		cc.log("[Action step]. override me")
	},
	update: function(a) {
		cc.log("[Action update]. override me")
	},
	getTarget: function() {
		return this.target
	},
	setTarget: function(a) {
		this.target = a
	},
	getOriginalTarget: function() {
		return this.originalTarget
	},
	setOriginalTarget: function(a) {
		this.originalTarget = a
	},
	getTag: function() {
		return this.tag
	},
	setTag: function(a) {
		this.tag = a
	},
	retain: function() {},
	release: function() {}
}), cc.action = function() {
	return new cc.Action
}, cc.Action.create = cc.action, cc.FiniteTimeAction = cc.Action.extend({
	_duration: 0,
	ctor: function() {
		cc.Action.prototype.ctor.call(this), this._duration = 0
	},
	getDuration: function() {
		return this._duration * (this._timesForRepeat || 1)
	},
	setDuration: function(a) {
		this._duration = a
	},
	reverse: function() {
		return cc.log("cocos2d: FiniteTimeAction#reverse: Implement me"), null
	},
	clone: function() {
		return new cc.FiniteTimeAction
	}
}), cc.Speed = cc.Action.extend({
	_speed: 0,
	_innerAction: null,
	ctor: function(a, b) {
		cc.Action.prototype.ctor.call(this), this._speed = 0, this._innerAction = null, a && this.initWithAction(a, b)
	},
	getSpeed: function() {
		return this._speed
	},
	setSpeed: function(a) {
		this._speed = a
	},
	initWithAction: function(a, b) {
		if (!a) throw new Error("cc.Speed.initWithAction(): action must be non nil");
		return this._innerAction = a, this._speed = b, !0
	},
	clone: function() {
		var a = new cc.Speed;
		return a.initWithAction(this._innerAction.clone(), this._speed), a
	},
	startWithTarget: function(a) {
		cc.Action.prototype.startWithTarget.call(this, a), this._innerAction.startWithTarget(a)
	},
	stop: function() {
		this._innerAction.stop(), cc.Action.prototype.stop.call(this)
	},
	step: function(a) {
		this._innerAction.step(a * this._speed)
	},
	isDone: function() {
		return this._innerAction.isDone()
	},
	reverse: function() {
		return new cc.Speed(this._innerAction.reverse(), this._speed)
	},
	setInnerAction: function(a) {
		this._innerAction !== a && (this._innerAction = a)
	},
	getInnerAction: function() {
		return this._innerAction
	}
}), cc.speed = function(a, b) {
	return new cc.Speed(a, b)
}, cc.Speed.create = cc.speed, cc.Follow = cc.Action.extend({
	_followedNode: null,
	_boundarySet: !1,
	_boundaryFullyCovered: !1,
	_halfScreenSize: null,
	_fullScreenSize: null,
	_worldRect: null,
	leftBoundary: 0,
	rightBoundary: 0,
	topBoundary: 0,
	bottomBoundary: 0,
	ctor: function(a, b) {
		cc.Action.prototype.ctor.call(this), this._followedNode = null, this._boundarySet = !1, this._boundaryFullyCovered = !1, this._halfScreenSize = null, this._fullScreenSize = null, this.leftBoundary = 0, this.rightBoundary = 0, this.topBoundary = 0, this.bottomBoundary = 0, this._worldRect = cc.rect(0, 0, 0, 0), a && (b ? this.initWithTarget(a, b) : this.initWithTarget(a))
	},
	clone: function() {
		var a = new cc.Follow,
			b = this._worldRect,
			c = new cc.Rect(b.x, b.y, b.width, b.height);
		return a.initWithTarget(this._followedNode, c), a
	},
	isBoundarySet: function() {
		return this._boundarySet
	},
	setBoudarySet: function(a) {
		this._boundarySet = a
	},
	initWithTarget: function(a, b) {
		if (!a) throw new Error("cc.Follow.initWithAction(): followedNode must be non nil");
		var c = this;
		b = b || cc.rect(0, 0, 0, 0), c._followedNode = a, c._worldRect = b, c._boundarySet = !cc._rectEqualToZero(b), c._boundaryFullyCovered = !1;
		var d = cc.director.getWinSize();
		return c._fullScreenSize = cc.p(d.width, d.height), c._halfScreenSize = cc.pMult(c._fullScreenSize, .5), c._boundarySet && (c.leftBoundary = -(b.x + b.width - c._fullScreenSize.x), c.rightBoundary = -b.x, c.topBoundary = -b.y, c.bottomBoundary = -(b.y + b.height - c._fullScreenSize.y), c.rightBoundary < c.leftBoundary && (c.rightBoundary = c.leftBoundary = (c.leftBoundary + c.rightBoundary) / 2), c.topBoundary < c.bottomBoundary && (c.topBoundary = c.bottomBoundary = (c.topBoundary + c.bottomBoundary) / 2), c.topBoundary === c.bottomBoundary && c.leftBoundary === c.rightBoundary && (c._boundaryFullyCovered = !0)), !0
	},
	step: function(a) {
		var b = this._followedNode.x,
			c = this._followedNode.y;
		if (b = this._halfScreenSize.x - b, c = this._halfScreenSize.y - c, this.target._renderCmd._dirtyFlag = 0, this._boundarySet) {
			if (this._boundaryFullyCovered) return;
			this.target.setPosition(cc.clampf(b, this.leftBoundary, this.rightBoundary), cc.clampf(c, this.bottomBoundary, this.topBoundary))
		} else this.target.setPosition(b, c)
	},
	isDone: function() {
		return !this._followedNode.running
	},
	stop: function() {
		this.target = null, cc.Action.prototype.stop.call(this)
	}
}), cc.follow = function(a, b) {
	return new cc.Follow(a, b)
}, cc.Follow.create = cc.follow, cc.ActionInterval = cc.FiniteTimeAction.extend({
	_elapsed: 0,
	_firstTick: !1,
	_easeList: null,
	_timesForRepeat: 1,
	_repeatForever: !1,
	_repeatMethod: !1,
	_speed: 1,
	_speedMethod: !1,
	ctor: function(a) {
		this._speed = 1, this._timesForRepeat = 1, this._repeatForever = !1, this.MAX_VALUE = 2, this._repeatMethod = !1, this._speedMethod = !1, cc.FiniteTimeAction.prototype.ctor.call(this), void 0 !== a && this.initWithDuration(a)
	},
	getElapsed: function() {
		return this._elapsed
	},
	initWithDuration: function(a) {
		return this._duration = 0 === a ? cc.FLT_EPSILON : a, this._elapsed = 0, this._firstTick = !0, !0
	},
	isDone: function() {
		return this._elapsed >= this._duration
	},
	_cloneDecoration: function(a) {
		a._repeatForever = this._repeatForever, a._speed = this._speed, a._timesForRepeat = this._timesForRepeat, a._easeList = this._easeList, a._speedMethod = this._speedMethod, a._repeatMethod = this._repeatMethod
	},
	_reverseEaseList: function(a) {
		if (this._easeList) {
			a._easeList = [];
			for (var b = 0; b < this._easeList.length; b++) a._easeList.push(this._easeList[b].reverse())
		}
	},
	clone: function() {
		var a = new cc.ActionInterval(this._duration);
		return this._cloneDecoration(a), a
	},
	easing: function(a) {
		this._easeList ? this._easeList.length = 0 : this._easeList = [];
		for (var b = 0; b < arguments.length; b++) this._easeList.push(arguments[b]);
		return this
	},
	_computeEaseTime: function(a) {
		var b = this._easeList;
		if (!b || 0 === b.length) return a;
		for (var c = 0, d = b.length; d > c; c++) a = b[c].easing(a);
		return a
	},
	step: function(a) {
		this._firstTick ? (this._firstTick = !1, this._elapsed = 0) : this._elapsed += a;
		var b = this._elapsed / (this._duration > 1.192092896e-7 ? this._duration : 1.192092896e-7);
		b = 1 > b ? b : 1, this.update(b > 0 ? b : 0), this._repeatMethod && this._timesForRepeat > 1 && this.isDone() && (this._repeatForever || this._timesForRepeat--, this.startWithTarget(this.target), this.step(this._elapsed - this._duration))
	},
	startWithTarget: function(a) {
		cc.Action.prototype.startWithTarget.call(this, a), this._elapsed = 0, this._firstTick = !0
	},
	reverse: function() {
		return cc.log("cc.IntervalAction: reverse not implemented."), null
	},
	setAmplitudeRate: function(a) {
		cc.log("cc.ActionInterval.setAmplitudeRate(): it should be overridden in subclass.")
	},
	getAmplitudeRate: function() {
		return cc.log("cc.ActionInterval.getAmplitudeRate(): it should be overridden in subclass."), 0
	},
	speed: function(a) {
		return 0 >= a ? (cc.log("The speed parameter error"), this) : (this._speedMethod = !0, this._speed *= a, this)
	},
	getSpeed: function() {
		return this._speed
	},
	setSpeed: function(a) {
		return this._speed = a, this
	},
	repeat: function(a) {
		return a = Math.round(a), isNaN(a) || 1 > a ? (cc.log("The repeat parameter error"), this) : (this._repeatMethod = !0, this._timesForRepeat *= a, this)
	},
	repeatForever: function() {
		return this._repeatMethod = !0, this._timesForRepeat = this.MAX_VALUE, this._repeatForever = !0, this
	}
}), cc.actionInterval = function(a) {
	return new cc.ActionInterval(a)
}, cc.ActionInterval.create = cc.actionInterval, cc.Sequence = cc.ActionInterval.extend({
	_actions: null,
	_split: null,
	_last: 0,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), this._actions = [];
		var b = a instanceof Array ? a : arguments,
			c = b.length - 1;
		if (c >= 0 && null == b[c] && cc.log("parameters should not be ending with null in Javascript"), c >= 0) {
			for (var d, e = b[0], f = 1; c > f; f++) b[f] && (d = e, e = cc.Sequence._actionOneTwo(d, b[f]));
			this.initWithTwoActions(e, b[c])
		}
	},
	initWithTwoActions: function(a, b) {
		if (!a || !b) throw new Error("cc.Sequence.initWithTwoActions(): arguments must all be non nil");
		var c = a._duration + b._duration;
		return this.initWithDuration(c), this._actions[0] = a, this._actions[1] = b, !0
	},
	clone: function() {
		var a = new cc.Sequence;
		return this._cloneDecoration(a), a.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._split = this._actions[0]._duration / this._duration, this._last = -1
	},
	stop: function() {
		-1 !== this._last && this._actions[this._last].stop(), cc.Action.prototype.stop.call(this)
	},
	update: function(a) {
		var b, c, d = 0,
			e = this._split,
			f = this._actions,
			g = this._last;
		a = this._computeEaseTime(a), e > a ? (b = 0 !== e ? a / e : 1, 0 === d && 1 === g && (f[1].update(0), f[1].stop())) : (d = 1, b = 1 === e ? 1 : (a - e) / (1 - e), -1 === g && (f[0].startWithTarget(this.target), f[0].update(1), f[0].stop()), g || (f[0].update(1), f[0].stop())), c = f[d], g === d && c.isDone() || (g !== d && c.startWithTarget(this.target), b *= c._timesForRepeat, c.update(b > 1 ? b % 1 : b), this._last = d)
	},
	reverse: function() {
		var a = cc.Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.sequence = function(a) {
	var b = a instanceof Array ? a : arguments;
	b.length > 0 && null == b[b.length - 1] && cc.log("parameters should not be ending with null in Javascript");
	for (var c, d, e, f; b && b.length > 0;) for (d = Array.prototype.shift.call(b), f = d._timesForRepeat || 1, d._repeatMethod = !1, d._timesForRepeat = 1, e = 0, c || (c = d, e = 1), e; f > e; e++) c = cc.Sequence._actionOneTwo(c, d);
	return c
}, cc.Sequence.create = cc.sequence, cc.Sequence._actionOneTwo = function(a, b) {
	var c = new cc.Sequence;
	return c.initWithTwoActions(a, b), c
}, cc.Repeat = cc.ActionInterval.extend({
	_times: 0,
	_total: 0,
	_nextDt: 0,
	_actionInstant: !1,
	_innerAction: null,
	ctor: function(a, b) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithAction(a, b)
	},
	initWithAction: function(a, b) {
		var c = a._duration * b;
		return this.initWithDuration(c) ? (this._times = b, this._innerAction = a, a instanceof cc.ActionInstant && (this._actionInstant = !0, this._times -= 1), this._total = 0, !0) : !1
	},
	clone: function() {
		var a = new cc.Repeat;
		return this._cloneDecoration(a), a.initWithAction(this._innerAction.clone(), this._times), a
	},
	startWithTarget: function(a) {
		this._total = 0, this._nextDt = this._innerAction._duration / this._duration, cc.ActionInterval.prototype.startWithTarget.call(this, a), this._innerAction.startWithTarget(a)
	},
	stop: function() {
		this._innerAction.stop(), cc.Action.prototype.stop.call(this)
	},
	update: function(a) {
		a = this._computeEaseTime(a);
		var b = this._innerAction,
			c = this._duration,
			d = this._times,
			e = this._nextDt;
		if (a >= e) {
			for (; a > e && this._total < d;) b.update(1), this._total++, b.stop(), b.startWithTarget(this.target), e += b._duration / c, this._nextDt = e;
			a >= 1 && this._total < d && this._total++, this._actionInstant || (this._total === d ? (b.update(1), b.stop()) : b.update(a - (e - b._duration / c)))
		} else b.update(a * d % 1)
	},
	isDone: function() {
		return this._total === this._times
	},
	reverse: function() {
		var a = new cc.Repeat(this._innerAction.reverse(), this._times);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	setInnerAction: function(a) {
		this._innerAction !== a && (this._innerAction = a)
	},
	getInnerAction: function() {
		return this._innerAction
	}
}), cc.repeat = function(a, b) {
	return new cc.Repeat(a, b)
}, cc.Repeat.create = cc.repeat, cc.RepeatForever = cc.ActionInterval.extend({
	_innerAction: null,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), this._innerAction = null, a && this.initWithAction(a)
	},
	initWithAction: function(a) {
		if (!a) throw new Error("cc.RepeatForever.initWithAction(): action must be non null");
		return this._innerAction = a, !0
	},
	clone: function() {
		var a = new cc.RepeatForever;
		return this._cloneDecoration(a), a.initWithAction(this._innerAction.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._innerAction.startWithTarget(a)
	},
	step: function(a) {
		var b = this._innerAction;
		b.step(a), b.isDone() && (b.startWithTarget(this.target), b.step(b.getElapsed() - b._duration))
	},
	isDone: function() {
		return !1
	},
	reverse: function() {
		var a = new cc.RepeatForever(this._innerAction.reverse());
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	setInnerAction: function(a) {
		this._innerAction !== a && (this._innerAction = a)
	},
	getInnerAction: function() {
		return this._innerAction
	}
}), cc.repeatForever = function(a) {
	return new cc.RepeatForever(a)
}, cc.RepeatForever.create = cc.repeatForever, cc.Spawn = cc.ActionInterval.extend({
	_one: null,
	_two: null,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), this._one = null, this._two = null;
		var b = a instanceof Array ? a : arguments,
			c = b.length - 1;
		if (c >= 0 && null == b[c] && cc.log("parameters should not be ending with null in Javascript"), c >= 0) {
			for (var d, e = b[0], f = 1; c > f; f++) b[f] && (d = e, e = cc.Spawn._actionOneTwo(d, b[f]));
			this.initWithTwoActions(e, b[c])
		}
	},
	initWithTwoActions: function(a, b) {
		if (!a || !b) throw new Error("cc.Spawn.initWithTwoActions(): arguments must all be non null");
		var c = !1,
			d = a._duration,
			e = b._duration;
		return this.initWithDuration(Math.max(d, e)) && (this._one = a, this._two = b, d > e ? this._two = cc.Sequence._actionOneTwo(b, cc.delayTime(d - e)) : e > d && (this._one = cc.Sequence._actionOneTwo(a, cc.delayTime(e - d))), c = !0), c
	},
	clone: function() {
		var a = new cc.Spawn;
		return this._cloneDecoration(a), a.initWithTwoActions(this._one.clone(), this._two.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._one.startWithTarget(a), this._two.startWithTarget(a)
	},
	stop: function() {
		this._one.stop(), this._two.stop(), cc.Action.prototype.stop.call(this)
	},
	update: function(a) {
		a = this._computeEaseTime(a), this._one && this._one.update(a), this._two && this._two.update(a)
	},
	reverse: function() {
		var a = cc.Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.spawn = function(a) {
	var b = a instanceof Array ? a : arguments;
	b.length > 0 && null == b[b.length - 1] && cc.log("parameters should not be ending with null in Javascript");
	for (var c = b[0], d = 1; d < b.length; d++) null != b[d] && (c = cc.Spawn._actionOneTwo(c, b[d]));
	return c
}, cc.Spawn.create = cc.spawn, cc.Spawn._actionOneTwo = function(a, b) {
	var c = new cc.Spawn;
	return c.initWithTwoActions(a, b), c
}, cc.RotateTo = cc.ActionInterval.extend({
	_dstAngleX: 0,
	_startAngleX: 0,
	_diffAngleX: 0,
	_dstAngleY: 0,
	_startAngleY: 0,
	_diffAngleY: 0,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._dstAngleX = b || 0, this._dstAngleY = c || this._dstAngleX, !0) : !1
	},
	clone: function() {
		var a = new cc.RotateTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._dstAngleX, this._dstAngleY), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a);
		var b = a.rotationX % 360,
			c = this._dstAngleX - b;
		c > 180 && (c -= 360), -180 > c && (c += 360), this._startAngleX = b, this._diffAngleX = c, this._startAngleY = a.rotationY % 360;
		var d = this._dstAngleY - this._startAngleY;
		d > 180 && (d -= 360), -180 > d && (d += 360), this._diffAngleY = d
	},
	reverse: function() {
		cc.log("cc.RotateTo.reverse(): it should be overridden in subclass.")
	},
	update: function(a) {
		a = this._computeEaseTime(a), this.target && (this.target.rotationX = this._startAngleX + this._diffAngleX * a, this.target.rotationY = this._startAngleY + this._diffAngleY * a)
	}
}), cc.rotateTo = function(a, b, c) {
	return new cc.RotateTo(a, b, c)
}, cc.RotateTo.create = cc.rotateTo, cc.RotateBy = cc.ActionInterval.extend({
	_angleX: 0,
	_startAngleX: 0,
	_angleY: 0,
	_startAngleY: 0,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._angleX = b || 0, this._angleY = c || this._angleX, !0) : !1
	},
	clone: function() {
		var a = new cc.RotateBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._angleX, this._angleY), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._startAngleX = a.rotationX, this._startAngleY = a.rotationY
	},
	update: function(a) {
		a = this._computeEaseTime(a), this.target && (this.target.rotationX = this._startAngleX + this._angleX * a, this.target.rotationY = this._startAngleY + this._angleY * a)
	},
	reverse: function() {
		var a = new cc.RotateBy(this._duration, -this._angleX, -this._angleY);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.rotateBy = function(a, b, c) {
	return new cc.RotateBy(a, b, c)
}, cc.RotateBy.create = cc.rotateBy, cc.MoveBy = cc.ActionInterval.extend({
	_positionDelta: null,
	_startPosition: null,
	_previousPosition: null,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), this._positionDelta = cc.p(0, 0), this._startPosition = cc.p(0, 0), this._previousPosition = cc.p(0, 0), void 0 !== b && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (void 0 !== b.x && (c = b.y, b = b.x), this._positionDelta.x = b, this._positionDelta.y = c, !0) : !1
	},
	clone: function() {
		var a = new cc.MoveBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._positionDelta), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a);
		var b = a.getPositionX(),
			c = a.getPositionY();
		this._previousPosition.x = b, this._previousPosition.y = c, this._startPosition.x = b, this._startPosition.y = c
	},
	update: function(a) {
		if (a = this._computeEaseTime(a), this.target) {
			var b = this._positionDelta.x * a,
				c = this._positionDelta.y * a,
				d = this._startPosition;
			if (cc.ENABLE_STACKABLE_ACTIONS) {
				var e = this.target.getPositionX(),
					f = this.target.getPositionY(),
					g = this._previousPosition;
				d.x = d.x + e - g.x, d.y = d.y + f - g.y, b += d.x, c += d.y, g.x = b, g.y = c, this.target.setPosition(b, c)
			} else this.target.setPosition(d.x + b, d.y + c)
		}
	},
	reverse: function() {
		var a = new cc.MoveBy(this._duration, cc.p(-this._positionDelta.x, -this._positionDelta.y));
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.moveBy = function(a, b, c) {
	return new cc.MoveBy(a, b, c)
}, cc.MoveBy.create = cc.moveBy, cc.MoveTo = cc.MoveBy.extend({
	_endPosition: null,
	ctor: function(a, b, c) {
		cc.MoveBy.prototype.ctor.call(this), this._endPosition = cc.p(0, 0), void 0 !== b && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		return cc.MoveBy.prototype.initWithDuration.call(this, a, b, c) ? (void 0 !== b.x && (c = b.y, b = b.x), this._endPosition.x = b, this._endPosition.y = c, !0) : !1
	},
	clone: function() {
		var a = new cc.MoveTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._endPosition), a
	},
	startWithTarget: function(a) {
		cc.MoveBy.prototype.startWithTarget.call(this, a), this._positionDelta.x = this._endPosition.x - a.getPositionX(), this._positionDelta.y = this._endPosition.y - a.getPositionY()
	}
}), cc.moveTo = function(a, b, c) {
	return new cc.MoveTo(a, b, c)
}, cc.MoveTo.create = cc.moveTo, cc.SkewTo = cc.ActionInterval.extend({
	_skewX: 0,
	_skewY: 0,
	_startSkewX: 0,
	_startSkewY: 0,
	_endSkewX: 0,
	_endSkewY: 0,
	_deltaX: 0,
	_deltaY: 0,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== c && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		var d = !1;
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) && (this._endSkewX = b, this._endSkewY = c, d = !0), d
	},
	clone: function() {
		var a = new cc.SkewTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._endSkewX, this._endSkewY), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._startSkewX = a.skewX % 180, this._deltaX = this._endSkewX - this._startSkewX, this._deltaX > 180 && (this._deltaX -= 360), this._deltaX < -180 && (this._deltaX += 360), this._startSkewY = a.skewY % 360, this._deltaY = this._endSkewY - this._startSkewY, this._deltaY > 180 && (this._deltaY -= 360), this._deltaY < -180 && (this._deltaY += 360)
	},
	update: function(a) {
		a = this._computeEaseTime(a), this.target.skewX = this._startSkewX + this._deltaX * a, this.target.skewY = this._startSkewY + this._deltaY * a
	}
}), cc.skewTo = function(a, b, c) {
	return new cc.SkewTo(a, b, c)
}, cc.SkewTo.create = cc.skewTo, cc.SkewBy = cc.SkewTo.extend({
	ctor: function(a, b, c) {
		cc.SkewTo.prototype.ctor.call(this), void 0 !== c && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		var d = !1;
		return cc.SkewTo.prototype.initWithDuration.call(this, a, b, c) && (this._skewX = b, this._skewY = c, d = !0), d
	},
	clone: function() {
		var a = new cc.SkewBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._skewX, this._skewY), a
	},
	startWithTarget: function(a) {
		cc.SkewTo.prototype.startWithTarget.call(this, a), this._deltaX = this._skewX, this._deltaY = this._skewY, this._endSkewX = this._startSkewX + this._deltaX, this._endSkewY = this._startSkewY + this._deltaY
	},
	reverse: function() {
		var a = new cc.SkewBy(this._duration, -this._skewX, -this._skewY);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.skewBy = function(a, b, c) {
	return new cc.SkewBy(a, b, c)
}, cc.SkewBy.create = cc.skewBy, cc.JumpBy = cc.ActionInterval.extend({
	_startPosition: null,
	_delta: null,
	_height: 0,
	_jumps: 0,
	_previousPosition: null,
	ctor: function(a, b, c, d, e) {
		cc.ActionInterval.prototype.ctor.call(this), this._startPosition = cc.p(0, 0), this._previousPosition = cc.p(0, 0), this._delta = cc.p(0, 0), void 0 !== d && this.initWithDuration(a, b, c, d, e)
	},
	initWithDuration: function(a, b, c, d, e) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (void 0 === e && (e = d, d = c, c = b.y, b = b.x), this._delta.x = b, this._delta.y = c, this._height = d, this._jumps = e, !0) : !1
	},
	clone: function() {
		var a = new cc.JumpBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._delta, this._height, this._jumps), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a);
		var b = a.getPositionX(),
			c = a.getPositionY();
		this._previousPosition.x = b, this._previousPosition.y = c, this._startPosition.x = b, this._startPosition.y = c
	},
	update: function(a) {
		if (a = this._computeEaseTime(a), this.target) {
			var b = a * this._jumps % 1,
				c = 4 * this._height * b * (1 - b);
			c += this._delta.y * a;
			var d = this._delta.x * a,
				e = this._startPosition;
			if (cc.ENABLE_STACKABLE_ACTIONS) {
				var f = this.target.getPositionX(),
					g = this.target.getPositionY(),
					h = this._previousPosition;
				e.x = e.x + f - h.x, e.y = e.y + g - h.y, d += e.x, c += e.y, h.x = d, h.y = c, this.target.setPosition(d, c)
			} else this.target.setPosition(e.x + d, e.y + c)
		}
	},
	reverse: function() {
		var a = new cc.JumpBy(this._duration, cc.p(-this._delta.x, -this._delta.y), this._height, this._jumps);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.jumpBy = function(a, b, c, d, e) {
	return new cc.JumpBy(a, b, c, d, e)
}, cc.JumpBy.create = cc.jumpBy, cc.JumpTo = cc.JumpBy.extend({
	_endPosition: null,
	ctor: function(a, b, c, d, e) {
		cc.JumpBy.prototype.ctor.call(this), this._endPosition = cc.p(0, 0), void 0 !== d && this.initWithDuration(a, b, c, d, e)
	},
	initWithDuration: function(a, b, c, d, e) {
		return cc.JumpBy.prototype.initWithDuration.call(this, a, b, c, d, e) ? (void 0 === e && (c = b.y, b = b.x), this._endPosition.x = b, this._endPosition.y = c, !0) : !1
	},
	startWithTarget: function(a) {
		cc.JumpBy.prototype.startWithTarget.call(this, a), this._delta.x = this._endPosition.x - this._startPosition.x, this._delta.y = this._endPosition.y - this._startPosition.y
	},
	clone: function() {
		var a = new cc.JumpTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._endPosition, this._height, this._jumps), a
	}
}), cc.jumpTo = function(a, b, c, d, e) {
	return new cc.JumpTo(a, b, c, d, e)
}, cc.JumpTo.create = cc.jumpTo, cc.bezierAt = function(a, b, c, d, e) {
	return Math.pow(1 - e, 3) * a + 3 * e * Math.pow(1 - e, 2) * b + 3 * Math.pow(e, 2) * (1 - e) * c + Math.pow(e, 3) * d
}, cc.BezierBy = cc.ActionInterval.extend({
	_config: null,
	_startPosition: null,
	_previousPosition: null,
	ctor: function(a, b) {
		cc.ActionInterval.prototype.ctor.call(this), this._config = [], this._startPosition = cc.p(0, 0), this._previousPosition = cc.p(0, 0), b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._config = b, !0) : !1
	},
	clone: function() {
		var a = new cc.BezierBy;
		this._cloneDecoration(a);
		for (var b = [], c = 0; c < this._config.length; c++) {
			var d = this._config[c];
			b.push(cc.p(d.x, d.y))
		}
		return a.initWithDuration(this._duration, b), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a);
		var b = a.getPositionX(),
			c = a.getPositionY();
		this._previousPosition.x = b, this._previousPosition.y = c, this._startPosition.x = b, this._startPosition.y = c
	},
	update: function(a) {
		if (a = this._computeEaseTime(a), this.target) {
			var b = this._config,
				c = 0,
				d = b[0].x,
				e = b[1].x,
				f = b[2].x,
				g = 0,
				h = b[0].y,
				i = b[1].y,
				j = b[2].y,
				k = cc.bezierAt(c, d, e, f, a),
				l = cc.bezierAt(g, h, i, j, a),
				m = this._startPosition;
			if (cc.ENABLE_STACKABLE_ACTIONS) {
				var n = this.target.getPositionX(),
					o = this.target.getPositionY(),
					p = this._previousPosition;
				m.x = m.x + n - p.x, m.y = m.y + o - p.y, k += m.x, l += m.y, p.x = k, p.y = l, this.target.setPosition(k, l)
			} else this.target.setPosition(m.x + k, m.y + l)
		}
	},
	reverse: function() {
		var a = this._config,
			b = [cc.pAdd(a[1], cc.pNeg(a[2])), cc.pAdd(a[0], cc.pNeg(a[2])), cc.pNeg(a[2])],
			c = new cc.BezierBy(this._duration, b);
		return this._cloneDecoration(c), this._reverseEaseList(c), c
	}
}), cc.bezierBy = function(a, b) {
	return new cc.BezierBy(a, b)
}, cc.BezierBy.create = cc.bezierBy, cc.BezierTo = cc.BezierBy.extend({
	_toConfig: null,
	ctor: function(a, b) {
		cc.BezierBy.prototype.ctor.call(this), this._toConfig = [], b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._toConfig = b, !0) : !1
	},
	clone: function() {
		var a = new cc.BezierTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._toConfig), a
	},
	startWithTarget: function(a) {
		cc.BezierBy.prototype.startWithTarget.call(this, a);
		var b = this._startPosition,
			c = this._toConfig,
			d = this._config;
		d[0] = cc.pSub(c[0], b), d[1] = cc.pSub(c[1], b), d[2] = cc.pSub(c[2], b)
	}
}), cc.bezierTo = function(a, b) {
	return new cc.BezierTo(a, b)
}, cc.BezierTo.create = cc.bezierTo, cc.ScaleTo = cc.ActionInterval.extend({
	_scaleX: 1,
	_scaleY: 1,
	_startScaleX: 1,
	_startScaleY: 1,
	_endScaleX: 0,
	_endScaleY: 0,
	_deltaX: 0,
	_deltaY: 0,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._endScaleX = b, this._endScaleY = null != c ? c : b, !0) : !1
	},
	clone: function() {
		var a = new cc.ScaleTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._endScaleX, this._endScaleY), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._startScaleX = a.scaleX, this._startScaleY = a.scaleY, this._deltaX = this._endScaleX - this._startScaleX, this._deltaY = this._endScaleY - this._startScaleY
	},
	update: function(a) {
		a = this._computeEaseTime(a), this.target && (this.target.scaleX = this._startScaleX + this._deltaX * a, this.target.scaleY = this._startScaleY + this._deltaY * a)
	}
}), cc.scaleTo = function(a, b, c) {
	return new cc.ScaleTo(a, b, c)
}, cc.ScaleTo.create = cc.scaleTo, cc.ScaleBy = cc.ScaleTo.extend({
	startWithTarget: function(a) {
		cc.ScaleTo.prototype.startWithTarget.call(this, a), this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX, this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY
	},
	reverse: function() {
		var a = new cc.ScaleBy(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	clone: function() {
		var a = new cc.ScaleBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._endScaleX, this._endScaleY), a
	}
}), cc.scaleBy = function(a, b, c) {
	return new cc.ScaleBy(a, b, c)
}, cc.ScaleBy.create = cc.scaleBy, cc.Blink = cc.ActionInterval.extend({
	_times: 0,
	_originalState: !1,
	ctor: function(a, b) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._times = b, !0) : !1
	},
	clone: function() {
		var a = new cc.Blink;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._times), a
	},
	update: function(a) {
		if (a = this._computeEaseTime(a), this.target && !this.isDone()) {
			var b = 1 / this._times,
				c = a % b;
			this.target.visible = c > b / 2
		}
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._originalState = a.visible
	},
	stop: function() {
		this.target.visible = this._originalState, cc.ActionInterval.prototype.stop.call(this)
	},
	reverse: function() {
		var a = new cc.Blink(this._duration, this._times);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.blink = function(a, b) {
	return new cc.Blink(a, b)
}, cc.Blink.create = cc.blink, cc.FadeTo = cc.ActionInterval.extend({
	_toOpacity: 0,
	_fromOpacity: 0,
	ctor: function(a, b) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._toOpacity = b, !0) : !1
	},
	clone: function() {
		var a = new cc.FadeTo;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._toOpacity), a
	},
	update: function(a) {
		a = this._computeEaseTime(a);
		var b = void 0 !== this._fromOpacity ? this._fromOpacity : 255;
		this.target.opacity = b + (this._toOpacity - b) * a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._fromOpacity = a.opacity
	}
}), cc.fadeTo = function(a, b) {
	return new cc.FadeTo(a, b)
}, cc.FadeTo.create = cc.fadeTo, cc.FadeIn = cc.FadeTo.extend({
	_reverseAction: null,
	ctor: function(a) {
		cc.FadeTo.prototype.ctor.call(this), null == a && (a = 0), this.initWithDuration(a, 255)
	},
	reverse: function() {
		var a = new cc.FadeOut;
		return a.initWithDuration(this._duration, 0), this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	clone: function() {
		var a = new cc.FadeIn;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._toOpacity), a
	},
	startWithTarget: function(a) {
		this._reverseAction && (this._toOpacity = this._reverseAction._fromOpacity), cc.FadeTo.prototype.startWithTarget.call(this, a)
	}
}), cc.fadeIn = function(a) {
	return new cc.FadeIn(a)
}, cc.FadeIn.create = cc.fadeIn, cc.FadeOut = cc.FadeTo.extend({
	ctor: function(a) {
		cc.FadeTo.prototype.ctor.call(this), null == a && (a = 0), this.initWithDuration(a, 0)
	},
	reverse: function() {
		var a = new cc.FadeIn;
		return a._reverseAction = this, a.initWithDuration(this._duration, 255), this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	clone: function() {
		var a = new cc.FadeOut;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._toOpacity), a
	}
}), cc.fadeOut = function(a) {
	return new cc.FadeOut(a)
}, cc.FadeOut.create = cc.fadeOut, cc.TintTo = cc.ActionInterval.extend({
	_to: null,
	_from: null,
	ctor: function(a, b, c, d) {
		cc.ActionInterval.prototype.ctor.call(this), this._to = cc.color(0, 0, 0), this._from = cc.color(0, 0, 0), void 0 !== d && this.initWithDuration(a, b, c, d)
	},
	initWithDuration: function(a, b, c, d) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._to = cc.color(b, c, d), !0) : !1
	},
	clone: function() {
		var a = new cc.TintTo;
		this._cloneDecoration(a);
		var b = this._to;
		return a.initWithDuration(this._duration, b.r, b.g, b.b), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._from = this.target.color
	},
	update: function(a) {
		a = this._computeEaseTime(a);
		var b = this._from,
			c = this._to;
		b && this.target.setColor(cc.color(b.r + (c.r - b.r) * a, b.g + (c.g - b.g) * a, b.b + (c.b - b.b) * a))
	}
}), cc.tintTo = function(a, b, c, d) {
	return new cc.TintTo(a, b, c, d)
}, cc.TintTo.create = cc.tintTo, cc.TintBy = cc.ActionInterval.extend({
	_deltaR: 0,
	_deltaG: 0,
	_deltaB: 0,
	_fromR: 0,
	_fromG: 0,
	_fromB: 0,
	ctor: function(a, b, c, d) {
		cc.ActionInterval.prototype.ctor.call(this), void 0 !== d && this.initWithDuration(a, b, c, d)
	},
	initWithDuration: function(a, b, c, d) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._deltaR = b, this._deltaG = c, this._deltaB = d, !0) : !1
	},
	clone: function() {
		var a = new cc.TintBy;
		return this._cloneDecoration(a), a.initWithDuration(this._duration, this._deltaR, this._deltaG, this._deltaB), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a);
		var b = a.color;
		this._fromR = b.r, this._fromG = b.g, this._fromB = b.b
	},
	update: function(a) {
		a = this._computeEaseTime(a), this.target.color = cc.color(this._fromR + this._deltaR * a, this._fromG + this._deltaG * a, this._fromB + this._deltaB * a)
	},
	reverse: function() {
		var a = new cc.TintBy(this._duration, -this._deltaR, -this._deltaG, -this._deltaB);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	}
}), cc.tintBy = function(a, b, c, d) {
	return new cc.TintBy(a, b, c, d)
}, cc.TintBy.create = cc.tintBy, cc.DelayTime = cc.ActionInterval.extend({
	update: function(a) {},
	reverse: function() {
		var a = new cc.DelayTime(this._duration);
		return this._cloneDecoration(a), this._reverseEaseList(a), a
	},
	clone: function() {
		var a = new cc.DelayTime;
		return this._cloneDecoration(a), a.initWithDuration(this._duration), a
	}
}), cc.delayTime = function(a) {
	return new cc.DelayTime(a)
}, cc.DelayTime.create = cc.delayTime, cc.ReverseTime = cc.ActionInterval.extend({
	_other: null,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), this._other = null, a && this.initWithAction(a)
	},
	initWithAction: function(a) {
		if (!a) throw new Error("cc.ReverseTime.initWithAction(): action must be non null");
		if (a === this._other) throw new Error("cc.ReverseTime.initWithAction(): the action was already passed in.");
		return cc.ActionInterval.prototype.initWithDuration.call(this, a._duration) ? (this._other = a, !0) : !1
	},
	clone: function() {
		var a = new cc.ReverseTime;
		return this._cloneDecoration(a), a.initWithAction(this._other.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._other.startWithTarget(a)
	},
	update: function(a) {
		a = this._computeEaseTime(a), this._other && this._other.update(1 - a)
	},
	reverse: function() {
		return this._other.clone()
	},
	stop: function() {
		this._other.stop(), cc.Action.prototype.stop.call(this)
	}
}), cc.reverseTime = function(a) {
	return new cc.ReverseTime(a)
}, cc.ReverseTime.create = cc.reverseTime, cc.Animate = cc.ActionInterval.extend({
	_animation: null,
	_nextFrame: 0,
	_origFrame: null,
	_executedLoops: 0,
	_splitTimes: null,
	_currFrameIndex: 0,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), this._splitTimes = [], a && this.initWithAnimation(a)
	},
	getAnimation: function() {
		return this._animation
	},
	setAnimation: function(a) {
		this._animation = a
	},
	getCurrentFrameIndex: function() {
		return this._currFrameIndex
	},
	initWithAnimation: function(a) {
		if (!a) throw new Error("cc.Animate.initWithAnimation(): animation must be non-NULL");
		var b = a.getDuration();
		if (this.initWithDuration(b * a.getLoops())) {
			this._nextFrame = 0, this.setAnimation(a), this._origFrame = null, this._executedLoops = 0;
			var c = this._splitTimes;
			c.length = 0;
			var d = 0,
				e = b / a.getTotalDelayUnits(),
				f = a.getFrames();
			cc.arrayVerifyType(f, cc.AnimationFrame);
			for (var g = 0; g < f.length; g++) {
				var h = f[g],
					i = d * e / b;
				d += h.getDelayUnits(), c.push(i)
			}
			return !0
		}
		return !1
	},
	clone: function() {
		var a = new cc.Animate;
		return this._cloneDecoration(a), a.initWithAnimation(this._animation.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._animation.getRestoreOriginalFrame() && (this._origFrame = a.displayFrame()), this._nextFrame = 0, this._executedLoops = 0
	},
	update: function(a) {
		if (a = this._computeEaseTime(a), 1 > a) {
			a *= this._animation.getLoops();
			var b = 0 | a;
			b > this._executedLoops && (this._nextFrame = 0, this._executedLoops++), a %= 1
		}
		for (var c = this._animation.getFrames(), d = c.length, e = this._splitTimes, f = this._nextFrame; d > f && e[f] <= a; f++) _currFrameIndex = f, this.target.setSpriteFrame(c[_currFrameIndex].getSpriteFrame()), this._nextFrame = f + 1
	},
	reverse: function() {
		var a = this._animation,
			b = a.getFrames(),
			c = [];
		if (cc.arrayVerifyType(b, cc.AnimationFrame), b.length > 0) for (var d = b.length - 1; d >= 0; d--) {
			var e = b[d];
			if (!e) break;
			c.push(e.clone())
		}
		var f = new cc.Animation(c, a.getDelayPerUnit(), a.getLoops());
		f.setRestoreOriginalFrame(a.getRestoreOriginalFrame());
		var g = new cc.Animate(f);
		return this._cloneDecoration(g), this._reverseEaseList(g), g
	},
	stop: function() {
		this._animation.getRestoreOriginalFrame() && this.target && this.target.setSpriteFrame(this._origFrame), cc.Action.prototype.stop.call(this)
	}
}), cc.animate = function(a) {
	return new cc.Animate(a)
}, cc.Animate.create = cc.animate, cc.TargetedAction = cc.ActionInterval.extend({
	_action: null,
	_forcedTarget: null,
	ctor: function(a, b) {
		cc.ActionInterval.prototype.ctor.call(this), b && this.initWithTarget(a, b)
	},
	initWithTarget: function(a, b) {
		return this.initWithDuration(b._duration) ? (this._forcedTarget = a, this._action = b, !0) : !1
	},
	clone: function() {
		var a = new cc.TargetedAction;
		return this._cloneDecoration(a), a.initWithTarget(this._forcedTarget, this._action.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._action.startWithTarget(this._forcedTarget)
	},
	stop: function() {
		this._action.stop()
	},
	update: function(a) {
		a = this._computeEaseTime(a), this._action.update(a)
	},
	getForcedTarget: function() {
		return this._forcedTarget
	},
	setForcedTarget: function(a) {
		this._forcedTarget !== a && (this._forcedTarget = a)
	}
}), cc.targetedAction = function(a, b) {
	return new cc.TargetedAction(a, b)
}, cc.TargetedAction.create = cc.targetedAction, cc.ActionInstant = cc.FiniteTimeAction.extend({
	isDone: function() {
		return !0
	},
	step: function(a) {
		this.update(1)
	},
	update: function(a) {},
	reverse: function() {
		return this.clone()
	},
	clone: function() {
		return new cc.ActionInstant
	}
}), cc.Show = cc.ActionInstant.extend({
	update: function(a) {
		this.target.visible = !0
	},
	reverse: function() {
		return new cc.Hide
	},
	clone: function() {
		return new cc.Show
	}
}), cc.show = function() {
	return new cc.Show
}, cc.Show.create = cc.show, cc.Hide = cc.ActionInstant.extend({
	update: function(a) {
		this.target.visible = !1
	},
	reverse: function() {
		return new cc.Show
	},
	clone: function() {
		return new cc.Hide
	}
}), cc.hide = function() {
	return new cc.Hide
}, cc.Hide.create = cc.hide, cc.ToggleVisibility = cc.ActionInstant.extend({
	update: function(a) {
		this.target.visible = !this.target.visible
	},
	reverse: function() {
		return new cc.ToggleVisibility
	},
	clone: function() {
		return new cc.ToggleVisibility
	}
}), cc.toggleVisibility = function() {
	return new cc.ToggleVisibility
}, cc.ToggleVisibility.create = cc.toggleVisibility, cc.RemoveSelf = cc.ActionInstant.extend({
	_isNeedCleanUp: !0,
	ctor: function(a) {
		cc.FiniteTimeAction.prototype.ctor.call(this), void 0 !== a && this.init(a)
	},
	update: function(a) {
		this.target.removeFromParent(this._isNeedCleanUp)
	},
	init: function(a) {
		return this._isNeedCleanUp = a, !0
	},
	reverse: function() {
		return new cc.RemoveSelf(this._isNeedCleanUp)
	},
	clone: function() {
		return new cc.RemoveSelf(this._isNeedCleanUp)
	}
}), cc.removeSelf = function(a) {
	return new cc.RemoveSelf(a)
}, cc.RemoveSelf.create = cc.removeSelf, cc.FlipX = cc.ActionInstant.extend({
	_flippedX: !1,
	ctor: function(a) {
		cc.FiniteTimeAction.prototype.ctor.call(this), this._flippedX = !1, void 0 !== a && this.initWithFlipX(a)
	},
	initWithFlipX: function(a) {
		return this._flippedX = a, !0
	},
	update: function(a) {
		this.target.flippedX = this._flippedX
	},
	reverse: function() {
		return new cc.FlipX(!this._flippedX)
	},
	clone: function() {
		var a = new cc.FlipX;
		return a.initWithFlipX(this._flippedX), a
	}
}), cc.flipX = function(a) {
	return new cc.FlipX(a)
}, cc.FlipX.create = cc.flipX, cc.FlipY = cc.ActionInstant.extend({
	_flippedY: !1,
	ctor: function(a) {
		cc.FiniteTimeAction.prototype.ctor.call(this), this._flippedY = !1, void 0 !== a && this.initWithFlipY(a)
	},
	initWithFlipY: function(a) {
		return this._flippedY = a, !0
	},
	update: function(a) {
		this.target.flippedY = this._flippedY
	},
	reverse: function() {
		return new cc.FlipY(!this._flippedY)
	},
	clone: function() {
		var a = new cc.FlipY;
		return a.initWithFlipY(this._flippedY), a
	}
}), cc.flipY = function(a) {
	return new cc.FlipY(a)
}, cc.FlipY.create = cc.flipY, cc.Place = cc.ActionInstant.extend({
	_x: 0,
	_y: 0,
	ctor: function(a, b) {
		cc.FiniteTimeAction.prototype.ctor.call(this), this._x = 0, this._y = 0, void 0 !== a && (void 0 !== a.x && (b = a.y, a = a.x), this.initWithPosition(a, b))
	},
	initWithPosition: function(a, b) {
		return this._x = a, this._y = b, !0
	},
	update: function(a) {
		this.target.setPosition(this._x, this._y)
	},
	clone: function() {
		var a = new cc.Place;
		return a.initWithPosition(this._x, this._y), a
	}
}), cc.place = function(a, b) {
	return new cc.Place(a, b)
}, cc.Place.create = cc.place, cc.CallFunc = cc.ActionInstant.extend({
	_selectorTarget: null,
	_callFunc: null,
	_function: null,
	_data: null,
	ctor: function(a, b, c) {
		cc.FiniteTimeAction.prototype.ctor.call(this), void 0 !== a && (void 0 === b ? this.initWithFunction(a) : this.initWithFunction(a, b, c))
	},
	initWithFunction: function(a, b, c) {
		return b ? (this._data = c, this._callFunc = a, this._selectorTarget = b) : a && (this._function = a), !0
	},
	execute: function() {
		null != this._callFunc ? this._callFunc.call(this._selectorTarget, this.target, this._data) : this._function && this._function.call(null, this.target)
	},
	update: function(a) {
		this.execute()
	},
	getTargetCallback: function() {
		return this._selectorTarget
	},
	setTargetCallback: function(a) {
		a !== this._selectorTarget && (this._selectorTarget && (this._selectorTarget = null), this._selectorTarget = a)
	},
	clone: function() {
		var a = new cc.CallFunc;
		return this._selectorTarget ? a.initWithFunction(this._callFunc, this._selectorTarget, this._data) : this._function && a.initWithFunction(this._function), a
	}
}), cc.callFunc = function(a, b, c) {
	return new cc.CallFunc(a, b, c)
}, cc.CallFunc.create = cc.callFunc, cc.ActionCamera = cc.ActionInterval.extend({
	_centerXOrig: 0,
	_centerYOrig: 0,
	_centerZOrig: 0,
	_eyeXOrig: 0,
	_eyeYOrig: 0,
	_eyeZOrig: 0,
	_upXOrig: 0,
	_upYOrig: 0,
	_upZOrig: 0,
	ctor: function() {
		var a = this;
		cc.ActionInterval.prototype.ctor.call(a), a._centerXOrig = 0, a._centerYOrig = 0, a._centerZOrig = 0, a._eyeXOrig = 0, a._eyeYOrig = 0, a._eyeZOrig = 0, a._upXOrig = 0, a._upYOrig = 0, a._upZOrig = 0
	},
	startWithTarget: function(a) {
		var b = this;
		cc.ActionInterval.prototype.startWithTarget.call(b, a);
		var c = a.getCamera(),
			d = c.getCenter();
		b._centerXOrig = d.x, b._centerYOrig = d.y, b._centerZOrig = d.z;
		var e = c.getEye();
		b._eyeXOrig = e.x, b._eyeYOrig = e.y, b._eyeZOrig = e.z;
		var f = c.getUp();
		b._upXOrig = f.x, b._upYOrig = f.y, b._upZOrig = f.z
	},
	clone: function() {
		return new cc.ActionCamera
	},
	reverse: function() {
		return new cc.ReverseTime(this)
	}
}), cc.OrbitCamera = cc.ActionCamera.extend({
	_radius: 0,
	_deltaRadius: 0,
	_angleZ: 0,
	_deltaAngleZ: 0,
	_angleX: 0,
	_deltaAngleX: 0,
	_radZ: 0,
	_radDeltaZ: 0,
	_radX: 0,
	_radDeltaX: 0,
	ctor: function(a, b, c, d, e, f, g) {
		cc.ActionCamera.prototype.ctor.call(this), void 0 !== g && this.initWithDuration(a, b, c, d, e, f, g)
	},
	initWithDuration: function(a, b, c, d, e, f, g) {
		if (cc.ActionInterval.prototype.initWithDuration.call(this, a)) {
			var h = this;
			return h._radius = b, h._deltaRadius = c, h._angleZ = d, h._deltaAngleZ = e, h._angleX = f, h._deltaAngleX = g, h._radDeltaZ = cc.degreesToRadians(e), h._radDeltaX = cc.degreesToRadians(g), !0
		}
		return !1
	},
	sphericalRadius: function() {
		var a, b, c, d = this.target.getCamera(),
			e = d.getEye(),
			f = d.getCenter(),
			g = e.x - f.x,
			h = e.y - f.y,
			i = e.z - f.z,
			j = Math.sqrt(Math.pow(g, 2) + Math.pow(h, 2) + Math.pow(i, 2)),
			k = Math.sqrt(Math.pow(g, 2) + Math.pow(h, 2));
		return 0 === k && (k = cc.FLT_EPSILON), 0 === j && (j = cc.FLT_EPSILON), b = Math.acos(i / j), c = 0 > g ? Math.PI - Math.asin(h / k) : Math.asin(h / k), a = j / cc.Camera.getZEye(), {
			newRadius: a,
			zenith: b,
			azimuth: c
		}
	},
	startWithTarget: function(a) {
		var b = this;
		cc.ActionInterval.prototype.startWithTarget.call(b, a);
		var c = b.sphericalRadius();
		isNaN(b._radius) && (b._radius = c.newRadius), isNaN(b._angleZ) && (b._angleZ = cc.radiansToDegrees(c.zenith)), isNaN(b._angleX) && (b._angleX = cc.radiansToDegrees(c.azimuth)), b._radZ = cc.degreesToRadians(b._angleZ), b._radX = cc.degreesToRadians(b._angleX)
	},
	clone: function() {
		var a = new cc.OrbitCamera,
			b = this;
		return a.initWithDuration(b._duration, b._radius, b._deltaRadius, b._angleZ, b._deltaAngleZ, b._angleX, b._deltaAngleX), a
	},
	update: function(a) {
		a = this._computeEaseTime(a);
		var b = (this._radius + this._deltaRadius * a) * cc.Camera.getZEye(),
			c = this._radZ + this._radDeltaZ * a,
			d = this._radX + this._radDeltaX * a,
			e = Math.sin(c) * Math.cos(d) * b + this._centerXOrig,
			f = Math.sin(c) * Math.sin(d) * b + this._centerYOrig,
			g = Math.cos(c) * b + this._centerZOrig;
		this.target.getCamera().setEye(e, f, g), this.target.setNodeDirty()
	}
}), cc.orbitCamera = function(a, b, c, d, e, f, g) {
	return new cc.OrbitCamera(a, b, c, d, e, f, g)
}, cc.OrbitCamera.create = cc.orbitCamera, cc.ActionEase = cc.ActionInterval.extend({
	_inner: null,
	ctor: function(a) {
		cc.ActionInterval.prototype.ctor.call(this), a && this.initWithAction(a)
	},
	initWithAction: function(a) {
		if (!a) throw new Error("cc.ActionEase.initWithAction(): action must be non nil");
		return this.initWithDuration(a.getDuration()) ? (this._inner = a, !0) : !1
	},
	clone: function() {
		var a = new cc.ActionEase;
		return a.initWithAction(this._inner.clone()), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._inner.startWithTarget(this.target)
	},
	stop: function() {
		this._inner.stop(), cc.ActionInterval.prototype.stop.call(this)
	},
	update: function(a) {
		this._inner.update(a)
	},
	reverse: function() {
		return new cc.ActionEase(this._inner.reverse())
	},
	getInnerAction: function() {
		return this._inner
	}
}), cc.actionEase = function(a) {
	return new cc.ActionEase(a)
}, cc.ActionEase.create = cc.actionEase, cc.EaseRateAction = cc.ActionEase.extend({
	_rate: 0,
	ctor: function(a, b) {
		cc.ActionEase.prototype.ctor.call(this), void 0 !== b && this.initWithAction(a, b)
	},
	setRate: function(a) {
		this._rate = a
	},
	getRate: function() {
		return this._rate
	},
	initWithAction: function(a, b) {
		return cc.ActionEase.prototype.initWithAction.call(this, a) ? (this._rate = b, !0) : !1
	},
	clone: function() {
		var a = new cc.EaseRateAction;
		return a.initWithAction(this._inner.clone(), this._rate), a
	},
	reverse: function() {
		return new cc.EaseRateAction(this._inner.reverse(), 1 / this._rate)
	}
}), cc.easeRateAction = function(a, b) {
	return new cc.EaseRateAction(a, b)
}, cc.EaseRateAction.create = cc.easeRateAction, cc.EaseIn = cc.EaseRateAction.extend({
	update: function(a) {
		this._inner.update(Math.pow(a, this._rate))
	},
	reverse: function() {
		return new cc.EaseIn(this._inner.reverse(), 1 / this._rate)
	},
	clone: function() {
		var a = new cc.EaseIn;
		return a.initWithAction(this._inner.clone(), this._rate), a
	}
}), cc.EaseIn.create = function(a, b) {
	return new cc.EaseIn(a, b)
}, cc.easeIn = function(a) {
	return {
		_rate: a,
		easing: function(a) {
			return Math.pow(a, this._rate)
		},
		reverse: function() {
			return cc.easeIn(1 / this._rate)
		}
	}
}, cc.EaseOut = cc.EaseRateAction.extend({
	update: function(a) {
		this._inner.update(Math.pow(a, 1 / this._rate))
	},
	reverse: function() {
		return new cc.EaseOut(this._inner.reverse(), 1 / this._rate)
	},
	clone: function() {
		var a = new cc.EaseOut;
		return a.initWithAction(this._inner.clone(), this._rate), a
	}
}), cc.EaseOut.create = function(a, b) {
	return new cc.EaseOut(a, b)
}, cc.easeOut = function(a) {
	return {
		_rate: a,
		easing: function(a) {
			return Math.pow(a, 1 / this._rate)
		},
		reverse: function() {
			return cc.easeOut(1 / this._rate)
		}
	}
}, cc.EaseInOut = cc.EaseRateAction.extend({
	update: function(a) {
		a *= 2, 1 > a ? this._inner.update(.5 * Math.pow(a, this._rate)) : this._inner.update(1 - .5 * Math.pow(2 - a, this._rate))
	},
	clone: function() {
		var a = new cc.EaseInOut;
		return a.initWithAction(this._inner.clone(), this._rate), a
	},
	reverse: function() {
		return new cc.EaseInOut(this._inner.reverse(), this._rate)
	}
}), cc.EaseInOut.create = function(a, b) {
	return new cc.EaseInOut(a, b)
}, cc.easeInOut = function(a) {
	return {
		_rate: a,
		easing: function(a) {
			return a *= 2, 1 > a ? .5 * Math.pow(a, this._rate) : 1 - .5 * Math.pow(2 - a, this._rate)
		},
		reverse: function() {
			return cc.easeInOut(this._rate)
		}
	}
}, cc.EaseExponentialIn = cc.ActionEase.extend({
	update: function(a) {
		this._inner.update(0 === a ? 0 : Math.pow(2, 10 * (a - 1)))
	},
	reverse: function() {
		return new cc.EaseExponentialOut(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseExponentialIn;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseExponentialIn.create = function(a) {
	return new cc.EaseExponentialIn(a)
}, cc._easeExponentialInObj = {
	easing: function(a) {
		return 0 === a ? 0 : Math.pow(2, 10 * (a - 1))
	},
	reverse: function() {
		return cc._easeExponentialOutObj
	}
}, cc.easeExponentialIn = function() {
	return cc._easeExponentialInObj
}, cc.EaseExponentialOut = cc.ActionEase.extend({
	update: function(a) {
		this._inner.update(1 === a ? 1 : -Math.pow(2, -10 * a) + 1)
	},
	reverse: function() {
		return new cc.EaseExponentialIn(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseExponentialOut;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseExponentialOut.create = function(a) {
	return new cc.EaseExponentialOut(a)
}, cc._easeExponentialOutObj = {
	easing: function(a) {
		return 1 === a ? 1 : -Math.pow(2, -10 * a) + 1
	},
	reverse: function() {
		return cc._easeExponentialInObj
	}
}, cc.easeExponentialOut = function() {
	return cc._easeExponentialOutObj
}, cc.EaseExponentialInOut = cc.ActionEase.extend({
	update: function(a) {
		1 !== a && 0 !== a && (a *= 2, a = 1 > a ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)), this._inner.update(a)
	},
	reverse: function() {
		return new cc.EaseExponentialInOut(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseExponentialInOut;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseExponentialInOut.create = function(a) {
	return new cc.EaseExponentialInOut(a)
}, cc._easeExponentialInOutObj = {
	easing: function(a) {
		return 1 !== a && 0 !== a ? (a *= 2, 1 > a ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)) : a
	},
	reverse: function() {
		return cc._easeExponentialInOutObj
	}
}, cc.easeExponentialInOut = function() {
	return cc._easeExponentialInOutObj
}, cc.EaseSineIn = cc.ActionEase.extend({
	update: function(a) {
		a = 0 === a || 1 === a ? a : -1 * Math.cos(a * Math.PI / 2) + 1, this._inner.update(a)
	},
	reverse: function() {
		return new cc.EaseSineOut(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseSineIn;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseSineIn.create = function(a) {
	return new cc.EaseSineIn(a)
}, cc._easeSineInObj = {
	easing: function(a) {
		return 0 === a || 1 === a ? a : -1 * Math.cos(a * Math.PI / 2) + 1
	},
	reverse: function() {
		return cc._easeSineOutObj
	}
}, cc.easeSineIn = function() {
	return cc._easeSineInObj
}, cc.EaseSineOut = cc.ActionEase.extend({
	update: function(a) {
		a = 0 === a || 1 === a ? a : Math.sin(a * Math.PI / 2), this._inner.update(a)
	},
	reverse: function() {
		return new cc.EaseSineIn(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseSineOut;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseSineOut.create = function(a) {
	return new cc.EaseSineOut(a)
}, cc._easeSineOutObj = {
	easing: function(a) {
		return 0 === a || 1 === a ? a : Math.sin(a * Math.PI / 2)
	},
	reverse: function() {
		return cc._easeSineInObj
	}
}, cc.easeSineOut = function() {
	return cc._easeSineOutObj
}, cc.EaseSineInOut = cc.ActionEase.extend({
	update: function(a) {
		a = 0 === a || 1 === a ? a : -.5 * (Math.cos(Math.PI * a) - 1), this._inner.update(a)
	},
	clone: function() {
		var a = new cc.EaseSineInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseSineInOut(this._inner.reverse())
	}
}), cc.EaseSineInOut.create = function(a) {
	return new cc.EaseSineInOut(a)
}, cc._easeSineInOutObj = {
	easing: function(a) {
		return 0 === a || 1 === a ? a : -.5 * (Math.cos(Math.PI * a) - 1)
	},
	reverse: function() {
		return cc._easeSineInOutObj
	}
}, cc.easeSineInOut = function() {
	return cc._easeSineInOutObj
}, cc.EaseElastic = cc.ActionEase.extend({
	_period: .3,
	ctor: function(a, b) {
		cc.ActionEase.prototype.ctor.call(this), a && this.initWithAction(a, b)
	},
	getPeriod: function() {
		return this._period
	},
	setPeriod: function(a) {
		this._period = a
	},
	initWithAction: function(a, b) {
		return cc.ActionEase.prototype.initWithAction.call(this, a), this._period = null == b ? .3 : b, !0
	},
	reverse: function() {
		return cc.log("cc.EaseElastic.reverse(): it should be overridden in subclass."), null
	},
	clone: function() {
		var a = new cc.EaseElastic;
		return a.initWithAction(this._inner.clone(), this._period), a
	}
}), cc.EaseElastic.create = function(a, b) {
	return new cc.EaseElastic(a, b)
}, cc.EaseElasticIn = cc.EaseElastic.extend({
	update: function(a) {
		var b = 0;
		if (0 === a || 1 === a) b = a;
		else {
			var c = this._period / 4;
			a -= 1, b = -Math.pow(2, 10 * a) * Math.sin((a - c) * Math.PI * 2 / this._period)
		}
		this._inner.update(b)
	},
	reverse: function() {
		return new cc.EaseElasticOut(this._inner.reverse(), this._period)
	},
	clone: function() {
		var a = new cc.EaseElasticIn;
		return a.initWithAction(this._inner.clone(), this._period), a
	}
}), cc.EaseElasticIn.create = function(a, b) {
	return new cc.EaseElasticIn(a, b)
}, cc._easeElasticInObj = {
	easing: function(a) {
		return 0 === a || 1 === a ? a : (a -= 1, -Math.pow(2, 10 * a) * Math.sin((a - .075) * Math.PI * 2 / .3))
	},
	reverse: function() {
		return cc._easeElasticOutObj
	}
}, cc.easeElasticIn = function(a) {
	return a && .3 !== a ? {
		_period: a,
		easing: function(a) {
			return 0 === a || 1 === a ? a : (a -= 1, -Math.pow(2, 10 * a) * Math.sin((a - this._period / 4) * Math.PI * 2 / this._period))
		},
		reverse: function() {
			return cc.easeElasticOut(this._period)
		}
	} : cc._easeElasticInObj
}, cc.EaseElasticOut = cc.EaseElastic.extend({
	update: function(a) {
		var b = 0;
		if (0 === a || 1 === a) b = a;
		else {
			var c = this._period / 4;
			b = Math.pow(2, -10 * a) * Math.sin((a - c) * Math.PI * 2 / this._period) + 1
		}
		this._inner.update(b)
	},
	reverse: function() {
		return new cc.EaseElasticIn(this._inner.reverse(), this._period)
	},
	clone: function() {
		var a = new cc.EaseElasticOut;
		return a.initWithAction(this._inner.clone(), this._period), a
	}
}), cc.EaseElasticOut.create = function(a, b) {
	return new cc.EaseElasticOut(a, b)
}, cc._easeElasticOutObj = {
	easing: function(a) {
		return 0 === a || 1 === a ? a : Math.pow(2, -10 * a) * Math.sin((a - .075) * Math.PI * 2 / .3) + 1
	},
	reverse: function() {
		return cc._easeElasticInObj
	}
}, cc.easeElasticOut = function(a) {
	return a && .3 !== a ? {
		_period: a,
		easing: function(a) {
			return 0 === a || 1 === a ? a : Math.pow(2, -10 * a) * Math.sin((a - this._period / 4) * Math.PI * 2 / this._period) + 1
		},
		reverse: function() {
			return cc.easeElasticIn(this._period)
		}
	} : cc._easeElasticOutObj
}, cc.EaseElasticInOut = cc.EaseElastic.extend({
	update: function(a) {
		var b = 0,
			c = this._period;
		if (0 === a || 1 === a) b = a;
		else {
			a = 2 * a, c || (c = this._period = .3 * 1.5);
			var d = c / 4;
			a -= 1, b = 0 > a ? -.5 * Math.pow(2, 10 * a) * Math.sin((a - d) * Math.PI * 2 / c) : Math.pow(2, -10 * a) * Math.sin((a - d) * Math.PI * 2 / c) * .5 + 1
		}
		this._inner.update(b)
	},
	reverse: function() {
		return new cc.EaseElasticInOut(this._inner.reverse(), this._period)
	},
	clone: function() {
		var a = new cc.EaseElasticInOut;
		return a.initWithAction(this._inner.clone(), this._period), a
	}
}), cc.EaseElasticInOut.create = function(a, b) {
	return new cc.EaseElasticInOut(a, b)
}, cc.easeElasticInOut = function(a) {
	return a = a || .3, {
		_period: a,
		easing: function(a) {
			var b = 0,
				c = this._period;
			if (0 === a || 1 === a) b = a;
			else {
				a = 2 * a, c || (c = this._period = .3 * 1.5);
				var d = c / 4;
				a -= 1, b = 0 > a ? -.5 * Math.pow(2, 10 * a) * Math.sin((a - d) * Math.PI * 2 / c) : Math.pow(2, -10 * a) * Math.sin((a - d) * Math.PI * 2 / c) * .5 + 1
			}
			return b
		},
		reverse: function() {
			return cc.easeElasticInOut(this._period)
		}
	}
}, cc.EaseBounce = cc.ActionEase.extend({
	bounceTime: function(a) {
		return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? (a -= 1.5 / 2.75, 7.5625 * a * a + .75) : 2.5 / 2.75 > a ? (a -= 2.25 / 2.75, 7.5625 * a * a + .9375) : (a -= 2.625 / 2.75, 7.5625 * a * a + .984375)
	},
	clone: function() {
		var a = new cc.EaseBounce;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseBounce(this._inner.reverse())
	}
}), cc.EaseBounce.create = function(a) {
	return new cc.EaseBounce(a)
}, cc.EaseBounceIn = cc.EaseBounce.extend({
	update: function(a) {
		var b = 1 - this.bounceTime(1 - a);
		this._inner.update(b)
	},
	reverse: function() {
		return new cc.EaseBounceOut(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseBounceIn;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseBounceIn.create = function(a) {
	return new cc.EaseBounceIn(a)
}, cc._bounceTime = function(a) {
	return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? (a -= 1.5 / 2.75, 7.5625 * a * a + .75) : 2.5 / 2.75 > a ? (a -= 2.25 / 2.75, 7.5625 * a * a + .9375) : (a -= 2.625 / 2.75, 7.5625 * a * a + .984375)
}, cc._easeBounceInObj = {
	easing: function(a) {
		return 1 - cc._bounceTime(1 - a)
	},
	reverse: function() {
		return cc._easeBounceOutObj
	}
}, cc.easeBounceIn = function() {
	return cc._easeBounceInObj
}, cc.EaseBounceOut = cc.EaseBounce.extend({
	update: function(a) {
		var b = this.bounceTime(a);
		this._inner.update(b)
	},
	reverse: function() {
		return new cc.EaseBounceIn(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseBounceOut;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseBounceOut.create = function(a) {
	return new cc.EaseBounceOut(a)
}, cc._easeBounceOutObj = {
	easing: function(a) {
		return cc._bounceTime(a)
	},
	reverse: function() {
		return cc._easeBounceInObj
	}
}, cc.easeBounceOut = function() {
	return cc._easeBounceOutObj
}, cc.EaseBounceInOut = cc.EaseBounce.extend({
	update: function(a) {
		var b = 0;.5 > a ? (a = 2 * a, b = .5 * (1 - this.bounceTime(1 - a))) : b = .5 * this.bounceTime(2 * a - 1) + .5, this._inner.update(b)
	},
	clone: function() {
		var a = new cc.EaseBounceInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseBounceInOut(this._inner.reverse())
	}
}), cc.EaseBounceInOut.create = function(a) {
	return new cc.EaseBounceInOut(a)
}, cc._easeBounceInOutObj = {
	easing: function(a) {
		var b;
		return .5 > a ? (a = 2 * a, b = .5 * (1 - cc._bounceTime(1 - a))) : b = .5 * cc._bounceTime(2 * a - 1) + .5, b
	},
	reverse: function() {
		return cc._easeBounceInOutObj
	}
}, cc.easeBounceInOut = function() {
	return cc._easeBounceInOutObj
}, cc.EaseBackIn = cc.ActionEase.extend({
	update: function(a) {
		var b = 1.70158;
		a = 0 === a || 1 === a ? a : a * a * ((b + 1) * a - b), this._inner.update(a)
	},
	reverse: function() {
		return new cc.EaseBackOut(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseBackIn;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseBackIn.create = function(a) {
	return new cc.EaseBackIn(a)
}, cc._easeBackInObj = {
	easing: function(a) {
		var b = 1.70158;
		return 0 === a || 1 === a ? a : a * a * ((b + 1) * a - b)
	},
	reverse: function() {
		return cc._easeBackOutObj
	}
}, cc.easeBackIn = function() {
	return cc._easeBackInObj
}, cc.EaseBackOut = cc.ActionEase.extend({
	update: function(a) {
		var b = 1.70158;
		a -= 1, this._inner.update(a * a * ((b + 1) * a + b) + 1)
	},
	reverse: function() {
		return new cc.EaseBackIn(this._inner.reverse())
	},
	clone: function() {
		var a = new cc.EaseBackOut;
		return a.initWithAction(this._inner.clone()), a
	}
}), cc.EaseBackOut.create = function(a) {
	return new cc.EaseBackOut(a)
}, cc._easeBackOutObj = {
	easing: function(a) {
		var b = 1.70158;
		return a -= 1, a * a * ((b + 1) * a + b) + 1
	},
	reverse: function() {
		return cc._easeBackInObj
	}
}, cc.easeBackOut = function() {
	return cc._easeBackOutObj
}, cc.EaseBackInOut = cc.ActionEase.extend({
	update: function(a) {
		var b = 2.5949095;
		a = 2 * a, 1 > a ? this._inner.update(a * a * ((b + 1) * a - b) / 2) : (a -= 2, this._inner.update(a * a * ((b + 1) * a + b) / 2 + 1))
	},
	clone: function() {
		var a = new cc.EaseBackInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseBackInOut(this._inner.reverse())
	}
}), cc.EaseBackInOut.create = function(a) {
	return new cc.EaseBackInOut(a)
}, cc._easeBackInOutObj = {
	easing: function(a) {
		var b = 2.5949095;
		return a = 2 * a, 1 > a ? a * a * ((b + 1) * a - b) / 2 : (a -= 2, a * a * ((b + 1) * a + b) / 2 + 1)
	},
	reverse: function() {
		return cc._easeBackInOutObj
	}
}, cc.easeBackInOut = function() {
	return cc._easeBackInOutObj
}, cc.EaseBezierAction = cc.ActionEase.extend({
	_p0: null,
	_p1: null,
	_p2: null,
	_p3: null,
	ctor: function(a) {
		cc.ActionEase.prototype.ctor.call(this, a)
	},
	_updateTime: function(a, b, c, d, e) {
		return Math.pow(1 - e, 3) * a + 3 * e * Math.pow(1 - e, 2) * b + 3 * Math.pow(e, 2) * (1 - e) * c + Math.pow(e, 3) * d
	},
	update: function(a) {
		var b = this._updateTime(this._p0, this._p1, this._p2, this._p3, a);
		this._inner.update(b)
	},
	clone: function() {
		var a = new cc.EaseBezierAction;
		return a.initWithAction(this._inner.clone()), a.setBezierParamer(this._p0, this._p1, this._p2, this._p3), a
	},
	reverse: function() {
		var a = new cc.EaseBezierAction(this._inner.reverse());
		return a.setBezierParamer(this._p3, this._p2, this._p1, this._p0), a
	},
	setBezierParamer: function(a, b, c, d) {
		this._p0 = a || 0, this._p1 = b || 0, this._p2 = c || 0, this._p3 = d || 0
	}
}), cc.EaseBezierAction.create = function(a) {
	return new cc.EaseBezierAction(a)
}, cc.easeBezierAction = function(a, b, c, d) {
	return {
		easing: function(e) {
			return cc.EaseBezierAction.prototype._updateTime(a, b, c, d, e)
		},
		reverse: function() {
			return cc.easeBezierAction(d, c, b, a)
		}
	}
}, cc.EaseQuadraticActionIn = cc.ActionEase.extend({
	_updateTime: function(a) {
		return Math.pow(a, 2)
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuadraticActionIn;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuadraticActionIn(this._inner.reverse())
	}
}), cc.EaseQuadraticActionIn.create = function(a) {
	return new cc.EaseQuadraticActionIn(a)
}, cc._easeQuadraticActionIn = {
	easing: cc.EaseQuadraticActionIn.prototype._updateTime,
	reverse: function() {
		return cc._easeQuadraticActionIn
	}
}, cc.easeQuadraticActionIn = function() {
	return cc._easeQuadraticActionIn
}, cc.EaseQuadraticActionOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return -a * (a - 2)
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuadraticActionOut;
		return a.initWithAction(), a
	},
	reverse: function() {
		return new cc.EaseQuadraticActionOut(this._inner.reverse())
	}
}), cc.EaseQuadraticActionOut.create = function(a) {
	return new cc.EaseQuadraticActionOut(a)
}, cc._easeQuadraticActionOut = {
	easing: cc.EaseQuadraticActionOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuadraticActionOut
	}
}, cc.easeQuadraticActionOut = function() {
	return cc._easeQuadraticActionOut
}, cc.EaseQuadraticActionInOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		var b = a;
		return a *= 2, 1 > a ? b = a * a * .5 : (--a, b = -.5 * (a * (a - 2) - 1)), b
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuadraticActionInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuadraticActionInOut(this._inner.reverse())
	}
}), cc.EaseQuadraticActionInOut.create = function(a) {
	return new cc.EaseQuadraticActionInOut(a)
}, cc._easeQuadraticActionInOut = {
	easing: cc.EaseQuadraticActionInOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuadraticActionInOut
	}
}, cc.easeQuadraticActionInOut = function() {
	return cc._easeQuadraticActionInOut
}, cc.EaseQuarticActionIn = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a * a * a * a
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuarticActionIn;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuarticActionIn(this._inner.reverse())
	}
}), cc.EaseQuarticActionIn.create = function(a) {
	return new cc.EaseQuarticActionIn(a)
}, cc._easeQuarticActionIn = {
	easing: cc.EaseQuarticActionIn.prototype._updateTime,
	reverse: function() {
		return cc._easeQuarticActionIn
	}
}, cc.easeQuarticActionIn = function() {
	return cc._easeQuarticActionIn
}, cc.EaseQuarticActionOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a -= 1, -(a * a * a * a - 1)
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuarticActionOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuarticActionOut(this._inner.reverse())
	}
}), cc.EaseQuarticActionOut.create = function(a) {
	return new cc.EaseQuarticActionOut(a)
}, cc._easeQuarticActionOut = {
	easing: cc.EaseQuarticActionOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuarticActionOut
	}
}, cc.easeQuarticActionOut = function() {
	return cc._easeQuarticActionOut
}, cc.EaseQuarticActionInOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a = 2 * a, 1 > a ? .5 * a * a * a * a : (a -= 2, -.5 * (a * a * a * a - 2))
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuarticActionInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuarticActionInOut(this._inner.reverse())
	}
}), cc.EaseQuarticActionInOut.create = function(a) {
	return new cc.EaseQuarticActionInOut(a)
}, cc._easeQuarticActionInOut = {
	easing: cc.EaseQuarticActionInOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuarticActionInOut
	}
}, cc.easeQuarticActionInOut = function() {
	return cc._easeQuarticActionInOut
}, cc.EaseQuinticActionIn = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a * a * a * a * a
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuinticActionIn;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuinticActionIn(this._inner.reverse())
	}
}), cc.EaseQuinticActionIn.create = function(a) {
	return new cc.EaseQuinticActionIn(a)
}, cc._easeQuinticActionIn = {
	easing: cc.EaseQuinticActionIn.prototype._updateTime,
	reverse: function() {
		return cc._easeQuinticActionIn
	}
}, cc.easeQuinticActionIn = function() {
	return cc._easeQuinticActionIn
}, cc.EaseQuinticActionOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a -= 1, a * a * a * a * a + 1
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuinticActionOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuinticActionOut(this._inner.reverse())
	}
}), cc.EaseQuinticActionOut.create = function(a) {
	return new cc.EaseQuinticActionOut(a)
}, cc._easeQuinticActionOut = {
	easing: cc.EaseQuinticActionOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuinticActionOut
	}
}, cc.easeQuinticActionOut = function() {
	return cc._easeQuinticActionOut
}, cc.EaseQuinticActionInOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a = 2 * a, 1 > a ? .5 * a * a * a * a * a : (a -= 2, .5 * (a * a * a * a * a + 2))
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseQuinticActionInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseQuinticActionInOut(this._inner.reverse())
	}
}), cc.EaseQuinticActionInOut.create = function(a) {
	return new cc.EaseQuinticActionInOut(a)
}, cc._easeQuinticActionInOut = {
	easing: cc.EaseQuinticActionInOut.prototype._updateTime,
	reverse: function() {
		return cc._easeQuinticActionInOut
	}
}, cc.easeQuinticActionInOut = function() {
	return cc._easeQuinticActionInOut
}, cc.EaseCircleActionIn = cc.ActionEase.extend({
	_updateTime: function(a) {
		return -1 * (Math.sqrt(1 - a * a) - 1)
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCircleActionIn;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCircleActionIn(this._inner.reverse())
	}
}), cc.EaseCircleActionIn.create = function(a) {
	return new cc.EaseCircleActionIn(a)
}, cc._easeCircleActionIn = {
	easing: cc.EaseCircleActionIn.prototype._updateTime,
	reverse: function() {
		return cc._easeCircleActionIn
	}
}, cc.easeCircleActionIn = function() {
	return cc._easeCircleActionIn
}, cc.EaseCircleActionOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a -= 1, Math.sqrt(1 - a * a)
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCircleActionOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCircleActionOut(this._inner.reverse())
	}
}), cc.EaseCircleActionOut.create = function(a) {
	return new cc.EaseCircleActionOut(a)
}, cc._easeCircleActionOut = {
	easing: cc.EaseCircleActionOut.prototype._updateTime,
	reverse: function() {
		return cc._easeCircleActionOut
	}
}, cc.easeCircleActionOut = function() {
	return cc._easeCircleActionOut
}, cc.EaseCircleActionInOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a = 2 * a, 1 > a ? -.5 * (Math.sqrt(1 - a * a) - 1) : (a -= 2, .5 * (Math.sqrt(1 - a * a) + 1))
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCircleActionInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCircleActionInOut(this._inner.reverse())
	}
}), cc.EaseCircleActionInOut.create = function(a) {
	return new cc.EaseCircleActionInOut(a)
}, cc._easeCircleActionInOut = {
	easing: cc.EaseCircleActionInOut.prototype._updateTime,
	reverse: function() {
		return cc._easeCircleActionInOut
	}
}, cc.easeCircleActionInOut = function() {
	return cc._easeCircleActionInOut
}, cc.EaseCubicActionIn = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a * a * a
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCubicActionIn;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCubicActionIn(this._inner.reverse())
	}
}), cc.EaseCubicActionIn.create = function(a) {
	return new cc.EaseCubicActionIn(a)
}, cc._easeCubicActionIn = {
	easing: cc.EaseCubicActionIn.prototype._updateTime,
	reverse: function() {
		return cc._easeCubicActionIn
	}
}, cc.easeCubicActionIn = function() {
	return cc._easeCubicActionIn
}, cc.EaseCubicActionOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a -= 1, a * a * a + 1
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCubicActionOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCubicActionOut(this._inner.reverse())
	}
}), cc.EaseCubicActionOut.create = function(a) {
	return new cc.EaseCubicActionOut(a)
}, cc._easeCubicActionOut = {
	easing: cc.EaseCubicActionOut.prototype._updateTime,
	reverse: function() {
		return cc._easeCubicActionOut
	}
}, cc.easeCubicActionOut = function() {
	return cc._easeCubicActionOut
}, cc.EaseCubicActionInOut = cc.ActionEase.extend({
	_updateTime: function(a) {
		return a = 2 * a, 1 > a ? .5 * a * a * a : (a -= 2, .5 * (a * a * a + 2))
	},
	update: function(a) {
		this._inner.update(this._updateTime(a))
	},
	clone: function() {
		var a = new cc.EaseCubicActionInOut;
		return a.initWithAction(this._inner.clone()), a
	},
	reverse: function() {
		return new cc.EaseCubicActionInOut(this._inner.reverse())
	}
}), cc.EaseCubicActionInOut.create = function(a) {
	return new cc.EaseCubicActionInOut(a)
}, cc._easeCubicActionInOut = {
	easing: cc.EaseCubicActionInOut.prototype._updateTime,
	reverse: function() {
		return cc._easeCubicActionInOut
	}
}, cc.easeCubicActionInOut = function() {
	return cc._easeCubicActionInOut
}, cc.cardinalSplineAt = function(a, b, c, d, e, f) {
	var g = f * f,
		h = g * f,
		i = (1 - e) / 2,
		j = i * (-h + 2 * g - f),
		k = i * (-h + g) + (2 * h - 3 * g + 1),
		l = i * (h - 2 * g + f) + (-2 * h + 3 * g),
		m = i * (h - g),
		n = a.x * j + b.x * k + c.x * l + d.x * m,
		o = a.y * j + b.y * k + c.y * l + d.y * m;
	return cc.p(n, o)
}, cc.reverseControlPoints = function(a) {
	for (var b = [], c = a.length - 1; c >= 0; c--) b.push(cc.p(a[c].x, a[c].y));
	return b
}, cc.cloneControlPoints = function(a) {
	for (var b = [], c = 0; c < a.length; c++) b.push(cc.p(a[c].x, a[c].y));
	return b
}, cc.copyControlPoints = cc.cloneControlPoints, cc.getControlPointAt = function(a, b) {
	var c = Math.min(a.length - 1, Math.max(b, 0));
	return a[c]
}, cc.reverseControlPointsInline = function(a) {
	for (var b = a.length, c = 0 | b / 2, d = 0; c > d; ++d) {
		var e = a[d];
		a[d] = a[b - d - 1], a[b - d - 1] = e
	}
}, cc.CardinalSplineTo = cc.ActionInterval.extend({
	_points: null,
	_deltaT: 0,
	_tension: 0,
	_previousPosition: null,
	_accumulatedDiff: null,
	ctor: function(a, b, c) {
		cc.ActionInterval.prototype.ctor.call(this), this._points = [], void 0 !== c && this.initWithDuration(a, b, c)
	},
	initWithDuration: function(a, b, c) {
		if (!b || 0 === b.length) throw new Error("Invalid configuration. It must at least have one control point");
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this.setPoints(b), this._tension = c, !0) : !1
	},
	clone: function() {
		var a = new cc.CardinalSplineTo;
		return a.initWithDuration(this._duration, cc.copyControlPoints(this._points), this._tension), a
	},
	startWithTarget: function(a) {
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this._deltaT = 1 / (this._points.length - 1), this._previousPosition = cc.p(this.target.getPositionX(), this.target.getPositionY()), this._accumulatedDiff = cc.p(0, 0)
	},
	update: function(a) {
		a = this._computeEaseTime(a);
		var b, c, d = this._points;
		if (1 === a) b = d.length - 1, c = 1;
		else {
			var e = this._deltaT;
			b = 0 | a / e, c = (a - e * b) / e
		}
		var f = cc.cardinalSplineAt(cc.getControlPointAt(d, b - 1), cc.getControlPointAt(d, b - 0), cc.getControlPointAt(d, b + 1), cc.getControlPointAt(d, b + 2), this._tension, c);
		if (cc.ENABLE_STACKABLE_ACTIONS) {
			var g, h;
			if (g = this.target.getPositionX() - this._previousPosition.x, h = this.target.getPositionY() - this._previousPosition.y, 0 !== g || 0 !== h) {
				var i = this._accumulatedDiff;
				g = i.x + g, h = i.y + h, i.x = g, i.y = h, f.x += g, f.y += h
			}
		}
		this.updatePosition(f)
	},
	reverse: function() {
		var a = cc.reverseControlPoints(this._points);
		return cc.cardinalSplineTo(this._duration, a, this._tension)
	},
	updatePosition: function(a) {
		this.target.setPosition(a), this._previousPosition = a
	},
	getPoints: function() {
		return this._points
	},
	setPoints: function(a) {
		this._points = a
	}
}), cc.cardinalSplineTo = function(a, b, c) {
	return new cc.CardinalSplineTo(a, b, c)
}, cc.CardinalSplineTo.create = cc.cardinalSplineTo, cc.CardinalSplineBy = cc.CardinalSplineTo.extend({
	_startPosition: null,
	ctor: function(a, b, c) {
		cc.CardinalSplineTo.prototype.ctor.call(this), this._startPosition = cc.p(0, 0), void 0 !== c && this.initWithDuration(a, b, c)
	},
	startWithTarget: function(a) {
		cc.CardinalSplineTo.prototype.startWithTarget.call(this, a), this._startPosition.x = a.getPositionX(), this._startPosition.y = a.getPositionY()
	},
	reverse: function() {
		for (var a, b = this._points.slice(), c = b[0], d = 1; d < b.length; ++d) a = b[d], b[d] = cc.pSub(a, c), c = a;
		var e = cc.reverseControlPoints(b);
		c = e[e.length - 1], e.pop(), c.x = -c.x, c.y = -c.y, e.unshift(c);
		for (var d = 1; d < e.length; ++d) a = e[d], a.x = -a.x, a.y = -a.y, a.x += c.x, a.y += c.y, e[d] = a, c = a;
		return cc.cardinalSplineBy(this._duration, e, this._tension)
	},
	updatePosition: function(a) {
		var b = this._startPosition,
			c = a.x + b.x,
			d = a.y + b.y;
		this._previousPosition.x = c, this._previousPosition.y = d, this.target.setPosition(c, d)
	},
	clone: function() {
		var a = new cc.CardinalSplineBy;
		return a.initWithDuration(this._duration, cc.copyControlPoints(this._points), this._tension), a
	}
}), cc.cardinalSplineBy = function(a, b, c) {
	return new cc.CardinalSplineBy(a, b, c)
}, cc.CardinalSplineBy.create = cc.cardinalSplineBy, cc.CatmullRomTo = cc.CardinalSplineTo.extend({
	ctor: function(a, b) {
		b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.CardinalSplineTo.prototype.initWithDuration.call(this, a, b, .5)
	},
	clone: function() {
		var a = new cc.CatmullRomTo;
		return a.initWithDuration(this._duration, cc.copyControlPoints(this._points)), a
	}
}), cc.catmullRomTo = function(a, b) {
	return new cc.CatmullRomTo(a, b)
}, cc.CatmullRomTo.create = cc.catmullRomTo, cc.CatmullRomBy = cc.CardinalSplineBy.extend({
	ctor: function(a, b) {
		cc.CardinalSplineBy.prototype.ctor.call(this), b && this.initWithDuration(a, b)
	},
	initWithDuration: function(a, b) {
		return cc.CardinalSplineTo.prototype.initWithDuration.call(this, a, b, .5)
	},
	clone: function() {
		var a = new cc.CatmullRomBy;
		return a.initWithDuration(this._duration, cc.copyControlPoints(this._points)), a
	}
}), cc.catmullRomBy = function(a, b) {
	return new cc.CatmullRomBy(a, b)
}, cc.CatmullRomBy.create = cc.catmullRomBy, cc.ActionTweenDelegate = cc.Class.extend({
	updateTweenAction: function(a, b) {}
}), cc.ActionTween = cc.ActionInterval.extend({
	key: "",
	from: 0,
	to: 0,
	delta: 0,
	ctor: function(a, b, c, d) {
		cc.ActionInterval.prototype.ctor.call(this), this.key = "", void 0 !== d && this.initWithDuration(a, b, c, d)
	},
	initWithDuration: function(a, b, c, d) {
		return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this.key = b, this.to = d, this.from = c, !0) : !1
	},
	startWithTarget: function(a) {
		if (!a || !a.updateTweenAction) throw new Error("cc.ActionTween.startWithTarget(): target must be non-null, and target must implement updateTweenAction function");
		cc.ActionInterval.prototype.startWithTarget.call(this, a), this.delta = this.to - this.from
	},
	update: function(a) {
		this.target.updateTweenAction(this.to - this.delta * (1 - a), this.key)
	},
	reverse: function() {
		return new cc.ActionTween(this.duration, this.key, this.to, this.from)
	},
	clone: function() {
		var a = new cc.ActionTween;
		return a.initWithDuration(this._duration, this.key, this.from, this.to), a
	}
}), cc.actionTween = function(a, b, c, d) {
	return new cc.ActionTween(a, b, c, d)
}, cc.ActionTween.create = cc.actionTween;
!
function() {
	var a = !1,
		b = cc.sys,
		c = b.browserVersion,
		d = !! (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
		e = {
			common: {
				MULTI_CHANNEL: !0,
				WEB_AUDIO: d,
				AUTOPLAY: !0
			}
		};
	if (e[b.BROWSER_TYPE_IE] = {
		MULTI_CHANNEL: !0,
		WEB_AUDIO: d,
		AUTOPLAY: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_ANDROID] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1
	}, e[b.BROWSER_TYPE_CHROME] = {
		MULTI_CHANNEL: !0,
		WEB_AUDIO: !0,
		AUTOPLAY: !1
	}, e[b.BROWSER_TYPE_FIREFOX] = {
		MULTI_CHANNEL: !0,
		WEB_AUDIO: !0,
		AUTOPLAY: !0,
		DELAY_CREATE_CTX: !0
	}, e[b.BROWSER_TYPE_UC] = {
		MULTI_CHANNEL: !0,
		WEB_AUDIO: !1,
		AUTOPLAY: !1
	}, e[b.BROWSER_TYPE_QQ] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !0
	}, e[b.BROWSER_TYPE_OUPENG] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_WECHAT] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_360] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !0
	}, e[b.BROWSER_TYPE_MIUI] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !0
	}, e[b.BROWSER_TYPE_LIEBAO] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_SOUGOU] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_BAIDU] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_BAIDU_APP] = {
		MULTI_CHANNEL: !1,
		WEB_AUDIO: !1,
		AUTOPLAY: !1,
		REPLAY_AFTER_TOUCH: !0,
		USE_EMPTIED_EVENT: !0
	}, e[b.BROWSER_TYPE_SAFARI] = {
		MULTI_CHANNEL: !0,
		WEB_AUDIO: !0,
		AUTOPLAY: !1,
		webAudioCallback: function(a) {
			document.createElement("audio").src = a
		}
	}, cc.sys.isMobile) cc.sys.os !== cc.sys.OS_IOS ? window.__audioSupport = e[b.browserType] || e.common : window.__audioSupport = e[b.BROWSER_TYPE_SAFARI];
	else switch (b.browserType) {
	case b.BROWSER_TYPE_IE:
		window.__audioSupport = e[b.BROWSER_TYPE_IE];
		break;
	case b.BROWSER_TYPE_FIREFOX:
		window.__audioSupport = e[b.BROWSER_TYPE_FIREFOX];
		break;
	default:
		window.__audioSupport = e.common
	}
	if (c) switch (b.browserType) {
	case b.BROWSER_TYPE_CHROME:
		c = parseInt(c), 30 > c ? window.__audioSupport = {
			MULTI_CHANNEL: !1,
			WEB_AUDIO: !0,
			AUTOPLAY: !1
		} : 42 === c && (window.__audioSupport.NEED_MANUAL_LOOP = !0);
		break;
	case b.BROWSER_TYPE_MIUI:
		cc.sys.isMobile && (c = c.match(/\d+/g), (c[0] < 2 || 2 === c[0] && 0 === c[1] && c[2] <= 1) && (window.__audioSupport.AUTOPLAY = !1))
	}
	a && setTimeout(function() {
		cc.log("browse type: " + b.browserType), cc.log("browse version: " + c), cc.log("MULTI_CHANNEL: " + window.__audioSupport.MULTI_CHANNEL), cc.log("WEB_AUDIO: " + window.__audioSupport.WEB_AUDIO), cc.log("AUTOPLAY: " + window.__audioSupport.AUTOPLAY)
	}, 0)
}(), cc.Audio = cc.Class.extend({
	volume: 1,
	loop: !1,
	src: null,
	_touch: !1,
	_playing: !1,
	_AUDIO_TYPE: "AUDIO",
	_pause: !1,
	_buffer: null,
	_currentSource: null,
	_startTime: null,
	_currentTime: null,
	_context: null,
	_volume: null,
	_ignoreEnded: !1,
	_manualLoop: !1,
	_element: null,
	ctor: function(a, b, c) {
		a && (this._context = a), b && (this._volume = b), a && b && (this._AUDIO_TYPE = "WEBAUDIO"), this.src = c
	},
	_setBufferCallback: null,
	setBuffer: function(a) {
		if (a) {
			var b = this._playing;
			this._AUDIO_TYPE = "WEBAUDIO", this._buffer && this._buffer !== a && this.getPlaying() && this.stop(), this._buffer = a, b && this.play(), this._volume.gain.value = this.volume, this._setBufferCallback && this._setBufferCallback(a)
		}
	},
	_setElementCallback: null,
	setElement: function(a) {
		if (a) {
			var b = this._playing;
			this._AUDIO_TYPE = "AUDIO", this._element && this._element !== a && this.getPlaying() && this.stop(), this._element = a, b && this.play(), a.volume = this.volume, a.loop = this.loop, this._setElementCallback && this._setElementCallback(a)
		}
	},
	play: function(a, b) {
		this._playing = !0, this.loop = void 0 === b ? this.loop : b, "AUDIO" === this._AUDIO_TYPE ? this._playOfAudio(a) : this._playOfWebAudio(a)
	},
	getPlaying: function() {
		if (!this._playing) return !1;
		if ("AUDIO" === this._AUDIO_TYPE) {
			var a = this._element;
			return !a || this._pause || a.ended ? this._playing = !1 : !0
		}
		var b = this._currentSource;
		return b && b.playbackState ? this._currentTime + this._context.currentTime - this._startTime < b.buffer.duration : !0
	},
	_playOfWebAudio: function(a) {
		var b = this._currentSource;
		if (this._buffer) {
			if (!this._pause && b) {
				if (!(0 === this._context.currentTime || this._currentTime + this._context.currentTime - this._startTime > b.buffer.duration)) return;
				this._stopOfWebAudio()
			}
			var c = this._context.createBufferSource();
			if (c.buffer = this._buffer, c.connect(this._volume), this._manualLoop ? c.loop = !1 : c.loop = this.loop, this._startTime = this._context.currentTime, this._currentTime = a || 0, this._ignoreEnded = !1, c.start) c.start(0, a || 0);
			else if (c.noteGrainOn) {
				var d = c.buffer.duration;
				this.loop ? c.noteGrainOn(0, a, d) : c.noteGrainOn(0, a, d - a)
			} else c.noteOn(0);
			this._currentSource = c;
			var e = this;
			c.onended = function() {
				return e._manualLoop && e._playing && e.loop ? (e.stop(), void e.play()) : void(e._ignoreEnded ? e._ignoreEnded = !1 : e._pause ? e._playing = !1 : e.stop())
			}
		}
	},
	_playOfAudio: function() {
		var a = this._element;
		a && (a.loop = this.loop, a.play())
	},
	stop: function() {
		this._playing = !1, "AUDIO" === this._AUDIO_TYPE ? this._stopOfAudio() : this._stopOfWebAudio()
	},
	_stopOfWebAudio: function() {
		var a = this._currentSource;
		this._ignoreEnded = !0, a && (a.stop(0), this._currentSource = null)
	},
	_stopOfAudio: function() {
		var a = this._element;
		a && (a.pause(), a.duration && a.duration !== 1 / 0 && (a.currentTime = 0))
	},
	pause: function() {
		this.getPlaying() !== !1 && (this._playing = !1, this._pause = !0, "AUDIO" === this._AUDIO_TYPE ? this._pauseOfAudio() : this._pauseOfWebAudio())
	},
	_pauseOfWebAudio: function() {
		this._currentTime += this._context.currentTime - this._startTime;
		var a = this._currentSource;
		a && a.stop(0)
	},
	_pauseOfAudio: function() {
		var a = this._element;
		a && a.pause()
	},
	resume: function() {
		this._pause && ("AUDIO" === this._AUDIO_TYPE ? this._resumeOfAudio() : this._resumeOfWebAudio(), this._pause = !1, this._playing = !0)
	},
	_resumeOfWebAudio: function() {
		var a = this._currentSource;
		if (a) {
			this._startTime = this._context.currentTime;
			var b = this._currentTime % a.buffer.duration;
			this._playOfWebAudio(b)
		}
	},
	_resumeOfAudio: function() {
		var a = this._element;
		a && a.play()
	},
	setVolume: function(a) {
		a > 1 && (a = 1), 0 > a && (a = 0), this.volume = a, "AUDIO" === this._AUDIO_TYPE ? this._element && (this._element.volume = a) : this._volume && (this._volume.gain.value = a)
	},
	getVolume: function() {
		return this.volume
	},
	cloneNode: function() {
		var a, b;
		if ("AUDIO" === this._AUDIO_TYPE) {
			a = new cc.Audio;
			var c = document.createElement("audio");
			c.src = this.src, a.setElement(c)
		} else {
			var d = this._context.createGain();
			d.gain.value = 1, d.connect(this._context.destination), a = new cc.Audio(this._context, d, this.src), this._buffer ? a.setBuffer(this._buffer) : (b = this, this._setBufferCallback = function(c) {
				a.setBuffer(c), b._setBufferCallback = null
			}), a._manualLoop = this._manualLoop
		}
		return a._AUDIO_TYPE = this._AUDIO_TYPE, a
	}
}), function(a) {
	var b = a.WEB_AUDIO,
		c = a.MULTI_CHANNEL,
		d = a.AUTOPLAY,
		e = [];
	!
	function() {
		var a = document.createElement("audio");
		if (a.canPlayType) {
			var b = a.canPlayType('audio/ogg; codecs="vorbis"');
			b && "" !== b && e.push(".ogg");
			var c = a.canPlayType("audio/mpeg");
			c && "" !== c && e.push(".mp3");
			var d = a.canPlayType('audio/wav; codecs="1"');
			d && "" !== d && e.push(".wav");
			var f = a.canPlayType("audio/mp4");
			f && "" !== f && e.push(".mp4");
			var g = a.canPlayType("audio/x-m4a");
			g && "" !== g && e.push(".m4a")
		}
	}();
	try {
		if (b) {
			var f = new(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
			a.DELAY_CREATE_CTX && setTimeout(function() {
				f = new(window.AudioContext || window.webkitAudioContext || window.mozAudioContext)
			}, 0)
		}
	} catch (g) {
		b = !1, cc.log("browser don't support web audio")
	}
	var h = {
		cache: {},
		load: function(c, d, g, i) {
			if (0 === e.length) return i("can not support audio!");
			var j;
			cc.loader.audioPath && (c = cc.path.join(cc.loader.audioPath, c));
			var k = cc.path.extname(c),
				l = [k];
			for (j = 0; j < e.length; j++) k !== e[j] && l.push(e[j]);
			var m;
			if (h.cache[d]) return i(null, h.cache[d]);
			if (b) try {
				var n = f.createGain();
				n.gain.value = 1, n.connect(f.destination), m = new cc.Audio(f, n, c), a.NEED_MANUAL_LOOP && (m._manualLoop = !0)
			} catch (o) {
				b = !1, cc.log("browser don't support web audio"), m = new cc.Audio(null, null, c)
			} else m = new cc.Audio(null, null, c);
			this.loadAudioFromExtList(c, l, m, i), h.cache[d] = m
		},
		loadAudioFromExtList: function(c, d, g, i) {
			if (0 === d.length) {
				var j = "can not found the resource of audio! Last match url is : ";
				return j += c.replace(/\.(.*)?$/, "("), e.forEach(function(a) {
					j += a + "|"
				}), j = j.replace(/\|$/, ")"), i({
					status: 520,
					errorMessage: j
				}, null)
			}
			if (c = cc.path.changeExtname(c, d.splice(0, 1)), b) {
				a.webAudioCallback && a.webAudioCallback(c);
				var k = new XMLHttpRequest;
				k.open("GET", c, !0), k.responseType = "arraybuffer", k.onload = function() {
					f.decodeAudioData(k.response, function(a) {
						g.setBuffer(a), i(null, g)
					}, function() {
						h.loadAudioFromExtList(c, d, g, i)
					})
				}, k.onerror = function() {
					i({
						status: 520,
						errorMessage: j
					}, null)
				}, k.send()
			} else {
				var l = document.createElement("audio"),
					m = !1,
					n = !1,
					o = setTimeout(function() {
						0 === l.readyState ? r() : (n = !0, l.pause(), document.body.removeChild(l), i("audio load timeout : " + c, g))
					}, 1e4),
					p = function() {
						if (!m) {
							l.pause();
							try {
								l.currentTime = 0, l.volume = 1
							} catch (a) {}
							document.body.removeChild(l), g.setElement(l), l.removeEventListener("canplaythrough", p, !1), l.removeEventListener("error", q, !1), l.removeEventListener("emptied", r, !1), !n && i(null, g), m = !0, clearTimeout(o)
						}
					},
					q = function() {
						m && (l.pause(), document.body.removeChild(l), l.removeEventListener("canplaythrough", p, !1), l.removeEventListener("error", q, !1), l.removeEventListener("emptied", r, !1), !n && h.loadAudioFromExtList(c, d, g, i), m = !0, clearTimeout(o))
					},
					r = function() {
						n = !0, p(), i(null, g)
					};
				cc._addEventListener(l, "canplaythrough", p, !1), cc._addEventListener(l, "error", q, !1), a.USE_EMPTIED_EVENT && cc._addEventListener(l, "emptied", r, !1), l.src = c, document.body.appendChild(l), l.volume = 0, l.play()
			}
		}
	};
	if (cc.loader.register(["mp3", "ogg", "wav", "mp4", "m4a"], h), cc.audioEngine = {
		_currMusic: null,
		_musicVolume: 1,
		features: a,
		willPlayMusic: function() {
			return !1
		},
		playMusic: function(a, b) {
			var c = this._currMusic;
			c && c.src !== a && c.getPlaying() && c.stop();
			var d = h.cache[a];
			d || (cc.loader.load(a), d = h.cache[a]), d.play(0, b), d.setVolume(this._musicVolume), this._currMusic = d
		},
		stopMusic: function(a) {
			var b = this._currMusic;
			b && (b.stop(), a && cc.loader.release(b.src))
		},
		pauseMusic: function() {
			var a = this._currMusic;
			a && a.pause()
		},
		resumeMusic: function() {
			var a = this._currMusic;
			a && a.resume()
		},
		rewindMusic: function() {
			var a = this._currMusic;
			a && (a.stop(), a.play())
		},
		getMusicVolume: function() {
			return this._musicVolume
		},
		setMusicVolume: function(a) {
			a -= 0, isNaN(a) && (a = 1), a > 1 && (a = 1), 0 > a && (a = 0), this._musicVolume = a;
			var b = this._currMusic;
			b && b.setVolume(a)
		},
		isMusicPlaying: function() {
			var a = this._currMusic;
			return a ? a.getPlaying() : !1
		},
		_audioPool: {},
		_maxAudioInstance: 5,
		_effectVolume: 1,
		playEffect: function(a, d) {
			if (!c) return null;
			var e = this._audioPool[a];
			e || (e = this._audioPool[a] = []);
			var f;
			for (f = 0; f < e.length && e[f].getPlaying(); f++);
			if (e[f]) g = e[f], g.setVolume(this._effectVolume), g.play(0, d);
			else if (!b && f > this._maxAudioInstance) cc.log("Error: %s greater than %d", a, this._maxAudioInstance);
			else {
				var g = h.cache[a];
				g || (cc.loader.load(a), g = h.cache[a]), g = g.cloneNode(), g.setVolume(this._effectVolume), g.loop = d || !1, g.play(), e.push(g)
			}
			return g
		},
		setEffectsVolume: function(a) {
			a -= 0, isNaN(a) && (a = 1), a > 1 && (a = 1), 0 > a && (a = 0), this._effectVolume = a;
			var b = this._audioPool;
			for (var c in b) {
				var d = b[c];
				if (Array.isArray(d)) for (var e = 0; e < d.length; e++) d[e].setVolume(a)
			}
		},
		getEffectsVolume: function() {
			return this._effectVolume
		},
		pauseEffect: function(a) {
			a && a.pause()
		},
		pauseAllEffects: function() {
			var a = this._audioPool;
			for (var b in a) for (var c = a[b], d = 0; d < a[b].length; d++) c[d].getPlaying() && c[d].pause()
		},
		resumeEffect: function(a) {
			a && a.resume()
		},
		resumeAllEffects: function() {
			var a = this._audioPool;
			for (var b in a) for (var c = a[b], d = 0; d < a[b].length; d++) c[d].resume()
		},
		stopEffect: function(a) {
			a && a.stop()
		},
		stopAllEffects: function() {
			var a = this._audioPool;
			for (var b in a) for (var c = a[b], d = 0; d < a[b].length; d++) c[d].stop()
		},
		unloadEffect: function(a) {
			if (a) {
				cc.loader.release(a);
				var b = this._audioPool[a];
				b && (b.length = 0), delete this._audioPool[a], delete h.cache[a]
			}
		},
		end: function() {
			this.stopMusic(), this.stopAllEffects()
		},
		_pauseCache: [],
		_pausePlaying: function() {
			var a = this._currMusic;
			a && a.getPlaying() && (a.pause(), this._pauseCache.push(a));
			var b = this._audioPool;
			for (var c in b) for (var d = b[c], e = 0; e < b[c].length; e++) d[e].getPlaying() && (d[e].pause(), this._pauseCache.push(d[e]))
		},
		_resumePlaying: function() {
			for (var a = this._pauseCache, b = 0; b < a.length; b++) a[b].resume();
			a.length = 0
		}
	}, !d) {
		var i = function() {
				var b = cc.audioEngine._currMusic;
				b && b._touch === !1 && b._playing && b.getPlaying() && (b._touch = !0, b.play(0, b.loop), !a.REPLAY_AFTER_TOUCH && cc._canvas.removeEventListener("touchstart", i))
			};
		setTimeout(function() {
			cc._canvas && cc._canvas.addEventListener("touchstart", i, !1)
		}, 150)
	}
	cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
		cc.audioEngine._pausePlaying()
	}), cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
		cc.audioEngine._resumePlaying()
	})
}(window.__audioSupport);
cc._globalFontSize = cc.ITEM_SIZE, cc._globalFontName = "Arial", cc._globalFontNameRelease = !1, cc.MenuItem = cc.Node.extend({
	_enabled: !1,
	_target: null,
	_callback: null,
	_isSelected: !1,
	_className: "MenuItem",
	ctor: function(a, b) {
		var c = cc.Node.prototype;
		c.ctor.call(this), this._target = null, this._callback = null, this._isSelected = !1, this._enabled = !1, c.setAnchorPoint.call(this, .5, .5), this._target = b || null, this._callback = a || null, this._callback && (this._enabled = !0)
	},
	isSelected: function() {
		return this._isSelected
	},
	setOpacityModifyRGB: function(a) {},
	isOpacityModifyRGB: function() {
		return !1
	},
	setTarget: function(a, b) {
		this._target = b, this._callback = a
	},
	isEnabled: function() {
		return this._enabled
	},
	setEnabled: function(a) {
		this._enabled = a
	},
	initWithCallback: function(a, b) {
		return this.anchorX = .5, this.anchorY = .5, this._target = b, this._callback = a, this._enabled = !0, this._isSelected = !1, !0
	},
	rect: function() {
		var a = this._position,
			b = this._contentSize,
			c = this._anchorPoint;
		return cc.rect(a.x - b.width * c.x, a.y - b.height * c.y, b.width, b.height)
	},
	selected: function() {
		this._isSelected = !0
	},
	unselected: function() {
		this._isSelected = !1
	},
	setCallback: function(a, b) {
		this._target = b, this._callback = a
	},
	activate: function() {
		if (this._enabled) {
			var a = this._target,
				b = this._callback;
			if (!b) return;
			a && cc.isString(b) ? a[b](this) : a && cc.isFunction(b) ? b.call(a, this) : b(this)
		}
	}
});
var _p = cc.MenuItem.prototype;
_p.enabled, cc.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled), cc.MenuItem.create = function(a, b) {
	return new cc.MenuItem(a, b)
}, cc.MenuItemLabel = cc.MenuItem.extend({
	_disabledColor: null,
	_label: null,
	_originalScale: 0,
	_colorBackup: null,
	ctor: function(a, b, c) {
		cc.MenuItem.prototype.ctor.call(this, b, c), this._disabledColor = null, this._label = null, this._colorBackup = null, a && (this._originalScale = 1, this._colorBackup = cc.color.WHITE, this._disabledColor = cc.color(126, 126, 126), this.setLabel(a), this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0))
	},
	getDisabledColor: function() {
		return this._disabledColor
	},
	setDisabledColor: function(a) {
		this._disabledColor = a
	},
	getLabel: function() {
		return this._label
	},
	setLabel: function(a) {
		a && (this.addChild(a), a.anchorX = 0, a.anchorY = 0, this.width = a.width, this.height = a.height, a.setCascadeColorEnabled(!0)), this._label && this.removeChild(this._label, !0), this._label = a
	},
	setEnabled: function(a) {
		this._enabled !== a && (a ? this.setColor(this._colorBackup) : (this._colorBackup = this.color, this.setColor(this._disabledColor))), cc.MenuItem.prototype.setEnabled.call(this, a)
	},
	initWithLabel: function(a, b, c) {
		return this.initWithCallback(b, c), this._originalScale = 1, this._colorBackup = cc.color.WHITE, this._disabledColor = cc.color(126, 126, 126), this.setLabel(a), this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0), !0
	},
	setString: function(a) {
		this._label.string = a, this.width = this._label.width, this.height = this._label.height
	},
	getString: function() {
		return this._label.string
	},
	activate: function() {
		this._enabled && (this.stopAllActions(), this.scale = this._originalScale, cc.MenuItem.prototype.activate.call(this))
	},
	selected: function() {
		if (this._enabled) {
			cc.MenuItem.prototype.selected.call(this);
			var a = this.getActionByTag(cc.ZOOM_ACTION_TAG);
			a ? this.stopAction(a) : this._originalScale = this.scale;
			var b = cc.scaleTo(.1, 1.2 * this._originalScale);
			b.setTag(cc.ZOOM_ACTION_TAG), this.runAction(b)
		}
	},
	unselected: function() {
		if (this._enabled) {
			cc.MenuItem.prototype.unselected.call(this), this.stopActionByTag(cc.ZOOM_ACTION_TAG);
			var a = cc.scaleTo(.1, this._originalScale);
			a.setTag(cc.ZOOM_ACTION_TAG), this.runAction(a)
		}
	}
});
var _p = cc.MenuItemLabel.prototype;
_p.string, cc.defineGetterSetter(_p, "string", _p.getString, _p.setString), _p.disabledColor, cc.defineGetterSetter(_p, "disabledColor", _p.getDisabledColor, _p.setDisabledColor), _p.label, cc.defineGetterSetter(_p, "label", _p.getLabel, _p.setLabel), cc.MenuItemLabel.create = function(a, b, c) {
	return new cc.MenuItemLabel(a, b, c)
}, cc.MenuItemAtlasFont = cc.MenuItemLabel.extend({
	ctor: function(a, b, c, d, e, f, g) {
		var h;
		a && a.length > 0 && (h = new cc.LabelAtlas(a, b, c, d, e)), cc.MenuItemLabel.prototype.ctor.call(this, h, f, g)
	},
	initWithString: function(a, b, c, d, e, f, g) {
		if (!a || 0 === a.length) throw new Error("cc.MenuItemAtlasFont.initWithString(): value should be non-null and its length should be greater than 0");
		var h = new cc.LabelAtlas;
		return h.initWithString(a, b, c, d, e), this.initWithLabel(h, f, g), !0
	}
}), cc.MenuItemAtlasFont.create = function(a, b, c, d, e, f, g) {
	return new cc.MenuItemAtlasFont(a, b, c, d, e, f, g)
}, cc.MenuItemFont = cc.MenuItemLabel.extend({
	_fontSize: null,
	_fontName: null,
	ctor: function(a, b, c) {
		var d;
		a && a.length > 0 ? (this._fontName = cc._globalFontName, this._fontSize = cc._globalFontSize, d = new cc.LabelTTF(a, this._fontName, this._fontSize)) : (this._fontSize = 0, this._fontName = ""), cc.MenuItemLabel.prototype.ctor.call(this, d, b, c)
	},
	initWithString: function(a, b, c) {
		if (!a || 0 === a.length) throw new Error("Value should be non-null and its length should be greater than 0");
		this._fontName = cc._globalFontName, this._fontSize = cc._globalFontSize;
		var d = new cc.LabelTTF(a, this._fontName, this._fontSize);
		return this.initWithLabel(d, b, c), !0
	},
	setFontSize: function(a) {
		this._fontSize = a, this._recreateLabel()
	},
	getFontSize: function() {
		return this._fontSize
	},
	setFontName: function(a) {
		this._fontName = a, this._recreateLabel()
	},
	getFontName: function() {
		return this._fontName
	},
	_recreateLabel: function() {
		var a = new cc.LabelTTF(this._label.string, this._fontName, this._fontSize);
		this.setLabel(a)
	}
}), cc.MenuItemFont.setFontSize = function(a) {
	cc._globalFontSize = a
}, cc.MenuItemFont.fontSize = function() {
	return cc._globalFontSize
}, cc.MenuItemFont.setFontName = function(a) {
	cc._globalFontNameRelease && (cc._globalFontName = ""), cc._globalFontName = a, cc._globalFontNameRelease = !0
};
var _p = cc.MenuItemFont.prototype;
_p.fontSize, cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize), _p.fontName, cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName), cc.MenuItemFont.fontName = function() {
	return cc._globalFontName
}, cc.MenuItemFont.create = function(a, b, c) {
	return new cc.MenuItemFont(a, b, c)
}, cc.MenuItemSprite = cc.MenuItem.extend({
	_normalImage: null,
	_selectedImage: null,
	_disabledImage: null,
	ctor: function(a, b, c, d, e) {
		if (cc.MenuItem.prototype.ctor.call(this), this._normalImage = null, this._selectedImage = null, this._disabledImage = null, void 0 !== b) {
			var f, g, h;
			void 0 !== e ? (f = c, h = d, g = e) : void 0 !== d && cc.isFunction(d) ? (f = c, h = d) : void 0 !== d && cc.isFunction(c) ? (g = d, h = c, f = null) : void 0 === c && (f = null), this.initWithNormalSprite(a, b, f, h, g)
		}
	},
	getNormalImage: function() {
		return this._normalImage
	},
	setNormalImage: function(a) {
		this._normalImage !== a && (a && (this.addChild(a, 0, cc.NORMAL_TAG), a.anchorX = 0, a.anchorY = 0), this._normalImage && this.removeChild(this._normalImage, !0), this._normalImage = a, this._normalImage && (this.width = this._normalImage.width, this.height = this._normalImage.height, this._updateImagesVisibility(), a.textureLoaded && !a.textureLoaded() && a.addEventListener("load", function(a) {
			this.width = a.width, this.height = a.height
		}, this)))
	},
	getSelectedImage: function() {
		return this._selectedImage
	},
	setSelectedImage: function(a) {
		this._selectedImage !== a && (a && (this.addChild(a, 0, cc.SELECTED_TAG), a.anchorX = 0, a.anchorY = 0), this._selectedImage && this.removeChild(this._selectedImage, !0), this._selectedImage = a, this._updateImagesVisibility())
	},
	getDisabledImage: function() {
		return this._disabledImage
	},
	setDisabledImage: function(a) {
		this._disabledImage !== a && (a && (this.addChild(a, 0, cc.DISABLE_TAG), a.anchorX = 0, a.anchorY = 0), this._disabledImage && this.removeChild(this._disabledImage, !0), this._disabledImage = a, this._updateImagesVisibility())
	},
	initWithNormalSprite: function(a, b, c, d, e) {
		this.initWithCallback(d, e), this.setNormalImage(a), this.setSelectedImage(b), this.setDisabledImage(c);
		var f = this._normalImage;
		return f && (this.width = f.width, this.height = f.height, f.textureLoaded && !f.textureLoaded() && f.addEventListener("load", function(a) {
			this.width = a.width, this.height = a.height, this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0)
		}, this)), this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0), !0
	},
	selected: function() {
		cc.MenuItem.prototype.selected.call(this), this._normalImage && (this._disabledImage && (this._disabledImage.visible = !1), this._selectedImage ? (this._normalImage.visible = !1, this._selectedImage.visible = !0) : this._normalImage.visible = !0)
	},
	unselected: function() {
		cc.MenuItem.prototype.unselected.call(this), this._normalImage && (this._normalImage.visible = !0, this._selectedImage && (this._selectedImage.visible = !1), this._disabledImage && (this._disabledImage.visible = !1))
	},
	setEnabled: function(a) {
		this._enabled !== a && (cc.MenuItem.prototype.setEnabled.call(this, a), this._updateImagesVisibility())
	},
	_updateImagesVisibility: function() {
		var a = this._normalImage,
			b = this._selectedImage,
			c = this._disabledImage;
		this._enabled ? (a && (a.visible = !0), b && (b.visible = !1), c && (c.visible = !1)) : c ? (a && (a.visible = !1), b && (b.visible = !1), c && (c.visible = !0)) : (a && (a.visible = !0), b && (b.visible = !1))
	}
});
var _p = cc.MenuItemSprite.prototype;
_p.normalImage, cc.defineGetterSetter(_p, "normalImage", _p.getNormalImage, _p.setNormalImage), _p.selectedImage, cc.defineGetterSetter(_p, "selectedImage", _p.getSelectedImage, _p.setSelectedImage), _p.disabledImage, cc.defineGetterSetter(_p, "disabledImage", _p.getDisabledImage, _p.setDisabledImage), cc.MenuItemSprite.create = function(a, b, c, d, e) {
	return new cc.MenuItemSprite(a, b, c, d, e || void 0)
}, cc.MenuItemImage = cc.MenuItemSprite.extend({
	ctor: function(a, b, c, d, e) {
		var f = null,
			g = null,
			h = null,
			i = null,
			j = null;
		void 0 === a || null === a ? cc.MenuItemSprite.prototype.ctor.call(this) : (f = new cc.Sprite(a), b && (g = new cc.Sprite(b)), void 0 === d ? i = c : void 0 === e ? (i = c, j = d) : e && (h = new cc.Sprite(c), i = d, j = e), cc.MenuItemSprite.prototype.ctor.call(this, f, g, h, i, j))
	},
	setNormalSpriteFrame: function(a) {
		this.setNormalImage(new cc.Sprite(a))
	},
	setSelectedSpriteFrame: function(a) {
		this.setSelectedImage(new cc.Sprite(a))
	},
	setDisabledSpriteFrame: function(a) {
		this.setDisabledImage(new cc.Sprite(a))
	},
	initWithNormalImage: function(a, b, c, d, e) {
		var f = null,
			g = null,
			h = null;
		return a && (f = new cc.Sprite(a)), b && (g = new cc.Sprite(b)), c && (h = new cc.Sprite(c)), this.initWithNormalSprite(f, g, h, d, e)
	}
}), cc.MenuItemImage.create = function(a, b, c, d, e) {
	return new cc.MenuItemImage(a, b, c, d, e)
}, cc.MenuItemToggle = cc.MenuItem.extend({
	subItems: null,
	_selectedIndex: 0,
	_opacity: null,
	_color: null,
	ctor: function() {
		cc.MenuItem.prototype.ctor.call(this), this._selectedIndex = 0, this.subItems = [], this._opacity = 0, this._color = cc.color.WHITE, arguments.length > 0 && this.initWithItems(Array.prototype.slice.apply(arguments))
	},
	getOpacity: function() {
		return this._opacity
	},
	setOpacity: function(a) {
		if (this._opacity = a, this.subItems && this.subItems.length > 0) for (var b = 0; b < this.subItems.length; b++) this.subItems[b].opacity = a;
		this._color.a = a
	},
	getColor: function() {
		var a = this._color;
		return cc.color(a.r, a.g, a.b, a.a)
	},
	setColor: function(a) {
		var b = this._color;
		if (b.r = a.r, b.g = a.g, b.b = a.b, this.subItems && this.subItems.length > 0) for (var c = 0; c < this.subItems.length; c++) this.subItems[c].setColor(a);
		void 0 === a.a || a.a_undefined || this.setOpacity(a.a)
	},
	getSelectedIndex: function() {
		return this._selectedIndex
	},
	setSelectedIndex: function(a) {
		if (a !== this._selectedIndex) {
			this._selectedIndex = a;
			var b = this.getChildByTag(cc.CURRENT_ITEM);
			b && b.removeFromParent(!1);
			var c = this.subItems[this._selectedIndex];
			this.addChild(c, 0, cc.CURRENT_ITEM);
			var d = c.width,
				e = c.height;
			this.width = d, this.height = e, c.setPosition(d / 2, e / 2)
		}
	},
	getSubItems: function() {
		return this.subItems
	},
	setSubItems: function(a) {
		this.subItems = a
	},
	initWithItems: function(a) {
		var b = a.length;
		cc.isFunction(a[a.length - 2]) ? (this.initWithCallback(a[a.length - 2], a[a.length - 1]), b -= 2) : cc.isFunction(a[a.length - 1]) ? (this.initWithCallback(a[a.length - 1], null), b -= 1) : this.initWithCallback(null, null);
		var c = this.subItems;
		c.length = 0;
		for (var d = 0; b > d; d++) a[d] && c.push(a[d]);
		return this._selectedIndex = cc.UINT_MAX, this.setSelectedIndex(0), this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0), !0
	},
	addSubItem: function(a) {
		this.subItems.push(a)
	},
	activate: function() {
		if (this._enabled) {
			var a = (this._selectedIndex + 1) % this.subItems.length;
			this.setSelectedIndex(a)
		}
		cc.MenuItem.prototype.activate.call(this)
	},
	selected: function() {
		cc.MenuItem.prototype.selected.call(this), this.subItems[this._selectedIndex].selected()
	},
	unselected: function() {
		cc.MenuItem.prototype.unselected.call(this), this.subItems[this._selectedIndex].unselected()
	},
	setEnabled: function(a) {
		if (this._enabled !== a) {
			cc.MenuItem.prototype.setEnabled.call(this, a);
			var b = this.subItems;
			if (b && b.length > 0) for (var c = 0; c < b.length; c++) b[c].enabled = a
		}
	},
	selectedItem: function() {
		return this.subItems[this._selectedIndex]
	},
	getSelectedItem: function() {
		return this.subItems[this._selectedIndex]
	},
	onEnter: function() {
		cc.Node.prototype.onEnter.call(this), this.setSelectedIndex(this._selectedIndex)
	}
});
var _p = cc.MenuItemToggle.prototype;
_p.selectedIndex, cc.defineGetterSetter(_p, "selectedIndex", _p.getSelectedIndex, _p.setSelectedIndex), cc.MenuItemToggle.create = function() {
	arguments.length > 0 && null == arguments[arguments.length - 1] && cc.log("parameters should not be ending with null in Javascript");
	var a = new cc.MenuItemToggle;
	return a.initWithItems(Array.prototype.slice.apply(arguments)), a
}, cc.MENU_STATE_WAITING = 0, cc.MENU_STATE_TRACKING_TOUCH = 1, cc.MENU_HANDLER_PRIORITY = -128, cc.DEFAULT_PADDING = 5, cc.Menu = cc.Layer.extend({
	enabled: !1,
	_selectedItem: null,
	_state: -1,
	_touchListener: null,
	_className: "Menu",
	ctor: function(a) {
		cc.Layer.prototype.ctor.call(this), this._color = cc.color.WHITE, this.enabled = !1, this._opacity = 255, this._selectedItem = null, this._state = -1, this._touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: !0,
			onTouchBegan: this._onTouchBegan,
			onTouchMoved: this._onTouchMoved,
			onTouchEnded: this._onTouchEnded,
			onTouchCancelled: this._onTouchCancelled
		}), arguments.length > 0 && null == arguments[arguments.length - 1] && cc.log("parameters should not be ending with null in Javascript");
		var b, c = arguments.length;
		if (0 === c) b = [];
		else if (1 === c) b = a instanceof Array ? a : [a];
		else if (c > 1) {
			b = [];
			for (var d = 0; c > d; d++) arguments[d] && b.push(arguments[d])
		}
		this.initWithArray(b)
	},
	onEnter: function() {
		var a = this._touchListener;
		a._isRegistered() || cc.eventManager.addListener(a, this), cc.Node.prototype.onEnter.call(this)
	},
	isEnabled: function() {
		return this.enabled
	},
	setEnabled: function(a) {
		this.enabled = a
	},
	initWithItems: function(a) {
		var b = [];
		if (a) for (var c = 0; c < a.length; c++) a[c] && b.push(a[c]);
		return this.initWithArray(b)
	},
	initWithArray: function(a) {
		if (cc.Layer.prototype.init.call(this)) {
			this.enabled = !0;
			var b = cc.winSize;
			if (this.setPosition(b.width / 2, b.height / 2), this.setContentSize(b), this.setAnchorPoint(.5, .5), this.ignoreAnchorPointForPosition(!0), a) for (var c = 0; c < a.length; c++) this.addChild(a[c], c);
			return this._selectedItem = null, this._state = cc.MENU_STATE_WAITING, this.cascadeColor = !0, this.cascadeOpacity = !0, !0
		}
		return !1
	},
	addChild: function(a, b, c) {
		if (!(a instanceof cc.MenuItem)) throw new Error("cc.Menu.addChild() : Menu only supports MenuItem objects as children");
		cc.Layer.prototype.addChild.call(this, a, b, c)
	},
	alignItemsVertically: function() {
		this.alignItemsVerticallyWithPadding(cc.DEFAULT_PADDING)
	},
	alignItemsVerticallyWithPadding: function(a) {
		var b, c, d, e, f, g = -a,
			h = this._children;
		if (h && h.length > 0) {
			for (c = 0, b = h.length; b > c; c++) g += h[c].height * h[c].scaleY + a;
			var i = g / 2;
			for (c = 0, b = h.length; b > c; c++) f = h[c], e = f.height, d = f.scaleY, f.setPosition(0, i - e * d / 2), i -= e * d + a
		}
	},
	alignItemsHorizontally: function() {
		this.alignItemsHorizontallyWithPadding(cc.DEFAULT_PADDING)
	},
	alignItemsHorizontallyWithPadding: function(a) {
		var b, c, d, e, f, g = -a,
			h = this._children;
		if (h && h.length > 0) {
			for (b = 0, c = h.length; c > b; b++) g += h[b].width * h[b].scaleX + a;
			var i = -g / 2;
			for (b = 0, c = h.length; c > b; b++) f = h[b], d = f.scaleX, e = h[b].width, f.setPosition(i + e * d / 2, 0), i += e * d + a
		}
	},
	alignItemsInColumns: function() {
		arguments.length > 0 && null == arguments[arguments.length - 1] && cc.log("parameters should not be ending with null in Javascript");
		for (var a = [], b = 0; b < arguments.length; b++) a.push(arguments[b]);
		var c, d, e, f = -5,
			g = 0,
			h = 0,
			i = 0,
			j = this._children;
		if (j && j.length > 0) for (b = 0, e = j.length; e > b; b++) g >= a.length || (c = a[g], c && (d = j[b].height, h = h >= d || isNaN(d) ? h : d, ++i, i >= c && (f += h + 5, i = 0, h = 0, ++g)));
		var k = cc.director.getWinSize();
		g = 0, h = 0, c = 0;
		var l = 0,
			m = 0,
			n = f / 2;
		if (j && j.length > 0) for (b = 0, e = j.length; e > b; b++) {
			var o = j[b];
			0 === c && (c = a[g], l = k.width / (1 + c), m = l), d = o._getHeight(), h = h >= d || isNaN(d) ? h : d, o.setPosition(m - k.width / 2, n - d / 2), m += l, ++i, i >= c && (n -= h + 5, i = 0, c = 0, h = 0, ++g)
		}
	},
	alignItemsInRows: function() {
		arguments.length > 0 && null == arguments[arguments.length - 1] && cc.log("parameters should not be ending with null in Javascript");
		var a, b = [];
		for (a = 0; a < arguments.length; a++) b.push(arguments[a]);
		var c, d, e, f, g = [],
			h = [],
			i = -10,
			j = -5,
			k = 0,
			l = 0,
			m = 0,
			n = this._children;
		if (n && n.length > 0) for (a = 0, e = n.length; e > a; a++) d = n[a], k >= b.length || (c = b[k], c && (f = d.width, l = l >= f || isNaN(f) ? l : f, j += d.height + 5, ++m, m >= c && (g.push(l), h.push(j), i += l + 10, m = 0, l = 0, j = -5, ++k)));
		var o = cc.director.getWinSize();
		k = 0, l = 0, c = 0;
		var p = -i / 2,
			q = 0;
		if (n && n.length > 0) for (a = 0, e = n.length; e > a; a++) d = n[a], 0 === c && (c = b[k], q = h[k]), f = d._getWidth(), l = l >= f || isNaN(f) ? l : f, d.setPosition(p + g[k] / 2, q - o.height / 2), q -= d.height + 10, ++m, m >= c && (p += l + 5, m = 0, c = 0, l = 0, ++k)
	},
	removeChild: function(a, b) {
		if (null != a) {
			if (!(a instanceof cc.MenuItem)) return void cc.log("cc.Menu.removeChild():Menu only supports MenuItem objects as children");
			this._selectedItem === a && (this._selectedItem = null), cc.Node.prototype.removeChild.call(this, a, b)
		}
	},
	_onTouchBegan: function(a, b) {
		var c = b.getCurrentTarget();
		if (c._state !== cc.MENU_STATE_WAITING || !c._visible || !c.enabled) return !1;
		for (var d = c.parent; null != d; d = d.parent) if (!d.isVisible()) return !1;
		return c._selectedItem = c._itemForTouch(a), c._selectedItem ? (c._state = cc.MENU_STATE_TRACKING_TOUCH, c._selectedItem.selected(), c._selectedItem.setNodeDirty(), !0) : !1
	},
	_onTouchEnded: function(a, b) {
		var c = b.getCurrentTarget();
		return c._state !== cc.MENU_STATE_TRACKING_TOUCH ? void cc.log("cc.Menu.onTouchEnded(): invalid state") : (c._selectedItem && (c._selectedItem.unselected(), c._selectedItem.setNodeDirty(), c._selectedItem.activate()), void(c._state = cc.MENU_STATE_WAITING))
	},
	_onTouchCancelled: function(a, b) {
		var c = b.getCurrentTarget();
		return c._state !== cc.MENU_STATE_TRACKING_TOUCH ? void cc.log("cc.Menu.onTouchCancelled(): invalid state") : (c._selectedItem && (c._selectedItem.unselected(), c._selectedItem.setNodeDirty()), void(c._state = cc.MENU_STATE_WAITING))
	},
	_onTouchMoved: function(a, b) {
		var c = b.getCurrentTarget();
		if (c._state !== cc.MENU_STATE_TRACKING_TOUCH) return void cc.log("cc.Menu.onTouchMoved(): invalid state");
		var d = c._itemForTouch(a);
		d !== c._selectedItem && (c._selectedItem && (c._selectedItem.unselected(), c._selectedItem.setNodeDirty()), c._selectedItem = d, c._selectedItem && (c._selectedItem.selected(), c._selectedItem.setNodeDirty()))
	},
	onExit: function() {
		this._state === cc.MENU_STATE_TRACKING_TOUCH && (this._selectedItem && (this._selectedItem.unselected(), this._selectedItem = null), this._state = cc.MENU_STATE_WAITING), cc.Node.prototype.onExit.call(this)
	},
	setOpacityModifyRGB: function(a) {},
	isOpacityModifyRGB: function() {
		return !1
	},
	_itemForTouch: function(a) {
		var b, c = a.getLocation(),
			d = this._children;
		if (d && d.length > 0) for (var e = d.length - 1; e >= 0; e--) if (b = d[e], b.isVisible() && b.isEnabled()) {
			var f = b.convertToNodeSpace(c),
				g = b.rect();
			if (g.x = 0, g.y = 0, cc.rectContainsPoint(g, f)) return b
		}
		return null
	}
});
var _p = cc.Menu.prototype;
_p.enabled, cc.Menu.create = function(a) {
	var b = arguments.length;
	b > 0 && null == arguments[b - 1] && cc.log("parameters should not be ending with null in Javascript");
	var c;
	return c = 0 === b ? new cc.Menu : 1 === b ? new cc.Menu(a) : new cc.Menu(Array.prototype.slice.call(arguments, 0))
};