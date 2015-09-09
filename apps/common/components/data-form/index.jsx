import React        from "react"
import EmailAddress from "common/data/types/email-address"
import Password     from "common/data/types/password"
import cx           from "classnames"

/**
 */

var Field = React.createClass({

  /**
   */

  getInitialState: function() {
    return {}
  },

  /**
   */

  onChange: function(event) {
    var value = event.target.value;

    var valid;

    try {
      this.props.field.coerce(value, this.props.data);
      valid = true;
    } catch(e) {
      valid = false;
      console.log(e);
      this.props.onFieldData(this.props.name, value);
    }

    console.log(valid);

    this.setState({ valid: valid });
  },

  /**
   */

  render: function() {

    var classNames = cx({
      "form-group"  : true,
      "has-error"    : this.state.valid === false,
      "has-success"  : this.state.valid === true,
      "has-feedback" : this.state.valid != void 0
    });

    var fieldElement = this._createFromField(this.props.name, this.props.field);

    if (!fieldElement) return <div style={{display:"none"}}></div>;

    return <div className={classNames} onChange={this.onChange}>
      <label>{this.props.name}</label>
      <div className="input-group">
        { fieldElement }
      </div>
      { this.state.valid === false ? <span className="ion-close form-control-feedback"></span> : void 0 }
    </div>;
  },

  /**
   */

  _createFromField: function(name, field) {
    switch(field.type) {
      case EmailAddress : return <input type="text" className="form-control" placeholder="email address"  />;
      case Password     : return <input type="password" className="form-control" placeholder="password" />;
    }
  }
});

/**
 */

var DataForm = React.createClass({

  /**
   */

  propTypes: {
    formClass: React.PropTypes.func.isRequired
  },

  /**
   */

  getInitialState: function() {
    return {
      data: {}
    }
  },

  /**
   */

  onFieldData: function(name, value) {
    this.state.data[name] = value;
    this.setState({
      data: this.state.data
    });
  },

  /**
   */

  _onChange: function(event) {

    var formClass = this.props.formClass;
    var schema    = formClass.schema;

    var formData = {};

    for (var fieldName in this.refs) {
      formData[fieldName] = React.findDOMNode(this.refs[fieldName]).value;
    }

    formData.bus = this.props.app.bus;

    try {
      var form = new formClass(formData);
    } catch(e) {
      this.setState({
        error: e
      });
    }
  },

  /**
   */

  render: function() {

    var formClass = this.props.formClass;
    var schema    = formClass.schema;

    var formFields = [];

    for (var name in schema.fields) {
      var field = schema.fields[name];
      formFields.push(
        <Field key={name} name={name} field={field} onFieldData={this.onFieldData} data={this.state.data} />
      );
    }
    
    return <form onChange={this._onChange}>
      { formFields }
    </form>
  }
});

export default DataForm;