function mapToPlainObject(obj) {
  let plainObj = {};

  if (!obj)
    return plainObj;

  for (let key in obj) {
    if (typeof obj[key] === "function")
      plainObj[key] = obj[key]();
    else
      plainObj[key] = obj[key];
  }

  return plainObj;
}

function advancedMerge(a, b, c, d) {
  return Object.assign({}, mapToPlainObject(a), mapToPlainObject(b), mapToPlainObject(c), mapToPlainObject(d));
}

export default advancedMerge;
