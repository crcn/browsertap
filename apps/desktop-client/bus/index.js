import commands from "./commands";
import { noop } from "common/mesh";

export default function(app, bus) {
  if (!bus) bus = noop;
  bus = commands(app, bus);
  return bus;
}
