
window.Elevations = React.createClass({
  componentDidMount: function () {
    var placeholder = document.getElementById('elevationsPlaceholder');
    var svg = d3.select(placeholder).append('svg')
      .attr("width", 300)
      .attr("height", 500);

    d3.json('elevationsBT-01_CBD-07.geojson', function (elevations) {
      var lineData = [];
      // var scaleMax = 500;
      // var scaleMin = 0;
      // var actualMax = Number.MIN_VALUE;
      // var actualMin = Number.MAX_VALUE;
      // for (var i = 0; i < elevations.length; ++i) {
      //   var elevation = elevations[i];
      //   if (elevation < actualMin) {
      //     actualMin = elevation;
      //   }
      //   if (elevation > actualMax) {
      //     actualMax = elevation;
      //   }
      // }

      // var delta = actualMax - actualMin;
      // var scaleFactor = (scaleMax - scaleMin) / delta;

      // var yMin = Number.MAX_VALUE;
      // var yMax = Number.MIN_VALUE;
      for (var i = 0; i < elevations.length; ++i) {
        //var y = ((elevations[i] - actualMin) * scaleFactor);
        lineData.push({ x: i*3, y: elevations[i] });
      }

      var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

      var lineGraph = svg.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      //alert("actualMin: " + actualMin + ", actualMax: " + actualMax + ", scaleFactor: " + scaleFactor + ", yMin: " + yMin + ", yMax: " + yMax);

      // plotElevation(elevations);

      // // Takes an array of ElevationResult objects, draws the path on the map
      // // and plots the elevation profile on a Visualization API ColumnChart.
      // function plotElevation(elevations) {
      //   var chartDiv = document.getElementById('otherPlaceholder');

      //   // Create a new chart in the elevation_chart DIV.
      //   var chart = new google.visualization.ColumnChart(chartDiv);

      //   // Extract the data from which to populate the chart.
      //   // Because the samples are equidistant, the 'Sample'
      //   // column here does double duty as distance along the
      //   // X axis.
      //   var data = new google.visualization.DataTable();
      //   data.addColumn('string', 'Sample');
      //   data.addColumn('number', 'Elevation');
      //   for (var i = 0; i < elevations.length; i++) {
      //     data.addRow(['', elevations[i]]);

      //   }

      //   // Draw the chart using the data within its DIV.
      //   chart.draw(data, {
      //     height: 150,
      //     width: 400,
      //     legend: 'none',
      //     titleY: 'Elevation (m)'
      //   });
      // }

    });
  },
  render: function() {
    return (
      <div>elevation profile:</div>
    );
  }
});

