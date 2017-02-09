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
}