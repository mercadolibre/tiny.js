(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _interopDefault(ex) {
    return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var inherits = _interopDefault(require('inherits'));
var EventEmitter = _interopDefault(require('events'));

function clone(obj) {
    if (obj === undefined || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        throw new Error('The "obj" parameter is required and must be an object.');
    }

    var copy = {},
        prop = void 0;

    for (prop in obj) {
        if (obj[prop] !== undefined) {
            copy[prop] = obj[prop];
        }
    }

    return copy;
}

function isPlainObject(obj) {
    // Not plain objects:
    // - null
    // - undefined
    if (obj == null) {
        return false;
    }
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj.nodeType || obj === obj.window) {
        return false;
    }

    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
}

function extend() {
    var options = void 0,
        name = void 0,
        src = void 0,
        copy = void 0,
        copyIsArray = void 0,
        clone = void 0,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && !(typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'function') {
        target = {};
    }

    // Nothing to extend, return original object
    if (length <= i) {
        return target;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                        target[name] = copy;
                    }
            }
        }
    }

    // Return the modified object
    return target;
}

function ajax(url, settings) {
    var args = arguments;
    var opts = void 0;

    settings = args.length === 1 ? args[0] : args[1];

    var noop = function noop() {};

    var defaults = {
        url: args.length === 2 && typeof url === 'string' ? url : '.',
        cache: true,
        data: {},
        headers: {},
        context: null,
        dataType: 'text',
        method: 'GET',
        credentials: 'omit',
        success: noop,
        error: noop,
        complete: noop
    };

    opts = extend(defaults, settings || {});

    var mimeTypes = {
        'application/json': 'json',
        'text/html': 'html',
        'text/plain': 'text'
    };

    var dataTypes = {};
    for (var type in mimeTypes) {
        if (mimeTypes.hasOwnProperty(type)) {
            dataTypes[mimeTypes[type]] = type;
        }
    }

    if (!opts.cache) {
        opts.url = opts.url + (~opts.url.indexOf('?') ? '&' : '?') + 'nc=' + Math.floor(Math.random() * 9e9);
    }

    var complete = function complete(status, xhr) {
        opts.complete.call(opts.context, xhr, status);
    };

    var success = function success(data, xhr) {
        var status = 'success';
        opts.success.call(opts.context, data, status, xhr);
        complete(status, xhr);
    };

    var error = function error(_error, status, xhr) {
        opts.error.call(opts.context, xhr, status, _error);
        complete(status, xhr);
    };

    var xhr = new XMLHttpRequest();

    var useXDR = opts.credentials === 'include' && !('withCredentials' in xhr) && 'XDomainRequest' in window;

    if (useXDR) {
        // Use XDomainRequest instead of XMLHttpRequest for IE<=9 and when CORS is requested
        xhr = new XDomainRequest();
        xhr.onload = function () {
            var mime = xhr.contentType;
            var dataType = mime && mimeTypes[mime[1]] ? mimeTypes[mime[1]].toLowerCase() : 'json';
            var result = void 0;

            if (dataType === 'json') {
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = xhr.responseText;
                }
            } else {
                result = xhr.responseText;
            }
            success(result, xhr);
        };
    } else {
        // Still cannot use xhr.onload for normal xhr due to required support of IE8 which
        // has no `onload` event https://msdn.microsoft.com/en-us/library/ms535874(v=vs.85).aspx#events
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var result = void 0;
                var status = xhr.status === 1223 ? 204 : xhr.status;

                if (status >= 200 && status < 300 || status === 304) {
                    var mime = /([\/a-z]+)(;|\s|$)/.exec(xhr.getResponseHeader('content-type'));
                    var dataType = mime && mimeTypes[mime[1]] ? mimeTypes[mime[1]].toLowerCase() : 'text';
                    result = xhr.responseText;

                    if (dataType === 'json') {
                        try {
                            result = JSON.parse(result);
                        } catch (e) {
                            result = xhr.responseText;
                        }
                    }

                    success(result, xhr);
                } else {
                    error(new Error(xhr.statusText), 'error', xhr, opts);
                }

                return;
            }
        };
    }

    xhr.onerror = function () {
        error(new Error(xhr.statusText || 'Network request failed'), 'error', xhr, opts);
    };

    xhr.open(opts.method, opts.url);

    if (opts.dataType && dataTypes[opts.dataType.toLowerCase()]) {
        opts.headers.Accept = dataTypes[opts.dataType.toLowerCase()] + ', */*; q=0.01';
    }

    if (opts.method === 'POST') {
        opts.headers = extend(opts.headers, {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
        });
    }

    if (opts.credentials === 'include') {
        xhr.withCredentials = true;
    }

    if (!useXDR) {
        for (var key in opts.headers) {
            xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    xhr.send(opts.data);

    return this;
}

var noop = function noop() {};

// document.head is not available in IE<9
var head = document.getElementsByTagName('head')[0];

var jsonpCount = 0;

/**
 * JSONP handler
 *
 * @memberof tiny
 * @method
 * @param {String} url
 * @param {Object} [opts] Optional opts.
 * @param {String} [opts.prefix] Callback prefix. Default: `__jsonp`
 * @param {String} [opts.param] QS parameter. Default: `callback`
 * @param {String|Function} [opts.name] The name of the callback function that
 *   receives the result. Default: `opts.prefix${increment}`
 * @param {Number} [opts.timeout] How long after the request until a timeout
 *   error will occur. Default: 15000
 *
 * @returns {Function} Returns a cancel function
 *
 * @example
 * var cancel = tiny.jsonp('http://suggestgz.mlapps.com/sites/MLA/autosuggest?q=smartphone&v=1', {timeout: 5000});
 * if (something) {
 *   cancel();
 * }
 */
function jsonp(url, settings) {
    var id = void 0,
        script = void 0,
        timer = void 0,
        cleanup = void 0,
        cancel = void 0;

    var opts = extend({
        prefix: '__jsonp',
        param: 'callback',
        timeout: 15000,
        success: noop,
        error: noop
    }, settings);

    // Generate an unique id for the request.
    jsonpCount++;
    id = opts.name ? typeof opts.name === 'function' ? opts.name(opts.prefix, jsonpCount) : opts.name : opts.prefix + jsonpCount++;

    cleanup = function cleanup() {
        // Remove the script tag.
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
        }

        // Don't delete the jsonp handler from window to not generate an error
        // when script will be loaded after cleaning
        window[id] = noop;

        if (timer) {
            clearTimeout(timer);
        }
    };

    if (opts.timeout) {
        timer = setTimeout(function () {
            cleanup();
            opts.error(new Error('Script loading timeout'));
        }, opts.timeout);
    }

    window[id] = function (data) {
        cleanup();
        opts.success(data);
    };

    // Add querystring component
    url += (~url.indexOf('?') ? '&' : '?') + opts.param + '=' + encodeURIComponent(id);
    url = url.replace('?&', '?');

    // Create script element
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onerror = function (e) {
        cleanup();
        opts.error(new Error(e.message || 'Script Error'));
    };
    head.appendChild(script);

    cancel = function cancel() {
        if (window[id]) {
            cleanup();
        }
    };

    return cancel;
}

