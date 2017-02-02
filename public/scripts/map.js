const Map = (function () {

    const LATLNG_NYC = L.latLng(40.7128, -74.0061); //City Hall, New York City

    let gameMap;

    const stationLocalIcon = L.divIcon({
        className: 'station local',
        iconSize: [8, 8]
    });

    const stationExpressIcon = L.divIcon({
        className: 'station express',
        iconSize: [8, 8]
    });

    function drawLine(line) {
        const pointsToDraw = line.stations.map(stationId => state.stations[stationId].latLng);
        L.polyline(pointsToDraw, {color: line.color})
            .addTo(gameMap);
    }

    function drawStation(station) {
        let popupText = '<b>' + station.name + '</b> <i>' + station.id + '</i><br>';
        const linesAtStation = new Set();
        station.lines.forEach(lineId => linesAtStation.add(state.lines[lineId].name));
        linesAtStation.forEach(lineName => {popupText += lineName + ' ';});
        L.marker(station.latLng, {icon:stationLocalIcon})
            .addTo(gameMap)
            .bindPopup(popupText)
            .addEventListener('click', updateActiveStation.bind(this, station.id));
    }

    return {

        initialize: function () {
            gameMap = L.map(UI.getMap(), {zoomControl: false});
            const defaultLocation = LATLNG_NYC;
            gameMap.setView(defaultLocation, 13);
            const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const tileLayerOptions = {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                id: 'build.a.subway.map'
            };
            L.control.zoom({position: 'topright'}).addTo(gameMap);
            L.tileLayer(tileURL, tileLayerOptions).addTo(gameMap);
        },

        draw: function(state) {
            state.lines.forEach(drawLine);
            state.stations.forEach(drawStation);
            //state.transfers.forEach(drawTransfer);
        },

        updateActiveLine: function(lineId) {

        }
    };

})();