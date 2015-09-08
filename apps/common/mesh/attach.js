
export default function(properties, bus) {
  return function(operation) {
    Object.assign(operation, properties);
    return bus(operation);
  };
};
