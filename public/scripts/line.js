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

    addStation() {

    }

    removeStation() {

    }
}