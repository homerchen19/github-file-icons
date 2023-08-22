# atom-file-icons

File specific icons for JavaScript. A port of the
[`file-icons/atom`](https://github.com/file-icons/atom) package.

This package was made to replace
[`file-icons-js`](https://www.npmjs.com/package/file-icons-js) (and that was the
basis for it), but it is kept up to date automatically with a GitHub action, so
it should never get out of sync with the master for more than a day.

## Usage

To install the package, install it with `npm` or `yarn`:

```shell
npm install atom-file-icons
# or
yarn add atom-file-icons
```

And import either of the provided functions:

```ts
import { getIconClass, getIconClassList } from 'atom-file-icons';
```

And finally, you can find the provided fonts and css styles here:

```ts
// Styles
import 'atom-file-icons/dist/index.css';

// Fonts
import 'atom-file-icons/dist/fonts/devopicons.woff2';
import 'atom-file-icons/dist/fonts/file-icons.woff2';
import 'atom-file-icons/dist/fonts/fontawesome.woff2';
import 'atom-file-icons/dist/fonts/mfixx.woff2';
import 'atom-file-icons/dist/fonts/octicons.woff2';
```

The way the fonts and styles are bundled is up to your build tools, but all of
the fonts are included as font-faces in the styles file.

## API

#### `getIconClass(name: string, opts: Options): string | null`

The `getIconClass` method returns a string containing a joint class name to use
on an element in order to make it into a file icon. It takes a set of options
which can modify the resulting class:

- `colorMode: "light" | "dark" | "mono"` — Each icon class contains both the
  icon specific class string as well as a color class string. This option
  determines whether the app is in light or dark mode, or if you'd rather have a
  monotone version of the icon.
- `isDir: boolean` — This options determines whether or not the resulting icon
  should be for a directory, as files and directories both have their own set of
  icons.
- `skipFallback: boolean` — Normally, this package will default the file icons
  to the default text file icon, or the folder icon to the default folder icon.
  If this option is passed and no match is found, the function will return
  `null`.

#### `getIconClassList(name: string, opts: Options): string[] | null`

This function takes the same options as `getIconClass`, the only difference is
that instead of a single joint class name, it will return an array of all of the
classes that should be used to make up the icon. If `skipFallback` is passed and
no match is found, you will still receive `null` as a response.

## Related

- [`file-icons/atom`](https://github.com/file-icons/atom)
- [`file-icons/vscode`](https://github.com/file-icons/vscode)
