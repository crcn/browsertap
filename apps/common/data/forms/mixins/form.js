import mixin from 'common/utils/class/mixin';
import httperr from 'httperr'

export default function(formName, modelClass) {
  return mixin({
    submit: async function() {

      var data = (await this.bus.execute({
        action: formName,
        data: this
      }).read()).value;

      if (modelClass != void 0) {
        return new modelClass(Object.assign({ bus: this.bus }, data))
      }

      return data;
    }
  });
};;
