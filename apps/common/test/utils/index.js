import React from "react";
import ReactDOM from "react-dom";
import Application from "common/application";

export default {

  /**
   */

  renderElement: function(componentClass, props, app) {

    if (!app) app = new Application();

    var div = document.createElement("div");
    var component = React.createElement(componentClass, Object.assign({
      app: app, messages: app.intl.messages
    }, props));
    ReactDOM.render(component, div);
    return div;
  },

  /**
   */

  timeout: function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

};
