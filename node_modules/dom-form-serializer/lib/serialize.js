import KeyExtractors from './KeyExtractors'
import InputReaders from './InputReaders'
import KeyAssignmentValidators from './KeyAssignmentValidators'
import defaultKeySplitter from './keySplitter'
import getInputElements from './getInputElements'
import getElementType from './getElementType'
import assignKeyValue from './assignKeyValue'

/**
 * Get a JSON object that represents all of the form inputs, in this element.
 *
 * @param {HTMLElement} Root element
 * @param {object} options
 * @param {object} options.inputReaders
 * @param {object} options.keyAssignmentValidators
 * @param {object} options.keyExtractors
 * @param {object} options.keySplitter
 * @param {string[]} options.include
 * @param {string[]} options.exclude
 * @param {string[]} options.ignoredTypes
 * @return {object}
 */
export default function serialize (element, options = {}) {
  let data = {}
  options.keySplitter = options.keySplitter || defaultKeySplitter
  options.keyExtractors = new KeyExtractors(options.keyExtractors || {})
  options.inputReaders = new InputReaders(options.inputReaders || {})
  options.keyAssignmentValidators = new KeyAssignmentValidators(options.keyAssignmentValidators || {})

  Array.prototype.forEach.call(
    getInputElements(element, options),
    (el) => {
      let type = getElementType(el)
      let keyExtractor = options.keyExtractors.get(type)
      let key = keyExtractor(el)
      let inputReader = options.inputReaders.get(type)
      let value = inputReader(el)
      let validKeyAssignment = options.keyAssignmentValidators.get(type)
      if (validKeyAssignment(el, key, value)) {
        let keychain = options.keySplitter(key)
        data = assignKeyValue(data, keychain, value)
      }
    }
  )

  return data
}
