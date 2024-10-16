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
  console.log('click from tab', tab)
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

// //dynamic load of index.js
// chrome.tabs.onUpdated.addListener(async (tabId, info) => {
//   const tab = await chrome.tabs.get(tabId)
//   if (typeof tab.url === 'undefined' || tab.url.includes('localhost')) return undefined
//   if (info.status === 'complete') {
//     console.log('complete')
//     const is_loaded = await exec(tabId, () => typeof CommandPal === 'function')
//     if (!is_loaded[0].result) {
//       await exec(tabId, ['src/index.js'])
//       //      await style(tabId, ['command-pal/theme-dark.css', 'shortlet/command-pal.css'])
//     }
//   }
// })
