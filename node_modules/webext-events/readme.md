# webext-events [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/webext-events.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=webext-events

> High-level events and utilities for events in Web Extensions

## Install

```sh
npm install webext-events
```

Or download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-events&name=webextEvents) to include in your `manifest.json`.

## Usage

This package exports various utilities, just import what you need.

- [onContextInvalidated](./source/on-context-invalidated.md) - Fires in content scripts when the extension is disabled, updated or reloaded.
- [onExtensionStart](./source/on-extension-start.md) - Fires when the extension starts or is enabled. This is what yuou thought `chrome.runtime.onStartup` was for.
- [oneEvent](./source/one-event.md) - Creates a promise that resolves when an event is received.
- [addListener](./source/add-listener.md) - Like `.addEventListener` but with a `signal` to remove the listener.

## Related

- [webext-tools](https://github.com/fregante/webext-tools) - Utility functions for Web Extensions.
- [webext-content-scripts](https://github.com/fregante/webext-content-scripts) - Utility functions to inject content scripts in WebExtensions.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