// Based on the https://github.com/pablomoretti/jcors-loader written by Pablo Moretti

/* private */

var document$1 = window.document;
var node_createElementScript = document$1.createElement('script');
var node_elementScript = document$1.getElementsByTagName('script')[0];
var buffer = [];
var lastBufferIndex = 0;
var createCORSRequest = function () {
    var xhr = void 0,
        CORSRequest = void 0;
    if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
        if ('withCredentials' in xhr) {
            CORSRequest = function CORSRequest(url) {
                xhr = new window.XMLHttpRequest();
                xhr.open('get', url, true);
                return xhr;
            };
        } else if (window.XDomainRequest) {
            CORSRequest = function CORSRequest(url) {
                xhr = new window.XDomainRequest();
                xhr.open('get', url);
                return xhr;
            };
        }
    }

    return CORSRequest;
}();
function execute(script) {
    if (typeof script === 'string') {
        var g = node_createElementScript.cloneNode(false);
        g.text = script;
        node_elementScript.parentNode.insertBefore(g, node_elementScript);
    } else {
        script.apply(window);
    }
}

function saveInBuffer(index, script) {
    buffer[index] = script;
}

function finishedTask(index) {
    saveInBuffer(index, null);
    lastBufferIndex = index + 1;
}

function executeBuffer() {
    var dep = true,
        script = void 0,
        index = lastBufferIndex,
        len = buffer.length;

    while (index < len && dep) {
        script = buffer[index];
        if (script !== undefined && script !== null) {
            execute(script);
            finishedTask(index);
            index += 1;
        } else {
            dep = false;
        }
    }
}

function loadsAndExecuteScriptsOnChain() {
    if (buffer.length) {
        (function () {
            var scr = buffer.pop(),
                script = void 0;
            if (typeof scr === 'string') {
                script = node_createElementScript.cloneNode(true);
                script.type = 'text/javascript';
                script.async = true;
                script.src = scr;
                script.onload = script.onreadystatechange = function () {
                    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        // Dereference the script
                        script = undefined;
                        // Load
                        loadsAndExecuteScriptsOnChain();
                    }
                };
                node_elementScript.parentNode.insertBefore(script, node_elementScript);
            } else {
                scr.apply(window);
                loadsAndExecuteScriptsOnChain();
            }
        })();
    }
}

function onloadCORSHandler(request, index) {
    return function () {
        saveInBuffer(index, request.responseText);
        executeBuffer();
        // Dereference the script
        request = undefined;
    };
}

function loadWithCORS() {
    var len = arguments.length,
        index,
        request;
    for (index = 0; index < len; index += 1) {
        if (typeof arguments[index] === 'string') {
            request = createCORSRequest(arguments[index]);
            request.onload = onloadCORSHandler(request, buffer.length);
            saveInBuffer(buffer.length, null);
            request.send();
        } else {
            saveInBuffer(buffer.length, arguments[index]);
            executeBuffer();
        }
    }
}

function loadWithoutCORS() {
    buffer.push(Array.prototype.slice.call(arguments, 0).reverse());
    loadsAndExecuteScriptsOnChain();
}

var jcors = createCORSRequest ? loadWithCORS : loadWithoutCORS;

var support = {
    /**
     * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
     *
     * @static
     * @type {Boolean|Object}
     * @example
     * if (tiny.support.transition) {
         *     // Some code here!
         * }
     */
    transition: transitionEnd(),

    /**
     * Verify that CSS Animations are supported (or any of its browser-specific implementations).
     *
     * @static
     * @type {Boolean|Object}
     * @example
     * if (tiny.support.animation) {
         *     // Some code here!
         * }
     */
    animation: animationEnd(),

    /**
     * Checks is the User Agent supports touch events.
     * @type {Boolean}
     * @example
     * if (tiny.support.touch) {
         *     // Some code here!
         * }
     */
    touch: 'ontouchend' in document,

    /**
     * Checks is the User Agent supports custom events.
     * @type {Boolean}
     * @example
     * if (tiny.support.customEvent) {
         *     // Some code here!
         * }
     */
    customEvent: function () {
        // TODO: find better solution for CustomEvent check
        try {
            // IE8 has no support for CustomEvent, in IE gte 9 it cannot be
            // instantiated but exist
            new CustomEvent(name, {
                detail: {}
            });
            return true;
        } catch (e) {
            return false;
        }
    }()
};

/**
 * Checks for the CSS Transitions support (http://www.modernizr.com/)
 *
 * @function
 * @private
 */
function transitionEnd() {
    var el = document.createElement('tiny');

    var transEndEventNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend'
    };

    for (var _name in transEndEventNames) {
        if (transEndEventNames.hasOwnProperty(_name) && el.style[_name] !== undefined) {
            return {
                end: transEndEventNames[_name]
            };
        }
    }

    return false;
}

/**
 * Checks for the CSS Animations support
 *
 * @function
 * @private
 */
function animationEnd() {
    var el = document.createElement('tiny');

    var animEndEventNames = {
        WebkitAnimation: 'webkitAnimationEnd',
        MozAnimation: 'animationend',
        OAnimation: 'oAnimationEnd oanimationend',
        animation: 'animationend'
    };

    for (var _name2 in animEndEventNames) {
        if (animEndEventNames.hasOwnProperty(_name2) && el.style[_name2] !== undefined) {
            return {
                end: animEndEventNames[_name2]
            };
        }
    }

    return false;
}

var isClassList = !!document.body.classList;

/**
 * Adds the specified class to an element
 *
 * @param el {HTMLElement}
 * @param className {String}
 *
 * @example
 * tiny.addClass(document.body, 'tiny-example');
 */
function addClass(el, className) {
    if (isClassList) {
        el.classList.add(className);
    } else {
        el.setAttribute('class', el.getAttribute('class') + ' ' + className);
    }
}

/**
 * Remove a single class from an element
 *
 * @param el {HTMLElement}
 * @param className {String}
 *
 * @example
 * tiny.removeClass(document.body, 'tiny-example');
 */
function removeClass(el, className) {
    if (isClassList) {
        el.classList.remove(className);
    } else {
        el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
    }
}

/**
 * Determine whether is the given class is assigned to an element
 * @param el {HTMLElement}
 * @param className {String}
 * @returns {Boolean}
 *
 * @example
 * tiny.hasClass(document.body, 'tiny-example');
 */
