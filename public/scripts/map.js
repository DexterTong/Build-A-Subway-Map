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
let currentStation;
let currentLine;

initMap();
loadGame('nyc2016')
    .then(createGameState)
    .then(createSidebarMenu)
    .then(drawAll)
    .then(setDefaults);

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
    const fileName = name + '.json';
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

function createSidebarMenu() {
    const lineMenu = document.getElementById('lines-list');
    const lineGroupsObject = gameState.lines.reduce((groups, line) => {
        if (groups[line.color])
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
        if (res !== 0)
            return res;
        if (B.express)
            return -1;
        return 1;
    }));
    lineGroups.sort((A, B) => {
        return A[0].name.localeCompare(B[0].name)
    });
    lineGroups.forEach(lineGroup => {
        lineMenu.appendChild(createLineGroupDiv(lineGroup))
    });
}

function createLineGroupDiv(lineGroup) {
    const lineGroupDiv = document.createElement('div');
    lineGroupDiv.id = lineGroup[0].color;
    lineGroupDiv.classList.add('line-group');
    lineGroup.forEach(line => {
        lineGroupDiv.appendChild(createLineDiv(line))
    });
    return lineGroupDiv;
}

function createLineDiv(line) {
    const lineDiv = document.createElement('div');
    lineDiv.id = line.id;
    lineDiv.title = line.fullName;
    lineDiv.classList.add('line', line.express ? 'express' : 'local');
    lineDiv.appendChild(document.createTextNode(line.name));
    lineDiv.style.backgroundColor = line.color;
    lineDiv.onclick = event => updateLineInfo(event);
    return lineDiv;
}

function updateLineInfo(event) {
    const lineId = event.srcElement.id;
    const lineDiv = document.getElementById(lineId);
    const line = gameState.lines[lineId];
    currentLine = line;
    const lineIconContainer = document.getElementById('line-icon-container');
    if (lineIconContainer.firstChild !== null)
        lineIconContainer.removeChild(lineIconContainer.firstChild);
    const clonedLineDiv = lineDiv.cloneNode(true);
    clonedLineDiv.removeAttribute('id');
    lineIconContainer.appendChild(clonedLineDiv);
    const term1 = document.getElementById('terminus-1');
    if (term1.firstChild !== null)
        term1.removeChild(term1.firstChild);
    if (line.stations.length > 0)
        term1.appendChild(document.createTextNode(gameState.stations[line.stations[0]].name));
    const term2 = document.getElementById('terminus-2');
    if (term2.firstChild !== null)
        term2.removeChild(term2.firstChild);
    if (line.stations.length > 0)
        term2.appendChild(document.createTextNode(gameState.stations[line.stations[line.stations.length - 1]].name));
    const numStations = document.getElementById('number-stations');
    if (numStations.firstChild !== null)
        numStations.removeChild(numStations.firstChild);
    numStations.appendChild(document.createTextNode('' + line.stations.length));
    const stationList = document.getElementById('line-station-list');
    while (stationList.firstChild !== null) {
        stationList.removeChild(stationList.firstChild);
    }
    populateDOMList(stationList, createStationList(line));
}

function updateStationInfo(stationId) {
    const station = currentStation = gameState.stations[stationId];
    replaceChildren(document.getElementById('station-name'), document.createTextNode(station.name));
    replaceChildren(document.getElementById('station-lines'), makeLineSpanArray(station.lines));
}

function replaceChildren(node, newChildren) {
    while (node.firstChild !== null)
        node.removeChild(node.firstChild);
    if (Array.isArray(newChildren))
        while (newChildren.length > 0)
            node.appendChild(newChildren.shift());
    else
        node.appendChild(newChildren);
}

function makeLineSpanArray(lineIds) {
    const lineSpans = [];
    lineIds.forEach(lineId => {
        const line = gameState.lines[lineId];
        const lineSpan = document.createElement('span');
        lineSpan.appendChild(document.createTextNode(line.name));
        lineSpan.classList.add('line');
        line.express ? lineSpan.classList.add('express') : lineSpan.classList.add('local');
        lineSpan.style.backgroundColor = line.color;
        lineSpans.push(lineSpan);
    });
    return lineSpans;
}

//replace all spaces in str for html-compliant id's
function idify(str) {
    return str.trim().replace(/ /g, '-');
}

function createStationList(line) {
    const stationList = [];
    if (line === undefined) {
        const sortedStations = gameState.stations.sort((A, B) => A.name.localeCompare(B.name));
        sortedStations.forEach(station => {
            const stationElement = document.createElement('li');
            stationElement.appendChild(document.createTextNode(station.name));
            stationList.push(stationElement);
        });
    }
    else {
        line.stations.forEach(stationId => {
            const stationElement = document.createElement('li');
            const station = gameState.stations[stationId];
            stationElement.appendChild(document.createTextNode(station.name));
            stationList.push(stationElement);
        });
    }
    return stationList;
}

function populateDOMList(listNode, arr) {
    arr.forEach(element => listNode.appendChild(element));
}