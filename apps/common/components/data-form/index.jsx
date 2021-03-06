import React        from 'react'
import EmailAddress from 'common/data/types/email-address'
import Password     from 'common/data/types/password'
import CreditCardNumber from 'common/data/types/credit-card-number'
import CVC          from 'common/data/types/credit-card-number'
import cx           from 'classnames'
import ReactIntl    from 'react-intl';
import diff         from 'object-diff';

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
    this._validate(event.target.value);
  },

  /**
   */

  _validate: function(value) {

    var valid = false;
    try {
      this.props.field.coerce(value, this.props.data);
      valid = true;
    } catch(e) { }

    var newState = { valid: valid, value: value };

    if (!Object.keys(diff(this.state, newState)).length) return;

    this.setState(newState);
    this.props.onFieldData(this.props.name, value);
  },

  /**
   */

  componentWillReceiveProps: function(props) {
    if (this.state.value != void 0) this._validate(this.state.value);
  },

  /**
   */

  render: function() {

    var classNames = cx({
      'field'        : true,
      // 'form-group'   : true,
      'form-inline'  : true,
      'has-error'    : this.state.valid === false,
      'has-success'  : this.state.valid === true,
      'has-feedback' : this.state.valid != void 0
    });

    var fieldElement = this._createFromField(this.props.name, this.props.field);

    if (fieldElement.props.type === 'hidden') {
      return null;
    }

    return <div className={classNames} onChange={this.onChange}>
      <label className='control-label'><FormattedMessage message={this.getIntlMessage('fieldsLabels.' + this.props.name)} /></label>
      <div className='input'>
        { fieldElement }
      </div>
        { this.state.valid != void 0  ? <span className={'ion-' + (this.state.valid ? 'checkmark' : 'close') + ' form-control-feedback'}></span> : void 0 }
    </div>;
  },

  /**
   */

  _createFromField: function(name, field) {

    if(field.type === EmailAddress || field.type === String || field.type === CVC || field.type === CreditCardNumber) {
      return <input name={name} type='text' className='form-control' />;
    } else if (field.type === Password) {
      return <input name={name} type='password' className='form-control' />;
    } else {
      return <input name={name} type='hidden' className='form-control' />;
    }

  },

  /**
   */

  _getPlaceHolderText: function(name) {
    return this.getIntlMessage('fieldsLabels.' + name);
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

  mixins: [IntlMixin],

  /**
   */

  getInitialState: function() {
    return {
      data: this.props.data || {},
      form: new this.props.formClass(),
      valid: false
    }
  },

  /**
   */

  onFieldData: function(name, value) {
    var data = this.state.data;
    data[name] = value;

    var form   = this.state.form;
    var schema = form.schema;

    data.bus = this.props.app.bus;

    var valid = false;

    try {
      form.setProperties(data);
      valid = true;
    } catch(e) {
    }

    this.setState({
      form: form,
      data: data,
      valid: valid
    });

    if (valid && this.props.onForm) {
      this.props.onForm(form);
    }
  },

  /**
   */

  onSubmit: async function(event) {
    event.preventDefault();

    this.setState({ loading: true });

    var err;
    try {
      var result = await this.state.form.submit();
    } catch(e) {
      err = e;
    }

    if (this.isMounted()) this.setState({
      loading: false,
      error: err,
      success: !err
    });

    if (!err && this.props.onSuccess) {
      this.props.onSuccess(result);
    }
  },

  /**
   */

  render: function() {

    var form   = this.state.form;
    var schema = form.schema;

    if (!schema) {
      throw new Error('schema not provided for ' + form.constructor.name);
    }

    var formFields = [];

    for (var name in schema.fields) {
      var field = schema.fields[name];
      if (field.hidden) continue;
      formFields.push(
        <Field key={name} name={name} field={field} onFieldData={this.onFieldData} data={this.state.data} {...this.props} />
      );
    }

    return <form onChange={this._onChange} className='form-horizontal m-common-data-form' onSubmit={this.onSubmit}>

      {this.props.title ? <h4>
          <FormattedMessage message={this.getIntlMessage(this.props.title)} />
      </h4> : void 0 }

      { this.state.error ? <div className='alert alert-danger'>{
        <FormattedMessage message={this.getIntlMessage('errors.' + this.state.error.message)} />
      }</div> : void 0 }

      { this.state.success && this.props.successMessage ? <div className='alert alert-success'>{
        <FormattedMessage message={this.getIntlMessage(this.props.successMessage)} />
      }</div> : void 0 }
      <div className='fields'>
        { formFields }
      </div>
      <div className='form-group submit-button'>
        <button name='submit' type='submit' className='form-control' disabled={!this.state.valid || this.state.loading}>
          { this.state.loading ? 'loading...' : this.getIntlMessage(this.props.submitLabel || 'buttons.submit') }
        </button>
      </div>
    </form>
  }
});

export default DataForm;
