import mousetrap from 'mousetrap';

export default function(app) {

  var currentKeys;
  app.router.location.watch(rebindKeys);

  function rebindKeys() {
    if (currentKeys) currentKeys.dispose();

    // TODO - yield for shortcut info
    currentKeys = _bindKeys({

      /**
       */

      'alt+space': function() {
        app.router.setQuery({
          showControls: app.router.location.query.showControls ? void 0 : true
        })
      },

      /**
       */

      'alt+right': function() {
        app.router.setQuery({
          toolBarPosition: (Number(app.router.location.query.toolBarPosition || 0) + 1) % 4
        });
      }
    });
  }
};

/**
 */

function _bindKeys(commands) {
  var disposables = [];

  for (var key in commands) {
    disposables.push(_bindKey(key, commands[key].bind(commands)));
  }

  return {
    dispose: function() {
      disposables.forEach(function(disposable) {
        disposable.dispose();
      });
    }
  }
}

/**
 */

function _bindKey(key, handler) {
  mousetrap.bind(key, handler);
  return {
    dispose: function() {
      mousetrap.unbind(key, handler)
    }
  }
}
