const actions = (function () {
  const selectOne = s => {
    return document.querySelector(s)
  }
  const selectAll = s => {
    return Object.entries(document.querySelectorAll(s)).map(o => o[1])
  }
  const matchInnerText = (el, t) => {
    return el.innerText.toLowerCase().trim().match(t) !== null
  }
  const isFrontmost = el => {
    const el_rect = el.getBoundingClientRect()
    return document
      .elementFromPoint(el_rect.left + el_rect.width / 2, el_rect.top + el_rect.height / 2)
      .isSameNode(el)
  }
  const clickIt = el_list => {
    if (!Array.isArray(el_list)) el_list = [el_list]
    if (el_list.length > 0) el_list.forEach(el => el.click())
    else throw new Error('No elements found')
  }
  const blur = o => {
    if (selectOne(':focus') !== null) selectOne(':focus').blur()
  }
  // const setValue = (el, text) => {
  //   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, text)
  //   el.dispatchEvent(new Event('input', { bubbles: true }))
  // }
  const setInput = (el, attr, value, event = undefined) => {
    if (typeof event !== 'string') event = 'input'
    callSetProperty(el, attr, value)
    dispatchEvent(el, event)
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

  const callSetProperty = (el, attr, value) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attr).set.call(el, value)
  }
  //
  return {
    goto: o => {
      if (o.append === true) window.location += o.url
      else window.location = o.url
    },
    back: o => {
      history.back()
    },
    forward: o => {
      history.forward()
    },
    click: o => {
      if (typeof o.text === 'string') {
        clickIt(
          selectAll(o.on)
            .filter(el => matchInnerText(el, o.text))
            .filter(el => isFrontmost(el))
            .slice(0, 1)
        )
      } else {
        clickIt(selectOne(o.on))
      }
    },
    click_all: o => {
      if (typeof o.text === 'string')
        clickIt(selectAll(o.on).filter(el => matchInnerText(el, o.text)))
      else clickIt(selectAll(o.on))
    },
    blur: blur,
    focus: o => {
      blur()
      selectOne(o.on).focus()
    },
    select: o => {
      selectOne(o.on).select()
    },
    add_class: o => {
      selectAll(o.on).forEach(el => el.classList.add(...o.class.split(' ')))
    },
    remove_class: o => {
      selectAll(o.on).forEach(el => el.classList.remove(...o.class.split(' ')))
    },
    toggle_class: o => {
      selectAll(o.on).forEach(el => el.classList.toggle(...o.class.split(' ')))
    },
    show: o => {
      if (typeof o.type !== 'string') o.type = 'block'
      selectAll(o.on).forEach(el => (el.style.display = o.type))
    },
    hide: o => {
      selectAll(o.on).forEach(el => (el.style.display = 'none'))
    },
    toggle: o => {
      if (typeof o.type !== 'string') o.type = 'block'
      selectAll(o.on).forEach(el => {
        if (el.style.display === 'none') el.style.display = o.type
        else el.style.display = 'none'
      })
    },
    input: o => {
      setInput(selectOne(o.on), 'input', o.text, 'input')
    },
    html_attribute: o => {
      selectAll(o.on).forEach(el => setInput(el, o.attribute, o.value, 'mouseup'))
    },
    check: o => {
      selectAll(o.on).forEach(el => triggerEvent(el, 'click'))
    },
    reveal_data: o => {
      // get the contents of the property 'data-XXX' (set data to "XXX")
      // for all elements matching 'on'
      // and append it as a span to the child element 'target' (could be set to "*")
      // with the inline style 'style'
      o.style = typeof o.style !== 'undefined' ? o.style : 'padding:2px 5px'
      selectAll(o.on).forEach(el => {
        const out_el = document.createElement('span')
        const target = o.target !== 'undefined' ? el.querySelector(o.target) : el
        out_el.textContent = el.dataset[o.data]
        out_el.setAttribute('style', o.style)
        target.append(out_el)
      })
    },
    copy_paste_label: o => {
      // get value(s) from selector with regex
      // find target or matching input field and paste
      // using react change event
      o.join = typeof o.join !== 'undefined' ? o.join : ' '
      selectAll(o.on).forEach(el => {
        const groups = el.innerText.match(new RegExp(o.text))
        if (groups) {
          groups.shift()
          const output = groups.join(o.join)
          const target = selectOne('' + el.getAttribute('for'))
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(
            target,
            output
          )
          target.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })
    },
    highlight: o => {},
    keyboard: o => {
      const el = typeof o.on === 'string' ? selectOne(o.on) : window
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
