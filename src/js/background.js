const githubRegexp = /.*:\/\/github.com\/.*/i;
const gitlabRegexp = /.*:\/\/.*gitlab.*./i;
const bitbucketRegexp = /.*:\/\/bitbucket.org\/.*/i;
const gogsRegexp = /.*:\/\/.*.gogs.io\/.*/i;
const giteaRegexp = /.*:\/\/.*.gitea.io\/.*/i;

const isGit = url =>
  url.match(githubRegexp) !== null ||
  url.match(gitlabRegexp) !== null ||
  url.match(bitbucketRegexp) !== null ||
  url.match(gogsRegexp) !== null ||
  url.match(giteaRegexp) !== null;

chrome.webNavigation.onHistoryStateUpdated.addListener(({ url }) => {
  if (isGit(url)) {
    chrome.tabs.executeScript(null, { file: 'contentscript.bundle.js' });
  }
});
