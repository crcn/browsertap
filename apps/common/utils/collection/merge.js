
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

  for (var i = 0, n = newItems.length; i < n; i++) {

    // cast the new item into whatever object needs to be in the existing items collection.
    // This could be a model for instance
    newItem    = selector.cast(newItems[i]);
    mergedItem = existingItems.find(function(existingItem) {
      return selector.equals(existingItem, newItem);
    }) || newItem;

    if (mergedItem !== newItem) {
      selector.update(mergedItem, newItem);
    }

    mergedItems.push(mergedItem);
  }

  for (var i = 0, n = existingItems.length; i < n; i++) {

    existingItem = existingItems[i];
    if (!~mergedItems.indexOf(existingItem)) {
      selector.remove(existingItem);
    }
  }

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
