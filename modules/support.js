let support = {
    /**
     * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
     *
     * @static
     * @type {Boolean|Object}
     * @example
     * if (tiny.support.transition) {
         *     // Some code here!
         * }
     */
    transition: transitionEnd(),

    /**
     * Verify that CSS Animations are supported (or any of its browser-specific implementations).
     *
     * @static
     * @type {Boolean|Object}
     * @example
     * if (tiny.support.animation) {
         *     // Some code here!
         * }
     */
    animation: animationEnd(),

    /**
     * Checks is the User Agent supports touch events.
     * @type {Boolean}
     * @example
     * if (tiny.support.touch) {
         *     // Some code here!
         * }
     */
    touch: 'ontouchend' in document,

    /**
     * Checks is the User Agent supports custom events.
     * @type {Boolean}
     * @example
     * if (tiny.support.customEvent) {
         *     // Some code here!
         * }
     */
    customEvent: (() => {
        // TODO: find better solution for CustomEvent check
        try {
            // IE8 has no support for CustomEvent, in IE gte 9 it cannot be
            // instantiated but exist
            new CustomEvent(name, {
                detail: {}
            });
            return true;
        } catch (e) {
            return false;
        }
    })()
};

export default support;

/**
 * Checks for the CSS Transitions support (http://www.modernizr.com/)
 *
 * @function
 * @private
 */
function transitionEnd() {
    let el = document.createElement('tiny');

    let transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
    };

    for (let name in transEndEventNames) {
        if (transEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
            return {
                end: transEndEventNames[name]
            };
        }
    }

    return false;
}

/**
 * Checks for the CSS Animations support
 *
 * @function
 * @private
 */
function animationEnd() {
    let el = document.createElement('tiny');

    let animEndEventNames = {
        WebkitAnimation : 'webkitAnimationEnd',
        MozAnimation    : 'animationend',
        OAnimation      : 'oAnimationEnd oanimationend',
        animation       : 'animationend'
    };

    for (let name in animEndEventNames) {
        if (animEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
            return {
                end: animEndEventNames[name]
            };
        }
    }

    return false;
}
