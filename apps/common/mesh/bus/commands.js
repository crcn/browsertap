import { Bus, NoopBus } from "mesh";

class CommandsBus extends Bus {
  constructor(commands, bus) {
    super();
    this._commands = commands;
    this._bus      = bus || new NoopBus();
  }
  execute(operation) {
    return (this._commands[operation.name] || this._bus).execute(operation);
  }
}

export default CommandsBus;
