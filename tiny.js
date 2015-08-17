import clone from './modules/clone';
import extend from './modules/extend';
import request from './modules/request';
import isPlainObject from './modules/isPlainObject';
import { support } from './modules/support';
import classList from './modules/classList';

let tiny = {
    clone,
    extend,
    request,
    isPlainObject,
    support,
    classList
};

let root = typeof self === 'object' && self.self === self && self ||
    typeof global === 'object' && global.global === global && global ||
    this;

root.tiny = tiny;

export default tiny;
