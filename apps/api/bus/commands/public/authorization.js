import sift from "sift"
import gen  from "common/bus/drivers/generator"

/**
 */

export default function(internalBus) {
  return [

    /**
     * registeration
     */

    sift({ name: "register" }),
    gen(function*() {
      var form = new SignupForm();
    })
  ];
};
