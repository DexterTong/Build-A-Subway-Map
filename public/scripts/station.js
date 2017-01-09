class Station {
    constructor(id, name, latLng, lines, transfers) {
        if(arguments.length === 1){
            this.id = id.id;
            this.name = id.name;
            this.latLng = id.latLng;
            this.lines = id.lines;
            this.transfers = id.transfers;
        }
        else {
            this.id = id;
            this.name = name;
            this.latLng = latLng;
            this.lines = lines;
            this.transfers = transfers;
        }
    }

    addLine() {

    }

    removeLine() {

    }

    addTransfer() {

    }

    removeTransfer() {

    }
}