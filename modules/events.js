import support from './support';
import './pointerEvents';

const supportsMouseEvents = !!window.MouseEvent;

/**
 * Every time Chico UI needs to inform all visual components that layout has
 * been changed, it emits this event.
 *
 * @constant
 * @type {String}
 */
export const onlayoutchange = 'layoutchange';

/**
 * Equivalent to 'resize'.
 * @constant
 * @type {String}
 */
export const onresize = 'resize';

/**
 * Equivalent to 'scroll'.
 * @constant
 * @type {String}
 */
export const onscroll = 'scroll';

/**
 * Equivalent to 'pointerdown' or 'mousedown', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerdown | Pointer Events W3C Recommendation
 */
export const onpointerdown = supportsMouseEvents ? 'pointerdown' : 'mousedown';

/**
 * Equivalent to 'pointerup' or 'mouseup', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerup | Pointer Events W3C Recommendation
 */
export const onpointerup = supportsMouseEvents ? 'pointerup' : 'mouseup';

/**
 * Equivalent to 'pointermove' or 'mousemove', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointermove | Pointer Events W3C Recommendation
 */
export const onpointermove = supportsMouseEvents ? 'pointermove' : 'mousemove';

/**
 * Equivalent to 'pointertap' or 'click', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#list-of-pointer-events | Pointer Events W3C Recommendation
 */
export const onpointertap = (support.touch && supportsMouseEvents) ? 'pointertap' : 'click';

/**
 * Equivalent to 'pointerenter' or 'mouseenter', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerenter | Pointer Events W3C Recommendation
 */
export const onpointerenter = supportsMouseEvents ? 'pointerenter' : 'mouseenter';

/**
 * Equivalent to 'pointerleave' or 'mouseleave', depending on browser capabilities.
 *
 * @constant
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerleave | Pointer Events W3C Recommendation
 */
export const onpointerleave = supportsMouseEvents ? 'pointerleave' : 'mouseleave';

/**
 * The DOM input event that is fired when the value of an <input> or <textarea>
 * element is changed. Equivalent to 'input' or 'keydown', depending on browser
 * capabilities.
 *
 * @constant
 * @type {String}
 */
export const onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';
