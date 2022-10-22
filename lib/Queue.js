class Queue {
  constructor(config = {}, queue = []) {
    this.config = {
      pace: 300,
      ...config,
    }
    this.queue = queue
    this.timer = null
  }
  // do one item and continue with next
  next(item) {
    this.timer = setTimeout(() => {
      this.timer = null
      item.fn()
      if (this.queue.length) {
        this.next(this.queue.shift())
      }
    }, item.delay)
  }
  // add to internal queue
  add(fn, delay = this.config.pace) {
    this.queue.push({ fn, delay })
  }
  // run queue from start to end
  run() {
    if (this.queue.length) {
      this.next(this.queue.shift())
    }
  }
  // stop timer and keep the rest of the queue
  stop() {
    clearTimeout(this.timer)
  }
  // reset timer and queue
  reset() {
    this.stop()
    this.queue = []
  }
}
export default Queue
