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
    map.on('click', addStation);
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