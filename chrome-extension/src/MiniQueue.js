// internal queue system
class MiniQueue {
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
