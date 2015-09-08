```javascript

class EmailAddress extends ValueObject {
  validate(value) {
    return /regexp/.test(value);
  }
}

class Password extends ValueObject {
  validate(value) {
    return /regexp/.test(value);
  }
}

@persistable("users")
class User extends Model {
  fields: {
    emailAddress: EmailAddress
  }
}

class Schema {
  fields: {
    emailAddress: EmailAddress,
    password: Password,
    metadata: Object
  }
}


class RegistrationForm extends EntityObject {
  fields: {
    emailAddress: EmailAddress,
    password: Password,
    metadata: Object
  }
}

class RegistrationForm {
  fields: {
    emailAddress: EmailAddress,
    password: Password,
    metadata: Object
  }
  register() {
    this.validate();
  }
}

// throw new exception
var u = new User({ emailAddress: "afdfsfs", bus: bus });
u.save();

```