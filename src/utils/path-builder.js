function buildRequestPath(host, rPath, ePath, params) {
  return `${host}${rPath}${parseEndPointPath(ePath, params)}`;
}

function parseEndPointPath(ePath, params) {
  if (!params)
    return ePath;

  let queryString = "";
  let tmpPath     = ePath.slice();
  for (let param in params) {
    let reg = new RegExp(`{${param}}`);
    const newPath = tmpPath.replace(reg, params[param]);
    if (newPath === tmpPath)
      queryString = (queryString) ? queryString + `&${param}=${params[param]}` : `${param}=${params[param]}`;
    tmpPath = newPath;
  }
  return (queryString) ? tmpPath + '?' + queryString : tmpPath;
}

export default buildRequestPath;