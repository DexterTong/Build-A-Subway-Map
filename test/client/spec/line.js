/* eslint-env browser, mocha */
/* eslint no-unused-expressions: ["off"] */
/* globals chai, Line */

describe('line.js', () => {
  const lineObject = {
    id: 29,
    color: '#808183',
    name: 'S',
    branch: 'Fakelin Av',
    express: false,
    category: 'subway',
    stations: [254, 449, 448, 254, 201],
  };

  describe('constructor', () => {
    const checkLine = (testLine, obj) => {
      Object.getOwnPropertyNames(testLine).forEach((prop) => {
        testLine[prop].should.deep.equal(obj[prop]);
      });
      (testLine instanceof Line).should.be.true;
    };

    it('Should create a line object from an object containing the same properties', () => {
      const line = new Line(lineObject);
      checkLine(line, lineObject);
    });
    it('Should create a line object when passed in property values', () => {
      const line = new Line(lineObject.id, lineObject.color, lineObject.name, lineObject.branch, lineObject.express,
        lineObject.category, lineObject.stations);
      checkLine(line, lineObject);
    });
  });

  describe('isValidId()', () => { // Note: tested in-depth in ./util.js
    it('Should be true for non-negative integers', () => {
      Line.isValidId(1).should.be.true;
    });
    it('Should be false for negative integers', () => {
      Line.isValidId(-1).should.be.false;
    });
  });

  describe('isValidColor()', () => {
    it('Should be true only for strings of the form \'#XXX\' or \'#XXXXXX\'', () => {
      Line.isValidColor('#184').should.be.true;
      Line.isValidColor('#FF23AE').should.be.true;
      Line.isValidColor('EDAB45').should.be.false;
      Line.isValidColor('#1G4432').should.be.false;
      Line.isValidColor('#20P').should.be.false;
    });
    it('Should be false for non-strings', () => {
      Line.isValidColor(undefined).should.be.false;
    });
  });

  describe('isValidName()', () => {
    it('Should be true only for strings of 1-3 uppercase letters xor 1-2 numbers', () => {
      Line.isValidName('SIR').should.be.true;
      Line.isValidName('12').should.be.true;
      Line.isValidName('D').should.be.true;
      Line.isValidName('100').should.be.false;
      Line.isValidName('abc').should.be.false;
      Line.isValidName('A1').should.be.false;
    });
    it('Should be false for non-strings', () => {
      Line.isValidName(null).should.be.false;
    });
  });

  describe('isValidBranch()', () => {
    it('Should be true for strings using allowed characters', () => {
      Line.isValidBranch('AaBb \'-. Street').should.be.true;
      Line.isValidBranch('Do you have $500 & 20¢?').should.be.false;
    });
    it('Should be false for non-strings', () => {
      Line.isValidBranch(34).should.be.false;
    });
  });

  describe('isValidExpress()', () => {
    it('Should be true for a boolean', () => {
      Line.isValidExpress(true).should.be.true;
      Line.isValidExpress(false).should.be.true;
    });
    it('Should be false for anything else', () => {
      Line.isValidExpress('true').should.be.false;
    });
  });

  describe('isValidCategory()', () => {
    it('Should be true for \'subway\'', () => {
      Line.isValidCategory('subway').should.be.true;
    });
    it('Should be false for any other string', () => {
      Line.isValidCategory('foo').should.be.false;
    });
    it('Should be false for a non-string', () => {
      Line.isValidCategory(2).should.be.false;
    });
  });

  describe('isValidStations()', () => { // Note: tested in-depth in ./util.js
    it('Should be true for non-negative integer arrays', () => {
      Line.isValidStations([0, 6, 2]).should.be.true;
    });
    it('Should be false for arrays with negative integers', () => {
      Line.isValidStations([5, -1]).should.be.false;
    });
  });

  describe('isValid()', () => {
    const checkValid = (line) => {
      const validity = Line.isValid(line);
      validity.should.equal(
        Line.isValidId(line.id) &&
        Line.isValidColor(line.color) &&
        Line.isValidName(line.name) &&
        Line.isValidBranch(line.branch) &&
        Line.isValidExpress(line.express) &&
        Line.isValidCategory(line.category) &&
        Line.isValidStations(line.stations));
    };
    it('Should agree with the result of all the validator functions above', () => {
      checkValid(lineObject);
      const invalidLine = lineObject;
      invalidLine.id = 'foo';
      checkValid(invalidLine);
    });
  });

  describe('deleteStation()', () => {
    let line;
    beforeEach(() => {
      line = new Line(lineObject);
    });

    it('Should delete only the given station id from the line', () => {
      line.deleteStation(448);
      line.stations.should.eql([254, 449, 254, 201]);
    });

    it('Should delete all occurrences of a particular station from the line', () => {
      line.deleteStation(254);
      line.stations.should.eql([449, 448, 201]);
    });

    it('Should not alter the stations array if the given id is not found', () => {
      line.deleteStation(1);
      line.stations.should.eql([254, 449, 448, 254, 201]);
    });
  });
});
