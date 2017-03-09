import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HttpMethods } from '../../src/mapper';

describe('[MAPPER] - http methods', function () {
  it('should contain correct GET data', function () {
    expect(HttpMethods.GET).to.equal('get');
  });
  it('should contain correct POST data', function () {
    expect(HttpMethods.POST).to.equal('post');
  });
  it('should contain correct PUT data', function () {
    expect(HttpMethods.PUT).to.equal('put');
  });
  it('should contain correct DELETE data', function () {
    expect(HttpMethods.DELETE).to.equal('delete');
  });
  it('should contain correct PATCH data', function () {
    expect(HttpMethods.PATCH).to.equal('patch');
  });
  it('should contain correct HEAD data', function () {
    expect(HttpMethods.HEAD).to.equal('head');
  });
});
