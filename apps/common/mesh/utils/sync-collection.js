import sift from 'sift';

export default function(bus, collection, options) {

  var handlers = Object.assign({}, {
    insert: noop,
    remove: noop,
    update: noop
  }, options);

  var spy = bus.execute({
    action: 'spy',
    filter: sift({ action: /insert|remove|update/, collection: collection })
  });

  async function run() {
    var value;
    while({value} = await spy.read()) {
      if (!value) break;
      switch(value.operation.action) {
        case 'insert':
          await handlers.insert(value.operation.data);
          break;
        case 'remove':
          await handlers.remove(value.operation.query);
          break;
        case 'update':
          await handlers.remove(value.operation.query, value.operation.data)
          break;
      }
    }
  };

  run();
}

function noop() {
  return Promise.resolve();
}
