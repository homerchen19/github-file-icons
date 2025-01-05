import TypeRegistry from './TypeRegistry'

export default class InputReaders extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault(el => el.value)
    this.register('checkbox', el => el.getAttribute('value') !== null ? (el.checked ? el.getAttribute('value') : null) : el.checked)
    this.register('select', el => getSelectValue(el))
  }
}

/**
 * Read select values
 *
 * @see {@link https://github.com/jquery/jquery/blob/master/src/attributes/val.js|Github}
 * @param {object} Select element
 * @return {string|Array} Select value(s)
 */
function getSelectValue (elem) {
  var value, option, i
  var options = elem.options
  var index = elem.selectedIndex
  var one = elem.type === 'select-one'
  var values = one ? null : []
  var max = one ? index + 1 : options.length

  if (index < 0) {
    i = max
  } else {
    i = one ? index : 0
  }

  // Loop through all the selected options
  for (; i < max; i++) {
    option = options[i]

    // Support: IE <=9 only
    // IE8-9 doesn't update selected after form reset
    if ((option.selected || i === index) &&

        // Don't return options that are disabled or in a disabled optgroup
        !option.disabled &&
        !(option.parentNode.disabled && option.parentNode.tagName.toLowerCase() === 'optgroup')
    ) {
      // Get the specific value for the option
      value = option.value

      // We don't need an array for one selects
      if (one) {
        return value
      }

      // Multi-Selects return an array
      values.push(value)
    }
  }

  return values
}

