const CityMap = (function() {

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
        map = L.map(UI.getMap(), {zoomControl: false}); // Get map through core module instead?
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
        Core.getAllLines().forEach(drawLine);
        Core.getAllStations().forEach(drawStation);
        Core.getAllTransfers().forEach(drawTransfer);
    }

    function deleteAllMarkers() {
        while(markers.lines.length > 0) {
            map.removeLayer(markers.lines.pop());
        }
        while(markers.stations.length > 0) {
            map.removeLayer(markers.stations.pop());
        }
        while(markers.transfers.length > 0) {
            map.removeLayer(markers.transfers.pop());
        }
    }

    function drawLine(line) {
        const pointsToDraw = line.stations.map(stationId => Core.getStation(stationId).latLng);
        const linePoly = L.polyline(pointsToDraw, {color: line.color});
        markers.lines.push(linePoly);
        linePoly.addTo(map);
    }

    function drawStation(station) {
        let popupText = '<b>' + station.name + '</b> <i>' + station.id + '</i><br>';
        const linesAtStation = new Set();
        station.lines.forEach(lineId => {linesAtStation.add(Core.getLine(lineId).name);});
        linesAtStation.forEach(lineName => {popupText += lineName + ' ';});
        const stationMarker = L.marker(station.latLng, {icon:stationLocalIcon});
        markers.stations.push(stationMarker);
        stationMarker.addTo(map).bindPopup(popupText)
            .addEventListener('click', Core.setActiveStation.bind(this, station.id));
    }

    function drawTransfer(transfer) {
    }

    function setActiveLine(line) {
    }

    function setActiveStation(station) {
    }

    function setActiveTransfer(transfer) {
    }

    function addCoordinates(station, callback) {
        const getCoordinates = (event) => {
            map.removeEventListener('click', getCoordinates);
            station.latLng = [Number(event.latlng.lat.toFixed(6)), Number(event.latlng.lng.toFixed(6))];
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
        addCoordinates
    };
})();