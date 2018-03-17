import '../css/options.css';

const form = document.querySelector('form');

chrome.storage.sync.get('colorsEnabled', result => {
  form.colors.checked = Boolean(result.colorsEnabled);
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const colorsEnabled = form.colors.checked;
  chrome.storage.sync.set({ colorsEnabled });
});
