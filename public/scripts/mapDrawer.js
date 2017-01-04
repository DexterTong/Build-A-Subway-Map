function drawAll() {
    gameState.lines.forEach(drawLine);
    gameState.stations.forEach(drawStation);
}

function drawLine(line) {
    const pointsToDraw = line.stations.map(stationId => gameState.stations[stationId].latLng);
    L.polyline(pointsToDraw, {color: line.color})
        .addTo(gameMap);
}

function drawStation(station) {
    let popupText = '<b>' + station.name + '</b> <i>' + station.id + '</i><br>';
    //TODO: display both local and express route bullets where necessary, like '61 St-Woodside'
    const linesAtStation = new Set();
    station.lines.forEach(lineId => linesAtStation.add(gameState.lines[lineId].name));
    linesAtStation.forEach(lineName => {popupText += lineName + ' '});
    L.marker(station.latLng, {icon:stationLocalIcon})
        .addTo(gameMap)
        .bindPopup(popupText);
}