
window.Elevations = React.createClass({
  componentDidMount: function () {
    var placeholder = document.getElementById('elevationsPlaceholder');
    var svg = d3.select(placeholder).append('svg')
      .attr("width", 300)
      .attr("height", 500);

    var data = this.props.elevations;
    data = data.slice(1, data.length - 1);
    data = data.split(",");
    var elevations = data.reverse();

    var lineData = [];
    for (var i = 0; i < elevations.length; ++i) {
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
  },
  render: function() {
    return (
      <div>elevation profile:</div>
    );
  }
});
