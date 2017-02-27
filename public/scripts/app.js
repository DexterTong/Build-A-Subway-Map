/* eslint-env browser */
/* globals mapper, files, Line, Station, ui */
/* eslint-disable no-use-before-define */

const app = (() => { // eslint-disable-line no-unused-vars
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

  // TODO: shift elements in items array to fill holes
  Common.prototype.flatten = function flatten() {
  };

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
    const module = new Common();

    module.add = function add(item) {
      if (item && Station.isValid(item)) { module.items[item.id] = item; }
    };

    module.setActive = function setActive(stationId) {
      module.active = module.get(stationId);
      ui.setActiveStation(module.active);
      mapper.setActiveStation(module.active, module.active !== undefined ?
        ui.createStationPopupContent(module.active) : undefined);
    };

    module.create = function create() {
      const newStation = new Station(module.newId());
      module.active = newStation;
      mapper.addCoordinates(newStation, (station) => {
        module.items[station.id] = station;
        render();
        module.setActive(station.id);
      });
    };

    module.remove = function remove() {
      if (module.active === undefined) { return; }

      module.active.lines.forEach(lineId => lines.get(lineId).deleteStation(module.active.id));
      module.items[module.active.id] = undefined;
      module.setActive(undefined);
      render();
    };

    module.update = function update(station, property, value) {
      const stationCopy = new Station(station);
      stationCopy[property] = value;
      if (Station.isValid(stationCopy)) {
        module.items[station.id] = stationCopy;
        module.active = stationCopy;
      }

      ui.update(undefined, module.active);
    };

    return module;
  }());

  const transfers = (function Transfers() {
    const module = new Common();

    module.setActive = function setActive(transferId) {
      module.active = module.get(transferId);
      ui.setActiveStation(module.active);
      mapper.setActiveStation(module.active);
    };

    return module;
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
