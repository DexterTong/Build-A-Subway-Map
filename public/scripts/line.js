/* eslint-env browser */
/* globals Utils */

class Line {  // eslint-disable-line no-unused-vars
  constructor(id, color, name, branch, express, category, stations) {
    if (typeof id === 'object') {
      this.id = id.id;
      this.color = id.color;
      this.name = id.name;
      this.branch = id.branch;
      this.express = id.express;
      this.category = id.category;
      this.stations = id.stations.slice();
    } else {
      this.id = id;
      this.color = color;
      this.name = name;
      this.branch = branch;
      this.express = express;
      this.category = category;
      this.stations = stations.slice();
    }
  }

  deleteStation(stationId) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i] === stationId) {
        this.stations.splice(i, 1); // Do not stop checking early, in case line stops here multiple times
      }
    }
  }

  static isValidId(value) {
    return Utils.isValidId(value);
  }

  static isValidColor(value) {
    // Check if value is a valid hex color string, i.e. '#XXX' or '#XXXXXX'
    if (typeof value !== 'string') { return false; }
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
  }

  static isValidName(value) {
    if (typeof value !== 'string') { return false; }
    return /^[A-Z]{1,3}$|^[\d]{1,2}$/.test(value);
  }

  static isValidBranch(value) {
    if (typeof value !== 'string') { return false; }
    return /^[A-Za-z\d '-.]*$/.test(value);
  }

  static isValidExpress(value) {
    return typeof value === 'boolean';
  }

  static isValidCategory(value) {
    if (typeof value !== 'string') { return false; }
    return ['subway'].indexOf(value) > -1;
  }

  static isValidStations(value) {
    return Utils.isNonNegativeIntArray(value);
  }

  static isValid(value) {
    return Line.isValidId(value.id) &&
      Line.isValidColor(value.color) &&
      Line.isValidName(value.name) &&
      Line.isValidBranch(value.branch) &&
      Line.isValidExpress(value.express) &&
      Line.isValidCategory(value.category) &&
      Line.isValidStations(value.stations);
  }
}
