const ShortletAPI = (() => {
  // internal helper functions
  // select the elements matching the selector o.on
  // filter by the regex o.text and by o.if: "view" (inViewport) and "front" (isFrontmost)
  //
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
      // return elements based on o.for
      return elms.slice(slice_map[o.for].start, slice_map[o.for].end)
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
  function dispatchEvent(elem, event, options = { bubbles: true }) {
    elem.dispatchEvent(new Event(event, options))
  }
  function dispatchKeyboardEvent(elem, event = 'keydown', key = 'Space', options = { bubbles: true }) {
    options.key = key
    elem.dispatchEvent(new KeyboardEvent(event, options)) // options {metaKey: true} (shiftKey, ctrlKey, altKey)
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
    dispatchKeyboardEvent(elem, 'keydown')
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
    if (target) elem.querySelector(target).append(span)
    else elem.after(span)
  }
  // return the Shortlet API
  return {
    // script control and utils
    wait: o => {
      // o.delay
    },
    log: o => {
      el(o).forEach(e => console.log('Shortlet.log: ', e))
    },
    highlight: o => {},
    // navigation
    goto: o => {
      if (typeof o.history === 'string') {
        if (o.history === 'back') history.back()
        if (o.history === 'forward') history.forward()
      }
      if (typeof o.url === 'string') {
        if (o.append === true) window.location += o.url
        else window.location = o.url
      }
    },
    // interaction
    click: o => {
      el(o).forEach(e => e.click())
    },
    double_click: o => {
      //el(o).forEach(e => e.click())
    },
    scroll_by: o => {
      const e = el(o)[0]
      o.top = o.top || e.clientHeight
      o.left = o.left || 0
      e.scrollBy(o.left, o.top)
    },
    scroll_to: o => {
      o.top = o.top || 0
      o.left = o.left || 0
      el(o)[0].scrollTo(o.left, o.top)
    },
    blur: () => {
      unFocus()
    },
    focus: o => {
      unFocus()
      el(o).forEach(e => e.focus())
    },
    select: o => {
      el(o).forEach(e => e.select())
    },
    copy: o => {
      navigator.clipboard.writeText(
        el(o)
          .map(e => e.innerText.trim())
          .join('\n')
      )
    },
    // visibility etc.
    show: o => {
      o.as = o.as || 'block'
      el(o).forEach(e => (e.style.display = o.as))
    },
    hide: o => {
      el(o).forEach(e => (e.style.display = 'none'))
    },
    toggle: o => {
      o.as = o.as || 'block'
      el(o).forEach(e => {
        if (e.style.display === 'none') e.style.display = o.as
        else e.style.display = 'none'
      })
    },
    // css
    style: o => {
      el(o).forEach(e => (e.style[o.property] = o.value))
    },
    add_class: o => {
      el(o).forEach(e => e.classList.add(...o.class.split(' ')))
    },
    remove_class: o => {
      el(o).forEach(e => e.classList.remove(...o.class.split(' ')))
    },
    toggle_class: o => {
      el(o).forEach(e => e.classList.toggle(...o.class.split(' ')))
    },
    stylesheet: o => {
      const s = document.createElement('style')
      s.textContent = o.css
      document.head.appendChild(s)
    },
    // forms
    input: o => {
      el(o).forEach(e => {
        if (o.use && o.use === 'plain') {
          e.value = o.value
        } else {
          setInput(e, 'value', o.value)
          if (o.key) dispatchKeyboardEvent(e, 'keydown', o.key)
        }
      })
    },
    check: o => {
      el(o).forEach(e => setChecked(e, o.value))
    },
    // dom manipulation
    write: this.set_text,
    set_text: o => {
      el(o).forEach(e => (e.innerText = o.text))
    },
    duplicate: o => {
      el(o).forEach(old => {
        const dup = old.cloneNode(true)
        old.after(dup)
        dup.id = o.id
      })
    },
    set: this.set_attribute,
    set_attribute: o => {
      o.attribute = o.attribute || o.attr
      el(o).forEach(e => e.setAttribute(o.attribute, o.value))
    },
    // event stuff
    dispatch: this.trigger,
    trigger: o => {
      el(o).forEach(e => dispatchEvent(e, o.event, o.options))
    },
    keypress: o => {
      let elms = el(o)
      if (elms.length === 0) elms = [window]
      elms.forEach(e => dispatchKeyboardEvent(e, o.event || 'keydown', o.key, o.options))
    },
    listen: o => {
      el(o).forEach(e =>
        e.addEventListener(o.for, () => {
          Shortlet.run(o.actions)
        })
      )
    },
    reveal_data: o => {
      el(o).forEach(e => addSpan(e, e.dataset[o.data] || '', o.target, o.style))
    },
    reveal: this.reveal_attribute,
    reveal_attribute: o => {
      o.attribute = o.attribute || o.attr
      el(o).forEach(e => addSpan(e, e.getAttribute(o.attribute) || '', o.target, o.style))
    },

    // spcial actions
    input_from: o => {
      const match = el({ ...o, on: o.from })[0].innerText.match(new RegExp(o.on || '.*'))
      if (match === null) return
      const output = match.length == 1 ? match[0] : match.shift().join(o.join || ' ')
      setInput(el({ ...o, on: o.on || o.to })[0], 'value', output)
    },
    // not updated ↓

    tooltip: o => {
      el(o).forEach(e => {
        const rect = e.getBoundingClientRect()
        const out = document.createElement('span')
        out.textContent = o.value
        out.classList.add('shortlet-tooltip')
        out.setAttribute('style', `left:${rect.left}px;top:${rect.top - 15}px;${o.style || ''}`)
        document.body.append(out)
      })
    },
    copy_paste_label: o => {
      // get value(s) from selector with regex
      // find target or matching input field and paste
      // using react change event
      o.join = typeof o.join !== 'undefined' ? o.join : ' '
      el(o).forEach(async e => {
        const groups = e.innerText.match(new RegExp(o.on))
        if (groups) {
          groups.shift()
          const output = groups.join(o.join)
          const target = await el1('#' + e.getAttribute('for'))
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(target, output)
          target.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })
    },
  }
})()
