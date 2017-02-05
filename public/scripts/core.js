const core = (function () {

    let state = createEmptyState();

    let activeLine;
    let activeStation;
    let activeTransfer;

    document.addEventListener('DOMContentLoaded', () => {
        Map.initialize();
        UI.initialize();
        fileIO.loadFromServer('nyc2016')
            .then(data => {createGameState(data);})
            .then(() => {update();});
    });

    function createEmptyState() {
        return {
            lines: [],
            stations: [],
            transfers: []
        }
    }

    function createGameState(data) {
        state = createEmptyState();
        //TODO: validate data
        data.lines.forEach(line => {
            state.lines[line.id] = new Line(line);
        });
        data.stations.forEach(station => {
            state.stations[station.id] = new Station(station);
        });
        update();
    }

    function update() {
        Map.update();
        UI.update();
    }

    function saveGame() {
        UI.downloadGame(fileIO.generateSave(state));
    }

    function loadGame() {
        UI.uploadGame();
    }

    function loadHandler(loadForm) {
        fileIO.loadFromLocal(loadForm).then((data) => {
            if(data.error !== undefined){
                console.log(data.error);
                return;
            }
            createGameState(data);
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

    function getAllLines() {
        return state.lines.slice();
    }

    function getAllStations() {
        return state.stations.slice();
    }

    function getAllTransfers() {
        return state.transfers.slice();
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
        loadGame: loadGame,
        loadHandler: loadHandler,
        getLine: getLine,
        getStation: getStation,
        getTransfer: getTransfer,
        getAllLines: getAllLines,
        getAllStations: getAllStations,
        getAllTransfers: getAllTransfers,
        setActiveLine: setActiveLine,
        setActiveStation: setActiveStation,
        setActiveTransfer: setActiveTransfer,
        createGameState: createGameState
    }
})();