const Actions = {
  click: function(selector) {
    document.querySelector(selector).click()
  },
  goto: function(url) {
    //document.location = url
    console.log('went to ', url);
  },
  type: function(text) {
    document.querySelector(selector).setAttribute(value, text)
  },

}
export default Actions