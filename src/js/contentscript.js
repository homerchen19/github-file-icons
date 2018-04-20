import fileIcons from 'file-icons-js';

import '../css/icons.css';

const select = document.querySelector.bind(document);
select.all = document.querySelectorAll.bind(document);

let colorsEnabled = true;
let darkMode = false;

const getSelector = () => {
  switch (window.location.hostname) {
    case 'github.com':
      return {
        filenameSelector:
          'tr.js-navigation-item > td.content > span a, .files-list > a.list-item',
        iconSelector:
          'tr.js-navigation-item > td.icon, .files-list > a.list-item',
        host: 'github',
      };
    case 'gitlab.com':
      return {
        filenameSelector: 'tr.tree-item > td.tree-item-file-name > a > span',
        iconSelector: 'tr.tree-item > td.tree-item-file-name > i',
        host: 'gitlab',
      };
    case 'bitbucket.org':
      return {
        filenameSelector: 'tr.iterable-item > td.filename > div > a',
        iconSelector: 'tr.iterable-item > td.filename > div > a > span',
        host: 'bitbucket',
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

const update = () => {
  const { filenameSelector, iconSelector, host } = getSelector();

  const filenameDoms = Array.from(select.all(filenameSelector));
  const iconDoms = Array.from(select.all(iconSelector));

  const filenameDomsLength = filenameDoms.length;

  if (filenameDomsLength !== 0) {
    const getGithubFilename = filenameDom =>
      Array.from(filenameDom.childNodes)
        .filter(node => node.nodeType === node.TEXT_NODE)
        .map(node => node.nodeValue.trim())
        .join('');

    for (let i = 0; i < filenameDomsLength; i += 1) {
      const filename =
        host === 'github'
          ? getGithubFilename(filenameDoms[i])
          : filenameDoms[i].innerText;
      const iconDom =
        host === 'github' ? iconDoms[i].querySelector('.octicon') : iconDoms[i];

      const isDirectory =
        iconDom.classList.contains('octicon-file-directory') ||
        iconDom.classList.contains('fa-folder');

      const className = colorsEnabled
        ? fileIcons.getClassWithColor(filename)
        : fileIcons.getClass(filename);

      const darkClassName = darkMode ? 'dark' : '';

      if (className && !isDirectory) {
        const icon = document.createElement('span');

        if (host === 'github') {
          icon.className = `icon octicon ${className} ${darkClassName}`;
        } else {
          icon.className = `${className} ${darkClassName}`;
          icon.style.marginRight = host === 'bitbucket' ? '10px' : '3px';
        }

        iconDom.parentNode.replaceChild(icon, iconDom);
      }
    }
  }
};

const init = () => {
  const observer = new MutationObserver(update);
  const observeFragment = () => {
    const ajaxFiles = select('.file-wrap');
    if (ajaxFiles) {
      observer.observe(ajaxFiles.parentNode, {
        childList: true,
      });
    }
  };

  loadFonts();
  update();
  observeFragment();

  document.addEventListener('pjax:end', update);
  document.addEventListener('pjax:end', observeFragment);
};

chrome.storage.sync.get(['colorsEnabled', 'darkMode'], result => {
  // eslint-disable-next-line prefer-destructuring
  colorsEnabled =
    result.colorsEnabled === undefined ? colorsEnabled : result.colorsEnabled;
  // eslint-disable-next-line prefer-destructuring
  darkMode = result.darkMode === undefined ? darkMode : result.darkMode;

  init();
});
