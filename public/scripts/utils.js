/*exported Utils*/

class Utils {
    static isIntegerArray(value) {
        if (!Array.isArray(value))
            return false;
        for (let i = 0; i < value.length; i++)
            if (!Number.isInteger(value[i]))
                return false;
        return true;
    }
}