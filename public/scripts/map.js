const map = L.map('map');

const stationLocalIcon = L.divIcon({
    className: 'station local',
    bgPos: [0, 0],
    iconSize: [8, 8]
});

const stationExpressIcon = L.divIcon({
    className: 'station express',
    bgPos: [0, 0],
    iconSize: [8, 8]
});

initMap();

function initMap() {
    const defaultLocation = L.latLng(40.7128, -74.0061);
    map.setView(defaultLocation, 13);
    //TODO: Move off of OSM server, possibly to local storage?
    const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayerOptions = {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'build.a.subway.map'
    };
    L.tileLayer(tileURL, tileLayerOptions).addTo(map);
    //map.on('click', addStation);
    map.on('click', function(event){
        L.popup()
            .setLatLng(event.latlng)
            .setContent(event.latlng.toString())
            .openOn(map);
    });
    loadStations();
}

function addStation(event) {
    /*L.popup()
     .setLatLng(event.latlng)
     .setContent(event.latlng.toString())
     .openOn(map);*/
    L.marker(event.latlng, {icon: stationLocalIcon})
        .addTo(map)
        .on('click', stationOnClick)
}

function stationOnClick(event) {
    this.remove();
}

function loadStations() {
    const req = new XMLHttpRequest();
    req.open('GET', '/data/stations.json', true);
    req.addEventListener('load', function() {
        if(this.status < 200 && this.status > 400){
            console.log('Could not retrieve data');
            return;
        }
        const data = JSON.parse(this.response);
        const stations = data.stations;
        const lines = data.lines;
        const stationIds = Object.getOwnPropertyNames(stations);
        stationIds.forEach(function(id) {
            let popupText = '<b>' + stations[id].name + ' ' + stations[id].id + '</b><br>';
            for(let i = 0; i < stations[id].lines.length; i++){
                popupText = popupText + stations[id].lines[i] + ' ';
            }
            L.marker(stations[id].latLng, {icon: stationLocalIcon})
                .addTo(map)
                .bindPopup(popupText);
        });
    });
    req.send();
}