// Creating map object
// var myMap = L.map("map", {
//   center: [35, -110],
//   zoom: 5
// });

// Adding tile layer


//Get the data set
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//  GET color radius call to the query URL
var circles=d3.json(queryUrl, function(data) {
	// console.log(data);
  function mapstyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  

// set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // set radiuss from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 0;
    }

    return magnitude * 4;
    }
    // GeoJSON layer
    L.geoJson(data, {
      // Maken cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // cirecle style
      style: mapstyle,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  

// an object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [ 1, 2, 3, 4, 5];
      var labels= ['<strong>Magnitudes</strong>'];
  
      // Looping through
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
                labels.push(
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                (grades[i] ? grades[i] : '+'));
        }

        div.innerHTML = labels.join('<br>');
    return div;
};
  
    // adding legend to the map.
    legend.addTo(myMap);
  });


// ### Level 2: More Data (Optional)
// * Plot a second data set on our map.
var tectonicUrl='static/data/tectonic.json'
var lines=d3.json(tectonicUrl, function(response) {
	L.geoJson(response).addTo(myMap)
	});



// Create base layers

// Streetmap Layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});


var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});


// Create two separate layer groups: one for cities and one for states
var earthquakes = L.layerGroup(circles);
var plates = L.layerGroup(lines);

// Create a baseMaps object
var baseMaps = {
  "Light view": lightmap,
  "outdoors view": outdoors,
  "Satellite View" :satellite
};

// Create an overlay object
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Plates": plates
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 2,
  layers: [lightmap, satellite,outdoors,earthquakes,plates]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
