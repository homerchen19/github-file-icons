import defaultKeyJoiner from './keyJoiner'

export default function flattenData (data, parentKey, options = {}) {
  let flatData = {}
  let keyJoiner = options.keyJoiner || defaultKeyJoiner

  for (let keyName in data) {
    if (!data.hasOwnProperty(keyName)) {
      continue
    }

    let value = data[keyName]
    let hash = {}

    // If there is a parent key, join it with
    // the current, child key.
    if (parentKey) {
      keyName = keyJoiner(parentKey, keyName)
    }

    if (Array.isArray(value)) {
      hash[keyName + '[]'] = value
      hash[keyName] = value
    } else if (typeof value === 'object') {
      hash = flattenData(value, keyName, options)
    } else {
      hash[keyName] = value
    }

    Object.assign(flatData, hash)
  }

  return flatData
}
