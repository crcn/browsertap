import React from "react";

export default {

  /**
   */

  renderElement: function(componentClass, props, app) {

    if (!app) app = apiApp;

    var div = document.createElement("div");
    var component = React.createElement(componentClass, Object.assign({
      app: app, messages: app.intl.messages
    }, props));
    React.render(component, div);
    return div;
  }

};