import L from  'leaflet'
import { geometry } from '@mapbox/geojson-area'


var mymap = L.map('mapid').setView([49.101563, -125.634364], 8);

// Load baselayer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnlkZXIxMjMiLCJhIjoiY2tveW4ydHFhMGl0dzJwcjk1MTJjeWlheSJ9.cYDVMjBJhW_T3IvgC1gPzw', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

// Fetch deferral layer
fetch('data/FADM_DESIGNATED_AREAS.geojson')
.then(response => response.json())
.then(data => L.geoJSON(data).addTo(mymap))
.then(data => {
  var area = geometry(data);
  console.log(area)
})
