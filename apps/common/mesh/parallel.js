
/**
 */
 
export default function(...busses) {
  return function(operation) {
    return Promise.all(busses.map(function(bus) {
      return bus(operation);
    }));
  };
};
