/* eslint-env browser */
/* globals app, L */

const mapper = (() => { // eslint-disable-line no-unused-vars
  let map;
  const LATLNG_NYC = L.latLng(40.7128, -74.0061); // City Hall, New York City
  const markers = {
    lines: [],
    stations: [],
    transfers: [],
  };

  const stationLocalIcon = L.divIcon({
    className: 'station local',
    iconSize: [8, 8],
  });

  const stationExpressIcon = L.divIcon({  // eslint-disable-line no-unused-vars
    className: 'station express',
    iconSize: [8, 8],
  });

  function initialize(mapElement) {
    map = L.map(mapElement, { zoomControl: false });
    const defaultLocation = LATLNG_NYC;
    map.setView(defaultLocation, 13);
    const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayerOptions = {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      id: 'build.a.subway.map',
    };
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.tileLayer(tileURL, tileLayerOptions).addTo(map);
  }

  function update() {
    deleteAllMarkers();
    app.lines.getAll().forEach(drawLine);
    app.stations.getAll().forEach(drawStation);
    app.transfers.getAll().forEach(drawTransfer);
  }

  function deleteAllMarkers() {
    while (markers.lines.length > 0) {
      const toRemove = markers.lines.pop();
      if (toRemove !== undefined) {
        map.removeLayer(toRemove);
      }
    }

    while (markers.stations.length > 0) {
      const toRemove = markers.stations.pop();
      if (toRemove !== undefined) {
        map.removeLayer(toRemove);
      }
    }

    while (markers.transfers.length > 0) {
      const toRemove = markers.transfers.pop();
      if (toRemove !== undefined) {
        map.removeLayer(toRemove);
      }
    }
  }

  function drawLine(line) {
    const pointsToDraw = line.stations.map(stationId => app.stations.get(stationId).latLng);
    const linePoly = L.polyline(pointsToDraw, { color: line.color });
    markers.lines[line.id] = linePoly;
    linePoly.addTo(map);
  }

  function drawStation(station) {
    /*
    let popupText = '<b>' + station.name + '</b> <i>' + station.id + '</i><br>';
    const linesAtStation = new Set();
    station.lines.forEach(lineId => {linesAtStation.add(Core.getLine(lineId).name);});
    linesAtStation.forEach(lineName => {popupText += lineName + ' ';});
    */
    const stationMarker = L.marker(station.latLng, { icon: stationLocalIcon }).addTo(map);
    markers.stations[station.id] = stationMarker;
    stationMarker.addEventListener('click', app.stations.clickController.bind(null, station.id));
  }

  function drawTransfer(transfer) {   // eslint-disable-line no-unused-vars
  }

  function setActiveLine(line) {  // eslint-disable-line no-unused-vars
  }

  function setActiveStation(station, popupContent) {
    if (station === undefined) {
      map.closePopup();
    } else {
      const stationMarker = markers.stations[station.id];
      stationMarker.unbindPopup();
      stationMarker.bindPopup(popupContent);
      stationMarker.openPopup();
    }
  }

  function setActiveTransfer(transfer) {  // eslint-disable-line no-unused-vars
  }

  function addCoordinates(station, callback) {
    const getCoordinates = (event) => {
      map.removeEventListener('click', getCoordinates);
      station.latLng = [// eslint-disable-line no-param-reassign
        Number(event.latlng.lat.toFixed(6)),
        Number(event.latlng.lng.toFixed(6)),
      ];
      callback(station);
    };

    map.addEventListener('click', getCoordinates);
  }

  return {
    initialize,
    update,
    setActiveLine,
    setActiveStation,
    setActiveTransfer,
    addCoordinates,
  };
})();
