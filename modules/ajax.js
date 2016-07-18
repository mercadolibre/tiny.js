import extend from './extend';

export default function ajax(url, settings) {
    let args = arguments;
    let opts;

    settings = (args.length === 1 ? args[0] : args[1]);

    let noop = function() { };

    const defaults = {
        url: (args.length === 2 && typeof url === 'string' ? url : '.'),
        cache: true,
        data: null,
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

    const mimeTypes = {
        'application/json': 'json',
        'text/html': 'html',
        'text/plain': 'text'
    };

    const dataTypes = {};
    for (let type in mimeTypes) {
        if(mimeTypes.hasOwnProperty(type)) {
            dataTypes[mimeTypes[type]] = type;
        }
    }

    if (!opts.cache) {
        opts.url = opts.url +
            (~opts.url.indexOf('?') ? '&' : '?') +
            'nc=' + Math.floor(Math.random() * 9e9);
    }

    let complete = function (status, xhr) {
        opts.complete.call(opts.context, xhr, status);
    };

    let success = function (data, xhr) {
        const status = 'success';
        opts.success.call(opts.context, data, status, xhr);
        complete(status, xhr);
    };

    let error = function (error, status, xhr) {
        opts.error.call(opts.context, xhr, status, error);
        complete(status, xhr);
    };

    // toString shortcut for DRY
    const toString = Object.prototype.toString;

    const normalizeRequestData = function (data, headers, cors) {
        const charset = 'charset=UTF-8';
        const formUrlEncoded = `application/x-www-form-urlencoded; ${charset}`;

        if ((typeof FormData !== 'undefined' && data instanceof FormData) ||
            /^\[object\s(ArrayBuffer|File|Blob)\]$/.test(toString.call(data))
        ) {
            return data;
        }

        if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams ||
            typeof data === 'string'
        ) {
            if (headers['Content-Type'] === undefined) {
                headers['Content-Type'] = formUrlEncoded;
            }

            return data.toString();
        }

        if (data !== null && typeof data === 'object') {
            if (headers['Content-Type'] === undefined) {
                if (cors) {
                    // The content type of a CORS request is limited to
                    // application/x-www-form-urlencoded, multipart/form-data, or text/plain
                    headers['Content-Type'] = formUrlEncoded;
                } else {
                    headers['Content-Type'] = `application/json;  ${charset}`;
                }
            }

            return JSON.stringify(data);
        }

        return data;
    };

    // Normalize the method name
    opts.method = opts.method.toUpperCase();

    // Set the cross domain option
    // To avoid the preflight requests please use the "simple" requests only
    // @see https://www.w3.org/TR/cors/#resource-requests
    const testAnchor = document.createElement('a');
    const originAnchor = document.createElement('a');
    originAnchor.href = location.href;

    try {
        testAnchor.href = opts.url;

        // Support: IE lte 11
        // Anchor's host property isn't correctly set when opts.url is relative
        testAnchor.href = testAnchor.href;
        opts.crossDomain = `${originAnchor.protocol}//${originAnchor.host}` !==
            `${testAnchor.protocol}//${testAnchor.host}`;
    } catch (e) {
        opts.crossDomain = true;
    }

    let xhr = new XMLHttpRequest();

    let useXDR = opts.crossDomain && !('withCredentials' in xhr) && 'XDomainRequest' in window;

    if (useXDR) {
        // Use XDomainRequest instead of XMLHttpRequest for IE<=9 and when CORS is requested
        xhr = new XDomainRequest();
        xhr.onload = function () {
            let mime = xhr.contentType;
            let dataType = mime && mimeTypes[mime[1]] ? mimeTypes[mime[1]].toLowerCase() : 'json';
            let result;

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
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                let result;
                let status = (xhr.status === 1223) ? 204 : xhr.status;

                if ((status >= 200 && status < 300) || status === 304) {
                    let mime = /([\/a-z]+)(;|\s|$)/.exec(xhr.getResponseHeader('content-type'));
                    let dataType = mime && mimeTypes[mime[1]] ? mimeTypes[mime[1]].toLowerCase() : 'text';
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

    xhr.onerror = function() {
        error(new Error(xhr.statusText || 'Network request failed'), 'error', xhr, opts);
    };

    if ((opts.method === 'GET' || opts.method === 'HEAD') && typeof opts.data === 'string') {
        opts.url += (~opts.url.indexOf('?') ? '&' : '?') + opts.data;
    }

    xhr.open(opts.method, opts.url);

    if (opts.dataType && dataTypes[opts.dataType.toLowerCase()]) {
        opts.headers.Accept = `${dataTypes[opts.dataType.toLowerCase()]}, */*; q=0.01`;
    }

    // Set the "X-Requested-With" header only if it is not already set
    if (!opts.crossDomain && !opts.headers['X-Requested-With']) {
        opts.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (opts.credentials === 'include') {
        xhr.withCredentials = true;
    }

    opts.data = normalizeRequestData(opts.data, opts.headers, opts.crossDomain);

    if (!useXDR) {
        for (let key in opts.headers) {
            xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    xhr.send(opts.data);

    return this;
}
