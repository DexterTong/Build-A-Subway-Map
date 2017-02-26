/* eslint-env browser */
/* globals CityMap, Files, Line, Station, UI, Core */
/* eslint-disable no-use-before-define */

const Core = (function Core() { // eslint-disable-line no-unused-vars
  let state = createEmptyState();
  let activeLine;
  let activeStation;
  let activeTransfer;

  function initialize() {
    UI.initialize();
    CityMap.initialize(UI.getMap());
    Files.loadFromServer('nyc2017_unbranched')
      .then(data => createGameState(data))
      .then(() => render());
  }

  const Lines = (function Lines() {
    function get(lineId) {
      return state.lines[lineId];
    }

    function getAll() {
      return state.lines.filter(line => line !== undefined);
    }

    function setActive(lineId) {
      activeLine = get(lineId);
      UI.setActiveLine(activeLine);
      CityMap.setActiveLine(activeLine);
    }

    function update(line, property, value) {
      const lineCopy = new Line(line);
      lineCopy[property] = value;
      if (Line.isValid(lineCopy)) {
        state.lines[line.id] = lineCopy;
        activeLine = lineCopy;
      }

      UI.update(activeLine);
    }

    function create() {
    }

    function remove() {
      if (activeLine === undefined) { return; }

      activeLine.stations.forEach(stationId => Stations.get(stationId).deleteLine(activeLine.id));
      state.lines[activeLine.id] = undefined;
      setActive(undefined);
      render();
    }

    function generateId() { // eslint-disable-line no-unused-vars
    }

    return {
      create,
      generateId,
      get,
      getAll,
      remove,
      setActive,
      update,
    };
  }());

  const Stations = (function Stations() {
    function get(stationId) {
      return state.stations[stationId];
    }

    function getAll() {
      return state.stations.filter(station => station !== undefined);
    }

    function setActive(stationId) {
      activeStation = get(stationId);
      UI.setActiveStation(activeStation);
      CityMap.setActiveStation(activeStation, activeStation !== undefined ?
        UI.createStationPopupContent(activeStation) : undefined);
    }

    // TODO: move array 'hole filling' to save step?
    function generateId() {
      let i = 0;
      for (; i < state.stations.length; i++) {
        if (state.stations[i] === undefined) { break; }
      }

      return i;
    }

    function create() {
      const newStation = new Station(generateId());
      activeStation = newStation;
      CityMap.addCoordinates(newStation, (station) => {
        state.stations[station.id] = station;
        render();
        setActive(station.id);
      });
    }

    function remove() {
      if (activeStation === undefined) { return; }

      activeStation.lines.forEach(lineId => state.lines[lineId].deleteStation(activeStation.id));
      state.stations[activeStation.id] = undefined;
      setActive(undefined);
      render();
    }

    function update(station, property, value) {
      const stationCopy = new Station(station);
      stationCopy[property] = value;
      if (Station.isValid(stationCopy)) {
        state.stations[station.id] = stationCopy;
        activeStation = stationCopy;
      }

      UI.update(undefined, activeStation);
    }

    return {
      create,
      generateId,
      get,
      getAll,
      remove,
      setActive,
      update,
    };
  }());

  const Transfers = (function Transfers() {
    function get(transferId) {
      return state.transfers[transferId];
    }

    function getAll() {
      return state.transfers.filter(transfer => transfer !== undefined);
    }

    function setActive(transferId) {
      activeTransfer = get(transferId);
      UI.setActiveStation(activeTransfer);
      CityMap.setActiveStation(activeTransfer);
    }

    function generateId() {
    }

    return {
      generateId,
      get,
      getAll,
      setActive,
    };
  }());

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

  function render() {
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
      render();
    });
  }

  return {
    initialize,
    saveGame,
    loadGame,
    loadHandler,
    createGameState,
    Lines,
    Stations,
    Transfers,
  };
}());
