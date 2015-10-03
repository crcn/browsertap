import accept from "./accept";
import noop   from "./noop";

export default function(test, yes, no) {
  if (!no) no = noop;
  return accept(test, no, yes);
};
