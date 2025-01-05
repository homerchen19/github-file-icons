import TypeRegistry from './TypeRegistry'

export default class KeyAssignmentValidators extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault(() => true)
    this.register('radio', (el) => el.checked)
  }
}
