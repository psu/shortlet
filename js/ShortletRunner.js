var ShortletRunner = (() => {
  const delay = 0
  const run = (shortlet = undefined) => {
    if (typeof shortlet === 'undefined') return
    // make sure we have an array
    if (!Array.isArray(shortlet.actions)) shortlet.actions = [shortlet.actions]
    if (typeof shortlet.repeat !== 'number' || shortlet.repeat < 0) shortlet.repeat = 1

    const queue = new ShortletQueue()
    // add all actions in the array to the queue as functions wrapped in try…catch

    for (let i = 0; i < shortlet.repeat; i++) {
      shortlet.actions.forEach(a => {
        if (typeof ShortletActions[a.do] !== 'function') throw `${a.do} is not a function`
        const item = () => {
          try {
            ShortletActions[a.do](a)
            logSuccess(a)
          } catch (err) {
            if (typeof a.fallback === 'object') {
              try {
                ShortletActions[a.do](a.fallback)
                logSuccess({ do: `${a.do} (fallback)`, ...a.fallback })
              } catch (err) {
                logError(err, `${a.do} (fallback)`, a.fallback)
              }
            } else {
              logError(err, a.do, a)
            }
          }
        }
        queue.add(item, a.delay)
      })
    }

    // start executing the queue
    queue.start()
  }

  const load = (shortlets = undefined) => {
    return shortlets.shortlets.filter(s => window.location.href.indexOf(s.url) != -1)
  }

  const logSuccess = (action = '') => {
    //if (!shortlet_logging) return
    let text = `🦾${action.do}`
    if (typeof action === 'object') {
      text = `🦾${action.do}   (`
      delete action.do
      text += Object.entries(action)
        .map(o => `${o[0]}: ${JSON.stringify(o[1])}`)
        .join(', ')
      text += ')'
    }
    console.log(`ShortletRunner: ${text}`)
  }

  const logError = (err = '', action = '', o = {}) => {
    //if (!shortlet_logging) return
    console.log(`ShortletRunner: Error for action '${action}'\n${JSON.stringify(o)}\n${err}`)
  }
  return { run: run, load: load }
})()
