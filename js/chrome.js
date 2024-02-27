var loaded = []

chrome.action.onClicked.addListener(async t => {
  console.log(t.id, loaded)
  console.time('mount')
  if (typeof loaded[t.id] === 'undefined') {
    await exec(t, ['js/content.js'])
    loaded[t.id] = (await exec(t, () => typeof Shortlet))[0].result === 'object'
  }
  console.timeEnd('mount')
  console.time('run')
  await exec(t, () => {
    Shortlet.runner('pontus_toggledarklight')
  })
  console.timeEnd('run')
})

const exec = (tab, script, args = []) => {
  const obj = typeof script === 'function' ? { func: script, args: args } : { files: script }
  //world: chrome.scripting.ExecutionWorld.MAIN,
  return chrome.scripting.executeScript({ target: { tabId: tab.id }, ...obj })
}

chrome.commands.onCommand.addListener(command => {
  console.log(`Command: ${command}`)
})
