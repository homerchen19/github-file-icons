import '../css/popup.css';

const $form = document.querySelector('form');
const $message = document.querySelector('.message');

const showMessage = (message, duration) => {
  $message.textContent = message;

  if (duration) {
    setTimeout(() => {
      $message.textContent = '';
    }, duration);
  }
};

document.body.onload = () => {
  chrome.storage.sync.get(['colorsDisabled', 'darkMode'], result => {
    $form.colors.checked = result.colorsDisabled || false;
    $form.darkMode.checked = result.darkMode || false;
  });
};

$form.addEventListener('submit', e => {
  e.preventDefault();

  const colorsDisabled = $form.colors.checked;
  const darkMode = $form.darkMode.checked;

  showMessage('Saving...');
  $form.save.disabled = true;

  chrome.storage.sync.set({ colorsDisabled, darkMode }, () => {
    showMessage('Saved!', 1000);
    $form.save.disabled = false;
  });
});
