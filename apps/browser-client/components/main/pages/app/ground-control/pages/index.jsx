var React = require("react");
var sift = require("sift");

var ops = [
  {
    name: "help",
    label: "Help",
    componentClass: require("./help")
  },
  {
    name: "payment",
    label: "Payment",
    componentClass: require("./payment")
  },
  {
    name: "playback-settings",
    label: "Playback Settings",
    componentClass: require("./playback-settings")
  },
  {
    name: "report-bug",
    label: "Report Bug",
    componentClass: require("./report-bug")
  },
  {
    name: "shortcuts",
    label: "Shortcuts",
    componentClass: require("./shortcuts")
  },
  {
    name: "logout",
    label: "logout",
    click: function(props) {
      props.app.router.redirect("logout");
    }
  },
  {
    name: "support",
    label: "Support",
    componentClass: require("./support")
  },
  {
    name: "team-members",
    label: "Team Members",
    componentClass: require("./team-members")
  },
  {
    name: "tools",
    label: "Tools",
    componentClass: require("./tools")
  }
];

var Cell = React.createClass({
  redirect: function() {
    if (this.props.cell.click) return this.props.cell.click(this.props);
    this.props.app.router.setQuery({
      showControls: this.props.cell.name
    });
  },
  render: function() {
    return <div className="cell" onClick={this.redirect}>
      <span>{this.props.cell.label}</span>
    </div>;
  }
});

var Options = React.createClass({
  render: function() {
    var elements = [];

    for (var op of ops) {
      elements.push(<Cell cell={op} {...this.props} />);
    }

    var selected = sift({ name: this.props.location.query.showControls }, ops).shift();

    return <div className="pages">
      { selected ? React.createElement(selected.componentClass, Object.assign({}, this.props)) : elements }
    </div>;
  }
});

export default Options;
