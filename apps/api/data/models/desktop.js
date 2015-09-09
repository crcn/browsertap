import Model         from "common/data/models/base/model"
import Schema        from "common/data/schema/schema";
import persistMixin  from "common/data/models/mixins/persist"
import mixinSchema   from "common/data/schema/mixin"
import DesktopState  from "api/data/types/desktop-state"

/**
 */

var ownerSchema = new Schema({
  fields: {
    _id: {
      type: require("common/data/types/object-id")
    }
  }
});

/**
 */

@mixinSchema(ownerSchema)
class Owner {

};
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
      type: Owner
    }
  }
});

/** 
 * maybe don't implement this
 */

@mixinSchema(desktopSchema)
class Desktop {

  /**
   * stops the desktop
   */

  *stop() {
    return yield this.fetch("stopDesktop");
  }

  /**
   * TODO
   */

  *start(owner) {
    return yield this.fetch("startDesktop", {
      // owner
    });
  }
}
