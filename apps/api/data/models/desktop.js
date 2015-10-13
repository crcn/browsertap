import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin"
import DesktopState  from "api/data/types/desktop-state"
import Reference     from "api/data/types/reference";

/**
 */

var desktopSchema = new Schema({
  fields: {
    _id: {
      type: require("common/data/types/object-id")
    },

    /**
     * current state of the desktop
     */

    state: {
      type: DesktopState
    },

    /**
     * owner this desktop currently belongs to
     */

    owner: {
      type: Reference
    }
  }
});

/**
 * maybe don't implement this
 */

@mixinSchema(desktopSchema)
class Desktop {

  /**
   * stops the desktopr
   */

  async stop() {
    return await this.fetch("stopDesktop");
  }

  /**
   * TODO
   */

  async start(owner) {
    return await this.fetch("startDesktop", {
      // owner
    });
  }
}
