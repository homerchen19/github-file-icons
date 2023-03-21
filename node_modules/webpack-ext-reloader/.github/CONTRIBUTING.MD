# How to Contribute

Before create any pull requests, please open a issue explaining the situation

- Be sure to follow the eslint rules and run the prettier
- Be sure **before open the pull request**, to test the existent code and/or create tests if you made a new feature or
changed a already existing one.

## Issues

Should be in the format:

```text
**Type:**
  - [x] bug
  - [ ] feature
  - [ ] enhancement
  - [ ] question

**Environment:**
  - OS: Windows 10
  - Version: 0.6.0

**Going to open a PR:**
  - [x] yes
  - [ ] no

**Description:**
The messages aren't showing on the console
```

## Pull Requests

- On the description of the pull request set the issue id for closing it:

```text
Now the messages are showing. Closes #41
```

## Following the guideline

Please follow the above rules, so the repo can stay consistent and easy for everyone find questions and
already resolved stuff. Be aware that your PR can be denied if you don't follow then :cry:

## Running this project locally

### Building and Testing

Inside this repository have an example plugin, so you can test and see it working
After cloning the repository, run:

```bash
npm run build
```

 And then run:

 ```bash
 npm run start:sample
 ```

 This will make the webpack run in watch mode for the sample plugin source and output the built files on the "dist"
 directory.
 Load the extension **(the files in "sample/dist" directory)** using the "load unpacked extension", open a
 new tab in any site and open the developer panel on it. Watch the dev. tools console tab, and do some changes on
 the background or content script. Voila!

**Note:**
You must have both background and content scripts for this plugin to work, and they must be specified in separate `entry` chunks
in your webpack config.

The reloading script will be injected only on the main entries chunks (in background and content script). Any other
chunks will be ignored.
