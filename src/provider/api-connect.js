import React, { Component } from 'react';
import PropTypes from 'prop-types';

function apiConnect(apiToProps) {
  return function (ConnectComponent) {
    class ApiConnected extends Component {
      constructor(props, context) {
        super(props, context);
        this.apiProps = apiToProps(context.api, Object.assign({}, props));
      }

      render() {
        return <ConnectComponent {...this.apiProps} {...this.props} />
      }
    }

    ApiConnected.contextTypes = {
      api : PropTypes.object
    };

    return ApiConnected;
  };
};

export default apiConnect;
