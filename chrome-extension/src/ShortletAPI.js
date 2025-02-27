const ShortletAPI = (() => {
  //
  function selectOne(selector, match = undefined, in_view = false, from_point = false) {
    return selectAll(selector, match, in_view, from_point)[0]
  }
  //
  function selectAll(selector, match = undefined, in_view = false, from_point = false) {
    const els = [...document.querySelectorAll(selector)]
    const els_filt = els
      .filter(el => typeof match !== 'string' || matchInnerText(el, match))
      .filter(el => !in_view || inViewport(el))
      .filter(el => !from_point || isElementFromPoint(el))
    // console.log(els)
    // console.log('matchInnerText(el, match)', matchInnerText(els[0], match))
    // console.log('inViewport(el)', in_view, inViewport(els[0]))
    // console.log('isElementFromPoint(el)', from_point, isElementFromPoint(els[0]))
    // console.log(filt)
    return els_filt
  }
  function matchInnerText(el, value) {
    value = value.toLowerCase().trim()
    const text = el.innerText.toLowerCase().trim()
    const hit = text.match(new RegExp(value))
    return !el.innerHTML.startsWith('<') && text && value && hit !== null
  }
  //
  function isElementFromPoint(el) {
    const el_rect = el.getBoundingClientRect()
    try {
      const el_p = document.elementFromPoint(el_rect.left + el_rect.width / 2, el_rect.top + el_rect.height / 2)
      return el_p.isSameNode(el)
    } catch (e) {
      return undefined
    }
  }
  function inViewport(el) {
    return el.dataset.shortlets_viewport === 'true'
  }
  function unFocus() {
    const focus = document.querySelector(':focus')
    if (focus) dispatchEvent(focus, 'blur')
  }
  // const setValue = (el, text) => {
  //   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, text)
  //   el.dispatchEvent(new Event('input', { bubbles: true }))
  // }
  function setInput(el, attr, value) {
    callSetProperty(el, attr, value)
    dispatchKeyboardEvent(el, 'keydown')
    dispatchEvent(el, 'input')
    dispatchEvent(el, 'mousedown')
  }
  const setChecked = (el, value = undefined) => {
    if (typeof value !== 'string') value = 'checked'
    callSetProperty(el, 'checked', value)
    dispatchEvent(el, 'mousedown')
  }
  const dispatchEvent = (el, event, options = undefined) => {
    if (typeof options !== 'object') options = { bubbles: true }
    el.dispatchEvent(new Event(event, options))
  }
  const dispatchKeyboardEvent = (el, key = undefined, event = undefined, options = undefined) => {
    if (typeof event !== 'string') event = 'keydown'
    if (typeof options !== 'object') options = { bubbles: true }
    options.key = key
    el.dispatchEvent(new KeyboardEvent(event, options))
  }

  function callSetProperty(el, attr, value) {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attr).set.call(el, value)
  }

  function repeat(n, fn, o) {
    for (let i = 0; i < n; i++) fn(o)
  }

  // this is the Shortlet API ↓
  return {
    wait: o => {}, // o should include the property "delay" in ms, anyway it is cleaner to include a "delay" property in the _upcoming_ action
    goto: o => {
      if (o.append === true) window.location += o.url
      else window.location = o.url
    },
    goto_back: o => {
      history.back()
    },
    goto_forward: o => {
      history.forward()
    },
    log_all: o => {
      repeat(
        o.repeat,
        o => {
          console.log('Shortlet.log_all', selectAll(o.on, o.match))
        },
        o
      )
    },
    click: o => {
      dispatchEvent(selectOne(o.on, o.match, o.in === 'view'), 'click')
    },
    click_plain: o => {
      selectOne(o.on, o.match, o.in === 'view').click()
    },
    click_all: o => {
      selectAll(o.on, o.match, o.in === 'view').forEach(el => dispatchEvent(el, 'click'))
    },
    click_all_plain: o => {
      selectAll(o.on, o.match, o.in === 'view').forEach(el => el.click())
    },
    click_num: o => {},
    blur: () => {
      unFocus()
    },
    focus: o => {
      unFocus()
      dispatchEvent(selectOne(o.on, o.match, o.in === 'view'), 'focus')
    },
    select: o => {
      dispatchEvent(selectOne(o.on, o.match, o.in === 'view'), 'select')
    },
    select_plain: o => {
      selectOne(o.on, o.match).select()
    },
    add_class: o => {
      selectAll(o.on, o.match).forEach(el => el.classList.add(...o.class.split(' ')))
    },
    remove_class: o => {
      selectAll(o.on, o.match).forEach(el => el.classList.remove(...o.class.split(' ')))
    },
    toggle_class: o => {
      selectAll(o.on, o.match).forEach(el => el.classList.toggle(...o.class.split(' ')))
    },
    add_style_tag: o => {
      const s = document.createElement('style')
      s.textContent = o.text
      document.head.appendChild(s)
    },
    show: o => {
      o.type = o.type || 'block'
      selectAll(o.on, o.match).forEach(el => (el.style.display = o.type))
    },
    hide: o => {
      selectAll(o.on, o.match).forEach(el => (el.style.display = 'none'))
    },
    toggle: o => {
      o.type = o.type || 'block'
      selectAll(o.on, o.match).forEach(el => {
        if (el.style.display === 'none') el.style.display = o.type
        else el.style.display = 'none'
      })
    },
    input_plain: o => {
      o.value = o.value || o.text
      selectAll(o.on, o.match).forEach(el => (el.value = o.value))
    },
    input: o => {
      o.value = o.value || o.text
      setInput(selectOne(o.on, o.match), 'value', o.value)
    },
    html_attribute: o => {
      selectAll(o.on, o.match).forEach(el => callSetProperty(el, o.attribute, o.value))
    },
    scroll_by: o => {
      const el = selectOne(o.on, o.match)
      o.top = o.top || el.clientHeight
      o.left = o.left || 0
      el.scrollBy(o.left, o.top)
    },
    scroll_to: o => {
      o.top = o.top || 0
      o.left = o.left || 0
      selectOne(o.on, o.match).scrollTo(o.left, o.top)
    },
    check: o => {
      selectAll(o.on, o.match).forEach(el => setChecked(el, o.value))
    },
    copy: o => {
      navigator.clipboard.writeText(selectOne(o.on, o.match).innerText.trim())
    },
    copy_all: o => {
      navigator.clipboard.writeText(
        selectAll(o.on, o.match)
          .map(el => el.innerText.trim())
          .join('\n')
      )
    },
    iife: o => {
      window.location = `javascript:(function(){${o.script}})();`
    },
    duplicate: o => {
      selectAll(o.on, o.match).forEach(el => {
        const n = el.cloneNode(true)
        el.after(n)
        n.id = o.id
      })
    },
    set_attr: o => {
      o.attribute = o.attribute || o.attr
      selectAll(o.on, o.match).forEach(el => el.setAttribute(o.attribute, o.value))
    },
    set_text: o => {
      selectAll(o.on, o.match).forEach(el => (el.innerText = o.text))
    },
    style: o => {
      o.property = o.property || o.prop
      selectAll(o.on, o.match).forEach(el => (el.style[o.property] = o.value))
    },
    dispatch: o => {
      dispatchEvent(selectOne(o.on, o.match), o.event)
    },
    add_event: o => {
      selectAll(o.on, o.match).forEach(el =>
        el.addEventListener(o.event, () => {
          Shortlet.run(o.actions)
        })
      )
    },
    // not updated ↓

    reveal_data: o => {
      // get the contents of the property 'data-XXX' (set data to "XXX")
      // for all elements matching 'on'
      // and append it as a span to the child element 'target' (could be set to "*")
      // with the inline style 'style'
      o.style = typeof o.style !== 'undefined' ? o.style : 'padding:2px 5px'
      selectAll(o.on, o.match).forEach(el => {
        const out_el = document.createElement('span')
        const target = o.target !== 'undefined' ? el.querySelector(o.target) : el
        out_el.textContent = el.dataset[o.data]
        out_el.setAttribute('style', o.style)
        target.append(out_el)
      })
    },
    tooltip: o => {
      selectAll(o.on, o.match).forEach(el => {
        const rect = el.getBoundingClientRect()
        const out = document.createElement('span')
        out.textContent = o.text
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
      selectAll(o.on, o.match).forEach(async el => {
        const groups = el.innerText.match(new RegExp(o.text))
        if (groups) {
          groups.shift()
          const output = groups.join(o.join)
          const target = await selectOne('#' + el.getAttribute('for'))
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(target, output)
          target.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })
    },
    highlight: o => {},
    keyboard: o => {
      const el = typeof o.on === 'string' ? selectOne(o.on, o.match) : window
      dispatchKeyboardEvent(el, o.key, o.event, o.options)
    },
    dispatch_enter: o => {
      document.querySelector(o.on).dispatchEvent(
        new KeyboardEvent('keydown', {
          code: 'Enter',
          key: 'Enter',
          charCode: 13,
          keyCode: 13,
          view: window,
          bubbles: true,
        })
      )
    },
    dispatch_space: o => {
      document.querySelector(o.on).focus()
      document.querySelector(o.on).dispatchEvent(
        new KeyboardEvent('keydown', {
          which: 32,
          charCode: 32,
          keyCode: 32,
          view: window,
          bubbles: true,
        })
      )
    },
  }
})()
