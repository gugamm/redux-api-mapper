# Config

This section will provide you the shape of the config object. Here we will list all properties supported. We recommend using the ``stateToAction`` helper function when defining your actions in your config.

```js
var config = {
  host : 'http://somehost.com/api', 
  name : 'MyCoolApi', //An indentifier for the api-mapper
  headers : { // Headers can be function or strings
    'Authorization' : () => window.localStorage.getItem('token'),
    'Content-type' : 'application/json'
  },
  options : {
    /* See http-layer documentation */
  },
  params: {
    count: 2, // default parameters for all requests
  },
  reducerBuilder : customReducerBuilder, //See api-reducer for mor information
  reducerData : [], //initial reducer data
  resources : [
    {
      name : 'Users',
      path : '/users',
      params: { // default parameters for USERS requests
        count: 2,
      },
      headers : {
        'Some-Fancy-Header' : 'some-fancy-header'
      },
      reducerName : 'users',
      reducerBuilder : customReducerBuilder,
      reducerData : [], //initial reducer data
      options : { 
        /* See http-layer documentation */
      },
      endPoints : [
        {
          name : 'getUsers',
          path : '/',
          method : 'get',
          params: { // default parameters for GET_USERS requests
            count: 2,
          },
          action : stateToAction(actionOnFetch, actionOnComplete, actionOnError, actionOnCancelled),
          headers : {
            'Another-Fancy-Header' : 'fancy-header'
          },
          reducerName : 'getUsers',
          reducerBuilder : customReducerBuilder,
          reducerData : [], //initial reducer data
          options : { 
            /* See http-layer documentation */
          }
        },
        {
          name : 'getUser',
          path : '/{id}', //{param} -> will be handled by the library
          method : 'get', //'post', 'put', 'patch', 'delete'...
          action : stateToAction(actionOnFetch, actionOnComplete),
          headers : {
            'Another-Fancy-Header' : 'Fancy-Header'
          }
        }
      ]
    }
  ]
}
```

### Caveats

* Inner headers will prevail
* Every path parameter inside brackets are handled by the library. This mapper will try to match the param name with a param provided by you when you do the request call
* ``actionOnFetch and others`` can be an action creator or an action object containing the type. In case of a function(action creator), it will call the function passing the response as a parameter and it will expect an object with a type and the payload as return.

### Tips

* You can (and should) put each resource in a separated file
* Always use stateToAction helper unless you have a good reason to do it by hand
* Add optional parameters as comments in your end-points, so you'll know what are the possible parameters
