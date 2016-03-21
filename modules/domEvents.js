import extend from './extend';
import isPlainObject from './isPlainObject';


let DOM_EVENTS = (function () {
    var events = [];
    for (let attr in document) {
        if (attr.substring(0,2) === 'on') {
            var evt = attr.replace('on', '');
            events.push(evt);
        }
    }
    return events;
})();

let MOUSE_EVENTS = DOM_EVENTS.filter((name) => {
    return /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/.test(name);
});

let isStandard = document.addEventListener ? true : false;

let addHandler = isStandard ? 'addEventListener' : 'attachEvent';

let removeHandler = isStandard ? 'removeEventListener' : 'detachEvent';

let dispatch = isStandard ? 'dispatchEvent' : 'fireEvent';


if (!Event.prototype.preventDefault && Object.defineProperties) {
    Object.defineProperties(window.Event.prototype,
        {
            bubbles: {
                value: true,
                writable: true
            },
            cancelable: {
                value: true,
                writable: true
            },
            preventDefault: {
                value: function () {
                    if (this.cancelable) {
                        this.defaultPrevented = true;
                        this.returnValue = false;
                    }
                }
            },
            stopPropagation: {
                value: function () {
                    this.stoppedPropagation = true;
                    this.cancelBubble = true;
                }
            },
            stopImmediatePropagation: {
                value: function () {
                    this.stoppedImmediatePropagation = true;
                    this.stopPropagation();
                }
            }
        }
    );
}

function getElements(el) {
    if (!el) {
        return [];
    }

    if (typeof el === 'string') {
        return nodeListToArray(document.querySelectorAll(el));
    } else if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(el)) &&
        (typeof el.length === 'number' || Object.prototype.hasOwnProperty.call(el, 'length'))) {
        if (el.length === 0 || el[0].nodeType < 1) {
            return [];
        }

        return nodeListToArray(el);
    } else if (Array.isArray(el)) {
        return [].concat(el);
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


export function initEvent(name, props) {
    if (typeof name !== 'string') {
        props = name;
        name = props.type;
    }
    let event,
        isDomEvent = DOM_EVENTS.indexOf(name) !== -1,
        isMouseEvent = isDomEvent && MOUSE_EVENTS.indexOf(name) !== -1;

    let data = extend({
        bubbles: isDomEvent,
        cancelable: isDomEvent,
        detail: undefined
    }, props);

    if (document.createEvent) {
        event = document.createEvent(isMouseEvent  && window.MouseEvent ? 'MouseEvents' : 'Events');
        event.initEvent(name, data.bubbles, data.cancelable, data.detail);
    } else if(document.createEventObject) {
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
    if (event.substr(0,2) === 'on') {
        return isStandard ? event.substr(2) : event;
    } else {
        return isStandard ? event : ('on' + event);
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
export function on(elem, event, handler, bubbles) {
    getElements(elem).forEach((el) => {
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
export function once(elem, event, handler, bubbles) {
    getElements(elem).forEach((el) => {
        let origHandler = handler;

        handler = function(e) {
            off(el, e.type, handler);

            return origHandler.apply(el, arguments);
        };

        el[addHandler](normalizeEventName(event), handler, bubbles || false);
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
export function off(elem, event, handler) {
    getElements(elem).forEach((el) => {
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
export function trigger(elem, event, props) {
    let name = typeof event === 'string' ? event : event.type;
    event = (typeof event === 'string' || isPlainObject(event)) ? initEvent(event, props) : event;

    getElements(elem).forEach((el) => {
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof this[event.type] == 'function') {
            this[event.type]();
        } else {
            isStandard ? el[dispatch](event) : el[dispatch](normalizeEventName(name), event);
        }
    });
}

let DOMEvents = {
    on,
    once,
    off,
    trigger
};

export default DOMEvents;
