const stationLocalIcon = L.divIcon({
    className: 'station local',
    iconSize: [8, 8]
});

const stationExpressIcon = L.divIcon({
    className: 'station express',
    iconSize: [8, 8]
});

let gameMap;
const gameState = {
    lines: [],
    stations: [],
    transfers: []
};

moveHeaderToSidebar();
initMap();
loadGame('nyc2016')
    .then(createGameState)
    .then(drawAll);
    //.then(populateMap);

function moveHeaderToSidebar() {
    const common = document.getElementById('common');
    const sidebar = document.getElementById('sidebar');
    common.parentNode.removeChild(common);
    sidebar.insertBefore(common, sidebar.firstChild);
}

function initMap() {
    gameMap = L.map('map', {
        zoomControl: false
    });
    const defaultLocation = L.latLng(40.7128, -74.0061); //City Hall, NYC
    gameMap.setView(defaultLocation, 13);
    //TODO: Move off of OSM server, possibly to local storage?
    const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayerOptions = {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'build.a.subway.map'
    };
    L.control.zoom({
        position: 'topright'
    }).addTo(gameMap);
    L.tileLayer(tileURL, tileLayerOptions).addTo(gameMap);
    //gameMap.on('click', addStation);
    gameMap.on('click', function (event) {
        L.popup()
            .setLatLng(event.latlng)
            .setContent(event.latlng.toString())
            .openOn(gameMap);
    });
}

function addStation(event) {
    /*L.popup()
     .setLatLng(event.latlng)
     .setContent(event.latlng.toString())
     .openOn(gameMap);*/
    L.marker(event.latlng, {icon: stationLocalIcon})
        .addTo(gameMap)
        .on('click', stationOnClick);
}

function stationOnClick(event) {
    this.remove();
}

function loadGame(name) {
    let fileName = name + '.json';
    return new Promise(function (resolve, reject) {
        const req = new XMLHttpRequest();
        req.open('GET', '/data/' + fileName, true);
        req.addEventListener('load', function () {
            if (this.status < 200 && this.status > 400) {
                //TODO: Handle load failure gracefully... or not
                reject(Error('Could not load the requested game: ' + req.statusText));
            }
            else
                resolve(JSON.parse(this.response));
        });
        req.send();
    });
}

function createGameState(data) {
    data.lines.forEach(line => {
        gameState.lines[line.id] = new Line(line);
    });
    data.stations.forEach(station => {
        gameState.stations[station.id] = new Station(station);
    });
    /*data.transfers.forEach(transfer => {
        gameState.transfers[transfer.id] = new Transfer(transfer);
    });*/
}

/*function populateMap() {
    drawStations();
    drawLines();
    drawTransfers();
}

function drawStations() {
    const stations = save.stations;
    const lines = save.lines;
    const stationIds = Object.keys(stations);
    stationIds.forEach(function (stationId) {
        let popupText = '<b>' + stations[stationId].name + ' ' + stations[stationId].id + '</b><br>';
        //TODO: display both local and express route bullets where necessary, like '61 St-Woodside'
        const linesAtStation = new Set();
        stations[stationId].lines.forEach(lineId => {
            linesAtStation.add(lines[lineId].name);
        });
        linesAtStation.forEach(lineName => {
            popupText += lineName + ' ';
        });
        L.marker(stations[stationId].latLng, {icon: stationLocalIcon})
            .addTo(gameMap)
            .bindPopup(popupText);
    });
}

function drawLines() {
    const stations = save.stations;
    const lines = save.lines;
    const lineIds = Object.keys(lines);
    lineIds.forEach(lineId => {
        gameState.lines[lineId] = new Line(lines[lineId]);
        const lineStations = lines[lineId].stations;
        const points = [];
        lineStations.forEach(stationId => {
            points.push(stations[stationId].latLng);
        });
        const linePath = L.polyline(points, {color: lines[lineId].color});
        linePath.addTo(gameMap);
    });
}

function drawTransfers() {

}*/