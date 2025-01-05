export default function assignKeyValue (obj, keychain, value) {
  if (!keychain) { return obj }

  var key = keychain.shift()

  // build the current object we need to store data
  if (!obj[key]) {
    obj[key] = Array.isArray(key) ? [] : {}
  }

  // if it's the last key in the chain, assign the value directly
  if (keychain.length === 0) {
    if (!Array.isArray(obj[key])) {
      obj[key] = value
    } else if (value !== null) {
      obj[key].push(value)
    }
  }

  // recursive parsing of the array, depth-first
  if (keychain.length > 0) {
    assignKeyValue(obj[key], keychain, value)
  }

  return obj
}
