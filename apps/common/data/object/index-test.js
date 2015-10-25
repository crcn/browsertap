import NativeDataObject from './native';
import PollyDataObject from './polly';
import expect from 'expect.js';
import testUtils from 'common/test/utils';

describe(__filename + '#', function() {


  function runTests(type, clazz) {
    describe(type, function() {
      it('can be created', function() {
        new clazz();
      });

      it('can be created with properties', function() {
        var dob = new clazz({ a: 1 });
        expect(dob.a).to.be(1);
      });

      it('can set properties', function() {
        var dob = new clazz();
        dob.setProperties({ a: 1 });
        expect(dob.a).to.be(1);
      });

      it('triggers changes when setProperties() is called', async function() {
        var dob = new clazz();
        var changes = [];
        dob.watch((c) => changes = c);
        dob.setProperties({ a: 1 });
        await testUtils.timeout(0);
        expect(changes[0].type).to.be('add');
        expect(changes[0].name).to.be('a');
        dob.setProperties({ a: 2 });
        await testUtils.timeout(0);
        expect(changes[0].type).to.be('update');
        expect(changes[0].name).to.be('a');
        expect(changes[0].oldValue).to.be(1);
        dob.setProperties({ a: void 0 });
        await testUtils.timeout(0);
        expect(changes[0].type).to.be('update');
        expect(changes[0].name).to.be('a');
      });
    });
  }

  runTests("native", NativeDataObject);
  runTests("native", PollyDataObject);
});
