_        = require "underscore"
bindable = require "bindable"

exports.load = () ->
  
  config = {
    default: {

    },
    debug: {
      mongodb: {
        host: "127.0.0.1",
        port: 27017,
        db: "browsertap-dev"
      },
      website: {
        http: {
          port: 8080
        }
      },
      provisioner: {
        host: "ludacraig.local",
        port: 8082
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
