# property
The *property* rule in *eslint-plugin-no-unsanitized* perform basic security
checks for property assignments. The idea of these checks is to ensure that
certain insecure coding patterns are avoided in your codebase. We encourage
developers to use HTML sanitizers or escapers to mitigate those insecure
patterns.

## Unsafe assignment to innerHTML or outerHTML 
This error message suggests that you are using an unsafe coding
pattern. Please do not simply assign variables to `innertHTML`,
as this might cause Cross-Site Scripting (XSS) vulnerabilities.
We encourage you to construct DOM nodes using `createElement`
and changing their attributes (e.g., `textContent`, `classList`) instead.

### Further Reading
* Advanced guidance on [Fixing rule violations](fixing-violations.md)
* This rule has some [customization](customization.md) options that allow you
to add or remove functions that should not be called