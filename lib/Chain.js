const Chain = {
  do: function (ms, fn, ... args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(fn(...args))
      }, ms)
    })
  },
  now: function(fn, ... args) {
    return new Promise((resolve, reject) => {
      resolve(fn(...args))
    })
  }
}
export default Chain