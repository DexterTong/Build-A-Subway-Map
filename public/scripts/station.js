/*globals Utils*/

class Station {
    constructor(id, name, latLng, lines, transfers) {
        if(typeof id === 'object'){
            this.id = id.id;
            this.name = id.name;
            this.latLng = id.latLng;
            this.lines = id.lines;
            this.transfers = id.transfers;
        }
        else {
            this.id = id;
            this.name = name !== undefined ? name : '';
            this.latLng = latLng !== undefined ? latLng : [0, 0];
            this.lines = lines !== undefined ? lines : [];
            this.transfers = transfers !== undefined ? transfers : [];
        }
    }

    static isValidId(value) {
        if(!Number.isInteger(value))
            return false;
        return value >= 0;
    }

    static isValidName(value) {
        //noinspection RedundantIfStatementJS
        if(typeof value !== 'string')
            return false;
        return true; //TODO: replace with real check later
    }

    static isValidLatLng(value) {
        if(!Array.isArray(value))
            return false;
        if(value.length !== 2)
            return false;
        return !(isNaN(value[0]) || isNaN(value[1]));

    }

    static isValidLines(value) {
        return Utils.isIntegerArray(value);
    }

    static isValidTransfers(value) {
        return Utils.isIntegerArray(value);
    }

    static isValid(value) {
        return Station.isValidId(value.id) &&
            Station.isValidName(value.name) &&
            Station.isValidLatLng(value.latLng) &&
            Station.isValidLines(value.lines) &&
            Station.isValidTransfers(value.transfers);
    }

    deleteLine(lineId) {
        for(let i = 0; i < this.lines.length; i++){
            if(this.lines[i] === lineId){
                this.lines.splice(i, 1);
            }
        }
    }
}