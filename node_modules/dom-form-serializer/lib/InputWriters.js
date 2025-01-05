import TypeRegistry from './TypeRegistry'

export default class InputWriters extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault((el, value) => { el.value = value })
    this.register('checkbox', (el, value) => {
      if (value === null) {
        el.indeterminate = true
      } else {
        el.checked = Array.isArray(value) ? value.indexOf(el.value) !== -1 : value
      }
    })
    this.register('radio', function (el, value) {
      if (value !== undefined) {
        el.checked = el.value === value.toString()
      }
    })
    this.register('select', setSelectValue)
  }
}

function makeArray (arr) {
  var ret = []
  if (arr !== null) {
    if (Array.isArray(arr)) {
      ret.push.apply(ret, arr)
    } else {
      ret.push(arr)
    }
  }
  return ret
}

/**
 * Write select values
 *
 * @see {@link https://github.com/jquery/jquery/blob/master/src/attributes/val.js|Github}
 * @param {object} Select element
 * @param {string|array} Select value
 */
function setSelectValue (elem, value) {
  var optionSet, option
  var options = elem.options
  var values = makeArray(value)
  var i = options.length

  while (i--) {
    option = options[ i ]
    /* eslint-disable no-cond-assign */
    if (values.indexOf(option.value) > -1) {
      option.setAttribute('selected', true)
      optionSet = true
    }
    /* eslint-enable no-cond-assign */
  }

  // Force browsers to behave consistently when non-matching value is set
  if (!optionSet) {
    elem.selectedIndex = -1
  }
}