function hasClass(el, className) {
    var exist;
    if (isClassList) {
        exist = el.classList.contains(className);
    } else {
        exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
    return exist;
}

var classList = {
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass
};

/**
 * Get the parent of an element, optionally filtered by a tag
 *
 * @param {HTMLElement} el
 * @param {String} tagname
 * @returns {HTMLElement}
 *
 * @example
 * tiny.parent(el, 'div');
 */
function parent(el, tagname) {
    var parentNode = el.parentNode;
    var tag = tagname ? tagname.toUpperCase() : tagname;

    if (parentNode === null) {
        return parentNode;
    }

    if (parentNode.nodeType !== 1) {
        return parent(parentNode, tag);
    }

    if (tagname !== undefined && parentNode.tagName === tag) {
        return parentNode;
    } else if (tagname !== undefined && parentNode.tagName !== tag) {
        return parent(parentNode, tag);
    } else if (tagname === undefined) {
        return parentNode;
    }
}

/**
 * IE8 safe method to get the next element sibling
 *
 * @memberof tiny
 * @param {HTMLElement} el A given HTMLElement.
 * @returns {HTMLElement}
 *
 * @example
 * tiny.next(el);
 */
function next(element) {
    function next(el) {
        do {
            el = el.nextSibling;
        } while (el && el.nodeType !== 1);

        return el;
    }

    return element.nextElementSibling || next(element);
}

/**
 * Get the value of a computed style for the first element in set of
 * matched elements or set one or more CSS properties for every matched element.
 *
 * @memberof tiny
 * @param {String|HTMLElement} elem CSS selector or an HTML Element
 * @param {String|Object} key A CSS property or a map of <property, value> when used as setter.
 * @param {Sreing} value A value to set for the property
 *
 * @returns {String|Void}
 */
function css(elem, key, value) {
    var args = arguments,
        elements = getElements(elem),
        length = elements.length,
        setter;

    // Get attribute
    if (typeof key === 'string' && args.length === 2) {
        return length === 0 ? '' : getElStyle(elements[0], key);
    }

    // Set attributes
    if (args.length === 3) {
        setter = function setter(el) {
            el.style[key] = value;
        };
    } else if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        setter = function setter(el) {
            Object.keys(key).forEach(function (name) {
                el.style[name] = key[name];
            });
        };
    }

    for (var i = 0; i < length; i++) {
        setter(elements[i]);
    }
}

function getElStyle(el, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
        // IE
    } else {
            // Turn style name into camel notation
            prop = prop.replace(/\-(\w)/g, function (str, $1) {
                return $1.toUpperCase();
            });
            return el.currentStyle[prop];
        }
}

function getElements(el) {
    if (!el) {
        return [];
    }

    if (typeof el === 'string') {
        return nodeListToArray(document.querySelectorAll(el));
    } else if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(el)) && (typeof el.length === 'number' || Object.prototype.hasOwnProperty.call(el, 'length')) && el.length > 0 && el[0].nodeType > 0) {

        return nodeListToArray(el);
    } else {
        return [el];
    }
}

function nodeListToArray(elements) {
    var i = 0,
        length = elements.length,
        arr = [];

    for (; i < length; i++) {
        arr.push(elements[i]);
    }

    return arr;
}

/**
 * Get the current vertical and horizontal positions of the scroll bars.
 *
 * @memberof tiny
 * @returns {{left: (Number), top: (Number)}}
 *
 * @example
 * tiny.scroll().top;
 */
function scroll() {
    return {
        'left': window.pageXOffset || document.documentElement.scrollLeft || 0,
        'top': window.pageYOffset || document.documentElement.scrollTop || 0
    };
}

/**
 * Get the current offset of an element.
 *
 * @param {HTMLElement} el A given HTMLElement.
 * @returns {{left: Number, top: Number}}
 *
 * @example
 * tiny.offset(el);
 */
function offset(el) {
    var rect = el.getBoundingClientRect(),
        fixedParent = getFixedParent(el),
        currentScroll = scroll(),
        offset = {
        'left': rect.left,
        'top': rect.top
    };

    if (css(el, 'position') !== 'fixed' && fixedParent === null) {
        offset.left += currentScroll.left;
        offset.top += currentScroll.top;
    }

    return offset;
}

/**
 * Get the current parentNode with the 'fixed' position.
 *
 * @private
 * @param {HTMLElement} el A given HTMLElement.
 *
 * @returns {HTMLElement}
 */
function getFixedParent(el) {
    var currentParent = el.offsetParent,
        parent = void 0;

    while (parent === undefined) {

        if (currentParent === null) {
            parent = null;
            break;
        }

        if (css(currentParent, 'position') !== 'fixed') {
            currentParent = currentParent.offsetParent;
        } else {
            parent = currentParent;
        }
    }

    return parent;
}

var defaults = {
    expires: '', // Empty string for session cookies
    path: '/',
    secure: false,
    domain: ''
};

var day = 60 * 60 * 24;

function get(key) {
    var collection = document.cookie.split('; '),
        value = null,
        l = collection.length;

    if (!l) {
        return value;
    }

    for (var i = 0; i < l; i++) {
        var parts = collection[i].split('='),
            _name3 = decodeURIComponent(parts.shift());

        if (key === _name3) {
            value = decodeURIComponent(parts.join('='));
            break;
        }
    }

    return value;
}

// Then `key` contains an object with keys and values for cookies, `value` contains the options object.
function set(key, value, options) {
    options = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : { expires: options };

    var expires = options.expires != null ? options.expires : defaults.expires;

    if (typeof expires === 'string' && expires !== '') {
        expires = new Date(expires);
    } else if (typeof expires === 'number') {
        expires = new Date(+new Date() + 1000 * day * expires);
    }

    if (expires && 'toGMTString' in expires) {
        expires = ';expires=' + expires.toGMTString();
    }

    var path = ';path=' + (options.path || defaults.path);

    var domain = options.domain || defaults.domain;
    domain = domain ? ';domain=' + domain : '';

    var secure = options.secure || defaults.secure ? ';secure' : '';

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        if (Array.isArray(value) || isPlainObject(value)) {
            value = JSON.stringify(value);
        } else {
            value = '';
        }
    }

    document.cookie = encodeCookie(key) + '=' + encodeCookie(value) + expires + path + domain + secure;
}

function remove(key) {
    set(key, '', -1);
}

function isEnabled() {
    if (navigator.cookieEnabled) {
        return true;
    }

    set('__', '_');
    var exist = get('__') === '_';
    remove('__');

    return exist;
}

var cookies = {
    get: get,
    set: set,
    remove: remove,
    isEnabled: isEnabled
};

/*
 * Escapes only characters that are not allowed in cookies
 */
function encodeCookie(value) {
    return String(value).replace(/[,;"\\=\s%]/g, function (character) {
        return encodeURIComponent(character);
    });
}

