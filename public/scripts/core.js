const Core = (function() {

    let state = createEmptyState();

    let activeLine;
    let activeStation;
    let activeTransfer;

    document.addEventListener('DOMContentLoaded', () => {
        CityMap.initialize();
        UI.initialize();
        Files.loadFromServer('nyc2017')
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
            if(line !== null && validateLine(line))
                state.lines[line.id] = new Line(line);
        });
        data.stations.forEach(station => {
            if(station !== null)
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
        UI.setCurrentAction('Load save file');
        UI.uploadGame();
    }

    function loadHandler(loadForm) {
        Files.loadFromLocal(loadForm).then((data) => {
            if(data.error !== undefined){
                console.log(data.error);
                UI.setCurrentAction('');
                return;
            }
            UI.setCurrentAction('');
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

    function generateLineId() {
    }

    //TODO: move array 'hole filling' to save step?
    function generateStationId() {
        let i = 0;
        for(; i < state.stations.length; i++) {
            if(state.stations[i] === undefined)
                return i;
        }
        return i;
    }

    function generateTransferId() {
    }

    function createStation() {
        const station = new Station(generateStationId(), ' New Station'); // Leading space to be at top of list
        activeStation = station;
        CityMap.addCoordinates(station, (station) => {
            state.stations[station.id] = station;
            update();
            setActiveStation(station.id);
        });
    }

    function updateLine(line, property, newValue) {
        if(validateLineProperty(property, newValue)) {
            line[property] = newValue;
            state.lines[line.id] = line;
            activeLine = line;
            UI.update(activeLine);
        }
        else
            console.log('Did not update line');
    }

    function validateLineProperty(property, value) {
        switch(property) {
            case 'id':
                return Number.isInteger(value);
            case 'color':
                break;
            case 'name':
                return /^[A-Z\d]*$/.test(value);     //Uppercase letters and numbers only
            case 'branch':
                return /^[A-Za-z\d ()]*$/.test(value);
            case 'express':
                return typeof value === 'boolean';
            case 'category':
                return ['subway'].indexOf(value) > -1;  // no light rail/trams/commuter rail for now
            case 'stations':
                break;
            default:
                return false;
        }
        return true;
    }

    function validateLine(line) {
        const lineProperties = Object.getOwnPropertyNames(line);
        for(let i = 0; i < lineProperties.length; i++)
            if(!validateLineProperty(lineProperties[i], line[lineProperties[i]]))
                return false;
        return true;
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
        createGameState,
        createStation,
        updateLine,
        validateLine
    };
})();