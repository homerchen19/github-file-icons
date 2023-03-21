# SelectorSet

An efficient data structure for matching and querying elements against a large set of CSS selectors.

## Usage

```javascript
var set = new SelectorSet();
set.add('#logo');
set.add('.post');
set.add('h1');

var el = document.createElement('h1');
set.matches(el);
// => [ { selector: 'h1' } ]

document.body.appendChild(el);
set.queryAll(document.body);
// => [ { selector: 'h1': elements: [el] } ]
```

An arbitrary `data` object can be associated with each selector to help identify matches.

```javascript
var set = new SelectorSet();

var data = function setupForm() {};
set.add('form', data);

var el = document.createElement('form');
set.matches(el);
// => [ { selector: 'form', data: setupForm } ]
```

## Installation

Available on npm as **selector-set**.

```
$ npm install selector-set
```

Alternatively you can download the single `selector-set.js` file. There are no additional dependencies.

```
$ curl -O https://raw.github.com/josh/selector-set/master/selector-set.js
```

## Use cases

### Batch find calls

Typical web apps run a bunch of `querySelector` calls on load.

```javascript
document.addEventListener('DOMContentLoaded', function() {
  var el;

  if ((el = document.querySelector('form.signup'))) {
    // ...
  }

  if ((el = document.querySelector('#sidebar'))) {
    // ...
  }

  if ((el = document.querySelector('.menu'))) {
    // ...
  }
});
```

Large numbers of `querySelectorAll` calls they are usually made on page load can be batched up for efficiency. Having them in a set also makes it convenient to rerun on changed content.

```javascript
var set = new SelectorSet();
set.add('form.signup', function(form) {
  // ...
});
set.add('#sidebar', function(sidebar) {
  // ...
});
set.add('.menu', function(menu) {
  // ...
});

document.addEventListener('DOMContentLoaded', function() {
  set.queryAll(document).forEach(function(match) {
    match.elements.forEach(function(el) {
      match.data.call(el, el);
    });
  });
});
```

### Match delegated events

Having a large number of delegated handlers on for a single event can slow it down on every dispatch. Doing one set match against an element is much faster than attempting to iterate and match every selector again and again.

```javascript
var handlers = new SelectorSet();
handlers.add('.menu', function(event) {
  // ...
});
handlers.add('.modal', function(event) {
  // ...
});

document.addEventListener(
  'click',
  function(event) {
    handlers.matches(event.target).forEach(function(rule) {
      rule.data.call(event.target, event);
    });
  },
  false
);
```

_(This is a trivialized example that doesn't handle propagated matches)_

### Apply CSS rules

For fun, we could implement CSS style matching and application in pure JS.

```javascript
var styles = new SelectorSet();
styles.add('p', {
  fontSize: '12px',
  color: 'red'
});
styles.add('p.item', {
  background: 'white'
});

// apply matching styles
styles.matches(el).forEach(function(rule) {
  for (name in rule.data) el.style[name] = rule.data[name];
});
```

Okay, you wouldn't want to ever actually do this. But consider the use case of implementing some sort of CSS property polyfill in pure JS.

## Browser Support

Chrome (latest), Safari (6.0+), Firefox (latest) and IE 9+.

The main requirement is `querySelectorAll` and some sort of `prefixMatchesSelector` support. You can support older browser versions by supplying your own fallback versions of these functions.

```javascript
// Use Sizzle's match and query functions
SelectorSet.prototype.querySelectorAll = Sizzle;
SelectorSet.prototype.matchesSelector = Sizzle.matchesSelector;

// Or use jQuery's internal Sizzle
SelectorSet.prototype.querySelectorAll = jQuery.find;
SelectorSet.prototype.matchesSelector = jQuery.find.matchesSelector;
```

Using Sizzle will also allow you to use more advanced selectors like `:first`, `:has`, `:input` that do not exist in native `querySelector`.

## Development

Clone the repository from GitHub.

```
$ git clone https://github.com/josh/selector-set
```

You'll need to have [Grunt](http://gruntjs.com) installed. If you don't have the `grunt` executable available, you can install it with:

```
$ npm install -g grunt-cli
```

Now just `cd` into the directory and install the local npm dependencies.

```
$ cd selector-set/
$ npm install
```

Use `grunt test` to run the test suite.

```
$ grunt test
Running "jshint:all" (jshint) task
>> 5 files lint free.

Running "qunit:all" (qunit) task
Testing test/test.html .....................OK
>> 100 assertions passed (50ms)

Done, without errors.
```

## Implementation

Actually matching a group of selectors against an element via `Element#matches` or `Sizzle` can actually be slow when you get to matching 100+ selectors. Real world applications tend to follow common selector patterns. This fact and the knowledge of a group of selectors ahead of time allows us to apply some optimizations.

First, selectors added to the set are quickly analyzed and indexed under a key. This key is derived from a significant part of the right most side of the selector. If the selector targets an id, the id name is used as the key. If theres a class, the class name is used and so forth. The selector is then put into a map indexed by this key. Looking up the key is constant time.

When its time to match the element against the group. The element's properties are examined for possible keys. These keys are then looked up in the mapping which returns a smaller set of selectors which then perform a full matches test against the element.

### Inspired by browsers

The grouping technique isn't a new idea. In fact, it's how WebKit and Firefox work already. In order to calculate the styles of a single element, a huge number of CSS rules need to be considered. Browsers don't just iterate over every selector and test it. That would be way too slow.

WebKit has a [`RuleSet`](https://github.com/WebKit/webkit/blob/c0885665302c752230987427d4021b6df634087d/Source/WebCore/css/RuleSet.cpp) class that very much inspired this library. Checkout it's definition of [`RuleSet::findBestRuleSetAndAdd`](https://github.com/WebKit/webkit/blob/c0885665302c752230987427d4021b6df634087d/Source/WebCore/css/RuleSet.cpp#L180-L231) to see how it groups CSS rules by selector category.

In the future I hope something like WebKit's `RuleSet` could be made directly available to the browser. Not only would be writing it in C++ be faster, having access to a real CSS parser would make it much more robust than this library's hacky regexp matchers.

### Profile

This graph compares selector-set match time to a naive loop that tests each selector every time.

![](https://f.cloud.github.com/assets/137/1523467/9370cb62-4bb6-11e3-9649-bce7f24b7042.png)

As you can see, the set-selector is mostly constant time as the number of selectors in the set grows O(1). But matching every selector every time is linear as to the number selectors O(N). There is a slight overhead to using selector-set when there are only a few selectors (<5). This is something that can be improved, but it maybe pointless to use the set if you only want to match one or two selectors.

Here is a jsPerf test matching a single element to all of the selectors on github.com.

http://jsperf.com/selectorset-match

### Custom indexes

Currently, only first class attributes like `id`, `class` and the tag name are indexed. But if you have some sort of application specific attribute you frequently use, you can write your own custom index on the attribute.

```javascript
SelectorSet.prototype.indexes.push({
  name: 'data-behavior~=',
  selector: function(sel) {
    var m;
    if ((m = sel.match(/\[data-behaviors~=(\w+)\]/))) {
      return m[1];
    }
  },
  element: function(el) {
    var behaviors = el.getAttribute('data-behavior');
    if (behaviors) {
      return behaviors.split(/\s+/);
    }
  }
});
```

## License

Copyright (c) 2013 Joshua Peek

Distributed under an MIT-style license. See LICENSE for details.
