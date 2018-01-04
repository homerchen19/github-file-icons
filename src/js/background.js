chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.executeScript(null, { file: 'contentscript.bundle.js' });
});
