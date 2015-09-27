import _flatten from "./_flatten";
import { AsyncResponse } from "./_responses";

/**
 */
 
export default function(...busses) {
  busses = _flatten(busses); 
  return function(operation) {

    var responses = busses.map(function(bus) {
      return bus(operation);
    });

    var response = new AsyncResponse();
    var i = 0;

    function nextResponse() {
      if (i >= responses.length) return response.end();
      var current = responses[i++];

      current.readAll().then(function(chunks) {
        chunks.forEach(response.write.bind(response));
        nextResponse();
      }).catch(response.error.bind(response));
    }

    nextResponse();

    return response;
  };
};
