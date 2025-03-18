chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  new Promise((resolve, reject) => {
    //
    if (request.action === 'get_storage') {
      chrome.storage.local.get([request.key], storage => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
        resolve(storage[request.key])
      })
    }
    //
    if (request.action === 'load_api') {
      resolve(
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ['src/ShortletAPI.js'],
          world: 'MAIN',
        })
      )
    }
    //
    if (request.action === 'open_options') {
      resolve(chrome.runtime.openOptionsPage())
    }
  })
    .then(data => {
      sendResponse({ data: data })
    })
    .catch(error => {
      sendResponse({ error: error.message })
    })
  return true
})

chrome.action.onClicked.addListener(tab => {
  chrome.runtime.openOptionsPage()
})

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install') {
    // set defaults
    chrome.storage.local.set({
      trigger: 'ctrl+space',
      trigger_in_input: 'checked',
      shortlets_list: JSON.stringify({ shortlets: [] }),
      dev_mode: '',
    })
  }
  if (details.reason == 'update') {
    console.log('Shortlet: Updated from ' + details.previousVersion + ' to ' + chrome.runtime.getManifest().version + '!')
  }
})
