/* eslint-env browser */
/* globals CityMap, Files, Line, Station, UI, Core */

const Core = (function Core() {
  let state = createEmptyState();
  let activeLine;
  let activeStation;
  let activeTransfer;

  function initialize() {
    UI.initialize();
    CityMap.initialize(UI.getMap());
    Files.loadFromServer('nyc2017')
      .then(data => createGameState(data))
      .then(() => update());
  }

  function createEmptyState() {
    return {
      lines: [],
      stations: [],
      transfers: [],
    };
  }

  function createGameState(data) {
    state = createEmptyState();
    data.lines.forEach((line) => {
      if (line !== null && Line.isValid(line)) {
        state.lines[line.id] = new Line(line);
      }
    });
    data.stations.forEach((station) => {
      if (station !== null && Station.isValid(station)) {
        state.stations[station.id] = new Station(station);
      }
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
      if (data.error !== undefined) {
        // console.log(data.error);
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
    return state.lines.filter(line => line !== undefined);
  }

  function getAllStations() {
    return state.stations.filter(station => station !== undefined);
  }

  function getAllTransfers() {
    return state.transfers.filter(transfer => transfer !== undefined);
  }

  function setActiveLine(lineId) {
    activeLine = getLine(lineId);
    UI.setActiveLine(activeLine);
    CityMap.setActiveLine(activeLine);
  }

  function setActiveStation(stationId) {
    activeStation = getStation(stationId);
    UI.setActiveStation(activeStation);
    CityMap.setActiveStation(activeStation, activeStation !== undefined ?
      UI.createStationPopupContent(activeStation) : undefined);
  }

  function setActiveTransfer(transferId) {
    activeTransfer = getTransfer(transferId);
    UI.setActiveStation(activeTransfer);
    CityMap.setActiveStation(activeTransfer);
  }

  function generateLineId() { // eslint-disable-line no-unused-vars
  }

  // TODO: move array 'hole filling' to save step?
  function generateStationId() {
    let i = 0;
    for (; i < state.stations.length; i++) {
      if (state.stations[i] === undefined) { break; }
    }

    return i;
  }

  function generateTransferId() { // eslint-disable-line no-unused-vars
  }

  function createLine() {
  }

  function deleteLine() {
    if (activeLine === undefined) { return; }

    activeLine.stations.forEach(stationId => getStation(stationId).deleteLine(activeLine.id));
    state.lines[activeLine.id] = undefined;
    setActiveLine(undefined);
    update();
  }

  function createStation() {
    // Leading space added to appear at top of station list
    const newStation = new Station(generateStationId(), ' New Station');
    activeStation = newStation;
    CityMap.addCoordinates(newStation, (station) => {
      state.stations[station.id] = station;
      update();
      setActiveStation(station.id);
    });
  }

  function deleteStation() {
    if (activeStation === undefined) { return; }

    activeStation.lines.forEach(lineId => state.lines[lineId].deleteStation(activeStation.id));
    state.stations[activeStation.id] = undefined;
    setActiveStation(undefined);
    update();
  }

  function updateLine(line, property, value) {
    const lineCopy = new Line(line);
    lineCopy[property] = value;
    if (Line.isValid(lineCopy)) {
      state.lines[line.id] = lineCopy;
      activeLine = lineCopy;
    } /* else {
      console.log('Did not update line');
    } */

    UI.update(activeLine);
  }

  function updateStation(station, property, value) {
    const stationCopy = new Station(station);
    stationCopy[property] = value;
    if (Station.isValid(stationCopy)) {
      state.stations[station.id] = stationCopy;
      activeStation = stationCopy;
    } /* else {
      console.log('Did not update station');
    } */

    UI.update(undefined, activeStation);
  }

  return {
    initialize,
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
    createLine,
    deleteLine,
    createStation,
    deleteStation,
    updateLine,
    updateStation,
  };
}());
