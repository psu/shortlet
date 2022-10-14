import Shortlet from './Shortlet'

Shortlet.run({goto: '/about', click: '.css-1jkzc0z'})
  .then(Shortlet.click)
  .then(Shortlet.wait3)
  .then(Shortlet.goto)
