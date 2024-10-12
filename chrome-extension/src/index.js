;(async () => {
  // prep the dom
  Object.entries(document.body.querySelectorAll('*'))
    .map(o => o[1])
    .filter(n => n.innerHTML.indexOf('<') == -1 && n.textContent.trim())
    .forEach(n => {
      n.setAttribute('_', n.textContent.trim().substring(0, 25))
    })

  // get options from storage
  const trigger = await callServiceWorker({ action: 'get_storage', key: 'trigger' })
  const trigger_in_input = await callServiceWorker({ action: 'get_storage', key: 'trigger_in_input' })
  const shortlets_list = JSON.parse(await callServiceWorker({ action: 'get_storage', key: 'shortlets_list' }))
  const dev_mode = await callServiceWorker({ action: 'get_storage', key: 'dev_mode' })
  const getShortlets = () => filterShortletsOnConditions(shortlets_list.shortlets, window.location.href)

  // intra-extension communication
  function callServiceWorker(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, response => {
        if (response.error) reject(response.error)
        resolve(response.data)
      })
    })
  }
  // helper to wrap and queue a single action
  function queueAction(q, a) {
    // logging templates
    const logSuccess = (a = '') => {
      if (!dev_mode) return
      const action = { ...a }
      let text = `🦾${action.do}`
      if (typeof action === 'object') {
        text = `🦾${action.do}   (`
        delete action.do
        text += Object.entries(action)
          .map(o => `${o[0]}: ${JSON.stringify(o[1])}`)
          .join(', ')
        text += ')'
      }
      console.log(`Shortlet: ${text}`)
    }
    const logError = (err = '', action = '', o = {}) => {
      if (!dev_mode) return
      console.log(`Shortlet: Error for action '${action}'\n${JSON.stringify(o)}\n${err}`)
    }
    const actionWrapper = () => {
      try {
        ShortletAPI[a.do](a)
        logSuccess(a)
      } catch (err) {
        if (typeof a.fallback === 'object') {
          try {
            ShortletAPI[a.do](a.fallback)
            logSuccess({ do: `${a.do}:fallback`, ...a.fallback })
          } catch (err) {
            logError(err, `${a.do}:fallback`, a)
          }
        } else {
          logError(err, a.do, a)
        }
      }
    }
    q.add(actionWrapper, a.delay)
  }
  // load shortlets for the current webpage
  function filterShortletsOnConditions(shlts, url) {
    return shlts.filter(s => url.match(s.conditions.url) != null)
  }
  // run a shortlet aka. queue its actions and exec the queue
  function runShortlet(s) {
    // assert format
    if (!Array.isArray(s.actions)) s.actions = [s.actions]
    if (typeof s.repeat !== 'number' || s.repeat < 0) s.repeat = 1
    // create queue
    const queue = new MiniQueue()
    // add all actions in the array to the queue as functions wrapped in try…catch
    for (let i = 0; i < s.repeat; i++) {
      s.actions.forEach(a => queueAction(queue, a))
    }
    // start executing the queue
    queue.start()
  }
  //
  function parseShortletsForCommandPal(shlts) {
    if (!Array.isArray(shlts)) shlts = [shlts]
    if (shlts.length > 0) {
      return shlts.map(s => ({
        name: s.title,
        description: `Executes ${s.actions.length} actions`,
        shortcut: s.shortcut,
        handler: () => {
          runShortlet(s)
        },
      }))
    }
    return []
  }
  // shortlets as commands
  const commands = parseShortletsForCommandPal(getShortlets())
  // system commands
  commands.push({
    name: 'Shortlet »',
    children: [
      {
        name: 'Open Shortlet options',
        handler: () => {
          callServiceWorker({ action: 'open_options' })
        },
      },
      {
        name: 'Load ShortletAPI',
        handler: () => {
          callServiceWorker({ action: 'load_api' })
        },
      },
      {
        name: 'Highlight Shortlets',
        handler: () => {
          if (dev_mode) console.log('====== Highlight start ======')
          getShortlets()
            .filter(s => s.shortcut)
            .forEach(s => {
              s.actions
                .filter(a => a.on)
                .forEach(a => {
                  if (document.querySelector(a.on)) {
                    if (dev_mode) console.log(a.on)
                    runShortlet({
                      actions: [
                        {
                          do: 'toggle_class',
                          on: a.on,
                          class: 'shortlet-highlight-element',
                        },
                        {
                          do: 'tooltip',
                          on: a.on,
                          text: s.id,
                          style: 'box-shadow:none;',
                        },
                      ],
                    })
                  }
                })
            })
          if (dev_mode) console.log('====== Highlight end ======')
        },
      },
    ],
  })
  // dev commands
  if (dev_mode) {
    commands.push({
      name: 'Developer Tools »',
      children: [
        {
          name: "Toggle 'Ignore Blur'",
          handler: () => {
            window.commandPalIgnoreBlur = typeof window.commandPalIgnoreBlur === 'undefined' ? false : !window.commandPalIgnoreBlur
          },
        },
      ],
    })
  }
  // add and start commandpal
  new CommandPal({
    commands: commands,
    hotkey: trigger,
    hotkeysGlobal: trigger_in_input,
    debugOutput: dev_mode,
    placeholder: ' ',
    emptyResultText: 'No Shortlets',
    hideButton: true,
    displayShortcutSymbols: true,
    shortcutOpenPalette: false,
    id: 'shortlet-command-pal',
  }).start()
  window.commandPalIgnoreBlur = dev_mode
})()
