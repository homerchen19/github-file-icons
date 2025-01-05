export default function keySplitter (key) {
  let matches = key.match(/[^[\]]+/g)
  let lastKey
  if (key.length > 1 && key.indexOf('[]') === key.length - 2) {
    lastKey = matches.pop()
    matches.push([lastKey])
  }
  return matches
}
