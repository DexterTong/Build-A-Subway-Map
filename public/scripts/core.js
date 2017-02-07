const Core = (function () {

    let state = createEmptyState();

    let activeLine;
    let activeStation;
    let activeTransfer;

    document.addEventListener('DOMContentLoaded', () => {
        CityMap.initialize();
        UI.initialize();
        Files.loadFromServer('nyc2016')
            .then(data => {createGameState(data);})
            .then(() => {update();});
    });

    function createEmptyState() {
        return {
            lines: [],
            stations: [],
            transfers: []
        };
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
    }

    function update() {
        CityMap.update();
        UI.update();
    }

    function saveGame() {
        UI.downloadGame(Files.generateSave(state));
    }

    function loadGame() {
        UI.uploadGame();
    }

    function loadHandler(loadForm) {
        Files.loadFromLocal(loadForm).then((data) => {
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
        return state.transfers[transferId];
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
        CityMap.setActiveLine(activeLine);
    }

    function setActiveStation(stationId) {
        activeStation = getStation(stationId);
        UI.setActiveStation(activeStation);
        CityMap.setActiveStation(activeStation);
    }

    function setActiveTransfer(transferId) {
        activeTransfer = getTransfer(transferId);
        UI.setActiveStation(activeTransfer);
        CityMap.setActiveStation(activeTransfer);
    }

    return {
        saveGame,
        loadGame,
        loadHandler,
        getLine,
        getStation,
        getTransfer,
        getAllLines,
        getAllStations,
        getAllTransfers,
        setActiveLine,
        setActiveStation,
        setActiveTransfer,
        createGameState
    };
})();