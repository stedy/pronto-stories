var currentPicker;

var StationPicker = React.createClass({
  getInitialState: function () {
    return {
      value: "",
      isSelecting: false
    }
  },
  select: function (value) {
    this.setState({
      value: value,
      isSelecting: false
    });
  },
  onClick: function () {
    if (this.state.isSelecting) {
      this.setState({ isSelecting: false });
      currentPicker = undefined;
    } else {
      this.setState({ isSelecting: true });
      currentPicker = this;
    }
  },
  render: function () {
    var rowStyle = {
      display: "flex"
    };

    var buttonValue;
    var buttonStyle = {
      marginRight: "10px"
    };
    if (this.state.isSelecting) {
      buttonValue = "Cancel";
      buttonStyle.background = "red";
    } else {
      buttonValue = "Select";
      buttonStyle.background = "lightblue";
    }

    var selectingIndicator;
    if (this.state.isSelecting) {
      selectingIndicator = <div>selecting...</div>;
    }

    return (
      <div style={rowStyle} id={this.props.id}>
        <input className="typeahead" type="text" placeholder={this.props.placeholder} name={this.props.name} value={this.state.value}></input>
        <input style={buttonStyle} type="button" type="button" onClick={this.onClick} value={buttonValue} />
        {selectingIndicator}
      </div>
    );
  }
});

window.StationForm = React.createClass({
  componentDidMount: function () {
    registerTypeaheads();
    window.markerClickHandler = function (name) {
      if (currentPicker !== undefined) {
        currentPicker.select(name);
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

