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
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	__webpack_require__(1);
	
	var _sketchJs = __webpack_require__(2);
	
	var _sketchJs2 = _interopRequireDefault(_sketchJs);
	
	var _info_box = __webpack_require__(3);
	
	var _info_box2 = _interopRequireDefault(_info_box);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var geoData = {};
	
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
	
	loadJSON('data/lots.geojson').then(function (lots) {
	  geoData.lots = lots;
	  window.geoData = geoData;
	
	  var points = [];
	  var polys = lots.features.filter(function (feat) {
	    return feat.properties.numfloors && feat.properties.numfloors >= 6;
	  }).map(function (feat) {
	    return feat.geometry.coordinates;
	  });
	  polys.forEach(function (poly) {
	    poly.forEach(function (lines) {
	      lines.forEach(function (line) {
	        line.forEach(function (point) {
	          return points.push(point);
	        });
	      });
	    });
	  });
	
	  var maxPt = points.reduce(function (_ref, _ref2) {
	    var _ref4 = _slicedToArray(_ref, 2);
	
	    var mX = _ref4[0];
	    var mY = _ref4[1];
	
	    var _ref3 = _slicedToArray(_ref2, 2);
	
	    var x = _ref3[0];
	    var y = _ref3[1];
	    return [mX > x ? mX : x, mY > y ? mY : y];
	  }, [-Infinity, -Infinity]);
	
	  var minPt = points.reduce(function (_ref5, _ref6) {
	    var _ref8 = _slicedToArray(_ref5, 2);
	
	    var mX = _ref8[0];
	    var mY = _ref8[1];
	
	    var _ref7 = _slicedToArray(_ref6, 2);
	
	    var x = _ref7[0];
	    var y = _ref7[1];
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
	
	    return function (_ref9) {
	      var _ref10 = _slicedToArray(_ref9, 2);
	
	      var x = _ref10[0];
	      var y = _ref10[1];
	      return [margin + (x - minX) * scale, (maxY - y) * scale];
	    };
	  };
	
	  container.style.height = container.getBoundingClientRect().height * 2 + 'px';
	
	  var sketch = _sketchJs2.default.create({
	    container: container,
	    fullscreen: false,
	    autoclear: false,
	    autostart: false,
	    retina: true,
	    globals: false,
	    width: container.getBoundingClientRect().width * 2,
	    height: container.getBoundingClientRect().height * 2,
	
	    resize: function resize() {
	      var _container$getBoundin = container.getBoundingClientRect();
	
	      var width = _container$getBoundin.width;
	      var height = _container$getBoundin.height;
	
	      this.canvas.style.height = height + 'px';
	      this.canvas.style.width = width + 'px';
	      this.canvas.height = height;
	      this.canvas.width = width;
	      this.height = height;
	      this.width = width;
	    }
	  });
	
	  var info = new _info_box2.default(document.querySelector('.info'));
	  setTimeout(function () {
	    return info.show();
	  }, 3000);
	
	  var mapToCanvas = createMapper(sketch.height, sketch.width, minPt, maxPt);
	  batch(polys, 100).forEach(function (polygons) {
	    setTimeout(function () {
	      polygons.forEach(function (poly) {
	        poly.forEach(function (lines) {
	          lines.forEach(function (line) {
	            line = line.map(mapToCanvas);
	            sketch.beginPath();
	            sketch.moveTo.apply(sketch, _toConsumableArray(line[0]));
	            for (var i = 1; i < line.length; i++) {
	              sketch.lineTo.apply(sketch, _toConsumableArray(line[i]));
	            }
	            sketch.strokeStyle = 'rgba(10, 10, 10, 0.5)';
	            sketch.stroke();
	          });
	        });
	      });
	    }, 5);
	  });
	
	  window.sketch = sketch;
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

	
	/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */
	
	(function ( root, factory ) {
	
	    if ( true ) {
	
	        // CommonJS like
	        module.exports = factory(root, root.document);
	
	    } else if ( typeof define === 'function' && define.amd ) {
	
	        // AMD
	        define( function() { return factory( root, root.document ); });
	
	    } else {
	
	        // Browser global
	        root.Sketch = factory( root, root.document );
	    }
	
	}( typeof window !== "undefined" ? window : this, function ( window, document ) {
	
	
	    "use strict";
	
	    /*
	    ----------------------------------------------------------------------
	
	        Config
	
	    ----------------------------------------------------------------------
	    */
	
	    var MATH_PROPS = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );
	    var HAS_SKETCH = '__hasSketch';
	    var M = Math;
	
	    var CANVAS = 'canvas';
	    var WEBGL = 'webgl';
	    var DOM = 'dom';
	
	    var doc = document;
	    var win = window;
	
	    var instances = [];
	
	    var defaults = {
	
	        fullscreen: true,
	        autostart: true,
	        autoclear: true,
	        autopause: true,
	        container: doc.body,
	        interval: 1,
	        globals: true,
	        retina: false,
	        type: CANVAS
	    };
	
	    var keyMap = {
	
	         8: 'BACKSPACE',
	         9: 'TAB',
	        13: 'ENTER',
	        16: 'SHIFT',
	        27: 'ESCAPE',
	        32: 'SPACE',
	        37: 'LEFT',
	        38: 'UP',
	        39: 'RIGHT',
	        40: 'DOWN'
	    };
	
	    /*
	    ----------------------------------------------------------------------
	
	        Utilities
	
	    ----------------------------------------------------------------------
	    */
	
	    function isArray( object ) {
	
	        return Object.prototype.toString.call( object ) == '[object Array]';
	    }
	
	    function isFunction( object ) {
	
	        return typeof object == 'function';
	    }
	
	    function isNumber( object ) {
	
	        return typeof object == 'number';
	    }
	
	    function isString( object ) {
	
	        return typeof object == 'string';
	    }
	
	    function keyName( code ) {
	
	        return keyMap[ code ] || String.fromCharCode( code );
	    }
	
	    function extend( target, source, overwrite ) {
	
	        for ( var key in source )
	
	            if ( overwrite || !( key in target ) )
	
	                target[ key ] = source[ key ];
	
	        return target;
	    }
	
	    function proxy( method, context ) {
	
	        return function() {
	
	            method.apply( context, arguments );
	        };
	    }
	
	    function clone( target ) {
	
	        var object = {};
	
	        for ( var key in target ) {
	            
	            if ( key === 'webkitMovementX' || key === 'webkitMovementY' )
	                continue;
	
	            if ( isFunction( target[ key ] ) )
	
	                object[ key ] = proxy( target[ key ], target );
	
	            else
	
	                object[ key ] = target[ key ];
	        }
	
	        return object;
	    }
	
	    /*
	    ----------------------------------------------------------------------
	
	        Constructor
	
	    ----------------------------------------------------------------------
	    */
	
	    function constructor( context ) {
	
	        var request, handler, target, parent, bounds, index, suffix, clock, node, copy, type, key, val, min, max, w, h;
	
	        var counter = 0;
	        var touches = [];
	        var resized = false;
	        var setup = false;
	        var ratio = win.devicePixelRatio || 1;
	        var isDiv = context.type == DOM;
	        var is2D = context.type == CANVAS;
	
	        var mouse = {
	            x:  0.0, y:  0.0,
	            ox: 0.0, oy: 0.0,
	            dx: 0.0, dy: 0.0
	        };
	
	        var eventMap = [
	
	            context.eventTarget || context.element,
	
	                pointer, 'mousedown', 'touchstart',
	                pointer, 'mousemove', 'touchmove',
	                pointer, 'mouseup', 'touchend',
	                pointer, 'click',
	                pointer, 'mouseout',
	                pointer, 'mouseover',
	
	            doc,
	
	                keypress, 'keydown', 'keyup',
	
	            win,
	
	                active, 'focus', 'blur',
	                resize, 'resize'
	        ];
	
	        var keys = {}; for ( key in keyMap ) keys[ keyMap[ key ] ] = false;
	
	        function trigger( method ) {
	
	            if ( isFunction( method ) )
	
	                method.apply( context, [].splice.call( arguments, 1 ) );
	        }
	
	        function bind( on ) {
	
	            for ( index = 0; index < eventMap.length; index++ ) {
	
	                node = eventMap[ index ];
	
	                if ( isString( node ) )
	
	                    target[ ( on ? 'add' : 'remove' ) + 'EventListener' ].call( target, node, handler, false );
	
	                else if ( isFunction( node ) )
	
	                    handler = node;
	
	                else target = node;
	            }
	        }
	
	        function update() {
	
	            cAF( request );
	            request = rAF( update );
	
	            if ( !setup ) {
	
	                trigger( context.setup );
	                setup = isFunction( context.setup );
	            }
	
	            if ( !resized ) {
	                trigger( context.resize );
	                resized = isFunction( context.resize );
	            }
	
	            if ( context.running && !counter ) {
	
	                context.dt = ( clock = +new Date() ) - context.now;
	                context.millis += context.dt;
	                context.now = clock;
	
	                trigger( context.update );
	
	                // Pre draw
	
	                if ( is2D ) {
	
	                    if ( context.retina ) {
	
	                        context.save();
	                        context.scale( ratio, ratio );
	                    }
	
	                    if ( context.autoclear )
	
	                        context.clear();
	                }
	
	                // Draw
	
	                trigger( context.draw );
	
	                // Post draw
	
	                if ( is2D && context.retina )
	
	                    context.restore();
	            }
	
	            counter = ++counter % context.interval;
	        }
	
	        function resize() {
	
	            target = isDiv ? context.style : context.canvas;
	            suffix = isDiv ? 'px' : '';
	
	            w = context.width;
	            h = context.height;
	
	            if ( context.fullscreen ) {
	
	                h = context.height = win.innerHeight;
	                w = context.width = win.innerWidth;
	            }
	
	            if ( context.retina && is2D && ratio ) {
	
	                target.style.height = h + 'px';
	                target.style.width = w + 'px';
	
	                w *= ratio;
	                h *= ratio;
	            }
	
	            if ( target.height !== h )
	
	                target.height = h + suffix;
	
	            if ( target.width !== w )
	
	                target.width = w + suffix;
	
	            if ( setup ) trigger( context.resize );
	        }
	
	        function align( touch, target ) {
	
	            bounds = target.getBoundingClientRect();
	
	            touch.x = touch.pageX - bounds.left - (win.scrollX || win.pageXOffset);
	            touch.y = touch.pageY - bounds.top - (win.scrollY || win.pageYOffset);
	
	            if ( context.retina && is2D && ratio ) {
	
	                touch.x *= ratio;
	                touch.y *= ratio;
	
	            }
	
	            return touch;
	        }
	
	        function augment( touch, target ) {
	
	            align( touch, context.element );
	
	            target = target || {};
	
	            target.ox = target.x || touch.x;
	            target.oy = target.y || touch.y;
	
	            target.x = touch.x;
	            target.y = touch.y;
	
	            target.dx = target.x - target.ox;
	            target.dy = target.y - target.oy;
	
	            return target;
	        }
	
	        function process( event ) {
	
	            event.preventDefault();
	
	            copy = clone( event );
	            copy.originalEvent = event;
	
	            if ( copy.touches ) {
	
	                touches.length = copy.touches.length;
	
	                for ( index = 0; index < copy.touches.length; index++ )
	
	                    touches[ index ] = augment( copy.touches[ index ], touches[ index ] );
	
	            } else {
	
	                touches.length = 0;
	                touches[0] = augment( copy, mouse );
	            }
	
	            extend( mouse, touches[0], true );
	
	            return copy;
	        }
	
	        function pointer( event ) {
	
	            event = process( event );
	
	            min = ( max = eventMap.indexOf( type = event.type ) ) - 1;
	
	            context.dragging =
	
	                /down|start/.test( type ) ? true :
	
	                /up|end/.test( type ) ? false :
	
	                context.dragging;
	
	            while( min )
	
	                isString( eventMap[ min ] ) ?
	
	                    trigger( context[ eventMap[ min-- ] ], event ) :
	
	                isString( eventMap[ max ] ) ?
	
	                    trigger( context[ eventMap[ max++ ] ], event ) :
	
	                min = 0;
	        }
	
	        function keypress( event ) {
	
	            key = event.keyCode;
	            val = event.type == 'keyup';
	            keys[ key ] = keys[ keyName( key ) ] = !val;
	
	            trigger( context[ event.type ], event );
	        }
	
	        function active( event ) {
	
	            if ( context.autopause )
	
	                ( event.type == 'blur' ? stop : start )();
	
	            trigger( context[ event.type ], event );
	        }
	
	        // Public API
	
	        function start() {
	
	            context.now = +new Date();
	            context.running = true;
	        }
	
	        function stop() {
	
	            context.running = false;
	        }
	
	        function toggle() {
	
	            ( context.running ? stop : start )();
	        }
	
	        function clear() {
	
	            if ( is2D )
	
	                context.clearRect( 0, 0, context.width, context.height );
	        }
	
	        function destroy() {
	
	            parent = context.element.parentNode;
	            index = instances.indexOf( context );
	
	            if ( parent ) parent.removeChild( context.element );
	            if ( ~index ) instances.splice( index, 1 );
	
	            bind( false );
	            stop();
	        }
	
	        extend( context, {
	
	            touches: touches,
	            mouse: mouse,
	            keys: keys,
	
	            dragging: false,
	            running: false,
	            millis: 0,
	            now: NaN,
	            dt: NaN,
	
	            destroy: destroy,
	            toggle: toggle,
	            clear: clear,
	            start: start,
	            stop: stop
	        });
	
	        instances.push( context );
	
	        return ( context.autostart && start(), bind( true ), resize(), update(), context );
	    }
	
	    /*
	    ----------------------------------------------------------------------
	
	        Global API
	
	    ----------------------------------------------------------------------
	    */
	
	    var element, context, Sketch = {
	
	        CANVAS: CANVAS,
	        WEB_GL: WEBGL,
	        WEBGL: WEBGL,
	        DOM: DOM,
	
	        instances: instances,
	
	        install: function( context ) {
	
	            if ( !context[ HAS_SKETCH ] ) {
	
	                for ( var i = 0; i < MATH_PROPS.length; i++ )
	
	                    context[ MATH_PROPS[i] ] = M[ MATH_PROPS[i] ];
	
	                extend( context, {
	
	                    TWO_PI: M.PI * 2,
	                    HALF_PI: M.PI / 2,
	                    QUARTER_PI: M.PI / 4,
	
	                    random: function( min, max ) {
	
	                        if ( isArray( min ) )
	
	                            return min[ ~~( M.random() * min.length ) ];
	
	                        if ( !isNumber( max ) )
	
	                            max = min || 1, min = 0;
	
	                        return min + M.random() * ( max - min );
	                    },
	
	                    lerp: function( min, max, amount ) {
	
	                        return min + amount * ( max - min );
	                    },
	
	                    map: function( num, minA, maxA, minB, maxB ) {
	
	                        return ( num - minA ) / ( maxA - minA ) * ( maxB - minB ) + minB;
	                    }
	                });
	
	                context[ HAS_SKETCH ] = true;
	            }
	        },
	
	        create: function( options ) {
	
	            options = extend( options || {}, defaults );
	
	            if ( options.globals ) Sketch.install( self );
	
	            element = options.element = options.element || doc.createElement( options.type === DOM ? 'div' : 'canvas' );
	
	            context = options.context = options.context || (function() {
	
	                switch( options.type ) {
	
	                    case CANVAS:
	
	                        return element.getContext( '2d', options );
	
	                    case WEBGL:
	
	                        return element.getContext( 'webgl', options ) || element.getContext( 'experimental-webgl', options );
	
	                    case DOM:
	
	                        return element.canvas = element;
	                }
	
	            })();
	
	            ( options.container || doc.body ).appendChild( element );
	
	            return Sketch.augment( context, options );
	        },
	
	        augment: function( context, options ) {
	
	            options = extend( options || {}, defaults );
	
	            options.element = context.canvas || context;
	            options.element.className += ' sketch';
	
	            extend( context, options, true );
	
	            return constructor( context );
	        }
	    };
	
	    /*
	    ----------------------------------------------------------------------
	
	        Shims
	
	    ----------------------------------------------------------------------
	    */
	
	    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	    var scope = self;
	    var then = 0;
	
	    var a = 'AnimationFrame';
	    var b = 'request' + a;
	    var c = 'cancel' + a;
	
	    var rAF = scope[ b ];
	    var cAF = scope[ c ];
	
	    for ( var i = 0; i < vendors.length && !rAF; i++ ) {
	
	        rAF = scope[ vendors[ i ] + 'Request' + a ];
	        cAF = scope[ vendors[ i ] + 'Cancel' + a ];
	    }
	
	    scope[ b ] = rAF = rAF || function( callback ) {
	
	        var now = +new Date();
	        var dt = M.max( 0, 16 - ( now - then ) );
	        var id = setTimeout( function() {
	            callback( now + dt );
	        }, dt );
	
	        then = now + dt;
	        return id;
	    };
	
	    scope[ c ] = cAF = cAF || function( id ) {
	        clearTimeout( id );
	    };
	
	    /*
	    ----------------------------------------------------------------------
	
	        Output
	
	    ----------------------------------------------------------------------
	    */
	
	    return Sketch;
	
	}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(4);
	
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
/* 4 */
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