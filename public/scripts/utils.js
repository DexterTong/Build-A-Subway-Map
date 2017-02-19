/* eslint-env browser */

class Utils { // eslint-disable-line no-unused-vars
  static isNonNegativeIntArray(value) {
    if (!Array.isArray(value)) { return false; }

    for (let i = 0; i < value.length; i++) {
      if (!Number.isInteger(value[i]) || value[i] < 0) { return false; }
    }

    return true;
  }
}
