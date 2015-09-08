import mesh from "mesh";
import gen from "common/bus/drivers/generator"
import sift from "sift"

/**

command({
  execute: function*(operation) {
    
  }
});

*/

export default function(command) {

  var { execute, test, schema } = command;

  if (typeof test === "object") test = sift(test);

  var bus = gen(function*(operation) {
    schema.validate(operation.data);
    var result = yield execute(operation);
    return result;
  });

  return function(operation) {
    if (test && !test(operation)) return mesh.noop(operation);
    return bus(operation);
  };
};  
