/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	__webpack_require__(1);
	
	var _info_box = __webpack_require__(2);
	
	var _info_box2 = _interopRequireDefault(_info_box);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var callbacks = [];
	
	function loop(t) {
	  callbacks = callbacks.map(function (cb) {
	    return cb(t) ? cb : null;
	  }).filter(function (cb) {
	    return cb;
	  });
	  if (callbacks.length) requestAnimationFrame(loop);
	}
	
	function register(cb) {
	  var running = !!callbacks.length;
	  callbacks.push(cb);
	  if (!running) {
	    requestAnimationFrame(loop);
	  }
	
	  return function remove() {
	    var index = callbacks.indexOf(cb);
	    if (index < 0) {
	      return;
	    }
	    callbacks.splice(index, 1);
	  };
	}
	
	function easeIn(step, start, change) {
	  return change * (1 - Math.pow(1 - step, 3)) + start;
	}
	
	function startAnimation(renderFn, duration) {
	  return new Promise(function (resolve) {
	    var startTime = void 0;
	    register(function (t) {
	      startTime = startTime || t;
	      var step = (t - startTime) / duration;
	      renderFn(step);
	      if (step >= 1) {
	        resolve();
	        return false;
	      }
	      return true;
	    });
	  });
	}
	
	function dist(_ref, _ref2) {
	  var _ref4 = _slicedToArray(_ref, 2);
	
	  var x1 = _ref4[0];
	  var y1 = _ref4[1];
	
	  var _ref3 = _slicedToArray(_ref2, 2);
	
	  var x2 = _ref3[0];
	  var y2 = _ref3[1];
	
	  var xDist = x2 - x1;
	  var yDist = y2 - y1;
	  return Math.sqrt(xDist * xDist + yDist * yDist);
	}
	
	function drawArc(ctx, arc, color, width) {
	  ctx.beginPath();
	  ctx.strokeStyle = color;
	  ctx.lineWidth = width;
	  ctx.moveTo.apply(ctx, _toConsumableArray(arc[0]));
	  arc.slice(1).forEach(function (pt) {
	    return ctx.lineTo.apply(ctx, _toConsumableArray(pt));
	  });
	  ctx.stroke();
	}
	
	function getArcDist(arc) {
	  var last = arc[0];
	  return arc.reduce(function (total, pt) {
	    total += dist(last, pt);
	    last = pt;
	    return total;
	  }, 0);
	}
	
	function cutArc(arc, perc) {
	  var last = arc[0];
	  var toGo = getArcDist(arc) * perc;
	  var toDraw = [last];
	  for (var i = 1, len = arc.length; i < len; i++) {
	    var pt = arc[i];
	    var segmentDist = dist(last, pt);
	    if (!segmentDist) {
	      continue;
	    }
	    if (toGo === 0) {
	      break;
	    }
	    if (segmentDist <= toGo) {
	      toDraw.push(pt);
	      toGo -= segmentDist;
	      last = pt;
	      continue;
	    }
	    var cutPerc = toGo / segmentDist;
	    var x = (pt[0] - last[0]) * cutPerc + last[0];
	    var y = (pt[1] - last[1]) * cutPerc + last[1];
	    toDraw.push([x, y]);
	    break;
	  }
	  return toDraw;
	}
	
	var Drawer = function () {
	  function Drawer(container) {
	    _classCallCheck(this, Drawer);
	
	    var _container$getBoundin = container.getBoundingClientRect();
	
	    var height = _container$getBoundin.height;
	    var width = _container$getBoundin.width;
	
	    var canvas = document.createElement('canvas');
	    canvas.style.height = height + 'px';
	    canvas.style.width = width + 'px';
	    canvas.height = height * 2;
	    canvas.width = width * 2;
	    container.appendChild(canvas);
	    this.ctx = canvas.getContext('2d');
	    this.canvas = canvas;
	  }
	
	  _createClass(Drawer, [{
	    key: 'arc',
	    value: function arc(_arc, duration, color) {
	      var _this = this;
	
	      var width = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
	
	      return startAnimation(function (step) {
	        var perc = easeIn(step, 0, 1);
	        var toDraw = cutArc(_arc, perc);
	        drawArc(_this.ctx, toDraw, color, width);
	      }, duration);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    }
	  }]);
	
	  return Drawer;
	}();
	
	var container = document.getElementById('wrapper');
	
	function loadJSON(file) {
	  return fetch(file).then(function (resp) {
	    return resp.json();
	  });
	}
	
	function batch(list, size) {
	  var batches = [];
	  list = list.slice();
	  while (list.length) {
	    batches.push(list.slice(0, size));
	    list = list.slice(size);
	  }
	  return batches;
	}
	
	loadJSON('data/segments.json').then(function (segments) {
	  window.segments = segments;
	
	  var points = [];
	  segments.forEach(function (seg) {
	    seg.forEach(function (point) {
	      return points.push(point);
	    });
	  });
	
	  var maxPt = points.reduce(function (_ref5, _ref6) {
	    var _ref8 = _slicedToArray(_ref5, 2);
	
	    var mX = _ref8[0];
	    var mY = _ref8[1];
	
	    var _ref7 = _slicedToArray(_ref6, 2);
	
	    var x = _ref7[0];
	    var y = _ref7[1];
	    return [mX > x ? mX : x, mY > y ? mY : y];
	  }, [-Infinity, -Infinity]);
	
	  var minPt = points.reduce(function (_ref9, _ref10) {
	    var _ref12 = _slicedToArray(_ref9, 2);
	
	    var mX = _ref12[0];
	    var mY = _ref12[1];
	
	    var _ref11 = _slicedToArray(_ref10, 2);
	
	    var x = _ref11[0];
	    var y = _ref11[1];
	    return [mX < x ? mX : x, mY < y ? mY : y];
	  }, [Infinity, Infinity]);
	
	  var createMapper = function createMapper(canvasHeight, canvasWidth, min, max) {
	    var _min = _slicedToArray(min, 2);
	
	    var minX = _min[0];
	    var minY = _min[1];
	
	    var _max = _slicedToArray(max, 2);
	
	    var maxX = _max[0];
	    var maxY = _max[1];
	
	
	    var xDiff = maxX - minX;
	    var yDiff = maxY - minY;
	
	    var xScale = canvasWidth / xDiff;
	    var yScale = canvasHeight / yDiff;
	    var scale = xScale < yScale ? xScale : yScale;
	
	    // center
	    var halfway = canvasWidth / 2;
	    var halfMapWidth = xDiff * scale / 2;
	    var margin = halfway - halfMapWidth;
	
	    return function (_ref13) {
	      var _ref14 = _slicedToArray(_ref13, 2);
	
	      var x = _ref14[0];
	      var y = _ref14[1];
	      return [margin + (x - minX) * scale, (maxY - y) * scale];
	    };
	  };
	
	  container.style.height = container.getBoundingClientRect().height * 2 + 'px';
	
	  var drawer = new Drawer(container);
	
	  var info = new _info_box2.default(document.querySelector('.info'));
	  setTimeout(function () {
	    return info.show();
	  }, 3000);
	
	  var mapToCanvas = createMapper(drawer.canvas.height, drawer.canvas.width, minPt, maxPt);
	  var i = 0;
	  var batches = batch(segments, 12);
	  while (batches.length) {
	    (function () {
	      var index = Math.random() * batches.length | 0;
	      var curBatch = batches[index];
	      batches.splice(index, 1);
	      i += 1;
	      setTimeout(function () {
	        curBatch.forEach(function (line) {
	          line = line.map(mapToCanvas);
	          drawer.arc(line, 2000, 'rgba(10, 10, 10, 0.5)');
	        });
	      }, 15 * i);
	    })();
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return
	      }
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var InfoBox = function () {
	  function InfoBox(el) {
	    _classCallCheck(this, InfoBox);
	
	    this.el = el;
	    var title = el.querySelector('h1');
	    var titleText = title.textContent.trim();
	    this.letters = this.buildLetterEls(titleText);
	    title.textContent = '';
	    this.letters.forEach(title.appendChild.bind(title));
	  }
	
	  _createClass(InfoBox, [{
	    key: 'buildLetterEls',
	    value: function buildLetterEls(text) {
	      var letters = [];
	      while (text.length) {
	        var span = document.createElement('span');
	        span.textContent = text[0];
	        text = text.slice(1);
	        letters.push(span);
	      }
	      return letters;
	    }
	  }, {
	    key: 'fadeInBg',
	    value: function fadeInBg() {
	      var _el$getBoundingClient = this.el.getBoundingClientRect();
	
	      var height = _el$getBoundingClient.height;
	      var width = _el$getBoundingClient.width;
	
	      var c = document.createElement('canvas');
	      var ctx = c.getContext('2d');
	      c.height = height;
	      c.width = width;
	      c.style.height = height + 'px';
	      c.style.width = width + 'px';
	      var divStyle = window.getComputedStyle(this.el);
	      c.style.bottom = divStyle.bottom;
	      c.style.left = divStyle.left;
	      c.style.position = 'absolute';
	      c.style.zIndex = this.el.style.zIndex || 0;
	      this.el.style.zIndex = this.el.style.zIndex ? this.el.style.zIndex + 1 : 1;
	      this.el.parentElement.appendChild(c);
	
	      var hue = (0, _utils.random)(360) | 0;
	
	      return (0, _utils.startAnimation)(function (step) {
	        step = Math.pow(step, 3);
	        var radius = step * width | 0;
	        var lightness = step * 50 + 30 | 0;
	        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
	        ctx.fillStyle = 'hsl(' + hue + ', ' + 5 + '%, ' + lightness + '%)';
	        ctx.fill();
	      }, 350);
	    }
	  }, {
	    key: 'fadeInText',
	    value: function fadeInText() {
	      var _this = this;
	
	      this.letters.forEach(function (span, i) {
	        var delay = (_this.letters.length - i) * 25;
	        span.style.transition = 'all 400ms cubic-bezier(.15,.62,.38,.94) ' + delay + 'ms';
	      });
	      this.el.classList.add('show');
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.fadeInBg().then(this.fadeInText.bind(this));
	    }
	  }]);
	
	  return InfoBox;
	}();
	
	exports.default = InfoBox;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {};
	
	module.exports.uniqueId = function uniqueId() {
	    var r = (Math.random() * 100000000) | 0;
	    return Date.now().toString(32) + r.toString(32);
	};
	
	module.exports.getCookie = function getCookie(name) {
	    var cookies = document.cookie.split(';');
	    var nameEQ = name + '=';
	    for (var i = 0; i < cookies.length; i++) {
	        var c = cookies[i];
	        while (c.charAt(0) === ' ') {
	            c = c.substring(1, c.length);
	        }
	        if (c.indexOf(nameEQ) === 0) {
	            return c.substring(nameEQ.length, c.length);
	        }
	    }
	    return null;
	};
	
	module.exports.encodeQueryParams = function encodeQueryParams(paramsObj) {
	    var eUC = encodeURIComponent;
	    return Object.keys(paramsObj).map(function(param) {
	        return eUC(param) + '=' + eUC(paramsObj[param]);
	    }).join('&');
	};
	
	module.exports.extend = function extend(target, source, overwrite) {
	    for (var key in source)
	        if (overwrite || !(key in target)) {
	            target[key] = source[key];
	        }
	    return target;
	};
	
	module.exports.onReady = function onReady(fn) {
	    if (document.readyState !== 'loading') {
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', fn);
	    }
	};
	
	module.exports.getJSON = function getJSON(url) {
	    return new Promise(function(resolve, reject) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.onload = function() {
	            if (this.status >= 200 && this.status < 400) {
	                try {
	                    resolve(JSON.parse(this.response));
	                } catch (err) {
	                    reject(this.response);
	                }
	            } else {
	                reject(this.response);
	            }
	        };
	        request.onerror = function() {
	            reject(this.response);
	        };
	        request.send();
	    });
	};
	
	module.exports.startAnimation = function startAnimation(renderFn, duration) {
	    var startTime;
	    return new Promise(function(resolve) {
	        function _render(t) {
	            startTime = startTime || t;
	            var step = (t - startTime) / duration;
	            renderFn(step);
	            if (step < 1) {
	                requestAnimationFrame(_render);
	            } else {
	                resolve();
	            }
	        }
	        requestAnimationFrame(_render);
	    });
	};
	
	module.exports.easeOut = function easeOut(step, start, change) {
	    return change * Math.pow(step, 2) + start;
	};
	
	module.exports.easeIn = function easeIn(step, start, change) {
	    return change * (1 - Math.pow(1 - step, 3)) + start;
	};
	
	module.exports.shuffle = function shuffle(list) {
	    list = list.slice();
	    var shuffled = [];
	    while (list.length) {
	        var i = Math.random() * list.length | 0;
	        shuffled.push(list.splice(i, 1)[0]);
	    }
	    return shuffled;
	};
	
	module.exports.random = function random(low, high) {
	    if (Array.isArray(low)) {
	        return low[random(low.length)];
	    }
	    if (high === undefined) {
	        high = low;
	        low = 0;
	    }
	    return Math.random() * (high - low) + low | 0;
	};
	
	// returns an array with ints between start and end (inclusive of start,
	// not inclusive of end). also accepts a single int, treating it as the end
	// and using 0 as start
	module.exports.range = function range(start, end) {
	    if (end === undefined) {
	        end = start;
	        start = 0;
	    }
	    var numbers = [];
	    while (start < end) {
	        numbers.push(start++);
	    }
	    return numbers;
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map