const saveAction = action => {
  console.log('Save action:', action)
}
const saveShortlet = shortlet => {
  console.log('Save shortlet:', shortlet)
}
const loadShortlets = shortlets => {
  console.log('LoadShortlets')
}
const getLoaded = () => {
  return getAllShortlets().shortlets.filter(s => window.location.href.indexOf(s.url) != -1)
}
const getAllShortlets = () => all_shortlets

const logSuccess = (a = '') => {
  if (typeof logging === 'undefined') return
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
  console.log(`ShortletRunner: ${text}`)
}

const logError = (err = '', action = '', o = {}) => {
  if (typeof logging === 'undefined') return
  console.log(`ShortletRunner: Error for action '${action}'\n${JSON.stringify(o)}\n${err}`)
}
