const React = require('react');

function apiConnect(apiToProps) {
  return function (ConnectComponent) {
    class ApiConnected extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.apiProps = apiToProps(context.api);
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

module.exports = apiConnect;
