import { combineReducers } from 'redux';
import buildActionBuilder from './action-builder';
import buildReducerBuilder from './default-reducer';

function createApiReducer(config) {
  const resourcesReducers = config.resources.reduce((acc, resource) => {
    const name = resource.reducerName || resource.name;
    acc[name]  = createResourceReducer(config, resource);
    return acc;
  }, {});

  return combineReducers(resourcesReducers);
};

function createResourceReducer(config, resource) {
  const endPointsReducers = resource.endPoints.reduce((acc, endPoint) => {
    const actionBuilder = buildActionBuilder(resource, endPoint);
    const name = endPoint.reducerName || endPoint.name;

    if (endPoint.reducerBuilder)
      acc[name] = endPoint.reducerBuilder(actionBuilder);
    else if (resource.reducerBuilder)
      acc[name] = resource.reducerBuilder(actionBuilder);
    else if (config.reducerBuilder)
      acc[name] = config.reducerBuilder(actionBuilder);
    else {
      let reducerData;

      if (endPoint.reducerData !== undefined)
        reducerData = endPoint.reducerData;
      else if (resource.reducerData !== undefined)
        reducerData = resource.reducerData;
      else if (config.reducerData !== undefined)
        reducerData = config.reducerData;
      else
        reducerData = null;

      acc[name] = buildReducerBuilder(reducerData)(actionBuilder);
    }
    return acc;
  }, {});

  return combineReducers(endPointsReducers);
};

export default createApiReducer;
