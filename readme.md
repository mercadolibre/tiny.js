# Tiny

> A JavaScript utility library oriented to real world tasks.

## Purpose

Tiny aims to stay small and simple, while powerful and really useful.

Inspired by jQuery and Underscore, but using concepts from [You might not need jQuery](http://youmightnotneedjquery.com/) and the power of ES6 (ES2015).

Methods are implemented individually and not as part of a whole.

## Installation

There are multiple ways to use Tiny.

### Inline resource (recommended)

Grab [the distributable code](https://github.com/mercadolibre/tiny.js/blob/master/dist/tiny.min.js) and embed into a `<script>` tag just before the `</body>` tag.

### Module

Use NPM or Bower and include Tiny as part of the build process.

```shell
npm install mercadolibre/tiny.js
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

**[WIP]**

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

**See the [external module](https://www.npmjs.com/package/events) and the [docs](https://nodejs.org/api/events.html#events_class_events_eventemitter) for a complete reference.**

### `tiny.DOMEvents`

**[WIP]**

- `on()`:
- `off()`:
- `once()`:
- `trigger()`:


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
- `key`: **[WIP]**
- `value`: **[WIP]**

### `tiny.ajax(url, settings)`

Performs an asynchronous HTTP (Ajax) request.

- `url`: type `String`. The URL to which the request is sent.
- `settings`: type `Object`. Optional.
    - `cache`: type `Boolean`. If set to `false`, it will force requests not to be cached by the browser. Default: `true`.
    - `data`: **[WIP]**
    - `headers`: **[WIP]**
    - `context`: **[WIP]**
    - `dataType`: **[WIP]**
    - `method`: **[WIP]**
    - `success`: **[WIP]**
    - `error`: **[WIP]**
    - `complete`: **[WIP]**
    
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

### `tiny.support`

Boolean values to determine which features are available on the browser.

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

**[WIP]**

- `get`:
- `set`:
- `remove`:
- `isEnabled`:


### `tiny.scroll`

Get the current vertical and horizontal positions of the scroll bars.

**[WIP]**


### `tiny.offset(el)`

Get the current offset of an element.

- `el`: An `HTMLElement`

**[WIP]**



## Maintenance
Oleh Burkhay (UX Front-End), and [contributors](https://github.com/mercadolibre/tiny.js/graphs/contributors).

## TO-DO
[See the issue tracker](https://github.com/mercadolibre/tiny.js/issues).

## Browser support
Tested on IE8+ and major browsers.
