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
// TODO: Review the possibility of using the pointer events for IE8

let focusinSupported = DOM_EVENTS.indexOf('focusin') !== -1;

let focus = { focus: 'focusin', blur: 'focusout' };

//let eventPrefix = document.addEventListener ? '' : 'on';

// Element unique ID
let _euid = 1;

let handlers = {};

// Element unique ID generator
function euid(el) {
    return el._euid || (el._euid = _euid++);
}

function returnTrue() {
    return true;
}

function returnFalse() {
    return false;
}

function parse(event) {
    let parts = ('' + event).split('.');
    return {
        e: parts[0],
        ns: parts.slice(1).sort().join(' ')
    };
}

function getElements(el) {
    if (typeof el === 'string') {
        return [].slice.call(document.querySelectorAll(el));
    } else if (el.length) {
        [].slice.call(el);
    } else {
        return [el];
    }
}

function findHandlers(el, event, fn, selector) {
    event = parse(event);

    if (event.ns) {
        var matcher = new RegExp('(?:^| )' + event.ns.replace(' ', ' .* ?') + '(?: |$)');
    }
    return (handlers[euid(el)] || []).filter(function(handler) {
        return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || euid(handler.fn) === euid(fn))
            && (!selector || handler.sel == selector);
    });
}

function createProxy(event) {
    var key, proxy = { originalEvent: event };
    for (key in event)
        if (event.hasOwnProperty(key) && !/^([A-Z]|returnValue$|layer[XY]$)/.test(key) && event[key] !== undefined) {
            proxy[key] = event[key];
        }

    return compatible(proxy, event);
}

let eventMethods = {
    preventDefault: 'isDefaultPrevented',
    stopImmediatePropagation: 'isImmediatePropagationStopped',
    stopPropagation: 'isPropagationStopped'
};

function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
        if (!source) {
            source = event;
        }

        for (let name in eventMethods) {
            let predicate = eventMethods[name],
                sourceMethod = source[name];

            event[name] = function() {
                this[predicate] = returnTrue;
                return sourceMethod && sourceMethod.apply(source, arguments);
            };
            event[predicate] = returnFalse;
        }

        /*
         event.stopImmediatePropagation = function () {
            this.isImmediatePropagationEnabled = false;
            this.cancelBubble = true;
         };
        */

        if (typeof source.defaultPrevented !== 'undefined' ? source.defaultPrevented :
                'returnValue' in source ? source.returnValue === false :
                source.getPreventDefault && source.getPreventDefault()) {
            event.isDefaultPrevented = returnTrue;
        }

    }
    return event;
}

function eventCapture(handler, captureSetting) {
    return handler.del &&
        (!focusinSupported && (handler.e in focus)) ||
        !!captureSetting;
}

function closest(el, selector) {
    // TODO: Add IE8 support
    return el.closest ?
        el.closest(selector) :
        (function (selector) {
            while (el) {
                if ((el.matches ||
                    el.mozMatchesSelector ||
                    el.msMatchesSelector ||
                    el.oMatchesSelector ||
                    el.webkitMatchesSelector).call(el, selector)) {
                    break;
                }

                el = el.parentElement;
            }

            return el;
        })(selector);
}

function add(el, types, fn, data, selector, delegator) {
    let id = euid(el),
        elHandlers = (handlers[id] || (handlers[id] = []));

    types.split(/\s/).forEach(function(event) {
        if (event === 'ready') {
            if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')) {
                setTimeout(fn, 1);
            }

            // TODO: Handle well an IE8
            return document.addEventListener ?
                document.addEventListener('DOMContentLoaded', fn, false) :
                window.attachEvent('onload', fn);
        }

        let handler   = parse(event);
        handler.fn    = fn;
        handler.sel   = selector;

        // emulate mouseenter, mouseleave
        /*
        if (handler.e in hover) fn = function(e) {
            var related = e.relatedTarget;
            if (!related || (related !== this && !$.contains(this, related)))
                return handler.fn.apply(this, arguments);
        }
        */
        handler.del   = delegator;

        let callback  = delegator || fn;

        handler.proxy = function(e) {
            e = compatible(e);

            if (e.isImmediatePropagationStopped()) {
                return;
            }

            e.data = data;

            let result = callback.apply(el, e._args ? [e].concat(e._args) : [e]);
            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }

            return result;
        };

        handler.i = elHandlers.length;
        elHandlers.push(handler);

        if ('addEventListener' in el)
            el.addEventListener((focusinSupported && focus[handler.e]) || handler.e, handler.proxy, eventCapture(handler, false));
    });
}