var DOM_EVENTS = function () {
    var events = [];
    for (var attr in document) {
        if (attr.substring(0, 2) === 'on') {
            var evt = attr.replace('on', '');
            events.push(evt);
        }
    }
    return events;
}();

var MOUSE_EVENTS = DOM_EVENTS.filter(function (name) {
    return (/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/.test(name)
    );
});

var isStandard = document.addEventListener ? true : false;

var addHandler = isStandard ? 'addEventListener' : 'attachEvent';

var removeHandler = isStandard ? 'removeEventListener' : 'detachEvent';

var dispatch = isStandard ? 'dispatchEvent' : 'fireEvent';

if (!Event.prototype.preventDefault && Object.defineProperties) {
    Object.defineProperties(window.Event.prototype, {
        bubbles: {
            value: true,
            writable: true
        },
        cancelable: {
            value: true,
            writable: true
        },
        preventDefault: {
            value: function value() {
                if (this.cancelable) {
                    this.defaultPrevented = true;
                    this.returnValue = false;
                }
            }
        },
        stopPropagation: {
            value: function value() {
                this.stoppedPropagation = true;
                this.cancelBubble = true;
            }
        },
        stopImmediatePropagation: {
            value: function value() {
                this.stoppedImmediatePropagation = true;
                this.stopPropagation();
            }
        }
    });
}

function getElements$1(el) {
    if (!el) {
        return [];
    }

    if (typeof el === 'string') {
        return nodeListToArray$1(document.querySelectorAll(el));
    } else if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(el)) && (typeof el.length === 'number' || Object.prototype.hasOwnProperty.call(el, 'length'))) {
        if (el.length === 0 || el[0].nodeType < 1) {
            return [];
        }

        return nodeListToArray$1(el);
    } else if (Array.isArray(el)) {
        return [].concat(el);
    } else {
        return [el];
    }
}

function nodeListToArray$1(elements) {
    var i = 0,
        length = elements.length,
        arr = [];

    for (; i < length; i++) {
        arr.push(elements[i]);
    }

    return arr;
}

function initEvent(name, props) {
    if (typeof name !== 'string') {
        props = name;
        name = props.type;
    }
    var event = void 0,
        isDomEvent = DOM_EVENTS.indexOf(name) !== -1,
        isMouseEvent = isDomEvent && MOUSE_EVENTS.indexOf(name) !== -1;

    var data = extend({
        bubbles: isDomEvent,
        cancelable: isDomEvent,
        detail: undefined
    }, props);

    if (document.createEvent) {
        event = document.createEvent(isMouseEvent && window.MouseEvent ? 'MouseEvents' : 'Events');
        event.initEvent(name, data.bubbles, data.cancelable, data.detail);
    } else if (document.createEventObject) {
        event = document.createEventObject(window.event);
        if (isMouseEvent) {
            event.button = 1;
        }
        if (!data.bubbles) {
            event.cancelBubble = true;
        }
    }

    return event;
}

function normalizeEventName(event) {
    if (event.substr(0, 2) === 'on') {
        return isStandard ? event.substr(2) : event;
    } else {
        return isStandard ? event : 'on' + event;
    }
}

/**
 * Crossbrowser implementation of {HTMLElement}.addEventListener.
 *
 * @memberof tiny
 * @type {Function}
 * @param {HTMLElement|String} elem An HTMLElement or a CSS selector to add listener to
 * @param {String} event Event name
 * @param {Function} handler Event handler function
 * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
 *
 * @example
 * tiny.on(document, 'click', function(e){}, false);
 *
 * tiny.on('p > button', 'click', function(e){}, false);
 */
function on(elem, event, handler, bubbles) {
    getElements$1(elem).forEach(function (el) {
        el[addHandler](normalizeEventName(event), handler, bubbles || false);
    });
}

/**
 * Attach a handler to an event for the {HTMLElement} that executes only
 * once.
 *
 * @memberof ch.Event
 * @type {Function}
 * @param {HTMLElement|String} elem An HTMLElement or a CSS selector to add listener to
 * @param {String} event Event name
 * @param {Function} handler Event handler function
 * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
 *
 * @example
 * tiny.once(document, 'click', function(e){}, false);
 */
function once(elem, event, _handler, bubbles) {
    getElements$1(elem).forEach(function (el) {
        var origHandler = _handler;

        _handler = function handler(e) {
            off(el, e.type, _handler);

            return origHandler.apply(el, arguments);
        };

        el[addHandler](normalizeEventName(event), _handler, bubbles || false);
    });
}

/**
 * Crossbrowser implementation of {HTMLElement}.removeEventListener.
 *
 * @memberof ch.Event
 * @type {Function}
 * @param {HTMLElement|String} elem An HTMLElement or a CSS selector to remove listener from
 * @param {String} event Event name
 * @param {Function} handler Event handler function to remove
 *
 * @example
 * tiny.off(document, 'click', fn);
 */
function off(elem, event, handler) {
    getElements$1(elem).forEach(function (el) {
        el[removeHandler](normalizeEventName(event), handler);
    });
}

/**
 * Crossbrowser implementation of {HTMLElement}.removeEventListener.
 *
 * @memberof tiny
 * @type {Function}
 * @param {HTMLElement} elem An HTMLElement or a CSS selector to dispatch event to
 * @param {String|Event} event Event name or an event object
 *
 * @example
 * tiny.trigger('.btn', 'click');
 */
function trigger(elem, event, props) {
    var _this = this;

    var name = typeof event === 'string' ? event : event.type;
    event = typeof event === 'string' || isPlainObject(event) ? initEvent(event, props) : event;

    getElements$1(elem).forEach(function (el) {
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof _this[event.type] == 'function') {
            _this[event.type]();
        } else {
            isStandard ? el[dispatch](event) : el[dispatch](normalizeEventName(name), event);
        }
    });
}

var DOMEvents = {
    on: on,
    once: once,
    off: off,
    trigger: trigger
};

/**
 * Polyfill for supporting pointer events on every browser
 *
 * @see Based on: <a href="https://github.com/deltakosh/handjs" target="_blank">Hand.js</a>
 */
