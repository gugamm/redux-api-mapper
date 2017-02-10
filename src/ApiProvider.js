const React = require('react');

class ApiProvider extends React.Component {
  getChildContext() {
    return {
      api : this.props.api
    };
  }

  render() {
    return this.props.children;
  }
};

ApiProvider.propTypes = {
  api : React.PropTypes.object.isRequired,
  children : React.PropTypes.element.isRequired
};

ApiProvider.childContextTypes = {
  api : React.PropTypes.object
};

module.exports =  ApiProvider;
