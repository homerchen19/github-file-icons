## Schema

```js
{
    "plugins": ["no-unsanitized"],
    "env": {
        // $ruleName is either "method" or "property"
        "no-unsanitized/$ruleName": ["errorlevel",
            // This object is optional would use default config for all default ruleChecks
            {
                // optional, omitting or length 0 would be considered permitting all objectNames
                objectMatches: ["$stringRegex"],

                // optional, removes default $ruleCheckName's provided by this rule
                disableDefault: $boolean,

                // optional, if omitted would disallow use of matched "$ruleCheckName" prop/method
                escape: {
                    // optional: Tagged template permitted as arguments/assignments
                    taggedTemplates: ["$taggedTemplateFunctionName"],

                    // optional: method permitted as arguments/assignments
                    methods: ["$MethodName"]
                }
            },
            // optional would use default ruleChecks, will merge each $ruleCheckName with default rule setup so user doesn't have to specify properties if already defined
            {
               "$ruleCheckName": {
                   // optional, same as above and overrides parent even if blank array
                   objectMatches: ["$stringRegex"],

                   // optional, same as above, overrides parent even if blank object
                   escape: {...}

                   // indices to check for arguments passed to a method call. Only applies to $ruleName="method"
                   properties: [...]
               }
               ...
            }
        ]
    }
}
```
