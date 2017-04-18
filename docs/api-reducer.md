# Api Reducer

Besides removing the boilerplate of making requests, this library also removes the boilerplate of creating actions and reducers. In this section, we will explain how to use the default reducer and how to override it. **You are not required to use this feature, but we highly recommend it**

### How to create an api reducer
Let's see how we create an api reducer<br>
<br>
The first thing you need to do is to create a configuration (same config to be used to create the mapper object)

```js
  const config = {
    host : 'http://somehost.com/api',
    resources : [
     {
       name : 'Users',
       path : '/users',
       endPoints : [
         {
           name : 'getUsers',
           path : '/'
         }
       ]
     } 
    ]
  } 
``` 

Now, we can create our reducer using the `createApiReducer` function

```js
import { createApiReducer } from 'redux-api-mapper';

const config =/*...*/;

const apiReducer = createApiReducer(config);
```

Now we can provide it to our store
```js
const rootReducer = combineReducer({
  api: apiReducer //it can be any name. Do not have to be "api"
});

const store = createStore(rootReducer);
```

### The default reducer
When we use `createApiReducer`, redux-api-mapper will create a reducer for each end point. We will define the shape of this reducer so we can consume it later.

```js
//This is the shape of the default reducer

const defaultReducer = {
  isFetching    : Boolean,
  isSuccess     : Boolean,
  isError       : Boolean,
  isCancelled   : Boolean,
  data          : any,
  errorData     : any,
  cancelledData : any
}

```

### Let's use it
Let's consume the state of the `getUsers` request for a `UserList` component for example.

```js
const mapStateToProps = (state) => {
  const { isFetching, isSuccess, isError, data } = state.api.Users.getUsers;
  
  return { isFetching, isSuccess, isError, data };
}
```

### Initial data
When using the default reducer, the initial data is `null`. Sometimes we may want to change this initial value. To do that, we can use the `reducerData` property in our configuration to define the initial data of the reducer. We can provide this property at `global`, `resource` or `endPoint` level. Let's see an example 

```js
const config = {
  host: 'http://somehost.com/api',
  reducerData: [], //all reducers gonna have [] as initial data
  resources : [
    {
      name: 'Users',
      path: '/users',
      reducerData: [], //We can define the initial data for this specific resource,
      endPoints: [
        {
          name: 'getUsers',
          path: '/'
        },
        {
          name: 'getUser',
          path: '/{id}',
          reducerData: {} //This endPoint have an Object as initial data
        }
      ]
    },
    {
      name: 'Profile',
      path: '/profile',
      reducerData: {}, //This specific resource have an Object as intiial data
      endPoints: [
        {
          name: 'getProfile',
          path: '/'
        },
        {
          name: 'getSchools',
          path: '/schools',
          reducerData: [] // This endPoint have an Array as initial data.
        }
      ]
    }
  ]
}

```

### Changing the name of the reducer
We can change the name of the generated reducers using our configuration. Let's see this in practice.

```js
const config = {
  host : /*...*/,
  resources : [
    {
      name : 'Users',
      reducerName : 'hello',
      path : '/users',
      endPoints : [
        {
          name : 'getUsers',
          reducerName : 'world',
          path : '/'
        }
      ]
    }
  ]
}

// Now we can consume this way:

const mapStateToProps = (state) => {
  const { isFetching, isError, isSuccess, data } = state.api.hello.world;
  
  return { isFetching, isError, isSuccess, data };
}
```

### Overriding the default reducer
The default reducer can be overridden if we provide a `reducerBuilder` in our configuration. The `reducerBuilder` is a function that receive an `actionBuilder` and returns a reducer. The action builder necessary because you can use it to build the actions related to an specific end point.
Let's see this in practice

```js
import { FetchStates } from 'redux-api-mapper';

const myReducerBuilder = function (actionBuilder) {
  const defaultState = {
    isFetching : false,
    data : null,
    fetchingCount : 0
  };
  
  //Lets handle only fetch_started and fetch_completed
  const FETCH_STARTED = actionBuilder(FetchStates.FETCH_STARTED);
  const FETCH_COMPLETED = actionBuilder(FetchStates.FETCH_COMPLETED);
  
  return function (prevState = defaultState, action) {
    switch (action.type) {
      case FETCH_STARTED : return {...prevState, isFetching : true, fetchingCount : prevState.fetchingCount + 1};
      case FETCH_COMPLETED : return {...prevState, isFetching : false, data : action.payload};
    }
    
    return prevState;
  }
}

```

Now we can provide our reducer builder in a `Global`, `Reducer` or `EndPoint` level.

```js
const config = {
  host : /*...*/,
  
  //Global level (will be used for all end points)
  reducerBuilder : myReducerBuilder,
  resources : [
    {
      name : 'Users',
      path : '/users',
      
      //Reducer Level (will be used for all Users resource end points)
      reducerBuilder : myReducerBuilder,
      
      endPoints : [
        {
          name : 'getUsers',
          path : '/',
          
          //End point level (will be used only in this end point)
          reducerBuilder : myReducerBuilder
        }
      ] 
    }
  ]
}

//Now we can consume it:

const mapStateToProps = (state) => {
  const { isFetching, data, fetchingCount } = state.api.Users.getUsers;
  
  return { isFetching, data, fetchingCount };
}
```
