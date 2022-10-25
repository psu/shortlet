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

  add(fn, delay = this.pace) {
    // add to internal queue
    this.queue.push({ fn, delay })
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
export default Queue
// https://stackoverflow.com/questions/6921275/is-it-possible-to-chain-settimeout-functions-in-javascript
