
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
    mergedItem = newItem;

    // compare the new item with the existing items
    for (var j = 0, n2 = existingItems.length; j < n2; j++) {

      existingItem = existingItems[j];

      if (selector.equals(existingItem, newItem)) {
        selector.update(existingItem, newItem);
        mergedItem = existingItem;
        break;
      }
    }

    mergedItems.push(mergedItem);
  }

  for (var i = 0, n = existingItems.length; i < n; i++) {

    existingItem = existingItems[i];

    for (var j = 0, n2 = mergedItems.length; j < n2; j++) {

      mergedItem = mergedItems[j];

      if (selector.equals(mergedItem, existingItem)) {
        break;
      }
    }

    if (j === n2) {
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
