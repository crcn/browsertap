import accept from "./accept";

export default function(test, yes, no) {
  if (!no) no = noop;
  return accept(test, no, yes);
};
