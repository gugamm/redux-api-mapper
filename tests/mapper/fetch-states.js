import { describe, it } from 'mocha';
import { expect } from 'chai';
import { FetchStates } from '../../src/mapper';

describe('[MAPPER] - fetch states', function () {
  it('should return correct FETCH_STARTED data', function () {
    expect(FetchStates.FETCH_STARTED).to.equal("@@FETCH_STARTED@@");
  });

  it('should return correct FETCH_COMPLETED data', function () {
    expect(FetchStates.FETCH_COMPLETED).to.equal("@@FETCH_COMPLETED@@");
  });

  it('should return correct FETCH_ERROR data', function () {
    expect(FetchStates.FETCH_ERROR).to.equal("@@FETCH_ERROR@@");
  });

  it('should return correct FETCH_CANCELLED data', function () {
    expect(FetchStates.FETCH_CANCELLED).to.equal("@@FETCH_CANCELLED@@");
  });
});
