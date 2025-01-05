# method
The *method* rule in *eslint-plugin-no-unsanitized* perform basic security
checks for function calls. The idea of these checks is to ensure that certain insecure
coding patterns are avoided in your codebase. We encourage developers
to use HTML sanitizers or escapers to mitigate those insecure patterns.

## Unsafe call to insertAdjacentHTML, document.write or document.writeln
This error message suggests that you are using an unsafe coding
pattern. Please do not simply call functions like `insertAdjacentHTML` with a
variable parameter, as this might cause Cross-Site Scripting (XSS)
vulnerabilities. We encourage you to construct DOM nodes using `createElement`
and changing their attributes (e.g., `textContent`, `classList`) instead.

### Further Reading
* Advanced guidance on [Fixing rule violations](fixing-violations.md)
* This rule has some [customization](customization.md) options that allow you
to add or remove functions that should not be called