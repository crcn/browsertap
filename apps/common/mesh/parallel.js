import _flatten from "./_flatten";

/**
 */
 
export default function(...busses) {
  busses = _flatten(busses); 
  return function(operation) {
    return Promise.all(busses.map(function(bus) {
      return bus(operation);
    }));
  };
};
