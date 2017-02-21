/* eslint-env browser, mocha */
/* eslint no-unused-expressions: ["off"] */
/* globals chai, Utils */

describe('Utils.js', () => {
  describe('isNonNegativeIntArray()', () => {
    it('Returns true when given an array of non-negative integers', () => {
      Utils.isNonNegativeIntArray([0, 3, 16, 2]).should.be.true;
    });
    it('Returns true for an empty array', () => {
      Utils.isNonNegativeIntArray([]).should.be.true;
    });
    it('Returns false when array has a negative integer', () => {
      Utils.isNonNegativeIntArray([0, 'apples', 16, 2]).should.be.false;
    });
    it('Returns false when array has a non-integer', () => {
      Utils.isNonNegativeIntArray([0, 'apples', 16, 2]).should.be.false;
    });
    it('Returns false when given a sparse array', () => {
      Utils.isNonNegativeIntArray([0, , 16, 2]).should.be.false; // eslint-disable-line no-sparse-arrays
    });
    it('Returns false for undefined', () => {
      Utils.isNonNegativeIntArray().should.be.false;
    });
    it('Returns false for a non-array', () => {
      Utils.isNonNegativeIntArray({ foo: 'bar' }).should.be.false;
    });
  });
});
