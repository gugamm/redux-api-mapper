# Making requests

After creating a mapper using `createMapper`, we can now make requests. This section will explain how to make requests and what happens when we make one.


### Our configuration
For sake of simplicity, consider the following configuration

```js
const config = {
  host: 'http://example.com/api',
  resources: [
    {
      name: 'Items',
      endPoints: [
        {
          name: 'getItems',
          path: '',
          method: 'get'
        },
        {
          name: 'getItem',
          path: '/{id}',
          method: 'get'
        }
      ]
    }
  ]
}
```
### Making requests
Let's see an example of making requests
```js
  import { createMapper } from 'redux-api-mapper';
  import store from './store';

  //First create the mapper
  const mapper = createMapper(store, config);
  
  //Now we can make the requests
  mapper.Items.getItems();
``` 
Note that for making requests, we gonna follow the following pattern: **mapper.[RESOURCE_NAME].[ENDPOINT_NAME]**

### What happens
Remember that the library does not know how to make requests. For this task, it uses what it's called `http-layer`. Whenever we make a call, the library will call a `http-layer` method according to the `method` option. The http-layer will then handle the request and return **something**. Depending on what the http-layer returns, we can, for example, chain requests.

The http-layer also plays an important rule here. It is responsible for dispatching actions for the store according to the state of the request. Both `XhrHttpLayer` and `FetchHttpLayer` dispatch actions according to the state of the request and also support options for you to pass payload data for your reducers.

### Method parameters
Now let's see the parameters we can pass when making requests:

##### `params` :: Object<key, string|Function> (optional)
An object describing the parameters of the request. If any parameter name is in the `path`, then it will be used as the path parameter. Otherwise, it will be used as a query parameter
##### `body` :: any (optional)
The body can be anything, but remember that some http-layers provide the `parseBody` option, so the `parseBody` function could be expecting a specific type by default. In case of XhrHttpLayer or FetchHttpLayer they expect anything that is serializable, since they use JSON.parse by default.
##### `headers` :: Object<key, string|Function> (optional)
An object describing the headers of the request. 
##### `options` :: Object<key, any> (optional)
An object used to pass parameters for the http-layer. The available options depends on the http-layer
