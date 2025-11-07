;(async () => {
  // get options from storage
  const trigger = await callServiceWorker({ action: 'get_storage', key: 'trigger' })
  const trigger_in_input = await callServiceWorker({ action: 'get_storage', key: 'trigger_in_input' })
  const shortlets_list = JSON.parse(await callServiceWorker({ action: 'get_storage', key: 'shortlets_list' }))
  const dev_mode = await callServiceWorker({ action: 'get_storage', key: 'dev_mode' })
  // get shortlets for the current webpage
  function getShortlets() {
    const list = shortlets_list.shortlets.filter(s => window.location.href.match(s.conditions.url) !== null)
    if (dev_mode) console.log('Shortlets loaded.', list)
    return list
  }
  // intra-extension communication
  function callServiceWorker(msg) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, res => {
        if (res.error) reject(res.error)
        resolve(res.data)
      })
    })
  }
  const preActions = async action => {
    await updateElementsViewport([...document.querySelectorAll(action.on)].flat())
  }
  // helper to wrap and queue a single action
  function queueAction(q, a) {
    // logging templates
    const logSuccess = action => {
      console.log(`Shortlet "${action.do}" ✔️`, action)
    }
    const logError = (err = '', action = '', obj = {}) => {
      console.log(`Shortlet "${action} 🚫": ${err}`, obj)
    }
    const wrapAction = () => {
      preActions(a).then(() => {
        try {
          ShortletAPI[a.do](a)
          if (dev_mode) logSuccess(a)
        } catch (err) {
          if (typeof a.fallback === 'object') {
            try {
              ShortletAPI[a.do](a.fallback)
              if (dev_mode) logSuccess({ do: `${a.do}:fallback`, ...a.fallback })
            } catch (err) {
              if (dev_mode) logError(err, `${a.do}:fallback`, a)
            }
          } else {
            if (dev_mode) logError(err, a.do, a)
          }
        }
      })
    }
    q.add(wrapAction, a.delay)
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
    if (shlts.length == 0) return []
    return shlts
      .filter(s => s.title)
      .map(s => ({
        name: s.title,
        //        description: s.description || `Executes ${s.actions.length} actions`,
        shortcut: s.shortcut,
        handler: async () => {
          runShortlet(s)
        },
      }))
  }
  //
  // function extractActionsFromShortlets(shlts) {
  //   return shlts
  //     .filter(s => s.actions)
  //     .map(s => s.actions)
  //     .flat()
  // }
  // //
  // function extractFallbacksFromActions(actions) {
  //   return actions
  //     .filter(a => a.fallback)
  //     .map(a => a.fallback)
  //     .flat()
  // }
  // //
  // function updateShortletDataAttributes(shlts) {
  //   if (!Array.isArray(shlts)) shlts = [shlts]
  //   let actions = extractActionsFromShortlets(shlts)
  //   actions = [...actions, ...extractFallbacksFromActions(actions)].filter(a => a && typeof a.if === 'string' && a.if.match(/view/i) !== null).flat()
  //   updateActionsDataAttributes(actions)
  // }
  //
  async function updateElementsViewport(els) {
    if (!Array.isArray(els)) els = [els]
    // filter doesn't work with promises so two steps are needed https://stackoverflow.com/questions/47095019/how-to-use-array-prototype-filter-with-async
    const els_viewport = await Promise.all(els.map(observeInViewPort))
    els.forEach((el, index) => {
      el.setAttribute('data-shortlets_viewport', els_viewport[index])
    })
    //if (dev_mode) console.log('Shortlet Viewport updated', els)
  }
  //
  function observeInViewPort(el) {
    return new Promise((resolve, reject) => {
      const observer = new IntersectionObserver(entries => {
        resolve(entries[0].isIntersecting)
      })
      observer.observe(el)
      setTimeout(() => {
        observer.unobserve(el)
        // console.log(`Unobserving element: ${el.innerText} (was: ${el.dataset.shortlets_viewport})`)
        observer.disconnect()
      }, 10)
    })
  }
  // function observeMutations() {
  //   new MutationObserver((mutationList, observer) => {
  //     for (const mutation of mutationList) {
  //       if (mutation.type === 'childList') {
  //         console.log('A child node has been added or removed.')
  //       } else if (mutation.type === 'attributes') {
  //         console.log(`The ${mutation.attributeName} attribute was modified.`)
  //       }
  //     }
  //   }).observe(document.body, { attributes: true, childList: true, subtree: true })
  // }
  // observeMutations()
  // shortlets as commands
  const page_shortlets = getShortlets()
  const commands = parseShortletsForCommandPal(page_shortlets)
  // system commands
  commands.push({
    name: '⚙️ Settings…',
    children: [
      {
        name: 'Open extension options',
        handler: () => {
          callServiceWorker({ action: 'open_options' })
        },
      },
      {
        name: 'Highlight all Shortlets',
        handler: () => {
          if (dev_mode) console.log('====== Highlight start ======')
          const highlight_actions = page_shortlets
            .filter(s => s.shortcut)
            .map(s => {
              return s.actions
                .filter(a => a.on)
                .map(a => {
                  if (dev_mode) console.log(a.on)
                  return [
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
                  ]
                })
            })
          runShortlet({ actions: highlight_actions.flat(2) })

          if (dev_mode) console.log('====== Highlight end ======')
        },
      },
    ],
  })
  // dev commands
  if (dev_mode) {
    commands.push({
      name: '🛠️ Developer Tools…',
      children: [
        {
          name: 'Load ShortletAPI.js',
          description: 'into this world…',
          handler: () => {
            callServiceWorker({ action: 'load_api' })
          },
        },
        {
          name: "Toggle 'Ignore Blur'",
          handler: () => {
            window.commandPalIgnoreBlur = typeof window.commandPalIgnoreBlur === 'undefined' ? false : !window.commandPalIgnoreBlur
          },
        },
      ],
    })
  }
  // add and start command-pal
  const cmd = new CommandPal({
    commands: commands,
    hotkey: trigger,
    hotkeysGlobal: trigger_in_input,
    debugOutput: dev_mode,
    placeholder: 'Search for shortlets…',
    emptyResultText: 'No Shortlets',
    hideButton: true,
    displayShortcutSymbols: true,
    shortcutOpenPalette: false,
    id: 'shortlet-command-pal',
  })
  cmd.start()

  if (dev_mode)
    console.log(
      ` _______      __                    _ __  __     _      __    __       _ __\n/_  __(_)__  / /_____ ____  _    __(_) /_/ /    | | /| / /__ / /  ___ (_) /____ ___\n / / / / _ \\/  \\_/ -_) __/ | |/|/ / / __/ _ \\   | |/ |/ / -_) _ \\(_-</ / __/ -_|_-<\n/_/ /_/_//_/_/\\_\\\\__/_/    |__,__/_/\\__/_//_/   |__/|__/\\__/_.__/___/_/\\__/\\__/___/`
    )
  return {
    run: actions => {
      if (typeof actions === 'string') actions = shortlets_list.filter(s => s.id == actions)[0].actions
      runShortlet({ actions })
    },
    dev: dev_mode,
  }
})().then(expo => {
  window.Shortlet = expo
})