(function (window) {
    'use strict';

    var POINTER_TYPE_TOUCH = 'touch';
    var POINTER_TYPE_PEN = 'pen';
    var POINTER_TYPE_MOUSE = 'mouse';

    // If the user agent already supports Pointer Events, do nothing
    if (window.PointerEvent) {
        return;
    }

    // Due to polyfill IE8 can has document.createEvent but it has no support for
    // custom Mouse Events
    var supportsMouseEvents = !!window.MouseEvent;

    if (!supportsMouseEvents) {
        return;
    }

    // The list of standardized pointer events http://www.w3.org/TR/pointerevents/
    var upperCaseEventsNames = ['PointerDown', 'PointerUp', 'PointerMove', 'PointerOver', 'PointerOut', 'PointerCancel', 'PointerEnter', 'PointerLeave'];
    var supportedEventsNames = upperCaseEventsNames.map(function (name) {
        return name.toLowerCase();
    });

    var previousTargets = {};

    var checkPreventDefault = function checkPreventDefault(node) {
        while (node && !node.ch_forcePreventDefault) {
            node = node.parentNode;
        }
        return !!node || window.ch_forcePreventDefault;
    };

    // Touch events
    var generateTouchClonedEvent = function generateTouchClonedEvent(sourceEvent, newName, canBubble, target, relatedTarget) {
        // Considering touch events are almost like super mouse events
        var evObj;

        if (document.createEvent && supportsMouseEvents) {
            evObj = document.createEvent('MouseEvents');
            // TODO: Replace 'initMouseEvent' with 'new MouseEvent'
            evObj.initMouseEvent(newName, canBubble, true, window, 1, sourceEvent.screenX, sourceEvent.screenY, sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey, sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, relatedTarget || sourceEvent.relatedTarget);
        } else {
            evObj = document.createEventObject();
            evObj.screenX = sourceEvent.screenX;
            evObj.screenY = sourceEvent.screenY;
            evObj.clientX = sourceEvent.clientX;
            evObj.clientY = sourceEvent.clientY;
            evObj.ctrlKey = sourceEvent.ctrlKey;
            evObj.altKey = sourceEvent.altKey;
            evObj.shiftKey = sourceEvent.shiftKey;
            evObj.metaKey = sourceEvent.metaKey;
            evObj.button = sourceEvent.button;
            evObj.relatedTarget = relatedTarget || sourceEvent.relatedTarget;
        }
        // offsets
        if (evObj.offsetX === undefined) {
            if (sourceEvent.offsetX !== undefined) {

                // For Opera which creates readonly properties
                if (Object && Object.defineProperty !== undefined) {
                    Object.defineProperty(evObj, 'offsetX', {
                        writable: true
                    });
                    Object.defineProperty(evObj, 'offsetY', {
                        writable: true
                    });
                }

                evObj.offsetX = sourceEvent.offsetX;
                evObj.offsetY = sourceEvent.offsetY;
            } else if (Object && Object.defineProperty !== undefined) {
                Object.defineProperty(evObj, 'offsetX', {
                    get: function get() {
                        if (this.currentTarget && this.currentTarget.offsetLeft) {
                            return sourceEvent.clientX - this.currentTarget.offsetLeft;
                        }
                        return sourceEvent.clientX;
                    }
                });
                Object.defineProperty(evObj, 'offsetY', {
                    get: function get() {
                        if (this.currentTarget && this.currentTarget.offsetTop) {
                            return sourceEvent.clientY - this.currentTarget.offsetTop;
                        }
                        return sourceEvent.clientY;
                    }
                });
            } else if (sourceEvent.layerX !== undefined) {
                evObj.offsetX = sourceEvent.layerX - sourceEvent.currentTarget.offsetLeft;
                evObj.offsetY = sourceEvent.layerY - sourceEvent.currentTarget.offsetTop;
            }
        }

        // adding missing properties

        if (sourceEvent.isPrimary !== undefined) evObj.isPrimary = sourceEvent.isPrimary;else evObj.isPrimary = true;

        if (sourceEvent.pressure) evObj.pressure = sourceEvent.pressure;else {
            var button = 0;

            if (sourceEvent.which !== undefined) button = sourceEvent.which;else if (sourceEvent.button !== undefined) {
                button = sourceEvent.button;
            }
            evObj.pressure = button === 0 ? 0 : 0.5;
        }

        if (sourceEvent.rotation) evObj.rotation = sourceEvent.rotation;else evObj.rotation = 0;

        // Timestamp
        if (sourceEvent.hwTimestamp) evObj.hwTimestamp = sourceEvent.hwTimestamp;else evObj.hwTimestamp = 0;

        // Tilts
        if (sourceEvent.tiltX) evObj.tiltX = sourceEvent.tiltX;else evObj.tiltX = 0;

        if (sourceEvent.tiltY) evObj.tiltY = sourceEvent.tiltY;else evObj.tiltY = 0;

        // Width and Height
        if (sourceEvent.height) evObj.height = sourceEvent.height;else evObj.height = 0;

        if (sourceEvent.width) evObj.width = sourceEvent.width;else evObj.width = 0;

        // preventDefault
        evObj.preventDefault = function () {
            if (sourceEvent.preventDefault !== undefined) sourceEvent.preventDefault();
        };

        // stopPropagation
        if (evObj.stopPropagation !== undefined) {
            var current = evObj.stopPropagation;
            evObj.stopPropagation = function () {
                if (sourceEvent.stopPropagation !== undefined) sourceEvent.stopPropagation();
                current.call(this);
            };
        }

        // Pointer values
        evObj.pointerId = sourceEvent.pointerId;
        evObj.pointerType = sourceEvent.pointerType;

        switch (evObj.pointerType) {// Old spec version check
            case 2:
                evObj.pointerType = POINTER_TYPE_TOUCH;
                break;
            case 3:
                evObj.pointerType = POINTER_TYPE_PEN;
                break;
            case 4:
                evObj.pointerType = POINTER_TYPE_MOUSE;
                break;
        }

        // Fire event
        if (target) target.dispatchEvent(evObj);else if (sourceEvent.target && supportsMouseEvents) {
            sourceEvent.target.dispatchEvent(evObj);
        } else {
            sourceEvent.srcElement.fireEvent('on' + getMouseEquivalentEventName(newName), evObj); // We must fallback to mouse event for very old browsers
        }
    };

    var generateMouseProxy = function generateMouseProxy(evt, eventName, canBubble, target, relatedTarget) {
        evt.pointerId = 1;
        evt.pointerType = POINTER_TYPE_MOUSE;
        generateTouchClonedEvent(evt, eventName, canBubble, target, relatedTarget);
    };

    var generateTouchEventProxy = function generateTouchEventProxy(name, touchPoint, target, eventObject, canBubble, relatedTarget) {
        var touchPointId = touchPoint.identifier + 2; // Just to not override mouse id

        touchPoint.pointerId = touchPointId;
        touchPoint.pointerType = POINTER_TYPE_TOUCH;
        touchPoint.currentTarget = target;

        if (eventObject.preventDefault !== undefined) {
            touchPoint.preventDefault = function () {
                eventObject.preventDefault();
            };
        }

        generateTouchClonedEvent(touchPoint, name, canBubble, target, relatedTarget);
    };

    var checkEventRegistration = function checkEventRegistration(node, eventName) {
        return node.__chGlobalRegisteredEvents && node.__chGlobalRegisteredEvents[eventName];
    };
    var findEventRegisteredNode = function findEventRegisteredNode(node, eventName) {
        while (node && !checkEventRegistration(node, eventName)) {
            node = node.parentNode;
        }if (node) return node;else if (checkEventRegistration(window, eventName)) return window;
    };

    var generateTouchEventProxyIfRegistered = function generateTouchEventProxyIfRegistered(eventName, touchPoint, target, eventObject, canBubble, relatedTarget) {
        // Check if user registered this event
        if (findEventRegisteredNode(target, eventName)) {
            generateTouchEventProxy(eventName, touchPoint, target, eventObject, canBubble, relatedTarget);
        }
    };

    var getMouseEquivalentEventName = function getMouseEquivalentEventName(eventName) {
        return eventName.toLowerCase().replace('pointer', 'mouse');
    };

    var getPrefixEventName = function getPrefixEventName(prefix, eventName) {
        var upperCaseIndex = supportedEventsNames.indexOf(eventName);
        var newEventName = prefix + upperCaseEventsNames[upperCaseIndex];

        return newEventName;
    };

    var registerOrUnregisterEvent = function registerOrUnregisterEvent(item, name, func, enable) {
        if (item.__chRegisteredEvents === undefined) {
            item.__chRegisteredEvents = [];
        }

        if (enable) {
            if (item.__chRegisteredEvents[name] !== undefined) {
                item.__chRegisteredEvents[name]++;
                return;
            }

            item.__chRegisteredEvents[name] = 1;
            item.addEventListener(name, func, false);
        } else {

            if (item.__chRegisteredEvents.indexOf(name) !== -1) {
                item.__chRegisteredEvents[name]--;

                if (item.__chRegisteredEvents[name] !== 0) {
                    return;
                }
            }
            item.removeEventListener(name, func);
            item.__chRegisteredEvents[name] = 0;
        }
    };

    var setTouchAware = function setTouchAware(item, eventName, enable) {
        // Leaving tokens
        if (!item.__chGlobalRegisteredEvents) {
            item.__chGlobalRegisteredEvents = [];
        }
        if (enable) {
            if (item.__chGlobalRegisteredEvents[eventName] !== undefined) {
                item.__chGlobalRegisteredEvents[eventName]++;
                return;
            }
            item.__chGlobalRegisteredEvents[eventName] = 1;
        } else {
            if (item.__chGlobalRegisteredEvents[eventName] !== undefined) {
                item.__chGlobalRegisteredEvents[eventName]--;
                if (item.__chGlobalRegisteredEvents[eventName] < 0) {
                    item.__chGlobalRegisteredEvents[eventName] = 0;
                }
            }
        }

        var nameGenerator;
        var eventGenerator;
        if (window.MSPointerEvent) {
            nameGenerator = function nameGenerator(name) {
                return getPrefixEventName('MS', name);
            };
            eventGenerator = generateTouchClonedEvent;
        } else {
            nameGenerator = getMouseEquivalentEventName;
            eventGenerator = generateMouseProxy;
        }
        switch (eventName) {
            case 'pointerenter':
            case 'pointerleave':
                var targetEvent = nameGenerator(eventName);
                if (item['on' + targetEvent.toLowerCase()] !== undefined) {
                    registerOrUnregisterEvent(item, targetEvent, function (evt) {
                        eventGenerator(evt, eventName);
                    }, enable);
                }
                break;
        }
    };

    // Intercept addEventListener calls by changing the prototype
    var interceptAddEventListener = function interceptAddEventListener(root) {
        var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;

        var customAddEventListener = function customAddEventListener(name, func, capture) {
            // Branch when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) !== -1) {
                setTouchAware(this, name, true);
            }

            if (current === undefined) {
                this.attachEvent('on' + getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };

        if (root.prototype) {
            root.prototype.addEventListener = customAddEventListener;
        } else {
            root.addEventListener = customAddEventListener;
        }
    };

    // Intercept removeEventListener calls by changing the prototype
    var interceptRemoveEventListener = function interceptRemoveEventListener(root) {
        var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;

        var customRemoveEventListener = function customRemoveEventListener(name, func, capture) {
            // Release when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) !== -1) {
                setTouchAware(this, name, false);
            }

            if (current === undefined) {
                this.detachEvent(getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };
        if (root.prototype) {
            root.prototype.removeEventListener = customRemoveEventListener;
        } else {
            root.removeEventListener = customRemoveEventListener;
        }
    };

    // Hooks
    interceptAddEventListener(window);
    interceptAddEventListener(window.HTMLElement || window.Element);
    interceptAddEventListener(document);
    interceptAddEventListener(HTMLBodyElement);
    interceptAddEventListener(HTMLDivElement);
    interceptAddEventListener(HTMLImageElement);
    interceptAddEventListener(HTMLUListElement);
    interceptAddEventListener(HTMLAnchorElement);
    interceptAddEventListener(HTMLLIElement);
    interceptAddEventListener(HTMLTableElement);
    if (window.HTMLSpanElement) {
        interceptAddEventListener(HTMLSpanElement);
    }
    if (window.HTMLCanvasElement) {
        interceptAddEventListener(HTMLCanvasElement);
    }
    if (window.SVGElement) {
        interceptAddEventListener(SVGElement);
    }

    interceptRemoveEventListener(window);
    interceptRemoveEventListener(window.HTMLElement || window.Element);
    interceptRemoveEventListener(document);
    interceptRemoveEventListener(HTMLBodyElement);
    interceptRemoveEventListener(HTMLDivElement);
    interceptRemoveEventListener(HTMLImageElement);
    interceptRemoveEventListener(HTMLUListElement);
    interceptRemoveEventListener(HTMLAnchorElement);
    interceptRemoveEventListener(HTMLLIElement);
    interceptRemoveEventListener(HTMLTableElement);
    if (window.HTMLSpanElement) {
        interceptRemoveEventListener(HTMLSpanElement);
    }
    if (window.HTMLCanvasElement) {
        interceptRemoveEventListener(HTMLCanvasElement);
    }
    if (window.SVGElement) {
        interceptRemoveEventListener(SVGElement);
    }

    // Prevent mouse event from being dispatched after Touch Events action
    var touching = false;
    var touchTimer = -1;

    function setTouchTimer() {
        touching = true;
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () {
            touching = false;
        }, 700);
        // 1. Mobile browsers dispatch mouse events 300ms after touchend
        // 2. Chrome for Android dispatch mousedown for long-touch about 650ms
        // Result: Blocking Mouse Events for 700ms.
    }

    function getFirstCommonNode(x, y) {
        while (x) {
            if (x.contains(y)) return x;
            x = x.parentNode;
        }
        return null;
    }

    //generateProxy receives a node to dispatch the event
    function dispatchPointerEnter(currentTarget, relatedTarget, generateProxy) {
        var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
        var node = currentTarget;
        var nodelist = [];
        while (node && node !== commonParent) {
            //target range: this to the direct child of parent relatedTarget
            if (checkEventRegistration(node, 'pointerenter')) //check if any parent node has pointerenter
                nodelist.push(node);
            node = node.parentNode;
        }
        while (nodelist.length > 0) {
            generateProxy(nodelist.pop());
        }
    }

    //generateProxy receives a node to dispatch the event
    function dispatchPointerLeave(currentTarget, relatedTarget, generateProxy) {
        var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
        var node = currentTarget;
        while (node && node !== commonParent) {
            //target range: this to the direct child of parent relatedTarget
            if (checkEventRegistration(node, 'pointerleave')) //check if any parent node has pointerleave
                generateProxy(node);
            node = node.parentNode;
        }
    }

    // Handling events on window to prevent unwanted super-bubbling
    // All mouse events are affected by touch fallback
    function applySimpleEventTunnels(nameGenerator, eventGenerator) {
        ['pointerdown', 'pointermove', 'pointerup', 'pointerover', 'pointerout'].forEach(function (eventName) {
            window.addEventListener(nameGenerator(eventName), function (evt) {
                if (!touching && findEventRegisteredNode(evt.target, eventName)) eventGenerator(evt, eventName, true);
            });
        });
        if (window['on' + nameGenerator('pointerenter').toLowerCase()] === undefined) window.addEventListener(nameGenerator('pointerover'), function (evt) {
            if (touching) return;
            var foundNode = findEventRegisteredNode(evt.target, 'pointerenter');
            if (!foundNode || foundNode === window) return;else if (!foundNode.contains(evt.relatedTarget)) {
                dispatchPointerEnter(foundNode, evt.relatedTarget, function (targetNode) {
                    eventGenerator(evt, 'pointerenter', false, targetNode, evt.relatedTarget);
                });
            }
        });
        if (window['on' + nameGenerator('pointerleave').toLowerCase()] === undefined) window.addEventListener(nameGenerator('pointerout'), function (evt) {
            if (touching) return;
            var foundNode = findEventRegisteredNode(evt.target, 'pointerleave');
            if (!foundNode || foundNode === window) return;else if (!foundNode.contains(evt.relatedTarget)) {
                dispatchPointerLeave(foundNode, evt.relatedTarget, function (targetNode) {
                    eventGenerator(evt, 'pointerleave', false, targetNode, evt.relatedTarget);
                });
            }
        });
    }

    (function () {
        if (window.MSPointerEvent) {
            //IE 10
            applySimpleEventTunnels(function (name) {
                return getPrefixEventName('MS', name);
            }, generateTouchClonedEvent);
        } else {
            applySimpleEventTunnels(getMouseEquivalentEventName, generateMouseProxy);

            // Handling move on window to detect pointerleave/out/over
            if (window.ontouchstart !== undefined) {
                window.addEventListener('touchstart', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        previousTargets[touchPoint.identifier] = touchPoint.target;

                        generateTouchEventProxyIfRegistered('pointerover', touchPoint, touchPoint.target, eventObject, true);

                        //pointerenter should not be bubbled
                        dispatchPointerEnter(touchPoint.target, null, function (targetNode) {
                            generateTouchEventProxy('pointerenter', touchPoint, targetNode, eventObject, false);
                        });

                        generateTouchEventProxyIfRegistered('pointerdown', touchPoint, touchPoint.target, eventObject, true);
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchend', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        var currentTarget = previousTargets[touchPoint.identifier];

                        if (!currentTarget) {
                            continue;
                        }

                        generateTouchEventProxyIfRegistered('pointerup', touchPoint, currentTarget, eventObject, true);
                        generateTouchEventProxyIfRegistered('pointerout', touchPoint, currentTarget, eventObject, true);

                        //pointerleave should not be bubbled
                        dispatchPointerLeave(currentTarget, null, function (targetNode) {
                            generateTouchEventProxy('pointerleave', touchPoint, targetNode, eventObject, false);
                        });

                        delete previousTargets[touchPoint.identifier];
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchmove', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        var newTarget = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
                        var currentTarget = previousTargets[touchPoint.identifier];

                        // If force preventDefault
                        if (currentTarget && checkPreventDefault(currentTarget) === true) eventObject.preventDefault();

                        // Viewport manipulation fires non-cancelable touchmove
                        if (!eventObject.cancelable) {
                            delete previousTargets[touchPoint.identifier];
                            generateTouchEventProxyIfRegistered('pointercancel', touchPoint, currentTarget, eventObject, true);
                            generateTouchEventProxyIfRegistered('pointerout', touchPoint, currentTarget, eventObject, true);

                            dispatchPointerLeave(currentTarget, null, function (targetNode) {
                                generateTouchEventProxy('pointerleave', touchPoint, targetNode, eventObject, false);
                            });
                            continue;
                        }

                        generateTouchEventProxyIfRegistered('pointermove', touchPoint, currentTarget, eventObject, true);

                        if (currentTarget === newTarget) {
                            continue; // We can skip this as the pointer is effectively over the current target
                        }

                        if (currentTarget) {
                            // Raise out
                            generateTouchEventProxyIfRegistered('pointerout', touchPoint, currentTarget, eventObject, true, newTarget);

                            // Raise leave
                            if (!currentTarget.contains(newTarget)) {
                                // Leave must be called if the new target is not a child of the current
                                dispatchPointerLeave(currentTarget, newTarget, function (targetNode) {
                                    generateTouchEventProxy('pointerleave', touchPoint, targetNode, eventObject, false, newTarget);
                                });
                            }
                        }

                        if (newTarget) {
                            // Raise over
                            generateTouchEventProxyIfRegistered('pointerover', touchPoint, newTarget, eventObject, true, currentTarget);

                            // Raise enter
                            if (!newTarget.contains(currentTarget)) {
                                // Leave must be called if the new target is not the parent of the current
                                dispatchPointerEnter(newTarget, currentTarget, function (targetNode) {
                                    generateTouchEventProxy('pointerenter', touchPoint, targetNode, eventObject, false, currentTarget);
                                });
                            }
                        }
                        previousTargets[touchPoint.identifier] = newTarget;
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchcancel', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];

                        generateTouchEventProxyIfRegistered('pointercancel', touchPoint, previousTargets[touchPoint.identifier], eventObject, true);
                    }
                });
            }
        }
    })();

    // Extension to navigator
    if (navigator.pointerEnabled === undefined) {

        // Indicates if the browser will fire pointer events for pointing input
        navigator.pointerEnabled = true;

        // IE
        if (navigator.msPointerEnabled) {
            navigator.maxTouchPoints = navigator.msMaxTouchPoints;
        }
    }
})(window);

