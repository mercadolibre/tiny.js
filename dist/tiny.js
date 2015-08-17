(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Add or remove class
 *
 * @name classList
 * @memberof ch.util
 * @param {HTMLElement} el A given HTMLElement.
 * @see Based on: <a href="http://youmightnotneedjquery.com/" target="_blank">http://youmightnotneedjquery.com/</a>
 * @example
 * ch.util.classList(document.body).add('ch-example');
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = classList;

function classList(el) {
    var isClassList = el.classList;

    return {
        'add': function add(className) {
            if (isClassList) {
                el.classList.add(className);
            } else {
                el.setAttribute('class', el.getAttribute('class') + ' ' + className);
            }
        },
        'remove': function remove(className) {
            if (isClassList) {
                el.classList.remove(className);
            } else {
                el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
            }
        },
        'contains': function contains(className) {
            var exist;
            if (isClassList) {
                exist = el.classList.contains(className);
            } else {
                exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
            return exist;
        }
    };
}

module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = clone;

function clone(obj) {
    if (!obj || typeof obj !== 'object') {
        throw new Error('The "obj" parameter is required and must be an object.');
    }

    var copy = {},
        prop = undefined;

    for (prop in obj) {
        if (obj[prop] !== undefined) {
            copy[prop] = obj[prop];
        }
    }

    return copy;
}

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = extend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isPlainObject = require('./isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function extend() {
    var options = undefined,
        name = undefined,
        src = undefined,
        copy = undefined,
        copyIsArray = undefined,
        clone = undefined,
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
    if (typeof target !== 'object' && ! typeof target === 'function') {
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
                if (deep && copy && ((0, _isPlainObject2['default'])(copy) || (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && (0, _isPlainObject2['default'])(src) ? src : {};
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

module.exports = exports['default'];

},{"./isPlainObject":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = isPlainObject;

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
    if (typeof obj !== 'object' || obj.nodeType || obj === obj.window) {
        return false;
    }

    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
}

module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = request;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

function request(url, settings) {
    var args = arguments;
    var opts = undefined;

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
        success: noop,
        error: noop,
        complete: noop
    };

    opts = (0, _extend2['default'])(defaults, settings || {});

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
        opts.url = opts.url + (opts.url.indexOf('?') ? '&' : '?') + 'nc=' + Math.floor(Math.random() * 9e9);
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

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var result = undefined;
            var _status = xhr.status === 1223 ? 204 : xhr.status;

            if (_status >= 200 && _status < 300 || _status === 304) {
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

                success(result, xhr, opts);
            } else {
                error(new Error(xhr.statusText), 'error', xhr, opts);
            }

            return;
        }
    };

    xhr.onerror = function () {
        error(new Error(xhr.statusText || 'Network request failed'), 'error', xhr, opts);
    };

    xhr.open(opts.method, opts.url);

    if (opts.dataType && dataTypes[opts.dataType.toLowerCase()]) {
        opts.headers.Accept = dataTypes[opts.dataType.toLowerCase()] + ', */*; q=0.01';
    }

    if (opts.method === 'POST') {
        opts.headers = (0, _extend2['default'])(opts.headers, {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
        });
    }

    for (var key in opts.headers) {
        xhr.setRequestHeader(key, opts.headers[key]);
    }

    xhr.send(opts.data);

    return this;
}

module.exports = exports['default'];

},{"./extend":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var support = {
    /**
     * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
     *
     * @static
     * @type {Boolean|Object}
     * @example
     * if (ch.support.transition) {
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
     * if (ch.support.animation) {
         *     // Some code here!
         * }
     */
    animation: animationEnd(),

    /**
     * Checks is the User Agent supports touch events.
     * @type {Boolean}
     * @example
     * if (ch.support.touch) {
         *     // Some code here!
         * }
     */
    touch: 'ontouchend' in document,

    /**
     * Checks is the User Agent supports custom events.
     * @type {Boolean}
     * @example
     * if (ch.support.customEvent) {
         *     // Some code here!
         * }
     */
    customEvent: (function () {
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
    })()
};

exports.support = support;
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

},{}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modulesClone = require('./modules/clone');

var _modulesClone2 = _interopRequireDefault(_modulesClone);

var _modulesExtend = require('./modules/extend');

var _modulesExtend2 = _interopRequireDefault(_modulesExtend);

var _modulesRequest = require('./modules/request');

var _modulesRequest2 = _interopRequireDefault(_modulesRequest);

var _modulesIsPlainObject = require('./modules/isPlainObject');

var _modulesIsPlainObject2 = _interopRequireDefault(_modulesIsPlainObject);

var _modulesSupport = require('./modules/support');

var _modulesClassList = require('./modules/classList');

var _modulesClassList2 = _interopRequireDefault(_modulesClassList);

var tiny = {
    clone: _modulesClone2['default'],
    extend: _modulesExtend2['default'],
    request: _modulesRequest2['default'],
    isPlainObject: _modulesIsPlainObject2['default'],
    support: _modulesSupport.support,
    classList: _modulesClassList2['default']
};

var root = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || undefined;

root.tiny = tiny;

exports['default'] = tiny;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./modules/classList":1,"./modules/clone":2,"./modules/extend":3,"./modules/isPlainObject":4,"./modules/request":5,"./modules/support":6}]},{},[7]);
