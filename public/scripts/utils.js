/* eslint-env browser */

class Utils { // eslint-disable-line no-unused-vars
  static isNonNegativeIntArray(value) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!Number.isInteger(value[i])) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Utils;
