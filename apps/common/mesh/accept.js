import noop from "./noop";

export default function(test, yes, no) {
  if (!no) no = noop;
  return function(operation) {
    return test(operation) ? yes(operation) : no(operation);
  };
};
