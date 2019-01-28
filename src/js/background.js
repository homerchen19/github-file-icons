const githubRegexp = /.*:\/\/github.com\/.*/i;
const gitlabRegexp = /.*:\/\/gitlab.com\/.*/i;
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

chrome.contextMenus.create({
  id: 'change-icon-color',
  title: 'Change icon colors',
  contexts: ['all'],
});

chrome.contextMenus.create({
  id: 'toggle-dark-mode',
  title: 'Toggle dark mode',
  contexts: ['all'],
});

const toggleStorage = key => tabs => {
  const activeTab = tabs[0];
  chrome.storage.sync.get(key, storage => {
    chrome.storage.sync.set({ [key]: !storage[key] }, () =>
      chrome.tabs.reload(activeTab.id)
    );
  });
};

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'change-icon-color') {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      toggleStorage('colorsDisabled')
    );
  } else if (info.menuItemId === 'toggle-dark-mode') {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      toggleStorage('darkMode')
    );
  }
});
