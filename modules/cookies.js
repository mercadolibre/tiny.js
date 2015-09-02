import isPlainObject from './isPlainObject';

let defaults = {
    expires: '', // Empty string for session cookies
    path: '/',
    secure: false,
    domain: ''
};

let day = 60 * 60 * 24;

function get(key) {
    let collection = document.cookie.split('; '),
        value = null,
        l = collection.length;

    if (!l) {
        return value;
    }

    for (let i = 0; i < l; i++) {
        let parts = collection[i].split('='),
            name = decodeURIComponent(parts.shift());

        if (key === name) {
            value = decodeURIComponent(parts.join('='));
            break;
        }
    }

    return value;
}

// Then `key` contains an object with keys and values for cookies, `value` contains the options object.
function set(key, value, options) {
    options = typeof options ==='object' ? options : { expires: options };

    let expires = options.expires != null ? options.expires : defaults.expires;

    if (typeof expires === 'string' && expires !== '') {
        expires = new Date(expires);
    } else if (typeof expires === 'number') {
        expires = new Date(+new Date + (1000 * day * expires));
    }

    if (expires && 'toGMTString' in expires) {
        expires = ';expires=' + expires.toGMTString();
    }

    let path = ';path=' + (options.path || defaults.path);

    let domain = options.domain || defaults.domain;
    domain = domain ? ';domain=' + domain : '';

    let secure = options.secure || defaults.secure ? ';secure' : '';

    if (typeof value == 'object') {
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
    let exist = get('__') === '_';
    remove('__');

    return exist;
}

let cookies = {
    get,
    set,
    remove,
    isEnabled
};

export default cookies;

/*
 * Escapes only characters that are not allowed in cookies
 */
function encodeCookie(value) {
    return String(value).replace(/[,;"\\=\s%]/g, (character) => {
        return encodeURIComponent(character);
    });
}
