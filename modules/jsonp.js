import extend from './extend';

let noop = function() {};

// document.head is not available in IE<9
let head = document.getElementsByTagName('head')[0];

let jsonpCount = 0;

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
export default function jsonp(url, settings) {
    let id,
        script,
        timer,
        cleanup,
        cancel;

    let opts = extend({
        prefix: '__jsonp',
        param: 'callback',
        timeout : 15000,
        success: noop,
        error: noop
    }, settings);

    // Generate an unique id for the request.
    jsonpCount++;
    id = opts.name ?
        (typeof opts.name === 'function' ? opts.name(opts.prefix, jsonpCount) : opts.name) :
    opts.prefix + (jsonpCount++);

    cleanup = function() {
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
        timer = setTimeout(() => {
            cleanup();
            opts.error(new Error('Script loading timeout'));
        }, opts.timeout);
    }

    window[id] = function(data) {
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

    cancel = function () {
        if (window[id]) {
            cleanup();
        }
    };

    return cancel;
}
