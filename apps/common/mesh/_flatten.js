export default function flatten(array) {
  var flattened = [];

  for (var item of array) {
    if (Array.isArray(item)) {
      flattened = flattened.concat(flatten(item));
    } else {
      flattened.push(item);
    }
  }

  return flattened;
};
