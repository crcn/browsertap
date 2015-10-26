import expect from 'expect.js';
import BaseModel from './model';

describe(__filename + '#', function() {
  it('can be created', function() {
    new BaseModel();
  });

  it('can be created with properties', function() {
    expect((new BaseModel({ name: 'a' })).name).to.be('a');
  });

  it('can set properties on the model', function() {
    var m = new BaseModel();
    m.setProperties({ name: 'a' });
    expect(m.name).to.be('a');
  });
  
  it('emits a change event with the old & new props', function(next) {
    var m = new BaseModel({ a: 'b' });
    m.once('change', function(n, o) {
      expect(n.properties.a).to.be('c');
      expect(n.properties.b).to.be('d');
      expect(o.properties.a).to.be('b');
      next();
    });
    m.setProperties({ a: 'c', b: 'd' });
  });

  it('doesn\'t emit a change event if nothing has changed', function() {
    var m = new BaseModel({ a: 'b' });
    var i = 0;
    m.on('change', function() { i++; });
    m.setProperties({ a: 'b' });
    expect(i).to.be(0);

    // sanity
    m.setProperties({ a: 'c' });
    expect(i).to.be(1);
  });
});
