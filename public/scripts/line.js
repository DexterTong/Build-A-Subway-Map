class Line {
    constructor(id, color, name, fullName, express, category, stations) {
        if(typeof id === 'object') {
            this.id = id.id;
            this.color = id.color;
            this.name = id.name;
            this.fullName = id.fullName;
            this.express = id.express;
            this.category = id.category;
            this.stations = id.stations;
        }
        else {
            this.id = id;
            this.color = color;
            this.name = name;
            this.fullName = fullName;
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