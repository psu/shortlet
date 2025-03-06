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
    const thisVersion = chrome.runtime.getManifest().version
    console.log('Updated from ' + details.previousVersion + ' to ' + thisVersion + '!')
  }
})

function exec(tabId, script, args = []) {
  const obj = typeof script === 'function' ? { func: script, args: args } : { files: script }
  //world: chrome.scripting.ExecutionWorld.MAIN,
  return chrome.scripting.executeScript({ target: { tabId: tabId }, ...obj })
}
function style(tabId, style) {
  const obj = typeof style === 'string' ? { css: style } : { files: style }
  return chrome.scripting.insertCSS({ target: { tabId: tabId }, ...obj })
}
