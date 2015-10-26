import { WritableStream } from 'mesh';

class FilterThrough {

  constructor(filter) {
    this._filter = filter;
    this._output = WritableStream.create();
  }

  write(chunk) {
    if (this._filter(chunk)) {
      this._output.write(chunk);
    }
  }

  close() {
    this._output.close();
  }

  abort(error) {
    this._output.abort(error);
  }

  pipeTo(writable) {
    return this._output.getReader().pipeTo(writable);
  }
}

FilterThrough.create = require('common/utils/class/create');

export default FilterThrough;
