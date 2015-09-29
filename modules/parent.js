/**
 * Get the parent of an element, optionally filtered by a tag
 *
 * @param {HTMLElement} el
 * @param {String} tagname
 * @returns {HTMLElement}
 *
 * @example
 * tiny.parent(el, 'div');
 */
export default function parent(el, tagname) {
    let parentNode = el.parentNode;
    let tag = tagname ? tagname.toUpperCase() : tagname;

    if (parentNode === null) {
        return parentNode;
    }

    if (parentNode.nodeType !== 1) {
        return parent(parentNode, tag);
    }

    if (tagname !== undefined && parentNode.tagName === tag) {
        return parentNode;
    } else if (tagname !== undefined && parentNode.tagName !== tag) {
        return parent(parentNode, tag);
    } else if (tagname === undefined) {
        return parentNode;
    }
}
