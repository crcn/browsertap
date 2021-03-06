import DataForm from './index'
import TestUtils from 'react-addons-test-utils';
import expect from 'expect.js'
import Schema from 'common/data/schema/schema'
import Password from 'common/data/types/password'
import EmailAddress from 'common/data/types/email-address'
import testUtils from 'common/test/utils'
import Form from 'common/data/forms/base';
import apiTestUtils from 'api/test/utils';

describe(__filename + '#', function() {

  var app;

  beforeEach(async function() {
    app = await apiTestUtils.createFakeApp();
  });

  afterEach(function() {
    app.dispose();
  });

  function renderDataForm(props) {
    return testUtils.renderElement(DataForm, props, app);
  }

  it('can render various forms', function() {
    class SomeForm extends Form {
      constructor(properties) {
        super('send', new Schema({
          fields: {
            emailAddress : EmailAddress,
            password     : Password
          }
        }), properties);
      }
    }


    var div = renderDataForm({ formClass: SomeForm });

    expect(div.querySelector('*[type=\'password\']')).not.to.be(null);
    expect(div.querySelector('*[type=\'text\']')).not.to.be(null);
  });

  it('enables the submit button once all the fields have been validated', function() {

    class SomeForm extends Form {
      constructor(properties) {
        super('send', new Schema({
          fields: {
            emailAddress : EmailAddress,
            password     : Password
          }
        }), properties);
      }
    }

    var div = renderDataForm({ formClass: SomeForm });

    var emailAddressInput = div.querySelector('*[type="text"]');
    var passwordInput     = div.querySelector('*[type="password"]');
    var submitButton      = div.querySelector('*[type="submit"]');

    expect(submitButton.disabled).to.be(true);

    // test ui state
    TestUtils.Simulate.change(passwordInput);

    expect(passwordInput.parentNode.parentNode.querySelector('.ion-close')).not.to.be(null);
    passwordInput.value = 'password';
    TestUtils.Simulate.change(passwordInput);
    expect(passwordInput.parentNode.parentNode.querySelector('.ion-close')).to.be(null);
    expect(passwordInput.parentNode.parentNode.querySelector('.ion-checkmark')).not.to.be(null);

    emailAddressInput.value = 'a@b.com';
    TestUtils.Simulate.change(emailAddressInput);

    expect(submitButton.disabled).to.be(false);
  });

  it('can render a form that depends on another field', function() {


    class SomeForm extends Form {
      constructor(properties) {
        super('send', new Schema({
          fields: {
            password       : Password,
            repeatPassword : {
              type: Password,
              validate: function(password, data) {
                return String(password) === String(data.password);
              }
            }
          }
        }), properties);
      }
    }

    var div = renderDataForm({ formClass: SomeForm });

    var submitButton      = div.querySelector('*[type="submit"]');

    var emailAddressInput = div.querySelector('*[type="text"]');
    var passwordInputs    = div.querySelectorAll('*[type="password"]');
    var passwordInput     = passwordInputs[0];
    var passwordInput2    = passwordInputs[1];

    expect(submitButton.disabled).to.be(true);
    passwordInput.value  = 'password';
    passwordInput2.value = 'password1';

    TestUtils.Simulate.change(passwordInput);
    TestUtils.Simulate.change(passwordInput2);

    expect(submitButton.disabled).to.be(true);

    passwordInput.value  = 'password1';
    TestUtils.Simulate.change(passwordInput);
    expect(submitButton.disabled).to.be(false);

    expect(passwordInput2.parentNode.parentNode.querySelector('.ion-checkmark')).not.to.be(null);

  });
});
