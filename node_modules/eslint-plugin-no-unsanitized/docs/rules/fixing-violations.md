# Fixing Rule Violations
The default configuration will allow your code to pass if it ensures
that all user input is properly escaped.
Using the [sanitizer.js](https://github.com/fxos-eng/sanitizer) 
library your code would look like this:

```js
// example for no-unsanitized/property
foo.innerHTML = Sanitizer.escapeHTML`<a href="${link}">click</a>`

// example for no-unsanitized/method
node.insertAdjacentHTML('afterend', Sanitizer.escapeHTML`<a href="${link}">click</a>`);
```

## Wrapping & Unwrapping
If you need to generate your HTML somewhere else and e.g. cache it,
you won't be able to run `escapeHTML` on a string that knows no
distinction between HTML and user inputs.
Another feature in Sanitizer that allows you to create an object
that contains escaped HTML which is guaranteed to be safe and thus
allowed for direct innerHTML assignments (and insertAdjacentHTML
calls): `createSafeHTML` and `unwrapSafeHTML`

Example:
```js
// create the HTML object for later usage
function storeGreeting(username) {
  var safeHTML = Sanitizer.createSafeHTML`<p>Hello ${username}</p>`;
  cache.store('greeting', safeHTML)
}

// re-use the existing safe-HTML object
function useGreeting(domNode) {
  var htmlObj = cache.retrieve('greeting');
  domNode.innerHTML = Sanitizer.unwrapSafeHTML(htmlObj);
}
```

# That still does not solve my problem
It might very well be the case that there's a bug in our linter rule.

[Please file an issue.](https://github.com/mozilla/eslint-plugin-no-unsanitized/issues/new)
