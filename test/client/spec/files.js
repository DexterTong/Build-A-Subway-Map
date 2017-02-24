/* eslint-env browser, mocha */
/* eslint no-unused-expressions: ['off'] */
/* globals Files */

describe('files.js', () => {
  const state = {
    lines: [
      {
        id: 30,
        color: '#808183',
        name: 'S',
        branch: 'Rockaway Park',
        express: false,
        category: 'subway',
        stations: [344, 343, 342, 341, 334],
      },
    ],
    stations: [
      {
        id: 92,
        name: 'Woodlawn',
        latLng: ['40.886037', '-73.878751'],
        lines: [3],
        transfers: [],
      },
    ],
    transfers: [],
  };
  describe('generateSave()', () => {
    const save = Files.generateSave(state);
    it('Should generate an object with a name and data', () => {
      save.should.have.keys('name', 'data');
    });
    it('Should set name to a filename string ending with \'.json\'', () => {
      save.name.should.be.a('string');
      save.name.should.match(/(^[\w-]+\.json)$/);
    });
    it('Should have a data string starting with the appropriate metadata', () => {
      save.data.should.be.a('string');
      save.data.should.match(/^text\/json;charset=utf-8,/);
    });
  });

  describe('loadFromLocal()', () => {
  });

  describe('loadFromServer()', () => {
  });
});
