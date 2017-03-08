function buildActionBuilder(resource, endPoint) {
  return function (actionName) {
    return `@API_${resource.name}_${endPoint.name}_${actionName}@`;
  };
};

export default buildActionBuilder;
