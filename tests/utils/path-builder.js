import { describe, it } from 'mocha';
import { expect } from 'chai';
import buildPath from '../../src/utils/path-builder';

describe('[UTILS] - path builder', function () {
  it('should build correct path without parameters', function () {
    const host = "http://test:4322/api";
    const resPath = "/users";
    const endPath = "/";
    const expected = "http://test:4322/api/users/";
    expect(buildPath(host, resPath, endPath)).to.equal(expected);
  });

  it('should build correct path with parameters', function () {
    const host = "http://test:4322/api";
    const resPath = "/test";
    const endPath = "/{a}/{b}/hey/{c}";
    const params = {
      a : 1,
      b : 2,
      c : 3,
      cool : 4,
      d : 5,
      f : 6,
      g : "hello world"
    };
    const expected = "http://test:4322/api/test/1/2/hey/3?cool=4&d=5&f=6&g=hello%20world";
    expect(buildPath(host, resPath, endPath, params)).to.equal(expected);
  });
});
