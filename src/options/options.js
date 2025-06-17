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
window.addEventListener('keydown', e => {
  if (e.metaKey && e.key === 's') {
    e.preventDefault()
    saveOptions()
  }
})

////////////////////////////////////////

const mod_active_keys = new Set()
let mod_reset_timeout_id = undefined
const mod_reset_time = 5000
const mod_tracked_keys = new Set(['Shift', 'Control', 'Alt', 'Meta'])

const mod_reset = () => {
  console.log('reset', mod_active_keys)
  mod_active_keys.clear()
  clearTimeout(mod_reset_timeout_id)
}
const mod_trigger = () => {
  console.log('trigger', mod_active_keys)
}

window.addEventListener('keydown', event => {
  // if key is not a modifier key, reset the active keys
  if (!mod_tracked_keys.has(event.key)) {
    mod_reset()
    return
  }
  if (!mod_active_keys.has(event.key)) mod_active_keys.add(event.key)
  if (mod_active_keys.size > 0) mod_trigger()
  // if no keyup event is fired within some time, reset anyway
  if (mod_reset_timeout_id) clearTimeout(mod_reset_timeout_id)
  mod_reset_timeout_id = setTimeout(mod_reset, mod_reset_time)
})

window.addEventListener('keyup', event => {
  if (mod_active_keys.has(event.key)) {
    mod_active_keys.delete(event.key)
    if (mod_active_keys.size === 0) mod_reset()
  }
})
