const ShortletAPI = (() => {
  // internal helper functions
  //
  // select the elements matching the selector o.on
  // filter by the regex o.text and by o.if: "view" (inViewport) and "front" (isFrontmost)
  function el(o) {
    // mandatory
    if (typeof o.on !== 'string') return []
    // defaults
    if (typeof o.on !== 'string') o.on = undefined
    if (typeof o.if !== 'string') o.if = ''
    if (typeof o.for !== 'string') o.for = 'first'
    try {
      // select and filter elements
      let elms = Array.from(document.querySelectorAll(o.on))
      if (o.text) elms = elms.filter(e => matchInnerText(e, o.text))
      if (o.if.match(/view/i) !== null) elms = elms.filter(e => inViewport(e))
      if (o.if.match(/front/i) !== null) elms = elms.filter(e => isFrontmost(e))
      if (o.for === 'random') return elms.slice((r = rand(1, elms.length)), r - 1)
      elms = elms.slice(slice_map[o.for].start, slice_map[o.for].end)
      if (elms.length === 0) throw new Error(`No elements found for: `, o.on)
      return elms
    } catch (err) {
      console.log(`Shortlet el() error: \n`, err)
    }
  }
  // helpers to filter elements
  function matchInnerText(elem, text) {
    const inner_text = elem.innerText.toLowerCase().trim()
    return inner_text !== '' && inner_text.match(new RegExp(text.toLowerCase().trim())) !== null
  }
  function isFrontmost(elem) {
    try {
      const rect = elem.getBoundingClientRect()
      return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2).isSameNode(elem)
    } catch (err) {
      return true
    }
  }
  function inViewport(e) {
    return e.dataset.shortlets_viewport === 'true'
  }
  // utils
  const slice_map = {
    first: { start: 0, end: 1 },
    last: { start: -1 },
    each: { start: 0 },
    all: { start: 0 },
    but_last: { start: 0, end: -1 },
    but_first: { start: 1 },
  }
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  // helper functions for the actions
  function dispatchEvent(elem, event, options = {}) {
    options = { bubbles: true, cancelable: true, view: window, key: 'Space', ...options }
    let ev
    if (event.match(/mouse|click/i) !== null) {
      ev = new MouseEvent(event, options)
    } else if (event.match(/key/i) !== null) {
      ev = new KeyboardEvent(event, options)
    } else {
      ev = new Event(event, options)
    }
    elem.dispatchEvent(ev)
  }
  function ispatchKeyboardEvent(elem, event = 'keydown', key = 'Space', options = { bubbles: true, cancelable: true, view: window }) {
    options.key = key
    elem.ispatchEvent(new KeyboardEvent(event, options)) // options {metaKey: true} (shiftKey, ctrlKey, altKey)
  }
  function ispatchMouseEvent(elem, event = 'click', options = { bubbles: true, cancelable: true, view: window }) {
    elem.ispatchEvent(new MouseEvent(event, options))
  }
  function setInputProperty(elem, attr, value) {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attr).set.call(elem, value)
  }
  function unFocus() {
    const has_focus = document.querySelector(':focus')
    if (has_focus) has_focus.blur()
  }
  function setInput(elem, attr, value) {
    setInputProperty(elem, attr, value)
    dispatchEvent(elem, 'keydown', { key: 'Space' })
    dispatchEvent(elem, 'input')
    dispatchEvent(elem, 'mousedown')
  }
  function setChecked(elem, value = 'checked') {
    setInputProperty(elem, 'checked', value)
    dispatchEvent(elem, 'mousedown')
  }
  function addSpan(elem, text, target, style = 'padding:2px 5px') {
    const span = document.createElement('span')
    span.textContent = text
    span.setAttribute('style', style)
    const out = elem.querySelector(target) || elem.parentElement.parentElement || elem.parentElement
    out.append(span)
  }
  function textMatchJoin(source, pattern, delimiter = '') {
    const match = source.match(new RegExp(pattern || '.*'))
    if (match === null) return ''
    if (match.length === 1) return match[0]
    return match.slice(1).join(delimiter)
  }
  // define Shortlet API
  const _ = {}
  _.wait = o => {} // o.delay
  _.log = o => el(o).forEach(e => console.log('Shortlet.log: ', e))
  _.highlight = o => {}
  _.goto = o => {
    if (typeof o.history === 'string') {
      if (o.history === 'back') history.back()
      if (o.history === 'forward') history.forward()
    }
    if (typeof o.url === 'string') {
      if (o.append === true) window.location += o.url
      else window.location = o.url
    }
  }
  _.click = o => el(o).forEach(e => e.click())
  _.scroll_by = o => {
    const e = el(o)[0]
    o.top = o.top || e.clientHeight
    o.left = o.left || 0
    e.scrollBy(o.left, o.top)
  }
  _.scroll_to = o => el(o)[0].scrollTo(o.left || 0, o.top || 0)
  _.blur = () => unFocus()
  _.focus = o => {
    unFocus()
    el(o).forEach(e => e.focus())
  }
  _.select = o => el(o).forEach(e => e.select())
  _.copy = o =>
    navigator.clipboard.writeText(
      el(o)
        .map(e => e.innerText.trim())
        .join(o.delimiter || '\n')
    )

  _.show = o =>
    el(o).forEach(e => {
      e.style.display = o.as || 'block'
      e.style.opacity = 1
    })
  _.hide = o => el(o).forEach(e => (e.style.display = 'none'))
  _.toggle = o =>
    el(o).forEach(e => {
      if (e.style.display === 'none') e.style.display = o.as || 'block'
      else e.style.display = 'none'
    })
  _.style = o => el(o).forEach(e => (e.style[o.property] = o.value))
  _.add_class = o => el(o).forEach(e => e.classList.add(...o.class.split(' ')))
  _.remove_class = o => el(o).forEach(e => e.classList.remove(...o.class.split(' ')))
  _.toggle_class = o => el(o).forEach(e => e.classList.toggle(...o.class.split(' ')))
  _.stylesheet = o => {
    const s = document.createElement('style')
    s.textContent = o.css
    document.head.appendChild(s)
  }
  _.input = o =>
    el(o).forEach(e => {
      if (o.use && o.use === 'plain') e.value = o.value
      else setInput(e, 'value', o.value)
    })
  _.check = o =>
    el(o).forEach(e => {
      if (o.use && o.use === 'plain') e.checked = o.value
      else setChecked(e, o.value)
    })
  _.set_text = o => el(o).forEach(e => (e.innerText = o.value))
  _.write = _.set_text
  _.duplicate = o =>
    el(o).forEach(old => {
      const dup = old.cloneNode(true)
      old.after(dup)
      dup.id += o.id
    })
  _.set_attribute = o => {
    o.attribute = o.attribute || o.attr
    el(o).forEach(e => e.setAttribute(o.attribute, o.value))
  }
  _.set = _.set_attribute
  _.dispatch = o => {
    let elms = el(o)
    if (elms.length === 0) elms = [window]
    elms.forEach(e => dispatchEvent(e, o.event || 'keydown', { key: o.key || 'Space', ...JSON.parse(o.options || '{}') }))
  }
  _.keypress = _.dispatch
  _.mouse = _.dispatch
  _.trigger = _.dispatch
  _.listen = o =>
    el(o).forEach(e =>
      e.addEventListener(o.for, () => {
        Shortlet.run(o.actions)
      })
    )
  _.reveal_data = o => el(o).forEach(e => addSpan(e, textMatchJoin(e.dataset[o.data], o.match, o.delimiter), o.target, o.style))
  _.reveal_attribute = o => el(o).forEach(e => addSpan(e, textMatchJoin(e.getAttribute(o.attribute || o.attr), o.match, o.delimiter), o.target, o.style))
  _.reveal = _.reveal_attribute
  _.input_from = o =>
    el({ ...o, on: o.from || o.on }).forEach(from => {
      const text = textMatchJoin(from.innerText, o.match, o.delimiter)
      el({ ...o, on: o.to }).forEach(to => setInput(to, 'value', text))
    })
  _.tooltip = o =>
    el(o).forEach(e => {
      const rect = e.getBoundingClientRect()
      const out = document.createElement('span')
      out.textContent = o.value
      out.classList.add('shortlet-tooltip')
      out.setAttribute('style', `left:${rect.left}px;top:${rect.top - 15}px;${o.style || ''}`)
      document.body.append(out)
    })
  return _
})()
