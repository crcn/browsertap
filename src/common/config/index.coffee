_        = require "underscore"
bindable = require "bindable"

exports.load = () ->
  
  config = {
    default: {

    },
    debug: {
      website: {
        http: {
          port: 8080
        }
      }
    }
  }


  env = process.env.NODE_ENV ? "debug"

  new bindable.Object _.extend { env: env }, config[env] ? {}, config.default
