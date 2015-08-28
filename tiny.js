import clone from './modules/clone';
import extend from './modules/extend';
import inherits from './modules/inherits';
import EventEmitter from './modules/eventEmitter';
import ajax from './modules/ajax';
import isPlainObject from './modules/isPlainObject';
import { support } from './modules/support';
import classList from './modules/classList';
import { cookies } from './modules/cookies';
import { DOMEvents } from './modules/domEvents';

let tiny = {
    clone,
    extend,
    inherits,
    EventEmitter,
    ajax,
    isPlainObject,
    support,
    classList,
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
