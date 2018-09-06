const githubRegexp = /.*:\/\/github.com\/.*/i;
const gitlabRegexp = /.*:\/\/gitlab.com\/.*/i;
const bitbucketRegexp = /.*:\/\/bitbucket.org\/.*/i;

const isGit = url =>
  url.match(githubRegexp) !== null ||
  url.match(gitlabRegexp) !== null ||
  url.match(bitbucketRegexp);

chrome.webNavigation.onHistoryStateUpdated.addListener(({ url }) => {
  if (isGit(url)) {
    chrome.tabs.executeScript(null, { file: 'contentscript.bundle.js' });
  }
});
