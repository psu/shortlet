'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { matchInnerText, textMatchJoin, slice_map } = require('../src/shortlet/ShortletAPI.js')

// --- matchInnerText ---

test('matchInnerText: matches substring case-insensitively', () => {
  assert.ok(matchInnerText({ innerText: 'Hello World' }, 'hello'))
  assert.ok(matchInnerText({ innerText: 'hello world' }, 'HELLO'))
})

test('matchInnerText: returns false for non-matching text', () => {
  assert.ok(!matchInnerText({ innerText: 'Hello World' }, 'xyz'))
})

test('matchInnerText: supports regex patterns', () => {
  assert.ok(matchInnerText({ innerText: 'Submit form now' }, 'sub.*form'))
  assert.ok(matchInnerText({ innerText: 'item 42' }, 'item \\d+'))
})

test('matchInnerText: returns false for empty innerText', () => {
  assert.ok(!matchInnerText({ innerText: '' }, '.*'))
})

test('matchInnerText: returns false for whitespace-only innerText', () => {
  assert.ok(!matchInnerText({ innerText: '   ' }, '.*'))
})

test('matchInnerText: trims surrounding whitespace before matching', () => {
  assert.ok(matchInnerText({ innerText: '  hello  ' }, 'hello'))
})

// --- textMatchJoin ---

test('textMatchJoin: returns full match when no pattern given', () => {
  assert.equal(textMatchJoin('hello world'), 'hello world')
})

test('textMatchJoin: returns empty string when pattern does not match', () => {
  assert.equal(textMatchJoin('hello', 'xyz'), '')
})

test('textMatchJoin: returns single capture group', () => {
  assert.equal(textMatchJoin('Price: $42', '\\$(\\d+)'), '42')
})

test('textMatchJoin: joins multiple capture groups with delimiter', () => {
  assert.equal(textMatchJoin('2024-01-15', '(\\d+)-(\\d+)-(\\d+)', '/'), '2024/01/15')
})

test('textMatchJoin: joins multiple capture groups with empty delimiter by default', () => {
  assert.equal(textMatchJoin('ab-cd', '(\\w+)-(\\w+)'), 'abcd')
})

// --- slice_map ---

test('slice_map first: selects only the first element', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.first.start, slice_map.first.end), [1])
})

test('slice_map last: selects only the last element', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.last.start, slice_map.last.end), [3])
})

test('slice_map each: selects all elements', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.each.start, slice_map.each.end), [1, 2, 3])
})

test('slice_map all: selects all elements', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.all.start, slice_map.all.end), [1, 2, 3])
})

test('slice_map but_last: selects all but the last element', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.but_last.start, slice_map.but_last.end), [1, 2])
})

test('slice_map but_first: selects all but the first element', () => {
  assert.deepEqual([1, 2, 3].slice(slice_map.but_first.start, slice_map.but_first.end), [2, 3])
})
