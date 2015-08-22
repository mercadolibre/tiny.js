import clone from './modules/clone';
import extend from './modules/extend';
import inherits from './modules/inherits';
import EventEmitter from './modules/eventEmitter';
import request from './modules/request';
import isPlainObject from './modules/isPlainObject';
import { support } from './modules/support';
import classList from './modules/classList';
import { cookies } from './modules/cookies';

let tiny = {
    clone,
    extend,
    inherits,
    EventEmitter,
    request,
    isPlainObject,
    support,
    classList,
    cookies
};

if (typeof window !== 'undefined') {
    window.tiny = tiny;
}

export default tiny;