function remove(el, events, fn, selector, capture) {
    var id = euid(el);

    (events || '').split(/\s/).forEach(function(event) {
        findHandlers(el, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i];
            if ('removeEventListener' in el)
                el.removeEventListener((focusinSupported && focus[handler.e]) || handler.e, handler.proxy, eventCapture(handler, capture));
        });
    });
}

export function initEvent(name, props) {
    if (typeof name !== 'string') {
        props = name;
        name = props.type;
    }
    let event,
        isDomEvent = DOM_EVENTS.indexOf(name) !== -1;

    let data = extend({
        bubbles: isDomEvent,
        cancelable: isDomEvent,
        detail: undefined
    }, props);

    /*if(document.createEvent) {
        event = document.createEvent('MouseEvents');
        event.initEvent(name, true, false);
    } else if(document.createEventObject) {
        event = document.createEventObject();
    }*/

    event = document.createEvent(isDomEvent && MOUSE_EVENTS.indexOf(name) !== -1 ? 'MouseEvents' : 'Events');
    event.initEvent(name, data.bubbles, data.cancelable, data.detail);

    return compatible(event);
}

export function on(elem, types, selector, data, fn, one) {
    if (data == null && fn == null) {
        // ( elem, types, fn )
        fn = selector;
        data = selector = undefined;
    } else if (fn == null) {
        if (typeof selector === 'string') {
            // ( elem, types, selector, fn )
            fn = data;
            data = undefined;
        } else {
            // ( elem, types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }
    if (fn === false) {
        fn = returnFalse;
    }

    return  getElements(elem).forEach(function(el) {
        let origFn,
            delegator;

        if (one === 1) {
            origFn = fn;
            fn = function(event) {
                off(el, event.type, fn);
                return origFn.apply(el, arguments);
            };
        }

        if (selector) {
            delegator = function(e) {
                let evt,
                    match = closest(e.target, selector);

                if (match && match !== el) {
                    evt = extend(createProxy(e), {
                        currentTarget: match,
                        liveFired: el
                    });

                    return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
                }
            };
        }
        add(el, types, fn, data, selector, delegator);
    });
}

export function one(elem, events, selector, data, callback) {
    return on(elem, events, selector, data, callback, 1);
}

export function off(elem, event, selector, callback) {
    if (typeof selector !== 'string' && typeof callback !== 'function' && callback !== false) {
        callback = selector;
        selector = undefined;
    }

    if (callback === false) {
        callback = returnFalse;
    }

    getElements(elem).forEach(function(el) {
        remove(el, event, callback, selector);
    });
}

export function trigger(elem, event, args) {
    event = (typeof event === 'string' || isPlainObject(event)) ? initEvent(event) : compatible(event);
    event._args = args;

    getElements(elem).forEach(function(el){
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof this[event.type] == 'function') {
            this[event.type]();
        }
        // items in the collection might not be DOM elements
        else if ('dispatchEvent' in el) {
            el.dispatchEvent(event);
        }
        // TODO: Don't forget about IE8
        else {
            triggerHandler(el, event, args);
        }
    });
}

/**
 * Triggers event handlers on current element just as if an event occurred
 * but doesn't trigger an actual event and doesn't bubble
 *
 * @param elem
 * @param event
 * @param args
 */
export function triggerHandler (elem, event, args) {
    let e;

    getElements(elem).forEach(function(el) {
        e = createProxy(typeof event === 'string' ? initEvent(event) : event);
        e._args = args;
        e.target = el;

        findHandlers(el, event.type || event).forEach(function(handler) {
            handler.proxy(e);
            if (e.isImmediatePropagationStopped()) {
                return false;
            }
        });
    });
}

export var domEvents = {
    Event: initEvent,
    on,
    one,
    off,
    trigger,
    triggerHandler
};
