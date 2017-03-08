function buildRequest(fullPath, method, params, headers, body, options) {
  return {fullPath, method, params, headers, body, options};
};

export default buildRequest;