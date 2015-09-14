const isClassList = !!document.body.classList;

/**
 * Adds the specified class to an element
 *
 * @param el {HTMLElement}
 * @param className {String}
 *
 * @example
 * tiny.addClass(document.body, 'tiny-example');
 */
export function addClass (el, className) {
    if (isClassList) {
        el.classList.add(className);
    } else {
        el.setAttribute('class', el.getAttribute('class') + ' ' + className);
    }
}

/**
 * Remove a single class from an element
 *
 * @param el {HTMLElement}
 * @param className {String}
 *
 * @example
 * tiny.removeClass(document.body, 'tiny-example');
 */
export function removeClass (el, className) {
    if (isClassList) {
        el.classList.remove(className);
    } else {
        el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
    }
}

/**
 * Determine whether is the given class is assigned to an element
 * @param el {HTMLElement}
 * @param className {String}
 * @returns {Boolean}
 *
 * @example
 * tiny.hasClass(document.body, 'tiny-example');
 */
export function hasClass (el, className) {
    var exist;
    if (isClassList) {
        exist = el.classList.contains(className);
    } else {
        exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
    return exist;
}

let classList = {
    addClass,
    removeClass,
    hasClass
};

export default classList;
