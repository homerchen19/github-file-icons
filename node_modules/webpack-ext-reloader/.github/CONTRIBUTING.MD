# Running this project locally

## Building and Testing in Browser

Inside this repository have an example plugin, so you can test and see it working
After cloning the repository, run:

```bash
npm run build
```

And then run:

**Chrome:**
 ```bash
 npm run start:sample:chrome
 ```

**Firefox:**
 ```bash
 npm run start:sample:firefox
 ```

This will make the webpack run in watch mode for the sample plugin source and output the built files on the "dist" directory.
Load the extension **(the files in "sample/dist" directory)** using the "load unpacked extension", open a new tab in any site and open the developer panel on it. Watch the dev. tools console tab, and do some changes on the background or content script. Voila!

**Note:**
You must have both background and content scripts for this plugin to work, and they must be specified in separate `entry` chunks in your webpack config.

The reloading script will be injected only on the main entries chunks (in background and content script). Any other chunks will be ignored.


## Linting and Unit Tests

In order to lint, simply use the `npm run lint` command. Similarly, to format with Prettier, use the `npm run format` command.

In order to run tests, you can use the `npm run test` command.
