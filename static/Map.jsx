var Map = React.createClass({
  componentDidMount: function () {
    var map = L.map('map').setView([47.6231447,-122.3285673], 13);
    L.tileLayer('https://{s}.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                maxZoom: 24,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                             'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'stedy.mck2dne6',
                accessToken: 'pk.eyJ1Ijoic3RlZHkiLCJhIjoiUU9kOC1xcyJ9.xmKXVS0kLIjF5hR6rBzTCw',
                }).addTo(map);


    var geojsonLayer = L.geoJson(geojson, {
        style: function(feature) {
          return {color: feature.properties.visit};
          },
        pointToLayer: function(feature, latlng) {
      var currentZoom = map.getZoom();

    var marker = new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
    marker.on('click', function () {
      if (markerClickHandler !== undefined) {
        markerClickHandler(feature.properties.name);
      }
    });
    return marker;
    },
    onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.name);
    }
    });
    map.addLayer(geojsonLayer);
  },
  render: function () {
    var style = {
      width: "800px",
      height: "900px"
    };
    return (
      <div id="map" class="col-xs-6" style={style}></div>
    );
  }
});

ReactDOM.render(
  <Map />,
  document.getElementById('mapPlaceholder')
);
