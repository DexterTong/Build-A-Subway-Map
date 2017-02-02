const state = {
    lines: [],
    stations: [],
    transfers: []
};

let activeLine;
let activeStation;
let activeTransfer;

document.addEventListener('DOMContentLoaded', () => {
    Map.initialize();
    loadGame('nyc2016')
        .then(data => {createGameState(data)})
        .then(function() {
            Map.draw(state);
            UI.initialize(state);
        });
});

function loadGame(name) {
    const fileName = name + '.json';
    return new Promise(function (resolve, reject) {
        const req = new XMLHttpRequest();
        req.open('GET', '/data/' + fileName, true);
        req.addEventListener('load', function () {
            if (this.status < 200 && this.status > 400) {
                //TODO: Handle load failure gracefully... or not
                reject(Error('Could not load the requested game: ' + req.statusText));
            }
            else
                resolve(JSON.parse(this.response));
        });
        req.send();
    });
}

function createGameState(data) {
    data.lines.forEach(line => {
        state.lines[line.id] = new Line(line);
    });
    data.stations.forEach(station => {
        state.stations[station.id] = new Station(station);
    });
}

function getLine(lineId) {
    return state.lines[lineId];
}

function getStation(stationId) {
    return state.stations[stationId];
}

function getTransfer(transferId) {

}

function updateActiveLine(lineId) {
    activeLine = getLine(lineId);
    UI.updateActiveLine(activeLine);
    //Map.updateActiveLine(line);
}

function updateActiveStation(stationId) {
    activeStation = getStation(stationId);
    UI.updateActiveStation(activeStation);
}

function updateActiveTransfer(transferId) {

}