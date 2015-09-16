/**
 * Get the current vertical and horizontal positions of the scroll bars.
 *
 * @memberof tiny
 * @returns {{left: (Number), top: (Number)}}
 *
 * @example
 * tiny.scroll().top;
 */
export default function scroll() {
    return {
        'left': window.pageXOffset || document.documentElement.scrollLeft || 0,
        'top': window.pageYOffset || document.documentElement.scrollTop || 0
    };
}
