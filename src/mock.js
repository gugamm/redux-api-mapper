/**
 * Creates an api mapper object for testing
 * @param {Object} config - An object defining api mapper
 */
function createMockMapper(config) {
  let mockMapper = {
    reset : function () {
      config.resources.forEach(resource => {
        mockMapper[resource.name].reset();
      });
    }
  };

  config.resources.forEach(resource => {
    addMockResource(mockMapper, resource);
  });

  return mockMapper;
}

function addMockResource(mapper, resource) {
  mapper[resource.name] = {
    reset : function () {
      resource.endPoints.forEach(endPoint => {
        mapper[resource.name][endPoint.name].reset();
      });
    }
  };

  resource.endPoints.forEach(endPoint => {
    addMockEndPoint(mapper,resource,endPoint);
  });
}

function addMockEndPoint(mapper, resource, endPoint) {
  let mockData = {
    called         : false,
    calledTimes    : 0,
    cancelled      : false,
    cancelledTimes : 0,
    params         : {},
    reqHeaders     : {},
    reqBody        : {},
    reqOptions     : {}
  };

  mapper[resource.name][endPoint.name] = {
    call : function (params, reqHeaders, reqBody, reqOptions) {
      mockData.called = true;
      mockData.calledTimes++;
      mockData.params = params;
      mockData.reqHeaders = reqHeaders;
      mockData.reqBody = reqBody;
      mockData.reqOptions = reqOptions;
      return () => {
        mockData.cancelled = true;
        mockData.cancelledTimes++;
      };
    },
    called : function () {
      return mockData.called;
    },
    cancelled : function () {
      return mockData.cancelled;
    },
    calledTimes : function () {
      return mockData.calledTimes;
    },
    cancelledTimes : function () {
      return mockData.cancelledTimes;
    },
    getMockData : function () {
      return mockData;
    },
    reset : function () {
      mockData = {
        called : false,
        calledTimes : 0,
        cancelled : false,
        cancelledTimes : 0,
        params : {},
        reqHeaders : {},
        reqBody : {},
        reqOptions : {}
      };
    }
  };
}

export default createMockMapper;
