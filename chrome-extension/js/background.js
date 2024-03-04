var loaded = []

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_storage') {
    new Promise((resolve, reject) => {
      chrome.storage.local.get([request.key], storage => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
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

chrome.action.onClicked.addListener(async t => {
  const c = await exec(t, () => typeof CommandPal === 'function' && typeof Shortlet === 'object')
  if (!c[0].result) await exec(t, ['js/bundle.js', 'js/content.js'])
  await exec(t, () => {
    console.log('Show UI', Shortlet)
  })
})

//chrome.tabs.sendMessage(tab.id, { message:message });

const exec = (tab, script, args = []) => {
  const obj = typeof script === 'function' ? { func: script, args: args } : { files: script }
  //world: chrome.scripting.ExecutionWorld.MAIN,
  return chrome.scripting.executeScript({ target: { tabId: tab.id }, ...obj })
}

chrome.commands.onCommand.addListener(command => {
  console.log(`Command: ${command}`)
})

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason !== 'install' && details.reason !== 'update') return
  //console.log(`onInstalled: ${details.reason}`)
  // chrome.contextMenus.create({
  //   id: 'sampleContextMenu',
  //   title: 'Sample Context Menu',
  //   contexts: ['selection'],
  // })
})
