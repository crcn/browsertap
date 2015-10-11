import InternalCommandsBus from "./commands";
import { NoopBus } from "common/mesh";

export default function(app, bus) {
  if (!bus) bus = new NoopBus();
  bus = new InternalCommandsBus(app, bus);
  this.execute = bus.execute.bind(this);
}
