# Customization

## Variable Tracing

The plugin allows a limit back-tracing of variables.
This will be used to check code like here:
```js
const greeting_template = `<p>Hello World!</p>`;
// ... lots of other code in between ...
someElemenet.innerHTML = greeting_template;
```

Currently, backtracing will only allow const and let variables that contain string literals only.
Further assignments to these variables will also be checked for validation.

**Backtracing can be disabled by setting the boolean
option `variableTracing` to `false`.**

Both values are supported and tested in CI.

## Customization Examples
You can customize the way this rule works in various ways.
* Add to the list of properties or functions to be checked for potentially
dangers variable input
* Add to the list of allowed escaping functions to mitigate security concerns
* Besides adding to the list, you may override the defaults and provide an exhaustive list yourself


### Disallow the `html` function by specifically checking input for the first function parameter
```json
{
 "rules": {
        "no-unsanitized/method": [
            "error",
            {
            },
            {
                "html": {
                    "properties": [0]
                }
            }
        ]
  }
}
```

## Advanced configuration

```js
{
    "plugins": ["no-unsanitized"],
    "rules": {
        "no-unsanitized/method": [
            "error",
            {
                disableDefault: true,
                escape: {
                    taggedTemplates: ["safeHTML"]
                }
            },
            {
                html: {
                    properties: [0]
                }
            }
        ],
        "no-unsanitized/method": [
            "error",
            {
                escape: {
                    taggedTemplates: ["safeHTML"]
                }
            },
            {
                innerHTML: {
                    objectMatches: ["document.*"]
                }
            }
        ]
    }
}
```

### Override list of escaping functions for property assignments only 
TBD


#### More
* See [our rule schema definition](SCHEMA.md). 

