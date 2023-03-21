const collectFirst = ([head, ...tail], fn) => {
  const result = head && fn(head);
  return result === undefined && tail.length ? collectFirst(tail, fn) : result;
};

const nonZero = (a, b) => (fn) => {
  const result = fn(a, b);
  return result === 0 ? undefined : result;
};

export default (...fns) => (a, b) => collectFirst(fns, nonZero(a, b)) || 0;
