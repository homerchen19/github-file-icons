import getElementType from './getElementType'

export default function getInputElements (element, options) {
  return Array.prototype.filter.call(
    element.querySelectorAll('input,select,textarea'),
    (el) => {
      if (el.tagName.toLowerCase() === 'input' && (el.type === 'submit' || el.type === 'reset')) {
        return false
      }
      let myType = getElementType(el)
      let extractor = options.keyExtractors.get(myType)
      let identifier = extractor(el)
      let foundInInclude = (options.include || []).indexOf(identifier) !== -1
      let foundInExclude = (options.exclude || []).indexOf(identifier) !== -1
      let foundInIgnored = false
      let reject = false

      if (options.ignoredTypes) {
        for (let selector of options.ignoredTypes) {
          if (el.matches(selector)) {
            foundInIgnored = true
          }
        }
      }

      if (foundInInclude) {
        reject = false
      } else {
        if (options.include) {
          reject = true
        } else {
          reject = (foundInExclude || foundInIgnored)
        }
      }

      return !reject
    }
  )
}
