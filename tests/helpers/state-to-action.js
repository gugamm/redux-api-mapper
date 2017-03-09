import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stateToAction } from '../../src/helpers';
import { FetchStates } from '../../src/mapper';

describe('[HELPERS] - stateToAction', function () {
  let mapper;
  const MOCK_FETCH     = "MOCK_FETCH";
  const MOCK_COMPLETED = "MOCK_COMPLETED";
  const MOCK_ERROR     = "MOCK_ERROR";
  const MOCK_CANCELLED = "MOCK_CANCELLED";

  beforeEach(function () {
    mapper = stateToAction(MOCK_FETCH, MOCK_COMPLETED, MOCK_ERROR, MOCK_CANCELLED);
  });

  it('should return a function', function () {
    expect(typeof mapper).to.equal('function');
  });

  it('should return handleFetch when FETCH_START', function () {
    expect(mapper(FetchStates.FETCH_STARTED)).to.equal(MOCK_FETCH);
  });

  it('should return handleCompleted when FETCH_COMPLETED', function () {
    expect(mapper(FetchStates.FETCH_COMPLETED)).to.equal(MOCK_COMPLETED);
  });

  it('should return handleError when FETCH_ERROR', function () {
    expect(mapper(FetchStates.FETCH_ERROR)).to.equal(MOCK_ERROR);
  });

  it('should return handleCancelled when FETCH_CANCELLED', function () {
    expect(mapper(FetchStates.FETCH_CANCELLED)).to.equal(MOCK_CANCELLED);
  });

  it('should throw an error for invalid state', function () {
    expect(function () { return mapper("INVALID_STATE"); }).to.throw(/Unknown state/);
  });
});