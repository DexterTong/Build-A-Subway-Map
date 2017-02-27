/* eslint-env browser */
/* globals mapper, files, Line, Station, ui */
/* eslint-disable no-use-before-define */

const core = (() => { // eslint-disable-line no-unused-vars
  function initialize() {
    ui.initialize();
    mapper.initialize(ui.getMap());
    files.loadFromServer('nyc2017_unbranched')
      .then(data => createGameState(data))
      .then(() => render());
  }

  function createGameState(data) {
    lines.clear();
    stations.clear();
    transfers.clear();
    data.lines.forEach(line => lines.add(new Line(line)));
    data.stations.forEach(station => stations.add(new Station(station)));
  }

  function render() {
    mapper.update();
    ui.update();
  }

  function saveGame() {
    ui.downloadGame(files.generateSave({
      lines: lines.getAll(),
      stations: stations.getAll(),
      transfers: transfers.getAll(),
    }));
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
    this.items = [];
  }

  Common.prototype.clear = function clear() {
    this.active = undefined;
    while (this.items.length > 1) {
      this.items.pop();
    }
  };

  Common.prototype.get = function get(id) {
    return this.items[id];
  };

  Common.prototype.getAll = function getAll() {
    return this.items.filter(item => item !== undefined);
  };

  Common.prototype.generateId = function newId() {
    return this.items.length;
  };

  const lines = (function lines() {
    const module = new Common();

    module.add = function add(item) {
      if (item && Line.isValid(item)) { this.items[item.id] = item; }
    };

    module.setActive = function setActive(lineId) {
      module.active = module.get(lineId);
      ui.setActiveLine(module.active);
      mapper.setActiveLine(module.active);
    };

    module.update = function update(line, property, value) {
      const lineCopy = new Line(line);
      lineCopy[property] = value;
      if (Line.isValid(lineCopy)) {
        module.items[line.id] = lineCopy;
        module.active = lineCopy;
      }

      ui.update(module.active);
    };

    module.create = function create() {
    };

    module.remove = function remove() {
      if (module.active === undefined) { return; }

      module.active.stations.forEach(stationId => stations.get(stationId).deleteLine(module.active.id));
      module.items[module.active.id] = undefined;
      module.setActive(undefined);
      render();
    };

    return module;
  }());

  const stations = (function Stations() {
    let active;
    const items = [];

    function add(item) {
      if (item && Station.isValid(item)) { items[item.id] = item; }
    }

    function clear() {
      active = undefined;
      while (items.length > 1) {
        items.pop();
      }
    }

    function get(stationId) {
      return items[stationId];
    }

    function getAll() {
      return items.filter(station => station !== undefined);
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
      for (; i < items.length; i++) {
        if (items[i] === undefined) { break; }
      }

      return i;
    }

    function create() {
      const newStation = new Station(generateId());
      active = newStation;
      mapper.addCoordinates(newStation, (station) => {
        items[station.id] = station;
        render();
        setActive(station.id);
      });
    }

    function remove() {
      if (active === undefined) { return; }

      active.lines.forEach(lineId => lines.get(lineId).deleteStation(active.id));
      items[active.id] = undefined;
      setActive(undefined);
      render();
    }

    function update(station, property, value) {
      const stationCopy = new Station(station);
      stationCopy[property] = value;
      if (Station.isValid(stationCopy)) {
        items[station.id] = stationCopy;
        active = stationCopy;
      }

      ui.update(undefined, active);
    }

    return {
      add,
      clear,
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
    const items = [];

    function clear() {
      active = undefined;
      while (items.length > 1) {
        items.pop();
      }
    }

    function get(transferId) {
      return items[transferId];
    }

    function getAll() {
      return items.filter(transfer => transfer !== undefined);
    }

    function setActive(transferId) {
      active = get(transferId);
      ui.setActiveStation(active);
      mapper.setActiveStation(active);
    }

    function generateId() {
    }

    return {
      clear,
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
  };
})();
