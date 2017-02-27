/* eslint-env browser */
/* globals Utils */

class Station { // eslint-disable-line no-unused-vars
  constructor(id, name, latLng, lines, transfers) {
    if (typeof id === 'object') {
      this.id = id.id;
      this.name = id.name;
      this.latLng = id.latLng.slice();
      this.lines = id.lines.slice();
      this.transfers = id.transfers.slice();
    } else {
      this.id = id;
      this.name = name !== undefined ? name : '*New Station';
      this.latLng = latLng !== undefined ? latLng.slice() : [0, 0];
      this.lines = lines !== undefined ? lines.slice() : [];
      this.transfers = transfers !== undefined ? transfers.slice() : [];
    }
  }

  static isValidId(value) {
    return Utils.isValidId(value);
  }

  static isValidName(value) {
    if (typeof value !== 'string') { return false; }
    if (value.length < 1) { return false; }
    return true;
  }

  static isValidLatLng(value) {
    if (!Array.isArray(value) || value.length !== 2) { return false; }
    return !(isNaN(value[0]) || isNaN(value[1]));
  }

  static isValidLines(value) {
    return Utils.isNonNegativeIntArray(value);
  }

  static isValidTransfers(value) {
    return Utils.isNonNegativeIntArray(value);
  }

  static isValid(value) {
    return Station.isValidId(value.id) &&
      Station.isValidName(value.name) &&
      Station.isValidLatLng(value.latLng) &&
      Station.isValidLines(value.lines) &&
      Station.isValidTransfers(value.transfers);
  }

  deleteLine(lineId) {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i] === lineId) {
        this.lines.splice(i, 1);
      }
    }
  }
}
