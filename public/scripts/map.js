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

initMap();
loadGame('nyc2016')
    .then(createGameState)
    .then(loadSidebarMenu)
    .then(drawAll);

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

function loadSidebarMenu() {
    const lineMenu = document.getElementById('sidebar-line-menu');
    const lineGroupsObject = gameState.lines.reduce((groups, line) => {
        if(groups[line.color])
            groups[line.color].push(line);
        else
            groups[line.color] = [line];
        return groups;
    }, {});
    const lineGroupsKeys = Object.keys(lineGroupsObject);
    const lineGroups = [];
    lineGroupsKeys.forEach(key => lineGroups.push(lineGroupsObject[key]));
    lineGroups.forEach(lineGroup => lineGroup.sort((A, B) => {
        const res = A.name.localeCompare(B.name);
        if(res !== 0)
            return res;
        if(B.express)
            return -1;
        return 1;
    }));
    lineGroups.sort((A, B) => {return A[0].name.localeCompare(B[0].name)});
    lineGroups.forEach(lineGroup => {lineMenu.appendChild(createLineGroupDiv(lineGroup))});
}

function createLineGroupDiv(lineGroup) {
    const lineGroupDiv = document.createElement('div');
    lineGroupDiv.id = lineGroup[0].color;
    lineGroupDiv.classList.add('line-group');
    lineGroup.forEach(line => {lineGroupDiv.appendChild(createLineDiv(line))});
    return lineGroupDiv;
}

function createLineDiv(line) {
    const lineDiv = document.createElement('div');
    lineDiv.id = idify(line.fullName);
    lineDiv.title = line.fullName;
    lineDiv.classList.add('line', line.express ? 'express' : 'local');
    lineDiv.appendChild(document.createTextNode(line.name));
    lineDiv.style.backgroundColor = line.color;
    lineDiv.onclick = event => {

    };
    return lineDiv;
}

//replace all spaces in str for html-compliant id's
function idify(str) {
    return str.trim().replace(/ /g, '-');
}