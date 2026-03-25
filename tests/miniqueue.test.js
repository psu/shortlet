'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { setTimeout: sleep } = require('node:timers/promises')
const { MiniQueue } = require('../src/shortlet/MiniQueue.js')

// --- constructor ---

test('constructor: initializes empty queue and zero delay', () => {
  const q = new MiniQueue()
  assert.equal(q.queue.length, 0)
  assert.equal(q.delay, 0)
})

test('constructor: accepts initial delay', () => {
  const q = new MiniQueue(undefined, 100)
  assert.equal(q.delay, 100)
})

test('constructor: accepts pre-populated queue', () => {
  const fn = () => {}
  const q = new MiniQueue([{ fn }])
  assert.equal(q.queue.length, 1)
})

test('constructor: ignores queue items without a fn function', () => {
  const q = new MiniQueue([{ notFn: 'oops' }, { fn: 'not a function' }])
  assert.equal(q.queue.length, 0)
})

// --- add() ---

test('add: pushes item to queue', () => {
  const q = new MiniQueue()
  q.add(() => {})
  assert.equal(q.queue.length, 1)
})

test('add: uses explicit delay when provided', () => {
  const q = new MiniQueue()
  q.add(() => {}, 500)
  assert.equal(q.queue[0].delay, 500)
})

test('add: falls back to instance default delay', () => {
  const q = new MiniQueue(undefined, 42)
  q.add(() => {})
  assert.equal(q.queue[0].delay, 42)
})

// --- start() ---

test('start: does nothing on an empty queue', () => {
  const q = new MiniQueue()
  assert.doesNotThrow(() => q.start())
})

test('start: executes all queued functions', async () => {
  const q = new MiniQueue()
  const results = []
  q.add(() => results.push(1), 0)
  q.add(() => results.push(2), 0)
  q.add(() => results.push(3), 0)
  q.start()
  await sleep(20)
  assert.deepEqual(results, [1, 2, 3])
})

test('start: executes functions in FIFO order', async () => {
  const q = new MiniQueue()
  const order = []
  q.add(() => order.push('a'), 0)
  q.add(() => order.push('b'), 0)
  q.add(() => order.push('c'), 0)
  q.start()
  await sleep(20)
  assert.deepEqual(order, ['a', 'b', 'c'])
})

test('start: is a no-op when called again while already running', async () => {
  const q = new MiniQueue()
  const results = []
  q.add(() => results.push(1), 0)
  q.start()
  q.start() // second call should not double-fire
  await sleep(20)
  assert.deepEqual(results, [1])
})

// --- pause() ---

test('pause: allows the queue to be resumed via start() after pausing', async () => {
  // pause() removes the timer reference so start() can be called again
  const q = new MiniQueue()
  const results = []
  q.add(() => results.push(1), 0)
  q.start()
  await sleep(10)
  q.pause()
  q.add(() => results.push(2), 0)
  q.start()
  await sleep(10)
  assert.deepEqual(results, [1, 2])
})
