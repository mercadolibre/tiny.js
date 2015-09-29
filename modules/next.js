/**
 * IE8 safe method to get the next element sibling
 *
 * @memberof tiny
 * @param {HTMLElement} el A given HTMLElement.
 * @returns {HTMLElement}
 *
 * @example
 * tiny.next(el);
 */
export default function next(element) {
    function next(el) {
        do {
            el = el.nextSibling;
        } while (el && el.nodeType !== 1);

        return el;
    }

    return element.nextElementSibling || next(element);
}
