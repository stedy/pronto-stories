
window.markerClickHandler = undefined;
var StationForm = window.StationForm;
var Map = window.Map;

var actionUrl = $('#hidden_get_map_link').attr("href");
ReactDOM.render(
  <StationForm action={actionUrl} />,
  document.getElementById('stationPickerPlaceholder')
);

ReactDOM.render(
  <Map />,
  document.getElementById('mapPlaceholder')
);