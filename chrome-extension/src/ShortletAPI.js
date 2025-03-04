const ShortletAPI = (() => {
  // internal helper functions
  // select the elements matching the selector o.on and the regex o.text
  function el(o) {
    if (typeof o.on !== 'string') return []
    if (typeof o.on !== 'string') o.on = undefined
    if (typeof o.if !== 'string') o.if = ''
    let elms = Array.from(document.querySelectorAll(o.on))
    if (o.text) elms = elms.filter(e => matchInnerText(e, o.text))
    if (o.if.match(/view/i) !== null) elms = elms.filter(e => inViewport(e))
    if (o.if.match(/front/i) !== null) elms = elms.filter(e => isElementFromPoint(e))
    return elms
  }
  //
  function el1(o) {
    return el(o)[0]
  }
  function dispatchEvent(elem, event, options = { bubbles: true }) {
    elem.dispatchEvent(new Event(event, options))
  }
  function dispatchKeyboardEvent(elem, event = 'keydown', key, options = { bubbles: true }) {
    options.key = key
    elem.dispatchEvent(new KeyboardEvent(event, options)) // options {metaKey: true} (shiftKey, ctrlKey, altKey)
  }
  function setInputProperty(elem, attr, value) {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attr).set.call(elem, value)
  }
  //
  function matchInnerText(elem, value) {
    value = value.toLowerCase().trim()
    const text = elem.innerText.toLowerCase().trim()
    if (!text || !value) return true // if either is empty, return true to disable the filter
    if (text.startsWith('<')) return false // do not try to match HTML
    return text.match(new RegExp(value)) !== null
  }
  //
  function isElementFromPoint(elem) {
    const rect = elem.getBoundingClientRect()
    // console.log(`isElementFromPoint: ${elem} rect: ${JSON.stringify(rect)}`)
    try {
      const frontmost = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      // console.log(`frontmost: ${JSON.stringify(frontmost)}, x: ${rect.left + rect.width / 2}, y: ${rect.top + rect.height / 2}`)
      return frontmost.isSameNode(elem)
    } catch (err) {
      // console.log(`isElementFromPoint: ${err}`)
      return true
    }
  }
  function inViewport(e) {
    return e.dataset.shortlets_viewport === 'true'
  }
  function unFocus() {
    const has_focus = document.querySelector(':focus')
    if (has_focus) has_focus.blur()
  }
  // const setValue = (el, text) => {
  //   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, text)
  //   el.dispatchEvent(new Event('input', { bubbles: true }))
  // }
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

  // return the Shortlet API
  return {
    // script control
    wait: o => {}, // o should include the property "delay" in ms, anyway it is cleaner to include a "delay" property in the _upcoming_ action
    log_all: o => {
      console.log('Shortlet.log_all', el(o))
    },
    // navigation
    goto: o => {
      // {append: true, url: '#app/state'}
      if (o.append === true) window.location += o.url
      else window.location = o.url
    },
    goto_back: o => {
      history.back()
    },
    goto_forward: o => {
      history.forward()
    },
    // interaction
    click: o => {
      el1(o).click()
    },
    click_all: o => {
      el(o).forEach(e => e.click())
    },
    scroll_by: o => {
      const e = el1(o)
      o.top = o.top || e.clientHeight
      o.left = o.left || 0
      e.scrollBy(o.left, o.top)
    },
    scroll_to: o => {
      o.top = o.top || 0
      o.left = o.left || 0
      el1(o).scrollTo(o.left, o.top)
    },
    blur: () => {
      unFocus()
    },
    focus: o => {
      unFocus()
      el1(o).focus()
    },
    select: o => {
      el1(o).select()
    },
    copy: o => {
      navigator.clipboard.writeText(el1(o).innerText.trim())
    },
    copy_all: o => {
      navigator.clipboard.writeText(
        el(o)
          .map(e => e.innerText.trim())
          .join('\n')
      )
    },
    // visibility etc.
    show: o => {
      o.as = o.as || 'block'
      el1(o).style.display = o.as
    },
    show_all: o => {
      o.as = o.as || 'block'
      el(o).forEach(e => (e.style.display = o.as))
    },
    hide: o => {
      el1(o).style.display = 'none'
    },
    hide_all: o => {
      el(o).forEach(e => (e.style.display = 'none'))
    },
    toggle: o => {
      o.as = o.as || 'block'
      const e = el1(o)
      if (e.style.display === 'none') e.style.display = o.as
      else e.style.display = 'none'
    },
    toggle_all: o => {
      o.as = o.as || 'block'
      el(o).forEach(e => {
        if (e.style.display === 'none') e.style.display = o.as
        else e.style.display = 'none'
      })
    },
    // css
    style: o => {
      el1(o).style[o.property] = o.value
    },
    style_all: o => {
      el(o).forEach(e => (e.style[o.property] = o.value))
    },
    add_class: o => {
      el1(o).classList.add(...o.class.split(' '))
    },
    add_class_all: o => {
      el(o).forEach(e => e.classList.add(...o.class.split(' ')))
    },
    remove_class: o => {
      el1(o).classList.remove(...o.class.split(' '))
    },
    remove_class_all: o => {
      el(o).forEach(e => e.classList.remove(...o.class.split(' ')))
    },
    toggle_class: o => {
      el1(o).classList.toggle(...o.class.split(' '))
    },
    toggle_class_all: o => {
      el(o).forEach(e => e.classList.toggle(...o.class.split(' ')))
    },
    stylesheet: o => {
      const s = document.createElement('style')
      s.textContent = o.css
      document.head.appendChild(s)
    },
    // forms
    input: o => {
      const e = el1(o)
      setInput(e, 'value', o.value)
      if (o.key) dispatchKeyboardEvent(e, 'keydown', o.key)
    },
    input_plain: o => {
      el1(o).value = o.value
    },
    check: o => {
      setChecked(el1(o), o.value)
    },
    check_all: o => {
      el(o).forEach(e => setChecked(e, o.value))
    },
    // dom manipulation
    change: o => {
      el1(o).innerText = o.text
    },
    change_all: o => {
      el(o).forEach(e => (e.innerText = o.text))
    },
    duplicate: o => {
      const old = el1(o)
      const dup = old.cloneNode(true)
      old.after(dup)
      dup.id = o.id
    },
    duplicate_all: o => {
      el(o).forEach(old => {
        const dup = old.cloneNode(true)
        old.after(dup)
        dup.id = o.id
      })
    },
    attribute: o => {
      o.attribute = o.attribute || o.attr
      el1(o).setAttribute(o.attribute, o.value)
    },
    attribute_all: o => {
      o.attribute = o.attribute || o.attr
      el(o).forEach(e => e.setAttribute(o.attribute, o.value))
    },
    // event stuff
    trigger: o => {
      dispatchEvent(el1(o), o.event, o.options)
    },
    trigger_all: o => {
      el(o).forEach(e => dispatchEvent(e, o.event, o.options))
    },
    keypress: o => {
      const e = typeof o.on === 'string' ? el1(o) : window
      dispatchKeyboardEvent(e, o.event || 'keydown', o.key, o.options)
    },
    listen: o => {
      el(o).forEach(e =>
        e.addEventListener(o.for, () => {
          Shortlet.run(o.actions)
        })
      )
    },
    // spcial actions
    input_from: o => {
      const match = el1({ ...o, on: o.from }).innerText.match(new RegExp(o.on || '.*'))
      if (match === null) return
      const output = match.length == 1 ? match[0] : match.shift().join(o.join || ' ')
      setInput(el1({ ...o, on: o.on || o.to }), 'value', output)
    },
    // not updated ↓

    reveal_data: o => {
      // get the contents of the property 'data-XXX' (set data to "XXX")
      // for all elements matching 'on'
      // and append it as a span to the child element 'target' (could be set to "*")
      // with the inline style 'style'
      o.style = typeof o.style !== 'undefined' ? o.style : 'padding:2px 5px'
      el(o).forEach(e => {
        const out_el = document.createElement('span')
        const target = o.target !== 'undefined' ? el.querySelector(o.target) : el
        out_el.textContent = e.dataset[o.data]
        out_el.setAttribute('style', o.style)
        target.append(out_el)
      })
    },
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
    highlight: o => {},
  }
})()
