const defaultLocation = L.latLng(40.7128, -74.0061);
const map = L.map('map').setView(defaultLocation, 13);
const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileLayerOptions = {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: 'build.a.subway.map'
};

L.tileLayer(tileURL, tileLayerOptions).addTo(map);