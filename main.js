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

// Story scroll control
// Set things up
console.log(window)
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("loaded", event)
  createScrollyObservers();
}, false);


function createScrollyObservers() {
  const sections = [
    {id: 'intro', threshold: 0.4, lat: 54.230769547647085, lng: -124.66206000875113, zoom: 6},
    {id: 'lakes', threshold: 0.4, lat: 49.09286680302231, lng: -125.54025650024414, zoom: 12},
    {id: 'parks', threshold: 0.4, lat: 49.378367907281685, lng: -125.92300834404244, zoom: 10},
    {id: 'second-growth', threshold: 0.4, lat: 51.01224410954622, lng: -117.56153868406271, zoom: 11},
    {id: 'value-og', threshold: 0.4,  lat: 49.250885049725404, lng: -125.18843503480318, zoom: 11}
  ]

  for (let section of sections) {
    console.log(section)
    const el = document.querySelector(`#${section.id}`)
    let options = {
      threshold: [section.threshold]
    }
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting == true) {
        mymap.setView([section.lat, section.lng], section.zoom);
      }

    }, options);
    observer.observe(el);
  }

}

// Fetch deferral layer
fetch('data/FADM_DESIGNATED_AREAS.geojson')
.then(response => response.json())
.then(data => {
  console.log(data.features);
  let features = data.features
  return features.filter(feature => feature.properties.BC_REGULATION_NUMBER
   == "228/2020")

 })
.then(data => {
  let total_area_hect = 0
  for(let feature of data) {
    let area = geometry(feature.geometry) // m2
    let area_hect = area*0.0001
    console.log(area_hect)
    total_area_hect += area_hect
  }
  console.log("Total no hectares " + total_area_hect)
  return data
})
.then(data => L.geoJSON(data).addTo(mymap))


// For debugging view
mymap.on('moveend', function(ev) {
  console.log(ev.target.getZoom())
  console.log(ev.target.getCenter())
});
