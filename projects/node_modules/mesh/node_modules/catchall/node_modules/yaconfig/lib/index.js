var path = require('path'),
jsonPersistence = require('./persist/json'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore');



var _combineKeys = function(childKey, key) {
    var keyParts = [];

    if(childKey) keyParts.push(childKey);
    if(key) keyParts.push(key);

    return keyParts.join(':');
}

var configHandler = function(childKey, root) {

    var emitter = new EventEmitter();

    
    var self = {
        
        /**
         */

        get: function(key) {
            
            return root.value(childKey, key);
               
        },

        /**
         */


        set: function(key, value) {

            emitter.emit('change', { key: key, value: value });

            return root.value(childKey, key, value);
        },

        /**
         */

        value: function(key, value) {

            return root.value(childKey, key, value);

        },

        /**
         */

        child: function(key) {

            return root.handler(childKey, key);

        },

        /**
         */

        emit: function() {

            emitter.emit.apply(emitter, arguments);  

        },

        /**
         */

        on: function(type, callback) {
            
            emitter.on(type, callback);

            return {
                dispose: function() {

                    emitter.removeListener(type, callback);

                }
            }
        },

        /**
         */

        persist: function(source, persistence) {

            if(!persistence) persistence = jsonPersistence;

            persistence.read(source, function(config) {

                self.set(null, config);


                self.on('change', _.throttle(function() {

                    persistence.write(source, self.get());

                    emitter.emit('save');
                }, 500));
            });
            
            return self;
        },

        /**
         */

        save: function() {
            
            root.save();

        }
    }

    return self;
}

var configRoot = function(value) {

    var config = value || {}, _children = {}, rootHandler;


    var _changed = function(key, value) {
        var keyParts = (key || '').split(':');

        //bubble up
        while(keyParts.length) {
            var handler = _children[keyParts.join(':')];


            if(handler) {

                handler.emit('change', key, value);

            }

            keyParts.pop();
        }

        rootHandler.emit('change', key, value)
    }
    
    var self = {

        /**
         */

        handler: function(childKey, key) {

            var realKey = _combineKeys(childKey, key);

            return _children[realKey] || (_children[realKey] = configHandler(realKey, self));
        },

        /**
         */

        save: _changed,
        
        /**
         */

        value: function(childKey, key, value) {

            var realKey = _combineKeys(childKey, key);

            if(!realKey.length) {
                if(arguments.length == 2) return config;
                return config = value || {};
            }


            var propTree = realKey.split(':'),
            property,
            current  = config,
            previous = current;


            while(propTree.length) {
                
                property = propTree.shift();
                previous = current;

                //value doesn't exist, and we're not at the end? add an object
                if(!current[property] && propTree.length > 0) current[property] = {};

                //keep traversing
                current = current[property];
            }


            //only keys?
            if(arguments.length == 2) return current;


            previous[property] = value;

            //notify the config handlers
            _changed(realKey, value);

            return value;
        }
    }

    return rootHandler = configHandler(null, self);
}



exports.file = function(source, persistence) {

    return exports.config().persist(source, persistence);

};

exports.config = function(value) {

    return configRoot(value);

}