/**
 * Normalizes touch/touch+click events into a 'pointertap' event that is not
 * part of standard.
 * Uses pointerEvents polyfill or native PointerEvents when supported.
 *
 * @example
 * // Use pointertap as fastclick on touch enabled devices
 * document.querySelector('.btn').addEventListener(ch.pointertap, function(e) {
 *   console.log('tap');
 * });
 */
(function () {
    'use strict';

    // IE8 has no support for custom Mouse Events, fallback to onclick

    if (!window.MouseEvent) {
        return;
    }

    var POINTER_TYPE_TOUCH = 'touch';
    var POINTER_TYPE_PEN = 'pen';
    var POINTER_TYPE_MOUSE = 'mouse';

    var isScrolling = false;
    var scrollTimeout = false;
    var sDistX = 0;
    var sDistY = 0;
    var activePointer;

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            sDistX = window.pageXOffset;
            sDistY = window.pageYOffset;
        }
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            isScrolling = false;
            sDistX = 0;
            sDistY = 0;
        }, 100);
    });

    window.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointerleave', pointerLeave);

    window.addEventListener('pointermove', function () /* e */{});

    /**
     * Handles the 'pointerdown' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerDown(e) {
        // don't register an activePointer if more than one touch is active.
        var singleFinger = e.pointerType === POINTER_TYPE_MOUSE || e.pointerType === POINTER_TYPE_PEN || e.pointerType === POINTER_TYPE_TOUCH && e.isPrimary;

        if (!isScrolling && singleFinger) {
            activePointer = {
                id: e.pointerId,
                clientX: e.clientX,
                clientY: e.clientY,
                x: e.x || e.pageX,
                y: e.y || e.pageY,
                type: e.pointerType
            };
        }
    }

    /**
     * Handles the 'pointerleave' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerLeave() /* e */{
        activePointer = null;
    }

    /**
     * Handles the 'pointerup' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerUp(e) {
        // Does our event is the same as the activePointer set by pointerdown?
        if (activePointer && activePointer.id === e.pointerId) {
            // Have we moved too much?
            if (Math.abs(activePointer.x - (e.x || e.pageX)) < 5 && Math.abs(activePointer.y - (e.y || e.pageY)) < 5) {
                // Have we scrolled too much?
                if (!isScrolling || Math.abs(sDistX - window.pageXOffset) < 5 && Math.abs(sDistY - window.pageYOffset) < 5) {
                    makePointertapEvent(e);
                }
            }
        }
        activePointer = null;
    }

    /**
     * Creates the pointertap event that is not part of standard.
     *
     * @private
     * @param {MouseEvent|PointerEvent} sourceEvent An event to use as a base for pointertap.
     */
    function makePointertapEvent(sourceEvent) {
        var evt = document.createEvent('MouseEvents');
        var newTarget = document.elementFromPoint(sourceEvent.clientX, sourceEvent.clientY);

        // According to the MDN docs if the specified point is outside the visible bounds of the document
        // or either coordinate is negative, the result is null
        if (!newTarget) {
            return null;
        }

        // TODO: Replace 'initMouseEvent' with 'new MouseEvent'
        evt.initMouseEvent('pointertap', true, true, window, 1, sourceEvent.screenX, sourceEvent.screenY, sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey, sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, newTarget);

        evt.maskedEvent = sourceEvent;
        newTarget.dispatchEvent(evt);

        return evt;
    }
})();

