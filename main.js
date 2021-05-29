import L from  'leaflet'
import { geometry } from '@mapbox/geojson-area'


const mymap = L.map('mapid').setView([49.101563, -125.634364], 8);

// Load baselayer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

L.tileLayer.provider('Esri.WorldTopoMap').addTo(mymap);

// Story scroll control
// Set things up
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("loaded", event)
  createScrollyObservers();
}, false);

console.log("s")
function createScrollyObservers() {
  const sections = [
    {id: 'intro', threshold: 0.4, lat: 54.230769547647085, lng: -124.66206000875113, zoom: 6},
    {id: 'lakes', threshold: 0.4, lat: 49.09286680302231, lng: -125.54025650024414, zoom: 12},
    {id: 'subalpine', threshold: 0.4, lat: 51.01224410954622, lng: -117.56153868406271, zoom: 11},
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
        mymap.flyTo([section.lat, section.lng], section.zoom, {
	        animate: true,
	        duration: 1.5
				});
				document.getElementById('total-og-count').innerHTML = 1000
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
