import Queue from './Queue.js'

class Shortlet extends Queue {
  constructor(...args) {
    super(...args)
  }

  actions = {
    goto: url => {
      // document.location = url
      console.log('goto ', url)
    },
    click: selector => {
      // document.querySelector(selector).click()
      console.log('click ', selector)
    },
    click_all: selector => {
      // document.querySelectorAll(selector).forEach(o=>{o.click()})
      console.log('click all ', selector)
    },
    input: text => {
      console.log('input ', text)
    },
  }

  run(actions) {
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
    const delay = action.delay || this.pace
    let fn = () => {}
    if (typeof this.actions[action.do] === 'function') {
      fn = () => {
        this.actions[action.do](...action.with)
      }
    }
    this.queue.push({ fn, delay })
  }
}

export default Shortlet
