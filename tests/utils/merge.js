import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mergeHeaders, mergeOptions } from '../../src/utils/merge';

describe('[UTILS] - merge', function () {
  it('should merge headers correctly', function () {
    const rootHeaders = {
      test : 'testHeader',
      anotherTest : 'anotherTest'
    };

    const resHeaders = {
      test : 'coolTest',
      foo : 'fooTest'
    };

    const endHeaders = {
      test : () => 'funTest',
      boo : 'boo',
      anotherTest : 'hey'
    };

    const reqHeaders = {
      foo : 'boo',
      test : () => 'boringTest'
    };

    const expectedHeaders = {
      test : 'boringTest',
      foo : 'boo',
      anotherTest : 'hey',
      boo : 'boo'
    };

    expect(mergeHeaders(rootHeaders, resHeaders, endHeaders, reqHeaders)).to.deep.equal(expectedHeaders);
  });

  it('should merge options correclty', function () {
    const rootOptions = {
      boo : 'foo',
      foo : 'boo'
    };
    const resHeaders = {
      a : 'b',
      b : 'a'
    };
    const endHeaders = null;
    const reqHeaders = {
      a : 'c',
      b : 'd'
    };
    const expectedHeaders = {
      boo : 'foo',
      foo : 'boo',
      a : 'c',
      b : 'd'
    };

    expect(mergeOptions(rootOptions, resHeaders, endHeaders, reqHeaders)).to.deep.equal(expectedHeaders);
  });
});
