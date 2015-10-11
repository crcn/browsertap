import sift from "sift";

export default function(bus, collection, options) {

  var handlers = Object.assign({}, {
    insert: noop,
    remove: noop,
    update: noop
  }, options);


  var spy = bus.execute({
    name: "spy",
    filter: sift({ name: /insert|remove|update/, collection: collection })
  });

  async function run() {
    var value;
    while({value} = await spy.read()) {
      if (!value) break;
      switch(value.operation.name) {
        case "insert": await handlers.insert(value.operation.data)
        case "remove": await handlers.remove(value.operation.query)
        case "update": await handlers.remove(value.operation.query, value.operation.data)
      }
    }
  };

  run();
}

function noop() {
  return Promise.resolve();
}
