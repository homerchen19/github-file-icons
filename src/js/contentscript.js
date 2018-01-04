import fileIcons from 'file-icons-js';

import '../css/icons.css';

const filenameDoms = Array.from(
  document.querySelectorAll('tr.js-navigation-item > td.content > span > a')
);
const iconDoms = Array.from(
  document.querySelectorAll('tr.js-navigation-item > td.icon')
);

const filenameDomsLength = filenameDoms.length;

if (filenameDomsLength !== 0) {
  for (let i = 0; i < filenameDomsLength; i += 1) {
    const { innerText: filename } = filenameDoms[i];
    const iconDom = iconDoms[i];
    const className = fileIcons.getClassWithColor(filename);

    if (className) {
      iconDom.innerHTML = `<span class='${className}'></span>`;
    }
  }
}
