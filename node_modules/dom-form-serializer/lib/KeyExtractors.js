import TypeRegistry from './TypeRegistry'

export default class KeyExtractors extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault(el => (el.getAttribute('name') || ''))
  }
}
