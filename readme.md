# Tiny

[![npm version](https://img.shields.io/npm/v/tiny.js.svg)](https://www.npmjs.com/package/tiny.js)
![Bower version](https://img.shields.io/bower/v/tiny.svg)
[![Build Status](https://travis-ci.org/mercadolibre/tiny.js.svg?branch=master)](https://travis-ci.org/mercadolibre/tiny.js)
[![devDependency Status](https://img.shields.io/david/dev/mercadolibre/tiny.js.svg)](https://david-dm.org/mercadolibre/tiny.js#info=devDependencies)

> A JavaScript utility library oriented to real world tasks.


## Purpose

Tiny aims to stay small and simple, while powerful and really useful.

Inspired by jQuery and Underscore, but using concepts from [You might not need jQuery](http://youmightnotneedjquery.com/) and the power of ES6 (ES2015).

Methods are implemented individually and not as part of a whole.


## Installation

There are multiple ways to use Tiny.


### Inline resource (recommended)

Grab [the distributable code](https://github.com/mercadolibre/tiny.js/blob/master/dist/tiny.min.js) and embed into a `<script>` tag just before the closing `</body>` tag.


### Module

Use NPM or Bower and include Tiny.js as a part of the build process.

```shell
npm install tiny.js
```

```shell
bower install tiny
```


### From CDN

```html
<script src="//ui.mlstatic.com/chico/tiny/x.x.x/tiny.min.js"></script>
```

Check [releases](https://github.com/mercadolibre/tiny.js/releases) to find the latest version number.


## API


### `tiny.clone(obj)`

Creates a copy of the provided object.

- `obj`: type `Object`. The object to be cloned.

Returns an `Object`.


### `tiny.extend([deep,] target, ...sources)`

Copy all of the properties of the sources to the target object and returns the 
  resulting object. The last source will override properties of the same name in
  previous object.


### `tiny.inherits(obj, superConstructor)`

Inherits the prototype methods from one constructor into another.

The parent will be accessible through the `obj.super_` property.

Fully compatible with standard Node.js `inherits`.

- `obj`: type `Object`. An object that will have the new members.
- `superConstructor`: type `Function`. The constructor Class.


### `tiny.isPlainObject(obj)`

Validates for a valid Object.

- `obj`: type `Object`. The object to be validated.

Returns a `Boolean`.


### `tiny.EventEmitter`

Node's event emitter.

The most relevant methods:

- `on()`
- `once()`
- `emmit()`

**[WIP]**

**See the [external module](https://www.npmjs.com/package/events) and the
  [docs](https://nodejs.org/api/events.html#events_class_events_eventemitter) 
  for a complete reference.**


### `tiny.DOMEvents`


#### `tiny.on(elem, event, handler, bubbles)`

Attach an event handler for an event to the selected elements.

- `elem`: type `HTMLElement|String`. An HTMLElement or a CSS selector to add listener to
- `event`: type `String`. Event name.
- `handler`: type `Function`. Event handler function.
- `bubbles`: type `Boolean`. Whether or not to be propagated to outer elements.

Example:
```js
tiny.on('.btn', 'click', function(e){ /* ... */ });
tiny.on(document.querySelector('button'), 'click', function(e){ /* ... */ });
```

#### `tiny.off(elem, event, handler)`

Remove an event handler from the element

- `elem`: type `HTMLElement|String`. An HTMLElement or a CSS selector to remove listener from
- `event`: type `String`. Event name.
- `handler`: type `Function`. Event handler function to remove.

Example:
```js
tiny.off('.btn', 'click', fn);
tiny.off(document.querySelector('button'), 'click', fn);
```

#### `tiny.once(elem, event, handler, bubbles)`

Attach a handler to an event for the element that executes *only* once.

- `elem`: type `HTMLElement|String`. An HTMLElement or a CSS selector to add listener to
- `event`: type `String`. Event name.
- `handler`: type `Function`. Event handler function.
- `bubbles`: type `Boolean`. Whether or not to be propagated to outer elements.

Example:
```js
tiny.once('.btn', 'click', fn);
tiny.once(document.querySelector('button'), 'click', fn);
```

#### `trigger(elem, event, props)`

Fires an event for the given element.

- `elem`: type `HTMLElement|String`. An HTMLElement or a CSS selector to add listener to
- `event`: type `String|Event`. Event name or an event object.

Example:
```js
tiny.trigger('.btn', 'click');
tiny.trigger(document.querySelector('button'), 'click');
tiny.trigger(document.body, 'layoutchange');
```


### `tiny.addClass(el, className)`

Adds the specified class to an element

- `el`: An `HTMLElement`
- `className`: `String` The class that should be added to an element

Example:
```js
tiny.addClass(document.body, 'example');
```


### `tiny.removeClass(el, className)`

Removes the specified class from an element

- `el`: An `HTMLElement`
- `className`: `String` The class that should be removed

Example:
```js
tiny.removeClass(document.body, 'example');
```


### `tiny.hasClass(el, className)`

Determines whether is the given class is assigned to an element

- `el`: An `HTMLElement`
- `className`: `String` The class that should be adden to an element

Example:
```js
tiny.hasClass(document.body, 'example'); // => false
```


*Note*: `tiny.addClass`, `tiny.removeClass` and `tiny.hasClass` are the methods
  of a single module named `classList`. It can be imported entirely as
  `import classList from 'tiny.js/modules/classList'` or as a separated methods
  `import {addClass, removeClass, hasClass} from 'tiny.js/modules/classList'`


### `tiny.parent(el, [, tagname])`

Get the parent of an element, optionally filtered by a tag

- `el`: An `HTMLElement`
- `className`: `String` The tag name of the parent to look for


### `tiny.next(el)`

Get the next element sibling 

- `el`: An `HTMLElement`


### `tiny.css(el, key[, value])`

Get the value of a computed style for the first element in set of
  matched elements or set one or more CSS properties for every matched element.
  
- `el`: An `HTMLElement` or a valid CSS selector.
- `key`: A CSS property name. Can be an object of property-value pairs to set.
- `value`: A value to set for the property.

```js
// Setter
tiny.css(el, 'width', 'auto');
tiny.css(el, {
  width: 'auto',
  height: 'auto'
});

// Getter
tiny.css(el, 'width');
```

### `tiny.ajax(url, settings)`

Performs an asynchronous HTTP (Ajax) request.

- `url`: type `String`. The URL to which the request is sent.
- `settings`: type `Object`. Optional.
    - `cache`: type `Boolean`. If set to `false`, it will force requests not to be cached by the browser. Default: `true`
    - `data`: type `String` A data that should be passed with xhr, currently sould be formatted as query string like a `a=b&c=d`. As an alternative `FormData` can be passed
    - `headers`: type `Object` A list of additional headers, for example `{ 'X-Auth': 'auth-token' }`
    - `context`: type `Object` Every callback will be called in context of `settings.context` or `window` if not provided
    - `dataType`: type `String` A mime type, [json,html,text]
    - `method`: type `String` A valid HTTP method, [GET|POST|PUT|DELETE]
    - `credentials`: type `Sting` Use the `"include"` value to send cookies in a CORS request. Default is `"omit"`
    - `success`: type `Function` A success callback that receives response data, status and xhr object.
    - `error`: type `Function` An error callback that receives xhr, status and error object.
    - `complete`: A success callback that receives response data, status and xhr object.

Example:
```js
tiny.ajax(
    "http://xxxx/data.json",
    success: fn,
    dataType: "json",
    credentials: "include"
);
```

### `tiny.jsonp(url, settings, callback)`

Performs a JSONP request

- `url`: type `String`. The URL of the requested resource.
- `settings`: type `Object`. Optional.
    - `prefix`: type `String`. Prefix for the callback functions that handle JSONP responses. Default: `"__jsonp"`
    - `name`: type `String|Function`. A name of the callback function that handle JSONP response. 
        Can be a function that receives the prefix and the request id (increment). Default: `settings.prefix + increment`
    - `param`: type `String`. A name of the query string parameter. Default: `"callback"`
    - `timeout`: type `Number`. How long after the request until a timeout error will occur. Default: `15000`
    - `success`: type `Function`. Success callback function.
    - `error`: type `Function`. Error callback function.


### `tiny.jcors(...args)`
Tiny loader of javascript sources using CORS. Load scripts asynchronously in parallel maintaining the execution order.
See [jcors-loader](https://github.com/pablomoretti/jcors-loader) for complete documentation.

Example:
```js
tiny.jcors(
    "http://xxxx/jquery.min.js",
    function() {
        $("#demo").html("jQuery Loaded");
    },
    "http://xxxx/jquery.cookie.js",
    function() {  
        $.cookie('not_existing'); 
    }
);
```


### `tiny.support`

Boolean values to determine which features are available in the browser.


#### `tiny.support.animation`

Verifies that CSS Animations are supported (or any of its browser-specific implementations).

Example:
```js
if (tiny.support.animation) {
    // Some code here!
}
```


#### `tiny.support.touch`

Checks is the User Agent supports touch events.

```js
if (tiny.support.touch) {
    // Some code here!
}
```


#### `tiny.support.customEvent`

Checks is the User Agent supports custom events.

```js
if (tiny.support.customEvent) {
    // Some code here!
}
```


### `tiny.cookies`

A tiny JavaScript API for handling cookies

#### `tiny.cookies.set(key, value, options)`

Create cookie

- `key`: type `String`. A cookie name.
- `value`: type `String|Object`. A cookie value.
- `options`: type `Object`
  - `expires`: type `Numbre|String`. Define when the cookie will be removed.
  - `path`: type `String`. A String indicating the path where the cookie is visible.
  - `domain`: type `string`. A valid domain where the cookie should be visible.
  - `secure`: type `Boolean`. Indicate if the cookie transmission requires a secure protocol (https).

Example:
```js
tiny.cookies.set('ID', 1); // Create session cookie
tiny.cookies.set('ID', 2, { expires: 14 }); // Creates a cookie that expires in 14 days
```


#### `tiny.cookies.get(key)`

Read cookie

- `key`: type `String` A cookie name to get.

Example:
```js
var user_id = tiny.cookies.get('ID');
```

#### `tiny.cookies.remove(key)`

Delete cookie

- `key`: type `String` A cookie name to delete.

Example:
```js
tiny.cookies.remove('ID');
```


#### `tiny.cookies.isEnabled()`

Check if the cookie is supported by the browser and enabled

Example:
```javascript
if (tiny.cookies.isEnabled()) {
  showCookiesPolicy();
}
```


### `tiny.scroll()`

Get the current vertical and horizontal positions of the scroll bars. Returns an object with `left` and `top` values.

Example:
```js
tiny.scroll(); // { left: 0, top: 1200 }
```


### `tiny.offset(el)`

Get the current offset of an element. Returns an object with `left` and `top` values.

- `el`: An `HTMLElement`

Example:
```js
tiny.offset(document.querySelector('header')); // { left: 0, top: 20 }
```


## Maintenance
Oleh Burkhay (UX Front-End), and [contributors](https://github.com/mercadolibre/tiny.js/graphs/contributors).


## TO-DO
[See the issue tracker](https://github.com/mercadolibre/tiny.js/issues).


## Browser support
Tested on IE8+ and major browsers.
