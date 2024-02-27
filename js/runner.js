const runner = id => {
  const shortlet = getLoaded().filter(s => s.id === id)[0]
  // assert format
  if (!Array.isArray(shortlet.actions)) shortlet.actions = [shortlet.actions]
  if (typeof shortlet.repeat !== 'number' || shortlet.repeat < 0) shortlet.repeat = 1

  const queue = new Queue()
  // add all actions in the array to the queue as functions wrapped in try…catch

  for (let i = 0; i < shortlet.repeat; i++) {
    shortlet.actions.forEach(a => {
      const item = () => {
        try {
          actions[a.do](a)
          logSuccess(a)
        } catch (err) {
          if (typeof a.fallback === 'object') {
            try {
              actions[a.do](a.fallback)
              logSuccess({ do: `${a.do}:fallback`, ...a.fallback })
            } catch (err) {
              logError(err, `${a.do}:fallback`, a)
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
