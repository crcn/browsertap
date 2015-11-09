
/**
* diffs a collection against another one
* @param newItems the new items to diff against
* @param existingItems the existing items to diff against
* @param selector the config which applies CRUD ops against the collection
*/

export default function(existingItems, newItems, selector) {
  var mergedItems = [];
  selector = Object.assign({}, defaultSelector, selector || {});

  var existingItem;
  var newItem;
  var mergedItem;

  newItems.forEach(function(newItem, i) {
    // cast the new item into whatever object needs to be in the existing items collection.
    // This could be a model for instance
    newItem    = selector.cast(newItem);
    mergedItem = existingItems.find(function(existingItem) {
      return selector.equals(existingItem, newItem);
    }) || newItem;

    if (mergedItem !== newItem) {
      selector.update(mergedItem, newItem);
    }

    mergedItems.push(mergedItem);
  });

  existingItems.forEach(function(existingItem, i) {
    if (!~mergedItems.indexOf(existingItem)) {
      selector.remove(existingItem);
    }
  });

  return mergedItems;
};

/*
 */

var defaultSelector = {
  cast: function(b) {
    return b
  },
  equals: function(a, b) {
    return a === b;
  },
  add: function(a) {
    // do nothing
  },
  remove: function(a) {
    // do nothing
  },
  update: function(a, b) {
    if (typeof a === 'object') Object.assign(a, b);
  }
}
