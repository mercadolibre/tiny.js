import EventEmitter from 'events';

/**
 * Inherits the prototype methods from one constructor into another.
 * The parent will be accessible through the obj.super_ property. Fully
 * compatible with standard node.js inherits.
 *
 * @memberof tiny
 * @param {Function} obj An object that will have the new members.
 * @param {Function} superConstructor The constructor Class.
 * @returns {Object}
 * @exampleDescription
 *
 * @example
 * tiny.inherits(obj, parent);
 */
export default EventEmitter;
