/* eslint-env browser */
/* globals mapper, files, Line, Station, ui */
/* eslint-disable no-use-before-define */

const core = (() => { // eslint-disable-line no-unused-vars
  let state = createNewState();

  function initialize() {
    ui.initialize();
    mapper.initialize(ui.getMap());
    files.loadFromServer('nyc2017_unbranched')
      .then(data => createGameState(data))
      .then(() => render());
  }

  function createNewState() {
    return {
      lines: [],
      stations: [],
      transfers: [],
    };
  }

  function createGameState(data) {
    state = createNewState();
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
    mapper.update();
    ui.update();
  }

  function saveGame() {
    ui.downloadGame(files.generateSave(state));
  }

  function loadGame() {
    ui.setCurrentAction('Load save file');
    ui.uploadGame();
  }

  function loadHandler(loadForm) {
    files.loadFromLocal(loadForm).then((data) => {
      if (data.error !== undefined) {
        // console.log(data.error);
        ui.setCurrentAction('');
        return;
      }

      ui.setCurrentAction('');
      createGameState(data);
      render();
    });
  }

  function Common() {
    this.active = undefined;
    this.items = [1, 2, 3];
  }

  Common.prototype.get = function get(id) {
    return this.items[id];
  };

  Common.prototype.getAll = function getAll() {
    return this.items.filter(item => item !== undefined);
  };

  Common.prototype.newId = function newId() {
    return this.items.length;
  };

  const lines = (function lines() {
    let active;

    function get(lineId) {
      return state.lines[lineId];
    }

    function getAll() {
      return state.lines.filter(line => line !== undefined);
    }

    function setActive(lineId) {
      active = get(lineId);
      ui.setActiveLine(active);
      mapper.setActiveLine(active);
    }

    function update(line, property, value) {
      const lineCopy = new Line(line);
      lineCopy[property] = value;
      if (Line.isValid(lineCopy)) {
        state.lines[line.id] = lineCopy;
        active = lineCopy;
      }

      ui.update(active);
    }

    function create() {
    }

    function remove() {
      if (active === undefined) { return; }

      active.stations.forEach(stationId => stations.get(stationId).deleteLine(active.id));
      state.lines[active.id] = undefined;
      setActive(undefined);
      render();
    }

    function generateId() {
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

  const stations = (function Stations() {
    let active;

    function get(stationId) {
      return state.stations[stationId];
    }

    function getAll() {
      return state.stations.filter(station => station !== undefined);
    }

    function setActive(stationId) {
      active = get(stationId);
      ui.setActiveStation(active);
      mapper.setActiveStation(active, active !== undefined ?
        ui.createStationPopupContent(active) : undefined);
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
      mapper.addCoordinates(newStation, (station) => {
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

      ui.update(undefined, active);
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

  const transfers = (function Transfers() {
    let active;

    function get(transferId) {
      return state.transfers[transferId];
    }

    function getAll() {
      return state.transfers.filter(transfer => transfer !== undefined);
    }

    function setActive(transferId) {
      active = get(transferId);
      ui.setActiveStation(active);
      mapper.setActiveStation(active);
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

  return {
    createGameState,
    initialize,
    loadGame,
    loadHandler,
    saveGame,
    lines,
    stations,
    transfers,
    Common,
  };
})();
