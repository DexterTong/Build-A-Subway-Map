/* eslint-env browser */
/* globals Utils */

class Line {
  constructor(id, color, name, branch, express, category, stations) {
    if (typeof id === 'object') {
      this.id = id.id;
      this.color = id.color;
      this.name = id.name;
      this.branch = id.branch;
      this.express = id.express;
      this.category = id.category;
      this.stations = id.stations;
    } else {
      this.id = id;
      this.color = color;
      this.name = name;
      this.branch = branch;
      this.express = express;
      this.category = category;
      this.stations = stations;
    }
  }

  deleteStation(stationId) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i] === stationId) {
        this.stations.splice(i, 1);
      }
    }
  }

  static isValidId(value) {
    if (!Number.isInteger(value)) {
      return false;
    }

    return value >= 0;
  }

  static isValidColor(value) {
    // Check if value is a valid hex color string, i.e. '#XXX' or '#XXXXXX'
    if (typeof value !== 'string') {
      return false;
    }

    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
  }

  static isValidName(value) {
    if (typeof value !== 'string') {
      return false;
    }

    return /^[A-Za-z\d]{1,3}$/.test(value);
  }

  static isValidBranch(value) {
    if (typeof value !== 'string') {
      return false;
    }

    return /^[A-Za-z\d ()]*$/.test(value);
  }

  static isValidExpress(value) {
    return typeof value === 'boolean';
  }

  static isValidCategory(value) {
    if (typeof value !== 'string') {
      return false;
    }

    return ['subway'].indexOf(value) > -1;
  }

  static isValidStations(value) {
    return Utils.isIntegerArray(value);
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
