/* eslint-env browser, mocha */
/* eslint no-unused-expressions: ["off"] */
/* globals Station, L */

describe('station.js', () => {
  const stationObject = {
    id: 24,
    name: 'Times Sq - 42 St',
    latLng: [40.75553, -73.98688],
    lines: [0, 1, 2, 9, 10, 23, 24, 25, 28, 26],
    transfers: [],
  };

  describe('constructor', () => {
    const checkStation = (testStation, obj) => {
      Object.getOwnPropertyNames(testStation).forEach((prop) => {
        testStation[prop].should.deep.equal(obj[prop]);
      });
      (testStation instanceof Station).should.be.true;
    };
    it('Should create a station object from an object containing the same properties', () => {
      const station = new Station(stationObject);
      checkStation(station, stationObject);
    });
    it('Should set name, latLng, lines, and transfers to appropriate default values as necessary', () => {
      const defaultStation = {
        id: 1,
        name: '*New Station',
        latLng: [0, 0],
        lines: [],
        transfers: [],
      };
      const station = new Station(1);
      checkStation(station, defaultStation);
    });
    it('Should create a station object when passed in property values', () => {
      const station = new Station(stationObject.id, stationObject.name, stationObject.latLng, stationObject.lines,
        stationObject.transfers);
      checkStation(station, stationObject);
    });
  });

  describe('isValidId()', () => { // Note: tested in-depth in ./util.js
    it('Should be true for non-negative integers', () => {
      Station.isValidId(1).should.be.true;
    });
    it('Should be false for negative integers', () => {
      Station.isValidId(-1).should.be.false;
    });
  });

  describe('isValidName()', () => {
    it('Should be true for a string at least 1 character long', () => { // Not that you should
      Station.isValidName('Quentin Rd').should.be.true;
      Station.isValidName('G').should.be.true;
    });
    it('Should be false for the empty string', () => {
      Station.isValidName('').should.be.false;
    });
    it('Should be false for non-strings', () => {
      Station.isValidName(12).should.be.false;
    });
  });

  describe('isValidLatLng()', () => {
    it('Should be true for arrays of exactly 2 numbers', () => {
      Station.isValidLatLng(stationObject.latLng).should.be.true;
      Station.isValidLatLng([45, -23]).should.be.true;
    });
    it('Should be false for arrays of lengths other than 2', () => {
      Station.isValidLatLng([1, 2, 3]).should.be.false;
      Station.isValidLatLng([0]).should.be.false;
    });
    it('Should be false for arrays containing non-numbers', () => {
      Station.isValidLatLng([1, NaN]).should.be.false;
      Station.isValidLatLng([undefined, '2']).should.be.false;
    });
    it('Should be false for non-arrays', () => {
      Station.isValidLatLng(null).should.be.false;
      Station.isValidLatLng({}).should.be.false;
    });
  });

  describe('isValidLines()', () => { // Note: tested in-depth in ./util.js
    it('Should be true for non-negative integer arrays', () => {
      Station.isValidLines([0, 6, 2]).should.be.true;
    });
    it('Should be false for arrays with negative integers', () => {
      Station.isValidLines([5, -1]).should.be.false;
    });
  });

  describe('isValidTransfers()', () => { // Note: tested in-depth in ./util.js
    it('Should be true for non-negative integer arrays', () => {
      Station.isValidTransfers([0, 6, 2]).should.be.true;
    });
    it('Should be false for arrays with negative integers', () => {
      Station.isValidTransfers([5, -1]).should.be.false;
    });
  });

  describe('isValid()', () => {
    const checkValid = (station) => {
      const validity = Station.isValid(station);
      validity.should.equal(
        Station.isValidId(station.id) &&
        Station.isValidName(station.name) &&
        Station.isValidLatLng(station.latLng) &&
        Station.isValidLines(station.lines) &&
        Station.isValidTransfers(station.transfers));
    };

    it('Should agree with the result of all the validator functions above', () => {
      checkValid(stationObject);
      const invalidStation = stationObject;
      invalidStation.id = 'foo';
      checkValid(invalidStation);
    });
  });
});
