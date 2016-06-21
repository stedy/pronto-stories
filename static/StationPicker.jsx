
var StationPicker = React.createClass({
  render: function () {
    return (
      <div id={this.props.id}>
        <input className="typeahead" type="text" placeholder={this.props.placeholder} name={this.props.name}></input>
      </div>
    );
  }
});

var StationForm = React.createClass({
  componentDidMount: function () {
    registerTypeaheads();
  },
  render: function() {
    return (
      <form action="{{ url_for('get_map') }}" method="post">
        <p>Select a start and stop station from the dropdown menu to view trip statistics for that route.</p>
        <StationPicker id="start-stations" placeholder="Starting Station" name="start"></StationPicker>
        <StationPicker id="end-stations" placeholder="Ending Station" name="end"></StationPicker>
        <input className="btn btn-default" type="submit" value="Map it!"></input>
      </form>
    );
  }
});

ReactDOM.render(
  <StationForm />,
  document.getElementById('stationPickerPlaceholder')
);
