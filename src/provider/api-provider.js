import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ApiProvider extends Component {
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
  api : PropTypes.object.isRequired,
  children : PropTypes.element.isRequired
};

ApiProvider.childContextTypes = {
  api : PropTypes.object
};

export default ApiProvider;
