;(async () => {
  const dev_mode = true
  function callServiceWorker(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, response => {
        if (response.error) reject(response.error)
        resolve(response.data)
      })
    })
  }
  function load(shortlet) {
    return shortlet.commands.filter(s => window.location.href.match(s.conditions.url) != null)
  }
  const shortlet_object = await callServiceWorker({ action: 'get_storage', key: 'shortlet_object' })
  const loaded_commands = load(shortlet_object)
  function logSuccess(a = '') {
    if (!dev_mode) return
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
    console.log(`Shortlet: ${text}`)
  }
  function logError(err = '', action = '', o = {}) {
    if (!dev_mode) return
    console.log(`Shortlet: Error for action '${action}'\n${JSON.stringify(o)}\n${err}`)
  }
  class Queue {
    constructor(queue = undefined, delay = undefined) {
      this.delay = 0
      this.queue = []
      if (typeof delay === 'number') this.delay = delay
      if (typeof queue === 'object') {
        queue.forEach(i => {
          if (typeof i.fn === 'function') this.queue.push(i)
        })
      }
    }
    add(f, d = this.delay) {
      this.queue.push({ fn: f, delay: d })
    }
    step(item) {
      // run the items function and make a reqursive call to the next
      if (typeof item.delay === 'undefined') item.delay = this.delay
      this.timer = setTimeout(() => {
        delete this.timer
        item.fn()
        if (this.queue.length > 0) this.step(this.queue.shift())
      }, item.delay)
    }
    start() {
      if (typeof this.timer === 'undefined' && this.queue.length > 0) this.step(this.queue.shift())
    }
    pause() {
      // stop timer and keep the rest of the queue
      delete this.timer
    }
  }
  function runner(id) {
    const shortlet = loaded_commands.filter(s => s.id === id)[0]
    // assert format
    if (!Array.isArray(shortlet.actions)) shortlet.actions = [shortlet.actions]
    if (typeof shortlet.repeat !== 'number' || shortlet.repeat < 0) shortlet.repeat = 1

    const queue = new Queue()
    // add all actions in the array to the queue as functions wrapped in try…catch
    for (let i = 0; i < shortlet.repeat; i++) {
      shortlet.actions.forEach(a => queueAction(queue, a))
    }

    // start executing the queue
    queue.start()
  }
  function queueAction(q, a) {
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
    q.add(item, a.delay)
  }
  function parseForCommandPal(commands) {
    if (commands.length > 0) {
      return commands.map(cmd => ({
        name: cmd.title,
        description: `Executes ${cmd.actions.length} actions`,
        shortcut: cmd.shortcut,
        handler: () => {
          Shortlet.runner(cmd.id)
        },
      }))
    }
    return []
  }
  // actions
  const actions = (function () {
    const selectOne = s => {
      return document.querySelector(s)
    }
    const selectAll = s => {
      return Object.entries(document.querySelectorAll(s)).map(o => o[1])
    }
    const selectOneWithText = (s, t) => {
      let elements = selectAll(s).filter(el => matchInnerText(el, t))
      if (elements.length == 0) throw new Error('Shortlet: No elements found')
      if (elements.length > 1)
        elements = elements.filter(async el => (await isInViewPort(el)) && isFrontmost(el))
      if (elements.length > 1)
        throw new Error(`Shortlet: Too many elements found (${elements.length})`)
      return elements[0]
    }
    const selectAllWithText = (s, t) => {
      return selectAll(s).filter(el => matchInnerText(el, t))
    }
    const matchInnerText = (el, t) => {
      return el.innerText.toLowerCase().trim().match(t.toLowerCase().trim()) !== null
    }
    const isInViewPort = element => {
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
    const getCSSRecursive = (el, prop) => {
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
    const reduceOnHighestCSS = (el_list, prop) => {
      if (el_list.length < 2) return el_list
      return el_list.reduce((el_acc, el) => {
        const el_ancestor_value = getComputedStyle(getCSSRecursive(el, prop))[prop]
        const el_acc_ancestor_value = getComputedStyle(getCSSRecursive(el_acc, prop))[prop]
        return el_acc_ancestor_value > el_ancestor_value ? el_acc : el
      })
    }
    const getFrontmost = el_list => {
      reduceOnHighestCSS(el_list, 'zIndex')
    }
    const isElementFromPoint = el => {
      const el_rect = el.getBoundingClientRect()
      try {
        const el_p = document.elementFromPoint(
          el_rect.left + el_rect.width / 2,
          el_rect.top + el_rect.height / 2
        )
        return el_p.isSameNode(el)
      } catch (e) {
        //if (dev_mode) console.log('Shortlet: No element from point.', el_rect)
        return false
      }
    }
    // isCSSVisible - recursive function checking element and it's parents for
    // getComputedStyle(document.querySelector('.sc-eBHJIF.gcQAcw').parentElement).display ==="none" (not "none" doesn't mean it is visible…)
    const clickIt = el_list => {
      if (!Array.isArray(el_list)) el_list = [el_list]
      if (el_list.length > 0) el_list.forEach(el => el.click())
      else throw new Error('Shortlet: No elements found')
    }
    const blur = o => {
      if (selectOne(':focus') !== null) selectOne(':focus').blur()
    }
    // const setValue = (el, text) => {
    //   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, text)
    //   el.dispatchEvent(new Event('input', { bubbles: true }))
    // }
    const setInput = (el, attr, value) => {
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

    const callSetProperty = (el, attr, value) => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attr).set.call(el, value)
    }
    const runMe = me => {
      if (typeof me === 'string') {
        return runner(me)
      }
      if (typeof me !== 'undefined') {
        if (!Array.isArray(me)) me = [me]
        const queue = new Queue()
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
        }
        clickIt(selectOne(o.on))
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

  // expose
  const expose = {
    runner: runner,
    commands: loaded_commands,
    reload: load,
    parse: parseForCommandPal,
    dev_mode: dev_mode,
  }
  return new Promise(resolve => {
    resolve(expose)
  })
})()
  .then(result => {
    let dev_menu = []
    try {
      window.Shortlet = result
      if (Shortlet.dev_mode) {
        window.commandPalIgnoreBlur = true
        dev_menu = [
          {
            name: 'Dev…',
            children: [
              {
                name: "Toggle 'Ignore Blur'",
                handler: () => {
                  window.commandPalIgnoreBlur =
                    typeof window.commandPalIgnoreBlur === 'undefined'
                      ? false
                      : !window.commandPalIgnoreBlur
                },
              },
              { name: 'Another command' },
            ],
          },
        ]
      }
      try {
        new CommandPal({
          commands: [...Shortlet.parse(Shortlet.commands), ...dev_menu],
          hotkey: 'alt+space',
          hotkeysGlobal: true,
          id: 'SCP',
          placeholder: ' ',
          hideButton: true,
          debugOutput: Shortlet.dev_mode,
          displayShortcutSymbols: true,
          shortcutOpenPalette: false,
          emptyResultText: 'No shortlets loaded.',
        }).start()
      } catch (e) {
        console.log('Error: Load CommandPal: ', e)
      }
    } catch (e) {
      console.log('Error: Load Shortlet: ', e)
    }
  })
  .catch(err => {
    console.log('Error: Init: ', err)
  })
