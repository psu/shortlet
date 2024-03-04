// Saves options to chrome.storage
const saveOptions = () => {
  const shortlets = document.getElementById('shortlets').value

  chrome.storage.local.set({ shortlet_object: shortlets }, () => {
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
  chrome.storage.local.get(['shortlet_object'], items => {
    document.getElementById('shortlets').value = items.shortlets
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
