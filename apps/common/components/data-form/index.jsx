import React        from "react"
import EmailAddress from "common/data/types/email-address"
import Password     from "common/data/types/password"
import cx           from "classnames"
import ReactIntl    from "react-intl";
import co           from "co";

var IntlMixin         = ReactIntl.IntlMixin;
var FormattedMessage  = ReactIntl.FormattedMessage;
var FormattedRelative = ReactIntl.FormattedRelative;

/**
 */

var Field = React.createClass({

  /**
   */

  propTypes: {
    messages: React.PropTypes.object.isRequired
  },
 
  /**
   */

  mixins: [IntlMixin],

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
    }

    this.props.onFieldData(this.props.name, value);
    this.setState({ valid: valid });
  },

  /**
   */

  render: function() {

    var classNames = cx({
      "form-group"   : true,
      "form-inline"  : true,
      "has-error"    : this.state.valid === false,
      "has-success"  : this.state.valid === true,
      "has-feedback" : this.state.valid != void 0
    }); 

    var fieldElement = this._createFromField(this.props.name, this.props.field);

    if (!fieldElement) return <div style={{display:"none"}}></div>;

    return <div className={classNames} onChange={this.onChange}>
      <label><FormattedMessage message={this.getIntlMessage("fieldsLabels." + this.props.name)} /></label>
      <div>
        { fieldElement }
        { this.state.valid != void 0 ? <span className={"ion-" + (this.state.valid ? "checkmark" : "close") + " form-control-feedback"}></span> : void 0 }
      </div>
    </div>;
  },

  /**
   */

  _createFromField: function(name, field) {
    switch(field.type) {
      case EmailAddress : return <input type="text" className="form-control" placeholder={this._getPlaceHolderText(name)}  />;
      case Password     : return <input type="password" className="form-control" placeholder={this._getPlaceHolderText(name)} />;
    }
  },

  /**
   */

  _getPlaceHolderText: function(name) {
    return this.getIntlMessage("fieldPlaceholders." + name);
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
    var data = this.state.data;
    data[name] = value;

    var formClass = this.props.formClass;
    var schema    = formClass.schema;

    data.bus = this.props.app.bus;

    var form;

    try {
      var form = new formClass(data);
    } catch(e) { }

    this.setState({
      form: form,
      data: this.state.data
    });
  },

  /**
   */

  onSubmit: co.wrap(function*(event) {
    event.preventDefault();  
    var result = yield this.state.form.submit();
    console.log(result);
  }),

  /**
   */

  render: function() {

    var formClass = this.props.formClass;
    var schema    = formClass.schema;

    var formFields = [];

    for (var name in schema.fields) {
      var field = schema.fields[name];
      formFields.push(
        <Field key={name} name={name} field={field} onFieldData={this.onFieldData} data={this.state.data} {...this.props} />
      );
    }
    
    return <form onChange={this._onChange} className="m-common-data-form" onSubmit={this.onSubmit}>

      { formFields }

      <div className="form-group form-inline">  
        <input type="submit" className="form-control" value="submit" disabled={!this.state.form} />
      </div>
    </form>
  }
});

export default DataForm;