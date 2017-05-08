/**
 * Create an action builder function. The action builder is a function that receive an actionName and return an new action name
 * for a specific end-point
 * @param {String} resourceName - The name of a resource
 * @param {String} endPointName - The name of an end-point
 * @param {String} [rootName] - The name of the root configuration
 * @returns {Function} - The action builder
 */
function buildActionBuilder(resourceName, endPointName, rootName) {
  if (typeof rootName !== 'undefined' && rootName) {
    return function (actionName) {
      return `@API_${rootName}_${resourceName}_${endPointName}_${actionName}@`;
    };
  }

  return function (actionName) {
    return `@API_${resourceName}_${endPointName}_${actionName}@`;
  };
}

export default buildActionBuilder;
