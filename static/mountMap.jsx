
window.markerClickHandler = undefined;
var StationForm = window.StationForm;
var Elevations = window.Elevations;
var Map = window.Map;

var actionUrl = $('#hidden_get_map_link').attr("href");
ReactDOM.render(
  <StationForm action={actionUrl} />,
  document.getElementById('stationPickerPlaceholder')
);

ReactDOM.render(
  <Elevations />,
  document.getElementById('elevationsPlaceholder')
);

var route = $('#hidden_route').attr("href");
var routeUrl = $('#hidden_route_url').attr("href");
ReactDOM.render(
  <Map drawRoute={true} route={route} routeUrl={routeUrl} />,
  document.getElementById('mapPlaceholder')
);