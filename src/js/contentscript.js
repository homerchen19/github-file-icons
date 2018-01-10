import fileIcons from 'file-icons-js';

import '../css/icons.css';

const select = document.querySelector.bind(document);
select.all = document.querySelectorAll.bind(document);

const update = () => {
  const filenameDoms = Array.from(
    select.all('tr.js-navigation-item > td.content > span > a')
  );
  const iconDoms = Array.from(select.all('tr.js-navigation-item > td.icon'));

  const filenameDomsLength = filenameDoms.length;

  if (filenameDomsLength !== 0) {
    for (let i = 0; i < filenameDomsLength; i += 1) {
      const { innerText: filename } = filenameDoms[i];
      const iconDom = iconDoms[i];

      const oldIcon = iconDom.querySelector('.octicon');
      const isDirectory = oldIcon.classList.contains('octicon-file-directory');

      const className = fileIcons.getClassWithColor(filename);

      if (className && !isDirectory) {
        iconDom.innerHTML = `<span class='${className}'></span>`;
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

  observeFragment();
  document.addEventListener('pjax:end', update);
  document.addEventListener('pjax:end', observeFragment);
};

init();
