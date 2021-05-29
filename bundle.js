
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (L) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var L__default = /*#__PURE__*/_interopDefaultLegacy(L);

    var wgs84$1 = {};

    wgs84$1.RADIUS = 6378137;
    wgs84$1.FLATTENING = 1/298.257223563;
    wgs84$1.POLAR_RADIUS = 6356752.3142;

    var wgs84 = wgs84$1;

    var geometry_1 = geometry;

    function geometry(_) {
        var area = 0, i;
        switch (_.type) {
            case 'Polygon':
                return polygonArea(_.coordinates);
            case 'MultiPolygon':
                for (i = 0; i < _.coordinates.length; i++) {
                    area += polygonArea(_.coordinates[i]);
                }
                return area;
            case 'Point':
            case 'MultiPoint':
            case 'LineString':
            case 'MultiLineString':
                return 0;
            case 'GeometryCollection':
                for (i = 0; i < _.geometries.length; i++) {
                    area += geometry(_.geometries[i]);
                }
                return area;
        }
    }

    function polygonArea(coords) {
        var area = 0;
        if (coords && coords.length > 0) {
            area += Math.abs(ringArea(coords[0]));
            for (var i = 1; i < coords.length; i++) {
                area -= Math.abs(ringArea(coords[i]));
            }
        }
        return area;
    }

    /**
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.  Note that this area will be positive if ring is oriented
     *     clockwise, otherwise it will be negative.
     *
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate signed geodesic area of the polygon in square
     *     meters.
     */

    function ringArea(coords) {
        var p1, p2, p3, lowerIndex, middleIndex, upperIndex, i,
        area = 0,
        coordsLength = coords.length;

        if (coordsLength > 2) {
            for (i = 0; i < coordsLength; i++) {
                if (i === coordsLength - 2) {// i = N-2
                    lowerIndex = coordsLength - 2;
                    middleIndex = coordsLength -1;
                    upperIndex = 0;
                } else if (i === coordsLength - 1) {// i = N-1
                    lowerIndex = coordsLength - 1;
                    middleIndex = 0;
                    upperIndex = 1;
                } else { // i = 0 to N-3
                    lowerIndex = i;
                    middleIndex = i+1;
                    upperIndex = i+2;
                }
                p1 = coords[lowerIndex];
                p2 = coords[middleIndex];
                p3 = coords[upperIndex];
                area += ( rad(p3[0]) - rad(p1[0]) ) * Math.sin( rad(p2[1]));
            }

            area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
        }

        return area;
    }

    function rad(_) {
        return _ * Math.PI / 180;
    }

    const mymap = L__default['default'].map('mapid').setView([49.101563, -125.634364], 8);

    // Load baselayer
    L__default['default'].tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    	maxZoom: 16
    });

    L__default['default'].tileLayer.provider('Esri.WorldTopoMap').addTo(mymap);

    // Story scroll control
    // Set things up
    window.addEventListener("DOMContentLoaded", (event) => {
      console.log("loaded", event);
      createScrollyObservers();
    	const onFirstScroll = (event) => {
    		document.getElementById('scroll-down-msg').style.opacity = 0;
    		document.removeEventListener('scroll', onFirstScroll, false);
    	};
    	document.addEventListener('scroll', onFirstScroll);
    }, false);

    console.log("s");
    function createScrollyObservers() {
      const sections = [
        {id: 'intro', threshold: 0.4, lat: 54.230769547647085, lng: -124.66206000875113, zoom: 6},
        {id: 'lakes', threshold: 0.4, lat: 49.09286680302231, lng: -125.54025650024414, zoom: 12},
        {id: 'subalpine', threshold: 0.4, lat: 51.01224410954622, lng: -117.56153868406271, zoom: 11},
        {id: 'parks', threshold: 0.4, lat: 49.378367907281685, lng: -125.92300834404244, zoom: 10},
        {id: 'second-growth', threshold: 0.4, lat: 51.01224410954622, lng: -117.56153868406271, zoom: 11},
        {id: 'value-og', threshold: 0.4,  lat: 49.250885049725404, lng: -125.18843503480318, zoom: 11}
      ];

      for (let section of sections) {
        console.log(section);
        const el = document.querySelector(`#${section.id}`);
        let options = {
          threshold: [section.threshold]
        };
        let observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting == true) {
            mymap.flyTo([section.lat, section.lng], section.zoom, {
    	        animate: true,
    	        duration: 1.5
    				});
    				document.getElementById('total-og-count').innerHTML = 1000;
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
      let features = data.features;
      return features.filter(feature => feature.properties.BC_REGULATION_NUMBER
       == "228/2020")

     })
    .then(data => {
      let total_area_hect = 0;
      for(let feature of data) {
        let area = geometry_1(feature.geometry); // m2
        let area_hect = area*0.0001;
        console.log(area_hect);
        total_area_hect += area_hect;
      }
      console.log("Total no hectares " + total_area_hect);
      return data
    })
    .then(data => L__default['default'].geoJSON(data).addTo(mymap));


    // For debugging view
    mymap.on('moveend', function(ev) {
      console.log(ev.target.getZoom());
      console.log(ev.target.getCenter());
    });

}(L));
