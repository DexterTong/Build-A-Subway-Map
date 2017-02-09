class Line {
    constructor(id, color, name, branch, express, category, stations) {
        if(typeof id === 'object') {
            this.id = id.id;
            this.color = id.color;
            this.name = id.name;
            this.branch = id.branch;
            this.express = id.express;
            this.category = id.category;
            this.stations = id.stations;
        }
        else {
            this.id = id;
            this.color = color;
            this.name = name;
            this.branch = branch;
            this.express = express;
            this.category = category;
            this.stations = stations;
        }
    }

    static validateId(value) {
        if(!Number.isInteger(value))
            return false;
        return value >= 0;
    }

    static validateColor(value) {
        //Check if value is a string representing a valid hexadecimal color, i.e. '#XXX' or '#XXXXXX'
        if(typeof value !== 'string')
            return false;
        return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
    }

    static validateName(value) {
        if(typeof value !== 'string')
            return false;
        return /^[A-Za-z\d]{1,3}$/.test(value);
    }

    static validateBranch(value) {
        if(typeof value !== 'string')
            return false;
        return /^[A-Za-z\d ()]*$/.test(value);
    }

    static validateExpress(value) {
        return typeof value === 'boolean';
    }

    static validateCategory(value) {
        if(typeof value !== 'string')
            return false;
        return ['subway'].indexOf(value) > -1;
    }

    static validateStations(value) {
        if(!Array.isArray(value))
            return false;
        for(let i = 0; i < value.length; i++)
            if(!Number.isInteger(value[i]))
                return false;
        return true;
    }

    static validate(line) {
        return Line.validateId(line.id)
            && Line.validateColor(line.color)
            && Line.validateName(line.name)
            && Line.validateBranch(line.branch)
            && Line.validateExpress(line.express)
            && Line.validateCategory(line.category)
            && Line.validateStations(line.stations);
    }
}