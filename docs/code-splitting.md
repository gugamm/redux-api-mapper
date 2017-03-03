# Code Splitting

This section will give you a quick example of how to use split the redux-api-mapper code.

The only thing you can split is the ``config`` object. If your ``containers`` only use some resource, you can take advantage of adding resources only when it's necessary.

```js
//suppose this react-router configuration

const router = (
  <Router ...>
    <Route ...>
      <Route path="/users" getComponent={function (p, cb) {
        Promise.all([import('./users'), import('./users-resource')]).then(
          r => {
            addResourceToMapper(api, r[1].default);
            cb(null, r[0].default);
          }
        )
      }} />
    </Route>
  </Router>
);
```

This way you will only require the users-resource when the user navigate to the ``/users`` page.
