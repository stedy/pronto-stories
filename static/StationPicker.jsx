var currentPicker;

var StationPicker = React.createClass({
  getInitialState: function () {
    return {
      value: ""
    }
  },
  onClick: function () {
    currentPicker = this;
  },
  render: function () {
    return (
      <div id={this.props.id}>
        <input className="typeahead" type="text" placeholder={this.props.placeholder} name={this.props.name} value={this.state.value}></input>
        <input type="button" onClick={this.onClick.bind(this)} value="Select"></input>
      </div>
    );
  }
});

var StationForm = React.createClass({
  componentDidMount: function () {
    registerTypeaheads();
    markerClickHandler = function (name) {
      if (currentPicker !== undefined) {
        currentPicker.setState({ value: name });
      }
    }
  },
  render: function() {
    return (
      <form action={this.props.action} method="post">
        <p>Select a start and stop station from the dropdown menu to view trip statistics for that route.</p>
        <StationPicker id="start-stations" placeholder="Starting Station" name="start"></StationPicker>
        <StationPicker id="end-stations" placeholder="Ending Station" name="end"></StationPicker>
        <input className="btn btn-default" type="submit" value="Map it!"></input>
      </form>
    );
  }
});

var actionUrl = $('#hidden_get_map_link').attr("href");
ReactDOM.render(
  <StationForm action={actionUrl} />,
  document.getElementById('stationPickerPlaceholder')
);
