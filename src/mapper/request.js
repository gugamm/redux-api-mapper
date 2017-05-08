function buildRequest(fullPath, method, params, headers, body, api, resource, endPoint, options) {
  return {fullPath, method, params, headers, body, api, resource, endPoint, options};
}

export default buildRequest;