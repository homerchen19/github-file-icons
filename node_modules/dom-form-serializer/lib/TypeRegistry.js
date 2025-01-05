export default class TypeRegistry {
  constructor (initial = {}) {
    this.registeredTypes = initial
  }

  get (type) {
    if (typeof this.registeredTypes[type] !== 'undefined') {
      return this.registeredTypes[type]
    } else {
      return this.registeredTypes['default']
    }
  }

  register (type, item) {
    if (typeof this.registeredTypes[type] === 'undefined') {
      this.registeredTypes[type] = item
    }
  }

  registerDefault (item) {
    this.register('default', item)
  }
}
