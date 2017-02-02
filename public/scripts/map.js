const Map = (function () {

    let map;
    const LATLNG_NYC = L.latLng(40.7128, -74.0061); //City Hall, New York City
    const markers = {
        lines: [],
        stations: [],
        transfers: []
    };

    const stationLocalIcon = L.divIcon({
        className: 'station local',
        iconSize: [8, 8]
    });

    const stationExpressIcon = L.divIcon({
        className: 'station express',
        iconSize: [8, 8]
    });

    function initialize() {
        map = L.map(UI.getMap(), {zoomControl: false});
        const defaultLocation = LATLNG_NYC;
        map.setView(defaultLocation, 13);
        const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tileLayerOptions = {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            id: 'build.a.subway.map'
        };
        L.control.zoom({position: 'topright'}).addTo(map);
        L.tileLayer(tileURL, tileLayerOptions).addTo(map);
    }

    function update() {
        deleteAllMarkers();
        core.getAllLines().forEach(drawLine);
        core.getAllStations().forEach(drawStation);
        core.getAllTransfers().forEach(drawTransfer);
    }

    function deleteAllMarkers() {
        markers.lines.forEach(linePoly => map.removeLayer(linePoly));
        markers.stations.forEach(stationMarker => map.removeLayer(stationMarker));
        markers.transfers.forEach(transferPoly => map.removeLayer(transferPoly));
    }

    function drawLine(line) {
        const pointsToDraw = line.stations.map(stationId => core.getStation(stationId).latLng);
        const linePoly = L.polyline(pointsToDraw, {color: line.color});
        markers.lines.push(linePoly);
        linePoly.addTo(map);
    }

    function drawStation(station) {
        let popupText = '<b>' + station.name + '</b> <i>' + station.id + '</i><br>';
        const linesAtStation = new Set();
        station.lines.forEach(lineId => linesAtStation.add(core.getLine(lineId).name));
        linesAtStation.forEach(lineName => {popupText += lineName + ' ';});
        const stationMarker = L.marker(station.latLng, {icon:stationLocalIcon});
        markers.stations.push(stationMarker);
        stationMarker.addTo(map).bindPopup(popupText)
            .addEventListener('click', core.setActiveStation.bind(this, station.id));
    }

    function drawTransfer(transfer) {
    }

    function setActiveLine(lineId) {
    }

    return {
        initialize: initialize,
        update: update,
        setActiveLine: setActiveLine
    };
})();