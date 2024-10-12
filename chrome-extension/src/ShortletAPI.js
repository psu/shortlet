const ShortletAPI = (() => {
  function selectOne(s) {
    return document.querySelector(s)
  }
  function selectAll(s) {
    return Object.entries(document.querySelectorAll(s)).map(o => o[1])
  }
  function selectOneWithText(s, t) {
    let elements = selectAll(s).filter(el => matchInnerText(el, t))
    if (elements.length == 0) throw new Error('Shortlet: No elements found')
    if (elements.length > 1) elements = elements.filter(async el => (await isInViewPort(el)) && isElementFromPoint(el))
    if (elements.length > 1) throw new Error(`Shortlet: Too many elements found (${elements.length})`)
    return elements[0]
  }
  function selectAllWithText(s, t) {
    return selectAll(s).filter(el => matchInnerText(el, t))
  }
  function matchInnerText(el, t) {
    return el.innerText.toLowerCase().trim().match(t.toLowerCase().trim()) !== null
  }
  function isInViewPort(element) {
    return new Promise((resolve, reject) => {
      const observer = new IntersectionObserver(entries => {
        resolve(entries[0].isIntersecting)
      })
      observer.observe(element)
      setTimeout(() => {
        observer.unobserve(element)
        observer.disconnect()
      }, 10)
    })
  }
  function getCSSRecursive(el, prop) {
    const ignore_list = ['auto', 'none', 'inherit', 'initial', 'revert', 'unset']
    if (el.tagName === 'BODY') {
      const o = document.createElement('div')
      o[prop] = 0
      return o
    } //throw new Error(`Shortlet: No parent have an explicit value set for '${prop}'`)
    const style = getComputedStyle(el)
    if (!ignore_list.includes(style[prop])) {
      return el
    } else {
      return getCSSRecursive(el.parentElement, prop)
    }
  }
  function reduceOnHighestCSS(el_list, prop) {
    if (el_list.length < 2) return el_list
    return el_list.reduce((el_acc, el) => {
      const el_ancestor_value = getComputedStyle(getCSSRecursive(el, prop))[prop]
      const el_acc_ancestor_value = getComputedStyle(getCSSRecursive(el_acc, prop))[prop]
      return el_acc_ancestor_value > el_ancestor_value ? el_acc : el
    })
  }
  function getFrontmost(el_list) {
    reduceOnHighestCSS(el_list, 'zIndex')
  }
  function isElementFromPoint(el) {
    const el_rect = el.getBoundingClientRect()
    try {
      const el_p = document.elementFromPoint(el_rect.left + el_rect.width / 2, el_rect.top + el_rect.height / 2)
      return el_p.isSameNode(el)
    } catch (e) {
      //if (dev_mode) console.log('Shortlet: No element from point.', el_rect)
      return false
    }
  }
  // isCSSVisible - recursive function checking element and it's parents for
  // getComputedStyle(document.querySelector('.sc-eBHJIF.gcQAcw').parentElement).display ==="none" (not "none" doesn't mean it is visible…)
  function clickIt(el_list) {
    if (!Array.isArray(el_list)) el_list = [el_list]
    if (el_list.length > 0) el_list.forEach(el => el.click())
    else throw new Error('Shortlet: No elements found')
  }
  function blur(o) {
    if (selectOne(':focus') !== null) selectOne(':focus').blur()
  }
  // const setValue = (el, text) => {
  //   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, text)
  //   el.dispatchEvent(new Event('input', { bubbles: true }))
  // }
  function setInput(el, attr, value) {
    callSetProperty(el, attr, value)
    dispatchKeyboardEvent(el, 'keydown')
    dispatchEvent(el, 'input')
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
  function runMe(me) {
    if (typeof me === 'string') {
      return _runShortlet(getShortlets()[me])
    }
    if (typeof me !== 'undefined') {
      if (!Array.isArray(me)) me = [me]
      const queue = new MiniQueue()
      me.forEach(a => queueAction(queue, a))
      queue.start()
    }
  }

  // this is the Shortlet API ↓
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
        clickIt(selectOneWithText(o.on, o.text))
      } else {
        clickIt(selectOne(o.on))
      }
    },
    click_all: o => {
      if (typeof o.text === 'string') clickIt(selectAllWithText(o.on, o.text))
      else clickIt(selectAll(o.on))
    },
    click_first: o => {
      if (typeof o.text === 'string') clickIt(selectAllWithText(o.on, o.text).slice(0, 1))
      else clickIt(selectAll(o.on).slice(0, 1))
    },
    click_front: o => {
      let el_list
      if (typeof o.text === 'string') el_list = selectAllWithText(o.on, o.text)
      else el_list = selectAll(o.on)
      clickIt(reduceOnHighestCSS(el_list))
    },
    blur: () => {
      blur()
    },
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
    add_style: o => {
      const style = document.createElement('style')
      style.textContent = o.text
      document.head.appendChild(style)
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
      setInput(selectOne(o.on), 'value', o.text)
    },
    html_attribute: o => {
      selectAll(o.on).forEach(el => callSetProperty(el, o.attribute, o.value))
    },
    check: o => {
      selectAll(o.on).forEach(el => setChecked(el, o.value))
    },
    copy: o => {
      navigator.clipboard.writeText(selectOne(o.on).innerText.trim())
    },
    copy_all: o => {
      navigator.clipboard.writeText(
        selectAll(o.on)
          .map(el => el.innerText.trim())
          .join('\n')
      )
    },
    iife: o => {
      window.location = `javascript:(function(){${o.script}})();`
    },
    duplicate: o => {
      selectAll(o.on).forEach(el => {
        const n = el.cloneNode(true)
        el.after(n)
        n.id = o.id
      })
    },
    set_attr: o => {
      o.attribute = o.attribute || o.attr
      selectAll(o.on).forEach(el => el.setAttribute(o.attribute, o.value))
    },
    set_text: o => {
      selectAll(o.on).forEach(el => (el.innerText = o.text))
    },
    style: o => {
      o.property = o.property || o.prop
      selectAll(o.on).forEach(el => (el.style[o.property] = o.value))
    },
    add_event: o => {
      selectAll(o.on).forEach(el =>
        el.addEventListener(o.event, () => {
          runMe(o.actions)
        })
      )
    },
    run: o => {
      runMe(o.shortlet || o.actions)
    },
    // not updated ↓

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
    tooltip: o => {
      selectAll(o.on).forEach(el => {
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
      selectAll(o.on).forEach(el => {
        const groups = el.innerText.match(new RegExp(o.text))
        if (groups) {
          groups.shift()
          const output = groups.join(o.join)
          const target = selectOne('#' + el.getAttribute('for'))
          console.log(target)
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(target, output)
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
