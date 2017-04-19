# Memory API

Both FetchHttpLayer and XhrHttpLayer offer options to help you building your application even when you don't have an api implemented yet. To do that, we gonna take a look at `memResponse` and `delay` options.

### How does it work
FetchHttpLayer and XhrHttpLayer provide this functionality. When using `memResponse` and `delay` on options, instead of doing an http request to a server, these layers will actually simulate an http request for you. If `delay` is provided, then the simulated request will complete after the `delay` time. The response will always be the `memResponse`. 

You can provide an `Object` or a `Function` as the `memResponse`. If providing a `Function`, this function will receive the `Request` object, so you can implement local api methods. Usually we only use `Objects` because they don't require us to write a lot of code that we gonna have to remove anyway.

### Let's use it

Here we are gonna show an example of how to use these options.

```js
const mockUsers = [
  {
    id: 0,
    name: 'Joe',
    age: 29
  },
  {
    id: 1,
    name: 'Paul',
    age: 38
  }
];

const config = {
  host: 'http://somehost.com/api',
  options: {
    delay: 1000 //1 sec
  },
  resources: [
    {
      name: 'Users',
      path: '/',
      endPoints: [
        {
          name: 'getUsers',
          path: '/',
          options: {
            memResponse: mockUsers
          }
        }
      ]
    }
  ]
};
//Now we can create our api, reducers and more...
const api = /*..*/;

//This mapper is using the XhrHttpLayer. You could also use the FetchHttpLayer, but the FetchHttpLayer returns a Promise instead of a Function.
api.Users.getUsers()(
  (users) => console.log(users) //this will log mockUsers
);
```

Note that even though we are not making an http-request, redux-api-mapper will simulate everything for you. Which means that if you are using reducers, it will dispatch FETCH_STARTED and FETCH_COMPLETED for you. This way you can see your loaders/spinners working... 

If you are using XhrHttpLayer, you can also use `httpLayer.abortRequest()`. It will dispatch an FETCH_ABORT to your reducers.

