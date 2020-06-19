import fileIcons from 'file-icons-js';
import domLoaded from 'dom-loaded';
import select from 'select-dom';
import mobile from 'is-mobile';

import '../css/icons.css';

let colorsDisabled = false;
let darkMode = false;

const getSelector = hostname => {
  switch (true) {
    case /.*github.*/.test(hostname):
      return {
        filenameSelector:
          'tr.js-navigation-item > td.content > span, .files-list > a.list-item, div.js-navigation-item > div[role="rowheader"] > span',
        iconSelector:
          'tr.js-navigation-item > td.icon, .files-list > a.list-item, div.js-navigation-item > div[role="gridcell"]:first-child',
        host: 'github',
      };
    case /.*gitlab.*/.test(hostname):
      return {
        filenameSelector: 'tr.tree-item > td.tree-item-file-name > a > span',
        iconSelector: 'tr.tree-item > td.tree-item-file-name > i',
        host: 'gitlab',
      };
    default:
      return {
        filenameSelector: 'tr > td.name > a',
        iconSelector: 'tr > td.name > span',
        host: 'others',
      };
  }
};

const loadFonts = () => {
  const fonts = [
    { name: 'FontAwesome', path: 'fonts/fontawesome.woff2' },
    { name: 'Mfizz', path: 'fonts/mfixx.woff2' },
    { name: 'Devicons', path: 'fonts/devopicons.woff2' },
    { name: 'file-icons', path: 'fonts/file-icons.woff2' },
    { name: 'octicons', path: 'fonts/octicons.woff2' },
  ];

  fonts.forEach(font => {
    const fontFace = new FontFace(
      font.name,
      `url("${chrome.extension.getURL(font.path)}") format("woff2")`,
      {
        style: 'normal',
        weight: 'normal',
      }
    );
    fontFace.load().then(loadedFontFace => document.fonts.add(loadedFontFace));
  });
};

const getGitHubMobileFilename = filenameDom =>
  Array.from(filenameDom.childNodes)
    .filter(node => node.nodeType === node.TEXT_NODE)
    .map(node => node.nodeValue.trim())
    .join('');

const update = () => {
  const { filenameSelector, iconSelector, host } = getSelector(
    window.location.hostname
  );
  const isMobile = mobile();
  const isGitHub = host === 'github';

  const filenameDoms = select.all(filenameSelector);
  const iconDoms = select.all(iconSelector);

  for (let i = 0; i < filenameDoms.length; i += 1) {
    const filename =
      isGitHub && isMobile
        ? getGitHubMobileFilename(filenameDoms[i])
        : filenameDoms[i].innerText.trim();

    const iconDom = isGitHub
      ? iconDoms[i].querySelector('.octicon')
      : iconDoms[i];

    const isDirectory =
      iconDom.classList.contains('octicon-file-directory') ||
      iconDom.classList.contains('fa-folder');

    const className = colorsDisabled
      ? fileIcons.getClass(filename)
      : fileIcons.getClassWithColor(filename);

    const darkClassName = darkMode ? 'dark' : '';

    if (className && !isDirectory) {
      const icon = document.createElement('span');

      if (isGitHub) {
        icon.className = `icon octicon ${className} ${darkClassName}`;
      } else {
        icon.className = `${className} ${darkClassName}`;
        icon.style.marginRight = '3px';
      }

      iconDom.parentNode.replaceChild(icon, iconDom);
    }
  }
};

const observer = new MutationObserver(update);
const observeFragment = () => {
  const ajaxFiles = select('.repository-content > .Box.mb-3');
  if (ajaxFiles) {
    observer.observe(ajaxFiles, {
      childList: true,
    });
  }
};

const init = async () => {
  loadFonts();
  observeFragment();

  await domLoaded;
  update();

  document.addEventListener('pjax:end', update);
  document.addEventListener('pjax:end', observeFragment);
};

chrome.storage.sync.get(['colorsDisabled', 'darkMode'], result => {
  colorsDisabled =
    result.colorsDisabled === undefined
      ? colorsDisabled
      : result.colorsDisabled;

  darkMode = result.darkMode === undefined ? darkMode : result.darkMode;

  init();
});
