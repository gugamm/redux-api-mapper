import { combineReducers } from 'redux';
import buildActionBuilder from './action-builder';
import defReducerBuilder from './default-reducer';

/**
 * Generates a combined reducer for all api end-points based on the configuration provided
 * @param {Object} config - The configuration object
 * @returns {Reducer<S>}
 */
function createApiReducer(config) {
  const resourcesReducers = config.resources.reduce((acc, resource) => {
    const name = resource.reducerName || resource.name;
    acc[name]  = createResourceReducer(config, resource);
    return acc;
  }, {});

  return combineReducers(resourcesReducers);
}

function createResourceReducer(config, resource) {
  const endPointsReducers = resource.endPoints.reduce((acc, endPoint) => {
    const actionBuilder = buildActionBuilder(resource.name, endPoint.name, config.name);
    const name = endPoint.reducerName || endPoint.name;

    let reducerData;

    if (endPoint.reducerData !== undefined)
      reducerData = endPoint.reducerData;
    else if (resource.reducerData !== undefined)
      reducerData = resource.reducerData;
    else if (config.reducerData !== undefined)
      reducerData = config.reducerData;
    else
      reducerData = undefined;

    if (endPoint.reducerBuilder)
      acc[name] = endPoint.reducerBuilder(actionBuilder, reducerData);
    else if (resource.reducerBuilder)
      acc[name] = resource.reducerBuilder(actionBuilder, reducerData);
    else if (config.reducerBuilder)
      acc[name] = config.reducerBuilder(actionBuilder, reducerData);
    else 
      acc[name] = defReducerBuilder(actionBuilder, reducerData);
    
    return acc;
  }, {});

  return combineReducers(endPointsReducers);
};

export default createApiReducer;
