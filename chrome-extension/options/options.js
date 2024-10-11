// Saves options to chrome.storage
const saveOptions = () => {
  const shortlet = document.getElementById('shortlet_json').value
  const dev = document.getElementById('dev_mode').checked
  chrome.storage.local.set({ shortlet_object: shortlet, dev_mode: dev }, () => {
    // Update status to let user know options were saved.
    const save = document.getElementById('save')
    const org = save.textContent
    save.textContent = org + ' ✓'
    setTimeout(() => {
      save.textContent = org
    }, 750)
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(['shortlet_object', 'dev_mode'], items => {
    document.getElementById('shortlet_json').value = items['shortlet_object']
    document.getElementById('dev_mode').checked = items['dev_mode']
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
