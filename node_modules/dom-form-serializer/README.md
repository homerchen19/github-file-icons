# DOM Form Serializer

[![Build Status](https://secure.travis-ci.org/jefersondaniel/dom-form-serializer.png?branch=master)](http://travis-ci.org/jefersondaniel/dom-form-serializer)
[![npm version](https://badge.fury.io/js/dom-form-serializer.svg)](https://www.npmjs.com/package/dom-form-serializer)
[![npm](https://img.shields.io/npm/dm/dom-form-serializer.svg)](https://www.npmjs.com/package/dom-form-serializer)

Serialize forms fields into a JSON representation.

## About

This project is a fork of [Backbone.Syphon](https://github.com/marionettejs/backbone.syphon) that has no dependency on backbone and jquery. It aims to make it easy to serialize the fields of a form into a simple JSON object.

### Installing

```
npm install dom-form-serializer
```

## Basic Usage

### Serialize

```js
var serialize = require('dom-form-serializer').serialize
serialize(document.querySelector('#form'))
```

### Keys Retrieved By "name" Attribute

The default behavior for serializing fields is to use the field's "name" attribute as the key in the serialized object.

```html
<form id="form">
  <input name="a">
  <select name="b"></select>
  <textarea name="c"></textarea>
</form>
```

```js
serialize(document.querySelector('#form'))

// will produce =>

{
  a: "",
  b: "",
  c: ""
}
```

### Checkboxes

By default, a checkbox will return a boolean value signifying whether or not it is checked.

```html
<form id="form">
  <input type="checkbox" name="a">
  <input type="checkbox" name="b" checked>
  <input type="checkbox" name="c" indeterminate>
</form>
```

```js
serialize(document.querySelector('#form'));

// will produce =>

{
  a: false,
  b: true,
  c: null
}
```

### Radio Button Groups

Radio button groups (grouped by the input element "name" attribute) will produce a single value, from the selected
radio button.

```html
<form id="form">
  <input type="radio" name="a" value="1">
  <input type="radio" name="a" value="2" checked>
  <input type="radio" name="a" value="3">
  <input type="radio" name="a" value="4">
</form>
```

```js
serialize(document.querySelector('#form'))

// will produce =>

{
  a: "2"
}
```

This behavior can be changed by registering a different set of Key Extractors, Input Readers, and Key Assignment
Validators. See the tests
[serialize.spec.js](https://github.com/jefersondaniel/dom-form-serializer/blob/master/test/serialize.spec.js) for more examples on these.

### Drop Down Lists

Serializing drop down lists (`<select>`) will result in value of the selected option.


```html
<form id="form">
  <select name="foo">
    <option value="bar"></option>
  </select>
</form>
```


```js
serialize(document.querySelector('#form'))

// will produce =>

{
  foo: "bar"    
}
```

### Multiple Select Boxes

Serializing multiple select boxes (`<select multiple>`) will yield the selected options as an array.

```html
<form id="form">
  <select name="foo" multiple>
    <option value="foo"></option>
    <option value="bar" selected></option>
    <option value="baz" selected></option>
  </select>
</form>
```

```js
serialize(document.querySelector('#form'))

// will produce =>

{
  foo: ["bar", "baz"]    
}
```

## Basic Usage: Deserialize

You can also deserialize an object's values back into their field equivalent. It uses the same conventions and configuration as the serialization process, with the introduction of Input Writers to handle populating the fields with the values

```html
<form id="form">
  <input type="text" name="a">
  <input type="text" name="b">
</form>
```

```js
var data = {
  a: "foo",
  b: "bar"
};

deserialize(document.querySelector('#form'), data);
```

This will populate the form field elements with the correct values from the `data` parameter.

## Ignored Input Types

The following types of input are ignored, and not included in the resulting JavaScript object:

* `<input type="submit">` buttons
* `<input type="reset"`> buttons
* standard `<button>` tags

If you need to get a value from the specific button that was clicked, you can use a DOM event to listen for that element being manipulated (clicked, for example) and manually grab
the data you need.

### Ignoring Other Input Types

You can define ignored selectors using the ignoredTypes option.

```js
// ignore all <textarea> input elements
serialize(element, {ignoredTypes: ['textarea']})
```

## Serializing Nested Attributes And Field Names

`serialize` will parse nested attribute names and create a nested result object, using the Rails standard of `name="foo[bar][baz]"` by default.

```html
<form>
  <input type="text" name="foo[bar]" value="a value">
  <input type="text" name="foo[baz][quux]" value="another value">
</form>
```

will produce

```js
{
  foo: {
    bar: "a value",
    baz: {
      quux: "another value"
    }
  }
}
```

### Array Inputs

`serialize` will parse multiple inputs named after the convention `name="foo[bar][]"` into elements of the array `bar`.

```html
<form>
  <input type="checkbox" name="foo[bar][]" value="baz" checked="checked">
  <input type="checkbox" name="foo[bar][]" value="qux" checked="checked">
</form>
```

will produce

```js
{
  foo: {
    bar: ["baz", "qux"]
  }
}
```

### Custom splitters

If your keys are split by something else than the Rails Array convention (for example `name="foo.bar.quux"`), you may pass this delimiter into `serialize` using the `keySplitter` option.

```html
<form id="form">
  <input type="text" name="widget" value="wombat">
  <input type="text" name="foo.bar" value="baz">
  <input type="text" name="foo.baz.quux" value="qux">
</form>
```

```js
serialize(document.querySelector('#form'), { keySplitter: key => key.split('.') })

// will produce =>

{
  widget: "wombat",
  foo: {
    bar: "baz",
    baz: {
      quux: "qux"
    }
  }
}

```

# Acknowledgments

[Backbone.Syphon](https://github.com/marionettejs/backbone.syphon)