var supportsMouseEvents = !!window.MouseEvent;

/**
 * Every time Chico UI needs to inform all visual components that layout has
 * been changed, it emits this event.
 *
 * @constant
 * @type {String}
 */
var onlayoutchange = 'layoutchange';

/**
 * Equivalent to 'resize'.
 * @constant
 * @type {String}
 */
var onresize = 'resize';

/**
 * Equivalent to 'scroll'.
 * @constant
 * @type {String}
 */
var onscroll = 'scroll';

/**
 * Equivalent to 'pointerdown' or 'mousedown', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerdown | Pointer Events W3C Recommendation
 */
var onpointerdown = supportsMouseEvents ? 'pointerdown' : 'mousedown';

/**
 * Equivalent to 'pointerup' or 'mouseup', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerup | Pointer Events W3C Recommendation
 */
var onpointerup = supportsMouseEvents ? 'pointerup' : 'mouseup';

/**
 * Equivalent to 'pointermove' or 'mousemove', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointermove | Pointer Events W3C Recommendation
 */
var onpointermove = supportsMouseEvents ? 'pointermove' : 'mousemove';

/**
 * Equivalent to 'pointertap' or 'click', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#list-of-pointer-events | Pointer Events W3C Recommendation
 */
var onpointertap = support.touch && supportsMouseEvents ? 'pointertap' : 'click';

