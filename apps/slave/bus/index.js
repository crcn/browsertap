import InternalCommandsBus from './commands';
import { NoopBus } from 'common/mesh';

export default function(app, bus) {
  if (!bus) bus = NoopBus.create();
  bus = InternalCommandsBus.create(app, bus);
  return bus;
}
