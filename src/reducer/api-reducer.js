import { combineReducers } from 'redux';
import buildActionBuilder from './action-builder';
import defReducerBuilder from './default-reducer';

function createApiReducer(config) {
  const resourcesReducers = config.resources.reduce((acc, resource) => {
    const name = resource.reducerName || resource.name;
    acc[name]  = createResourceReducer(config.reducerBuilder, resource);
    return acc;
  }, {});

  return combineReducers(resourcesReducers);
};

function createResourceReducer(cReducerBuilder, resource) {
  const endPointsReducers = resource.endPoints.reduce((acc, endPoint) => {
    const actionBuilder = buildActionBuilder(resource, endPoint);
    const name = endPoint.reducerName || endPoint.name;

    if (endPoint.reducerBuilder)
      acc[name] = endPoint.reducerBuilder(actionBuilder);
    else if (resource.reducerBuilder)
      acc[name] = resource.reducerBuilder(actionBuilder);
    else if (cReducerBuilder)
      acc[name] = cReducerBuilder(actionBuilder);
    else
      acc[name] = defReducerBuilder(actionBuilder);

    return acc;
  }, {});

  return combineReducers(endPointsReducers);
};

export default createApiReducer;
