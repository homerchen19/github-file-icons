import '../css/options.css';

const $form = document.querySelector('form');
const $message = document.querySelector('.message');

function showMessage(message, duration) {
  $message.textContent = message;

  if (duration) {
    setTimeout(() => {
      $message.textContent = '';
    }, duration);
  }
}

document.body.onload = () => {
  chrome.storage.sync.get(['colorsEnabled', 'darkMode'], result => {
    $form.colors.checked = result.colorsEnabled || true;
    $form.darkMode.checked = result.darkMode || false;
  });
};

$form.addEventListener('submit', e => {
  e.preventDefault();

  const colorsEnabled = $form.colors.checked;
  const darkMode = $form.darkMode.checked;

  showMessage('Saving...');
  $form.save.disabled = true;

  chrome.storage.sync.set({ colorsEnabled, darkMode }, () => {
    showMessage('Saved!', 1000);
    $form.save.disabled = false;
  });
});
