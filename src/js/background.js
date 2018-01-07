const githubRegexp = /.*:\/\/github.com\/.*/i;

const isGitHub = url => url.match(githubRegexp) !== null;

chrome.webNavigation.onHistoryStateUpdated.addListener(({ url }) => {
  if (isGitHub(url)) {
    chrome.tabs.executeScript(null, { file: 'contentscript.bundle.js' });
  }
});
