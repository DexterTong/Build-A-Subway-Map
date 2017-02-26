/* eslint-env browser */
/* globals CityMap, Files, Line, Station, UI, Core */
/* eslint-disable no-use-before-define */

const Core = (function Core() { // eslint-disable-line no-unused-vars
  let state = createEmptyState();

  function initialize() {
    UI.initialize();
    CityMap.initialize(UI.getMap());
    Files.loadFromServer('nyc2017_unbranched')
      .then(data => createGameState(data))
      .then(() => render());
  }

  const Lines = (function Lines() {
    let active;

    function get(lineId) {
      return state.lines[lineId];
    }

    function getAll() {
      return state.lines.filter(line => line !== undefined);
    }

    function setActive(lineId) {
      active = get(lineId);
      UI.setActiveLine(active);
      CityMap.setActiveLine(active);
    }

    function update(line, property, value) {
      const lineCopy = new Line(line);
      lineCopy[property] = value;
      if (Line.isValid(lineCopy)) {
        state.lines[line.id] = lineCopy;
        active = lineCopy;
      }

      UI.update(active);
    }

    function create() {
    }

    function remove() {
      if (active === undefined) { return; }

      active.stations.forEach(stationId => Stations.get(stationId).deleteLine(active.id));
      state.lines[active.id] = undefined;
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
    let active;

    function get(stationId) {
      return state.stations[stationId];
    }

    function getAll() {
      return state.stations.filter(station => station !== undefined);
    }

    function setActive(stationId) {
      active = get(stationId);
      UI.setActiveStation(active);
      CityMap.setActiveStation(active, active !== undefined ?
        UI.createStationPopupContent(active) : undefined);
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
      active = newStation;
      CityMap.addCoordinates(newStation, (station) => {
        state.stations[station.id] = station;
        render();
        setActive(station.id);
      });
    }

    function remove() {
      if (active === undefined) { return; }

      active.lines.forEach(lineId => state.lines[lineId].deleteStation(active.id));
      state.stations[active.id] = undefined;
      setActive(undefined);
      render();
    }

    function update(station, property, value) {
      const stationCopy = new Station(station);
      stationCopy[property] = value;
      if (Station.isValid(stationCopy)) {
        state.stations[station.id] = stationCopy;
        active = stationCopy;
      }

      UI.update(undefined, active);
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
    let active;

    function get(transferId) {
      return state.transfers[transferId];
    }

    function getAll() {
      return state.transfers.filter(transfer => transfer !== undefined);
    }

    function setActive(transferId) {
      active = get(transferId);
      UI.setActiveStation(active);
      CityMap.setActiveStation(active);
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
