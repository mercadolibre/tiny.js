import extend from './extend';

export default function ajax(url, settings) {
    let args = arguments;
    let opts;

    settings = (args.length === 1 ? args[0] : args[1]);

    let noop = function() { };

    const defaults = {
        url: (args.length === 2 && typeof url === 'string' ? url : '.'),
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

    let xhr = new XMLHttpRequest();

    let useXDR = opts.credentials === 'include' && !('withCredentials' in xhr) && 'XDomainRequest' in window;

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

    xhr.open(opts.method, opts.url);

    if (opts.dataType && dataTypes[opts.dataType.toLowerCase()]) {
        opts.headers.Accept = `${dataTypes[opts.dataType.toLowerCase()]}, */*; q=0.01`;
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
        for (let key in opts.headers) {
            xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    xhr.send(opts.data);

    return this;
}
