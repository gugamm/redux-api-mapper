import React, { Component } from 'react';

function apiConnect(apiToProps) {
  return function (ConnectComponent) {
    class ApiConnected extends Component {
      constructor(props, context) {
        super(props, context);
        this.apiProps = apiToProps(context.api, {...props});
      }

      render() {
        return <ConnectComponent {...this.apiProps} {...this.props} />
      }
    }

    ApiConnected.contextTypes = {
      api : React.PropTypes.object
    };

    return ApiConnected;
  };
};

export default apiConnect;
