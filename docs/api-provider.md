# ApiProvider and apiConnect

If you ever used ``react-redux`` before, you've probably have already used ``connect`` and ``<Provider store={yourstore} />``. This library provides the same functionality but for you api object. This way you can provide your api methods as props to your connected objects.
**This feature is not required. You can still "import" the api object and use it normally in your components. Use this feature if you want to pass request methods as properties to your components**

### How to provide an api
Let's see how we provide our api object so we can connect components to it.

```js
  const api = /* create your api mapper */
  const container = document.getElementById('container');
  
  //Provide your api here
  ReactDOM.render(<ApiProvider api={api}><App /></ApiProvider>, container); 
``` 
### Let's connect
Now that we've provided our api object, we can connect to it. Lets create a ``UserList`` component that will connect to the api to use the ``Users`` resource

```js
class UserList extends Component {
    componentDidMount() {
        //do the api call
        this.props.getUsers();
    }

    render() {
        list = this.props.users.map(user => <li key={user.id}>{user.name}</li>)
        return (
            <ul>
                {list}
            </ul>
        );
    }
}

//Lets connect (we recomend using "compose" from redux and "connect" from react-redux)

//Here we are considering that you are using the default apiReducer
const mapStateToProps = (state) => {
    const getUsers = state.api.Users.getUsers;
    return {
        users : getUsers.data
    };
};

const mapApiToProps = (api, ownProps) => {
    const Users = api.Users;
    //Remember : ownProps are props passed to the wrapper component
    return {
        getUsers : Users.getUsers
    };
};

const enchance = compose(
    connect(mapStateToProps),
    apiConnect(mapApiToProps)
);

export default enchance(UserList);
```

And that's it! We've connected our component to the api object. 

### Providing multiple api objects

What if we want to `provide` multiple api objects? Suppose our application consumes multiple api objects. Can we still provide multiple api objects using the `Provider`?

The answer is yes, and this is possible because the only requirement from the `Provider` is that the `api` prop is an Object. We can create an object containing multiple apis and whenever we want to use `apiConnect`, our `mapApiToProps` only have to access the propesties of this object.

```js
//Multiple apis object
//
//Suppose we have these api objects
const gitApi = createMapper(/*...*/);
const redditApi = createMapper(/*...*/);
//Now lets create an object containing these two api
const apiMapper = { gitApi, redditApi };
//Now we can provide our apiMapper
ReactDOM.render(<ApiProvider api={apiMapper}><App /></ApiProvider>);
```

In the above example, we composed two api objects into a single one. This way we can provide multiple api objects to our Provider. Now let's see how we can connect using this approach.

```js
//Here is the magic
const mapApiToProps = ({gitApi, redditApi}) => {
  /*return props here*/
};
//Export the connected component
export default apiConnect(SomeComponent);
```

As you can see, we can have access to both git and reddit api. This is a very good tip if you need to have multiple api objects.

### Other tips
* If you noticed, we did the api request in the ``componentDidMount`` method. You can read a better explanation for that [here](https://twitter.com/dan_abramov/status/790590733468241920). You should put your api requests in this method.
