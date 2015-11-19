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
export default function css(elem, key, value) {
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
        setter = function(el) {
            el.style[key] = value;
        };
    } else if (typeof key === 'object') {
        setter = function(el) {
            Object.keys(key).forEach(function(name) {
                el.style[name] = key[name];
            });
        };
    }

    for (let i = 0; i < length; i++) {
        setter(elements[i]);
    }
}

function getElStyle(el, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
        // IE
    } else {
        // Turn style name into camel notation
        prop = prop.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });
        return el.currentStyle[prop];
    }
}

function getElements(el) {
    if (!el) {
        return [];
    }

    if (typeof el === 'string') {
        return nodeListToArray(document.querySelectorAll(el));
    } else if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(el)) &&
        (typeof el.length === 'number' || Object.prototype.hasOwnProperty.call(el, 'length')) &&
         el.length > 0 && el[0].nodeType > 0) {

        return nodeListToArray(el);
    } else {
        return [el];
    }
}

function nodeListToArray(elements) {
    let i = 0,
        length = elements.length,
        arr = [];

    for (; i < length; i++) {
        arr.push(elements[i]);
    }

    return arr;
}
