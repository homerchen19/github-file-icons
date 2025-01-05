export default function getElementType (el) {
  let typeAttr
  let tagName = el.tagName
  let type = tagName
  if (tagName.toLowerCase() === 'input') {
    typeAttr = el.getAttribute('type')
    if (typeAttr) {
      type = typeAttr
    } else {
      type = 'text'
    }
  }
  return type.toLowerCase()
}