/**
 * Equivalent to 'pointerenter' or 'mouseenter', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerenter | Pointer Events W3C Recommendation
 */
var onpointerenter = supportsMouseEvents ? 'pointerenter' : 'mouseenter';

/**
 * Equivalent to 'pointerleave' or 'mouseleave', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerleave | Pointer Events W3C Recommendation
 */
var onpointerleave = supportsMouseEvents ? 'pointerleave' : 'mouseleave';

/**
 * The DOM input event that is fired when the value of an <input> or <textarea>
 * element is changed. Equivalent to 'input' or 'keydown', depending on browser
 * capabilities.
 *
 * @constant
 * @type {String}
 */
var onkeyinput = 'oninput' in document.createElement('input') ? 'input' : 'keydown';

var events = Object.freeze({
    onlayoutchange: onlayoutchange,
    onresize: onresize,
    onscroll: onscroll,
    onpointerdown: onpointerdown,
    onpointerup: onpointerup,
    onpointermove: onpointermove,
    onpointertap: onpointertap,
    onpointerenter: onpointerenter,
    onpointerleave: onpointerleave,
    onkeyinput: onkeyinput
});

var tiny = {
    clone: clone,
    extend: extend,
    inherits: inherits,
    EventEmitter: EventEmitter,
    ajax: ajax,
    jsonp: jsonp,
    jcors: jcors,
    isPlainObject: isPlainObject,
    support: support,
    addClass: classList.addClass,
    removeClass: classList.removeClass,
    hasClass: classList.hasClass,
    parent: parent,
    next: next,
    css: css,
    offset: offset,
    scroll: scroll,
    cookies: cookies,
    on: DOMEvents.on,
    bind: DOMEvents.on,
    one: DOMEvents.once,
    once: DOMEvents.once,
    off: DOMEvents.off,
    trigger: DOMEvents.trigger
};

for (var e in events) {
    tiny[e] = events[e];
}

if (typeof window !== 'undefined') {
    window.tiny = tiny;
}

module.exports = tiny;

},{"events":1,"inherits":2}]},{},[3]);
