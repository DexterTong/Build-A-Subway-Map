const core = (function () {

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
        fileIO.loadFromServer('nyc2016')
            .then(data => {
                createGameState(data)
            })
            .then(function () {
                Map.draw(state);
                UI.initialize(state);
            });
    });

    function createGameState(data) {
        data.lines.forEach(line => {
            state.lines[line.id] = new Line(line);
        });
        data.stations.forEach(station => {
            state.stations[station.id] = new Station(station);
        });
    }

    function saveGame() {
        UI.downloadSave(fileIO.generateSave(state));
    }

    function getLine(lineId) {
        return state.lines[lineId];
    }

    function getStation(stationId) {
        return state.stations[stationId];
    }

    function getTransfer(transferId) {
    }

    function getAllStations() {
        return state.stations.slice();
    }

    function setActiveLine(lineId) {
        activeLine = getLine(lineId);
        UI.setActiveLine(activeLine);
        //Map.setActiveLine(line);
    }

    function setActiveStation(stationId) {
        activeStation = getStation(stationId);
        UI.setActiveStation(activeStation);
    }

    function setActiveTransfer(transferId) {
    }

    return {
        saveGame: saveGame,
        getLine: getLine,
        getStation: getStation,
        getTransfer: getTransfer,
        getAllStations: getAllStations,
        setActiveLine: setActiveLine,
        setActiveStation: setActiveStation,
        setActiveTransfer: setActiveTransfer
    }
})();