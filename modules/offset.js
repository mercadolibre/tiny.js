import css from './css';
import scroll from './scroll';

/**
 * Get the current offset of an element.
 *
 * @param {HTMLElement} el A given HTMLElement.
 * @returns {{left: Number, top: Number}}
 *
 * @example
 * tiny.offset(el);
 */
export default function offset(el) {
    let rect = el.getBoundingClientRect(),
        fixedParent = getFixedParent(el),
        currentScroll = scroll(),
        offset = {
            'left': rect.left,
            'top': rect.top
        };

    if (css(el, 'position') !== 'fixed' && fixedParent === null) {
        offset.left += currentScroll.left;
        offset.top += currentScroll.top;
    }

    return offset;
}

/**
 * Get the current parentNode with the 'fixed' position.
 *
 * @private
 * @param {HTMLElement} el A given HTMLElement.
 *
 * @returns {HTMLElement}
 */
function getFixedParent (el) {
    let currentParent = el.offsetParent,
        parent;

    while (parent === undefined) {

        if (currentParent === null) {
            parent = null;
            break;
        }

        if (css(currentParent, 'position') !== 'fixed') {
            currentParent = currentParent.offsetParent;
        } else {
            parent = currentParent;
        }
    }

    return parent;
}
