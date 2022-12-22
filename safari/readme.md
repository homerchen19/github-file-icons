# Building the Safari Extension

The Safari extension is built using a github action into the build branch whenever a new release is created. XCode Cloud is picking up the build automatically, but the appstoreconnect the app is manually released.


The extension can be manually loaded here:

1. Clone. `git clone --depth 1 https://github.com/homerchen19/github-file-icons.git`
2. Install and build. `npm install; npm run build`

## Manual Build/Release

- Open `/safari` in Xcode.
- In top bar, change "File Icons for GitHub and GitLab (iOS)" to "... (macOS)"
- Open the four targets and increment the project version number and update the Marketing Version to the github release number
- Click `Project` > `Build` from the menu bar
- Click `Project` > `Archive` from the menu bar

## Upload Archive

After active is created..

- Open Archive List. Click `window` > `organizer` from menu
- Select latest build, click `Distribute App`
- Select `App Store Connect`> click `Next`
- Select `Upload` > click `Next`
- Click `Next` after verification completes
- Click `Automatically manage signing` > click `Next`
- Click `Upload`

## Release App

- Login to https://appstoreconnect.apple.com and create a new submission w/ the current version.
- Fill out the changelog
- Select the latest build (build might take a few hours to show up)
- Click `Save` > click `Add for review`

## (not used.. hope one day) Automated Build/Release

3. `Xcode: update build# and version#`
4. `Xcode : build`
5. `Xcode : archive`
6. `Xcode : upload archive`
7. `appstoreconnect.apple.com : manually create new appstore release`
