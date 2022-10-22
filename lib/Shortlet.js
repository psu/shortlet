import Queue from './Queue.js'

class Shortlet extends Queue {
  constructor(data = {}, ...args) {
    super(...args)
    this.data = data
  }
  print() {
    console.log(this)
  }
  // run(data = {}) {
  //   return new Promise((resolve, reject) => {
  //     this.data = { ...this.data, ...data }
  //     resolve(this.data)
  //   })
  // }
  // add(ms, fn, ...args) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(fn(...args))
  //     }, ms)
  //   })
  // }
  // now(fn, ...args) {
  //   return new Promise((resolve, reject) => {
  //     resolve(fn(...args))
  //   })
  // }
}

// const S = {
//   // Defaults
//   data: Helper.defaults,
//   // Primary functions
//   init: Helper.init,
//   run: Helper.run,
//   // Actions
//   goto: function (data) {
//     return Helper.do(data._pace, () => {
//       document.location = data.goto
//       console.log('goot ', data.goto)
//       return data
//     })
//   },
//   click: function (data) {
//     return Helper.do(data._pace, () => {
//       document.querySelector(data.click).click()
//       console.log('click ', data.click)
//       return data
//     })
//   },
//   clickAll: function (data) {
//     return Helper.do(data._pace, () => {
//       //document.querySelector(data.click).forEach(o=>o.click())
//       console.log('click all ', data.clickAll)
//       return data
//     })
//   },
//   input: function (data) {
//     return Helper.do(data._pace, () => {
//       console.log('input ', data.input)
//       return data
//     })
//   },
//   wait: function (data) {
//     return Helper.do(data._pace, () => {
//       console.log('wait2', data)
//       return data
//     })
//   },
//   wait2: function (data) {
//     return Helper.do(data._pace * 2, () => {
//       console.log('wait2', data)
//       return data
//     })
//   },
//   wait3: function (data) {
//     return Helper.do(data._pace * 3, () => {
//       console.log('wait2', data)
//       return data
//     })
//   },
//   wait10: function (data) {
//     return Helper.do(data._pace * 10, () => {
//       console.log('wait2', data)
//       return data
//     })
//   },
// }

export default Shortlet
// https://stackoverflow.com/questions/6921275/is-it-possible-to-chain-settimeout-functions-in-javascript
