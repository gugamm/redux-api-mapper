function buildActionBuilder(config, resource, endPoint) {
  return function (actionName) {
    if (config.name) {
      return `@API_${config.name}_${resource.name}_${endPoint.name}_${actionName}@`;
    }
    return `@API_${resource.name}_${endPoint.name}_${actionName}@`;
  };
};

export default buildActionBuilder;
