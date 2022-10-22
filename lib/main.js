import Shortlet from './Shortlet.js'
export { Shortlet }

const s = new Shortlet()

s.add(() => {
  console.log('item 1')
})

s.add(() => {
  console.log('item 2')
})

s.add(() => {
  console.log('item 3')
})
s.run()
s.print()
