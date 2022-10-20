import Chain from "./Chain.js"

const Shortlet = {
  // Defaults
  data: {_pace: 100},
  // Primary functions
  init: function (data) {
    this.data = data
    return this
  },
  run: function (data = {}) {
    return new Promise((resolve, reject) => {
      this.data = { ...this.data, ...data }
      resolve(this.data)
    });
  },  
  // Actions
  goto: function (data) {
    return Chain.do(data._pace, ()=>{
      document.location = data.goto
      console.log('goot ', data.goto)
      return data
    })
  },
  click: function (data) {
    return Chain.do(data._pace, ()=>{
      document.querySelector(data.click).click()
      console.log('click ', data.click)
      return data
    })
  },
  clickAll: function (data) {
    return Chain.do(data._pace, ()=>{
      //document.querySelector(data.click).forEach(o=>o.click())
      console.log('click all ', data.clickAll)
      return data
    })
  },
  input: function (data) {
    return Chain.do(data._pace, ()=>{
      console.log('input ', data.input)
      return data
    })
  },  
  wait: function (data) {
    return Chain.do(data._pace, ()=>{
      console.log('wait2', data)
      return data
    })
  },
  wait2: function (data) {
    return Chain.do(data._pace*2, ()=>{
      console.log('wait2', data)
      return data
    })
  },
  wait3: function (data) {
    return Chain.do(data._pace*3, ()=>{
      console.log('wait2', data)
      return data
    })
  },
  wait10: function (data) {
    return Chain.do(data._pace*10, ()=>{
      console.log('wait2', data)
      return data
    })
  },
}
export default Shortlet;