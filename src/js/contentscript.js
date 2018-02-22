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
        iconDom.innerHTML = `<span class='icon ${className}'></span>`;
      }
    }
  }

  const filenameDomsGitlab = Array.from(
    select.all('tr.tree-item > td.tree-item-file-name > a > span')
  );

  const iconDomsGitlab = Array.from(
    select.all('tr.tree-item > td.tree-item-file-name > i')
  );

  const filenameDomsGitlabLength = filenameDomsGitlab.length;

  if (filenameDomsGitlabLength !== 0) {
    for (let i = 0; i < filenameDomsGitlabLength; i += 1) {
      const { innerText: filename } = filenameDomsGitlab[i];
      const iconDomGitlab = iconDomsGitlab[i];

      const isDirectory = iconDomGitlab.classList.contains('fa-folder');

      const className = fileIcons.getClassWithColor(filename);

      if (className && !isDirectory) {
        const icon = document.createElement('span');
        icon.className = `${className}`;
        iconDomGitlab.parentNode.replaceChild(icon, iconDomGitlab);
      }
    }
  }

  const filenameDomsBitbucket = Array.from(
    select.all('tr.iterable-item > td.filename > div > a')
  );

  const iconDomsBitbucket = Array.from(
    select.all('tr.iterable-item > td.filename > div > a > span')
  );

  const filenameDomsBitbucketLength = filenameDomsBitbucket.length;

  if (filenameDomsBitbucketLength !== 0) {
    for (let i = 0; i < filenameDomsBitbucketLength; i += 1) {
      const { innerText: filename } = filenameDomsBitbucket[i];
      const iconDomBitbucket = iconDomsBitbucket[i];

      const className = fileIcons.getClassWithColor(filename);

      if (className) {
        const icon = document.createElement('span');
        icon.className = `${className}`;
        icon.style.marginRight = '10px';
        iconDomBitbucket.parentNode.replaceChild(icon, iconDomBitbucket);
      }
    }
  }

  const filenameDomsGogsGitea = Array.from(select.all('tr > td.name > a'));

  const iconDomsGogsGitea = Array.from(select.all('tr > td.name > span'));

  const filenameDomsGogsGiteaLength = filenameDomsGogsGitea.length;

  if (filenameDomsGogsGiteaLength !== 0) {
    for (let i = 0; i < filenameDomsGogsGiteaLength; i += 1) {
      const { innerText: filename } = filenameDomsGogsGitea[i];
      const iconDomGogsGitea = iconDomsGogsGitea[i];

      // const oldIcon = iconDomGogsGitea.querySelector('.octicon');
      const isDirectory = iconDomGogsGitea.classList.contains(
        'octicon-file-directory'
      );

      const className = fileIcons.getClassWithColor(filename);

      if (className && !isDirectory) {
        const icon = document.createElement('span');
        icon.className = `${className}`;
        icon.style.marginRight = '10px';
        iconDomGogsGitea.parentNode.replaceChild(icon, iconDomGogsGitea);
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

  update();
  observeFragment();
  document.addEventListener('pjax:end', update);
  document.addEventListener('pjax:end', observeFragment);
};

init();
