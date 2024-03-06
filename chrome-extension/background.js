chrome.tabs.onUpdated.addListener(async (tabId, info) => {
  const tab = await chrome.tabs.get(tabId)
  if (typeof tab.url === 'undefined') return undefined
  if (info.status === 'complete') {
    const is_loaded = await exec(
      tabId,
      () => typeof CommandPal === 'function' && typeof Shortlet === 'object'
    )
    if (!is_loaded[0].result) {
      await exec(tabId, ['command-pal/bundle.js', 'content.js'])
      await style(tabId, ['command-pal/theme-dark.css', 'content.css'])
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //
  if (request.action === 'get_storage') {
    new Promise((resolve, reject) => {
      chrome.storage.local.get([request.key], storage => {
        // if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
        resolve(JSON.parse(storage[request.key]))
      })
    })
      .then(data => {
        sendResponse({ data: data })
      })
      .catch(error => {
        sendResponse({ error: error.message })
      })
    return true
  }
})

chrome.action.onClicked.addListener(tab => {
  chrome.runtime.openOptionsPage()
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
