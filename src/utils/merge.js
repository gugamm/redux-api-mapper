function headerToObject(header) {
  let newHeader = {};

  if (!header)
    return newHeader;

  for (let headerKey in header) {
    if (typeof header[headerKey] === "function")
      newHeader[headerKey] = header[headerKey]();
    else
      newHeader[headerKey] = header[headerKey];
  };

  return newHeader;
}

function mergeHeaders(mapHeaders, resHeaders, endHeaders, reqHeaders) {
  return Object.assign({}, headerToObject(mapHeaders), headerToObject(resHeaders), headerToObject(endHeaders), headerToObject(reqHeaders));
}

function mergeOptions(mapOptions, resOptions, endOptions, reqOptions) {
  return Object.assign({}, mapOptions, resOptions, endOptions, reqOptions);
}

export {mergeHeaders, mergeOptions};
