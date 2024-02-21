class Queue {
  constructor(pace = 300, queue = []) {
    this.pace = pace
    this.queue = queue
    this.timer = null
  }

  next(item) {
    // do one item and continue with next
    this.timer = setTimeout(() => {
      this.timer = null
      item.fn()
      if (this.queue.length) {
        this.next(this.queue.shift())
      }
    }, item.delay)
  }

  add(fn, delay) {
    // add to internal queue
    delay = typeof delay !== 'undefined' ? delay : this.pace
    this.queue.push({ fn: fn, delay: delay })
  }

  start() {
    // run queue from start to end
    if (this.queue.length) {
      this.next(this.queue.shift())
    }
  }

  stop() {
    // stop timer and keep the rest of the queue
    clearTimeout(this.timer)
  }

  reset() {
    // reset timer and queue
    this.stop()
    this.queue = []
  }
}

class Shortlet extends Queue {
  constructor(...args) {
    super(...args)
  }

  actions = {
    goto: url => {
      window.location = url
    },
    goto_append: url => {
      window.location += url
    },
    click: selector => {
      document.querySelector(selector).click()
    },
    click_all: selector => {
      document.querySelectorAll(selector).forEach(o => {
        o.click()
      })
    },
    click_text: (selector, text) => {
      document.querySelectorAll(selector).forEach(o => {
        if (o.firstChild.text == text) {
          o.click()
        }
      })
    },
    input: text => {
      console.log('input:', text)
    },
    blur: () => {
      if (document.querySelector(':focus') !== null) {
        document.querySelector(':focus').blur()
      }
    },
    input_focus: selector => {
      if (document.querySelector(':focus') !== null) {
        document.querySelector(':focus').blur()
      }
      document.querySelector(selector).focus()
    },
    input_select: selector => {
      document.querySelector(selector).select()
    },
    input_value: (selector, text) => {
      document.querySelector(selector).value = text
    },
    class_add: (selector, class_list) => {
      document.querySelectorAll(selector).forEach(o => {
        o.classList.add(...class_list.split(' '))
      })
    },
    class_remove: (selector, class_list) => {
      document.querySelectorAll(selector).forEach(o => {
        o.classList.remove(...class_list.split(' '))
      })
    },
    class_toggle: (selector, class_list) => {
      document.querySelectorAll(selector).forEach(o => {
        o.classList.toggle(...class_list.split(' '))
      })
    },
    show: (selector, type = 'block') => {
      document.querySelectorAll(selector).forEach(o => {
        o.style.display = type
      })
    },
    hide: selector => {
      document.querySelectorAll(selector).forEach(o => {
        o.style.display = 'none'
      })
    },
    toggle: (selector, type = 'block') => {
      document.querySelectorAll(selector).forEach(o => {
        if (o.style.display === 'none') o.style.display = type
        else o.style.display = 'none'
      })
    },
    dispatch_enter: selector => {
      document.querySelector(selector).dispatchEvent(
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
    dispatch_space: selector => {
      document.querySelector(selector).focus()
      document.querySelector(selector).dispatchEvent(
        new KeyboardEvent('keydown', {
          which: 32,
          charCode: 32,
          keyCode: 32,
          view: window,
          bubbles: true,
        })
      )
    },
    // get the contents of the property 'data-XXX' (set data to "XXX")
    // for all elements matching 'selector'
    // and append it as a span to the child element 'target' (could be set to "*")
    // with the inline style 'style'
    reveal_data: (data, selector, target, style) => {
      document.querySelectorAll(selector).forEach(el => {
        const output = document.createElement('span')
        output.textContent = el.dataset[data]
        output.setAttribute('style', style)
        el.querySelector(target).appendChild(output)
      })
    },
  }

  run(actions = []) {
    if (!Array.isArray(actions)) {
      actions = [actions]
    }
    this.addActions(actions)
    this.start()
  }

  addActions(actions) {
    actions.forEach(a => {
      this.addSingleAction(a)
    })
  }

  addSingleAction(action) {
    let fn = () => {}
    if (typeof this.actions[action.do] === 'function') {
      fn = () => {
        try {
          this.actions[action.do](...action.with)
        } catch (e) {
          if (typeof action.fallback !== 'undefined') {
            try {
              this.actions[action.do](...action.fallback)
            } catch (e) {
              this.logError(e, `${action.do} (fallback)`, action.fallback)
            }
          } else {
            this.logError(e, action.do, action.with)
          }
        }
      }
    }
    this.add(fn, action.delay)
  }

  logError(e = '', action = '', args = []) {
    let with_args = args.length !== 0 ? ` with '${args.join(', ')}'` : ''
    console.log(`Shortlet:  Error doing '${action}'${with_args}\n${e}`)
  }
}
