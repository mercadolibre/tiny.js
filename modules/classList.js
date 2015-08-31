/**
 * Add or remove class
 *
 * @name classList
 * @memberof tiny
 * @param {HTMLElement} el A given HTMLElement.
 * @see Based on: <a href="http://youmightnotneedjquery.com/" target="_blank">http://youmightnotneedjquery.com/</a>
 *
 * @example
 * tiny.classList(document.body).add('ch-example');
 */
export default function classList(el) {
    const isClassList = el.classList;

    return {
        add: function add(className) {
            if (isClassList) {
                el.classList.add(className);
            } else {
                el.setAttribute('class', el.getAttribute('class') + ' ' + className);
            }
        },
        remove: function remove(className) {
            if (isClassList) {
                el.classList.remove(className);
            } else {
                el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
            }
        },
        contains: function contains(className) {
            var exist;
            if (isClassList) {
                exist = el.classList.contains(className);
            } else {
                exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
            return exist;
        }
    };
}
