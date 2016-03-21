import clone from './modules/clone';
import extend from './modules/extend';
import inherits from './modules/inherits';
import EventEmitter from './modules/eventEmitter';
import ajax from './modules/ajax';
import jcors from './modules/jcors';
import isPlainObject from './modules/isPlainObject';
import classList from './modules/classList';
import cookies from './modules/cookies';
import DOMEvents from './modules/domEvents';

let tiny = {
    clone,
    extend,
    inherits,
    EventEmitter,
    ajax,
    jcors,
    isPlainObject,
    addClass: classList.addClass,
    removeClass: classList.removeClass,
    hasClass: classList.hasClass,
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
