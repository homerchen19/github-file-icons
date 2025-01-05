[![Build Status](https://travis-ci.org/mozilla/eslint-plugin-no-unsanitized.svg?branch=master)](https://travis-ci.org/mozilla/eslint-plugin-no-unsanitized)
# Disallow unsanitized code (no-unsanitized)

These rules disallow unsafe coding practices that may result into security
vulnerabilities. We will disallow assignments (e.g., to innerHTML) as well as
calls (e.g., to insertAdjacentHTML) without the use of a pre-defined escaping
function. The escaping functions must be called with a template string.
The function names are hardcoded as `Sanitizer.escapeHTML` and `escapeHTML`.
The plugin also supports the
[Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
and calls to `.setHTML()` are also allowed by default.

This plugin is built for and used within Mozilla to maintain and improve the security
of our products and services.

# Rule Details

## method
The *method* rule disallows certain function calls.
E.g., `document.write()` or `insertAdjacentHTML()`.
See [docs/rules/method.md](docs/rules/method.md) for more.

## property
The *property* rule disallows certain assignment expressions, e.g., to `innerHTML`.

See [docs/rules/property.md](docs/rules/property.md) for more.


## Examples

Here are a few examples of code that we do not want to allow:

```js
foo.innerHTML = input.value;
bar.innerHTML = "<a href='"+url+"'>About</a>";
```

A few examples of allowed practices:

```js
foo.innerHTML = 5;
bar.innerHTML = "<a href='/about.html'>About</a>";
bar.innerHTML = escapeHTML`<a href='${url}'>About</a>`;
```




# Install

With **yarn** or **npm**:
```
$ yarn add -D eslint-plugin-no-unsanitized
$ npm install --save-dev eslint-plugin-no-unsanitized
```

## Usage

In your `.eslintrc.json` file enable this rule with the following:

```
{
    "extends": ["plugin:no-unsanitized/DOM"]
}
```

Or:
```
{
    "plugins": ["no-unsanitized"],
    "rules": {
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error"
    }
}
```

# Documentation
See [docs/](docs/).
