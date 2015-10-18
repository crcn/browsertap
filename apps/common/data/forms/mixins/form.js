import mixin from "common/utils/class/mixin";
import httperr from "httperr"
import readAll from "common/mesh/utils/read-all";

export default function(formName, modelClass) {
  return mixin({
    submit: async function() {

      var data = (await this.bus.execute({
        name: formName,
        data: this
      }).read()).value;

      if (modelClass != void 0) {
        return new modelClass(Object.assign({ bus: this.bus }, data))
      }

      return data;
    }
  });
};;
