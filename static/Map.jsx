window.Map = React.createClass({
  componentDidMount: function () {
    var that = this;
    this.map = L.map('map').setView([47.6231447,-122.3285673], 13);
    L.tileLayer('https://{s}.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                maxZoom: 24,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                             'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'stedy.mck2dne6',
                accessToken: 'pk.eyJ1Ijoic3RlZHkiLCJhIjoiUU9kOC1xcyJ9.xmKXVS0kLIjF5hR6rBzTCw',
                }).addTo(that.map);


    var geojsonLayer = L.geoJson(geojson, {
        style: function(feature) {
          return {color: feature.properties.visit};
        },
        pointToLayer: function(feature, latlng) {
          var currentZoom = that.map.getZoom();

          var marker = new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
          marker.on('click', function () {
            if (window.markerClickHandler !== undefined) {
              window.markerClickHandler(feature.properties.name);
            }
          });
          return marker;
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.name);
        }
    });
    that.map.addLayer(geojsonLayer);

    if (this.props.drawRoute === true) {
      this.drawRoute();
    }
  },
  drawRoute: function () {
    var that = this;
    L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlZHkiLCJhIjoiUU9kOC1xcyJ9.xmKXVS0kLIjF5hR6rBzTCw';

    var svg = d3.select(that.map.getPanes().overlayPane).append('svg');
    var g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    d3.json(this.props.routeUrl, function(collection) {

      var featuresdata = collection.features.filter(function(d) {
        return d.properties.id == that.props.route;
      });

      var transform = d3.geo.transform({
          point: projectPoint
      });

      var d3path = d3.geo.path().projection(transform);

      var toLine = d3.svg.line()
          .interpolate('linear')
          .x(function(d) {
              return applyLatLngToLayer(d).x
          })
          .y(function(d) {
              return applyLatLngToLayer(d).y
          });

      var ptFeatures = g.selectAll('circle')
          .data(featuresdata)
          .enter()
          .append('circle')
          .attr('class', 'waypoints');

      var linePath = g.selectAll('.lineConnect')
          .data([featuresdata])
          .enter()
          .append('path')
          .attr('class', 'lineConnect');

      var marker = g.append('circle')
          .attr('id', 'marker')
          .attr('class', 'travelMarker');

      var originANDdestination = [featuresdata[0], featuresdata[featuresdata.length - 1]]

      var begend = g.selectAll('.drinks')
          .data(originANDdestination)
          .enter()
          .append('circle', '.drinks')
          .style('opacity', '1');

      that.map.on('viewreset', reset);

      reset();
      transition();

      function reset() {
          var bounds = d3path.bounds(collection),
              topLeft = bounds[0],
              bottomRight = bounds[1];

          begend.attr('transform',
              function(d) {
                  return 'translate(' +
                      applyLatLngToLayer(d).x + ',' +
                      applyLatLngToLayer(d).y + ')';
              });

          ptFeatures.attr('transform',
              function(d) {
                  return 'translate(' +
                      applyLatLngToLayer(d).x + ',' +
                      applyLatLngToLayer(d).y + ')';
              });

          marker.attr('transform',
              function() {
                  var y = featuresdata[0].geometry.coordinates[0]
                  var x = featuresdata[0].geometry.coordinates[1]
                  return 'translate(' +
                      that.map.latLngToLayerPoint(new L.LatLng(y, x)).x + ',' +
                      that.map.latLngToLayerPoint(new L.LatLng(y, x)).y + ')';
              });


          svg.attr('width', bottomRight[0] - topLeft[0] + 120)
              .attr('height', bottomRight[1] - topLeft[1] + 120)
              .style('left', topLeft[0] - 50 + 'px')
              .style('top', topLeft[1] - 50 + 'px');

          linePath.attr('d', toLine)
          g.attr('transform', 'translate(' + (-topLeft[0] + 50) + ',' + (-topLeft[1] + 50) + ')');

      } // end reset

      function transition() {
          linePath.transition()
              .duration(7500)
              .attrTween('stroke-dasharray', tweenDash)
      }

      function tweenDash() {
          return function(t) {
              //total length of path (single value)
              var l = linePath.node().getTotalLength();
              var interpolate = d3.interpolateString('0,' + l, l + ',' + l);
              var marker = d3.select('#marker');
              var p = linePath.node().getPointAtLength(t * l);

              //Move the marker to that point
              marker.attr('transform', 'translate(' + p.x + ',' + p.y + ')'); //move marker
              console.log(interpolate(t))
              return interpolate(t);
          }
      }

      function projectPoint(x, y) {
          var point = that.map.latLngToLayerPoint(new L.LatLng(x,y));
          this.stream.point(point.x, point.y);
      } //end projectPoint
    });

    function applyLatLngToLayer(d) {
        var y = d.geometry.coordinates[0]
        var x = d.geometry.coordinates[1]
        return that.map.latLngToLayerPoint(new L.LatLng(y, x))


    }
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
