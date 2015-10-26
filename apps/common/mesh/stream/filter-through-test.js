import FilterThrough from './filter-through';
import sift from 'sift';
import expect from 'expect.js';
import { timeout } from 'common/test/utils';

describe(__filename + '#', function() {
  it('can filter writes', async function() {
    var buffer = [];
    var w = FilterThrough.create(sift({ action: /a|b|c/ }));

    w.pipeTo({
      write: buffer.push.bind(buffer),
      close: function() { },
      abort: function() { }
    });

    w.write({ action: 'a' });
    w.write({ action: 'd' });

    await timeout(0);

    expect(buffer.length).to.be(1);
    expect(buffer[0].action).to.be('a');
  });
});
