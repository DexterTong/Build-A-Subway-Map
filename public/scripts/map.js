const stationLocalIcon = L.divIcon({
    className: 'station local',
    iconSize: [8, 8]
});

const stationExpressIcon = L.divIcon({
    className: 'station express',
    iconSize: [8, 8]
});

let map;
let save;
moveHeaderToPane();
initMap();
loadGame('nyc2016')
    .then(populateMap);

function moveHeaderToPane() {
    const common = document.getElementById('common');
    const pane = document.getElementById('pane');
    common.parentNode.removeChild(common);
    pane.appendChild(common);
}

function initMap() {
    map = L.map('map', {
        zoomControl: false
    });
    const defaultLocation = L.latLng(40.7128, -74.0061); //City Hall, NYC
    map.setView(defaultLocation, 13);
    //TODO: Move off of OSM server, possibly to local storage?
    const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayerOptions = {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'build.a.subway.map'
    };
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    L.tileLayer(tileURL, tileLayerOptions).addTo(map);
    //map.on('click', addStation);
    map.on('click', function(event){
        L.popup()
            .setLatLng(event.latlng)
            .setContent(event.latlng.toString())
            .openOn(map);
    });
}

function addStation(event) {
    /*L.popup()
     .setLatLng(event.latlng)
     .setContent(event.latlng.toString())
     .openOn(map);*/
    L.marker(event.latlng, {icon: stationLocalIcon})
        .addTo(map)
        .on('click', stationOnClick);
}

function stationOnClick(event) {
    this.remove();
}

function loadGame(name) {
    let fileName = name + '.json';
    return new Promise(function(resolve, reject) {
        const req = new XMLHttpRequest();
        req.open('GET', '/data/' + fileName, true);
        req.addEventListener('load', function() {
            if(this.status < 200 && this.status > 400){
                //TODO: Handle load failure gracefully... or not
                reject(Error('Could not load the requested game: ' + req.statusText));
            }
            else
                save = JSON.parse(this.response);
                resolve();
        });
    req.send();
    });
}

function populateMap() {
    drawStations();
    drawLines();
    drawTransfers();
}

function drawStations() {
    const stations = save.stations;
    const lines = save.lines;
    const stationIds = Object.getOwnPropertyNames(stations);
    stationIds.forEach(function(stationId) {
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
            .addTo(map)
            .bindPopup(popupText);
    });
}

//TODO: re-order station listing in lines
function drawLines() {
    const stations = save.stations;
    const lines = save.lines;
    const lineIds = Object.getOwnPropertyNames(lines);
    lineIds.forEach(lineId => {
       const lineStations = lines[lineId].stations;
       const points = [];
       lineStations.forEach(stationId => {
           points.push(stations[stationId].latLng);
       });
       const linePath = L.polyline(points, {color: lines[lineId].color});
       console.log('drawing', lines[lineId].name, 'in', lines[lineId].color);
       linePath.addTo(map);
    });
}

function drawTransfers() {

}
