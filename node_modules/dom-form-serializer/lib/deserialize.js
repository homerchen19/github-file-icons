import KeyExtractors from './KeyExtractors'
import InputWriters from './InputWriters'
import flattenData from './flattenData'
import getInputElements from './getInputElements'
import getElementType from './getElementType'

/**
 * Use the given JSON object to populate all of the form inputs, in this element.
 *
 * @param {HTMLElement} Root element
 * @param {object} options
 * @param {object} options.inputWriters
 * @param {object} options.keyExtractors
 * @param {object} options.keySplitter
 * @param {string[]} options.include
 * @param {string[]} options.exclude
 * @param {string[]} options.ignoredTypes
 */
export default function deserialize (form, data, options = {}) {
  let flattenedData = flattenData(data, null, options)
  options.keyExtractors = new KeyExtractors(options.keyExtractors || {})
  options.inputWriters = new InputWriters(options.inputWriters || {})

  Array.prototype.forEach.call(
    getInputElements(form, options),
    (el) => {
      let type = getElementType(el)

      let keyExtractor = options.keyExtractors.get(type)
      let key = keyExtractor(el)

      let inputWriter = options.inputWriters.get(type)
      let value = flattenedData[key]

      inputWriter(el, value)
    }
  )
}

