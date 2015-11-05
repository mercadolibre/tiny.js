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

                success(result, xhr, opts);
            } else {
                error(new Error(xhr.statusText), 'error', xhr, opts);
            }

            return;
        }
    };

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

    for (let key in opts.headers) {
        xhr.setRequestHeader(key, opts.headers[key]);
    }

    xhr.send(opts.data);

    return this;
}
