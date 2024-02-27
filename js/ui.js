const ShowUI = () => {
  if (window.___shortlet.loaded.length > 0) {
    console.log('Show UI with items:', format(window.___shortlet.loaded))
    return
  }
  console.log({ items: [{ title: `No Shortlets found for '${window.location.href}'` }] })

  function format(shortlets) {
    if (shortlets.length > 0) {
      return {
        items: shortlets.map(s => ({
          title: s.title,
          uid: s.url + '_' + s.id,
          id: s.id,
          subtitle: `Executes ${s.actions.length} actions`,
          arg: s.id,
        })),
      }
    }
  }
}
