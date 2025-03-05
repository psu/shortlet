// Saves options to chrome.storage
const saveOptions = () => {
  chrome.storage.local.set(
    {
      trigger: document.getElementById('trigger').value,
      shortlets_list: document.getElementById('shortlet_json').value,
      trigger_in_input: document.getElementById('trigger_in_input').checked,
      dev_mode: document.getElementById('dev_mode').checked,
    },
    () => {
      // Update status to let user know options were saved.
      const save = document.getElementById('save')
      const org = save.textContent
      save.textContent = org + ' ✓'
      setTimeout(() => {
        save.textContent = org
      }, 750)
    }
  )
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(['trigger', 'shortlets_list', 'trigger_in_input', 'dev_mode'], items => {
    document.getElementById('trigger').value = items['trigger']
    document.getElementById('shortlet_json').value = items['shortlets_list']
    document.getElementById('trigger_in_input').checked = items['trigger_in_input']
    document.getElementById('dev_mode').checked = items['dev_mode']
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
