import clone from './modules/clone';
import extend from './modules/extend';
import inherits from './modules/inherits';
import EventEmitter from './modules/eventEmitter';
import ajax from './modules/ajax';
import jsonp from './modules/jsonp';
import isPlainObject from './modules/isPlainObject';
import support from './modules/support';
import classList from './modules/classList';
import parent from './modules/parent';
import css from './modules/css';
import offset from './modules/offset';
import scroll from './modules/scroll';
import cookies from './modules/cookies';
import DOMEvents from './modules/domEvents';

let tiny = {
    clone,
    extend,
    inherits,
    EventEmitter,
    ajax,
    jsonp,
    isPlainObject,
    support,
    addClass: classList.addClass,
    removeClass: classList.removeClass,
    hasClass: classList.hasClass,
    parent,
    css,
    offset,
    scroll,
    cookies,
    on: DOMEvents.on,
    bind: DOMEvents.on,
    one: DOMEvents.once,
    once: DOMEvents.once,
    off: DOMEvents.off,
    trigger: DOMEvents.trigger
};

if (typeof window !== 'undefined') {
    window.tiny = tiny;
}

export default tiny;
