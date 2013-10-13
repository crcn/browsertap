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
      },
      client: {
        http: {
          port: 8081
        }
      }
    }
  }

  env = process.env.NODE_ENV ? "debug"

  new bindable.Object _.extend { env: env, type: process.env.TYPE }, config[env] ? {}, config.default
