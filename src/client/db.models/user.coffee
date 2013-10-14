mongoose = require "mongoose"
Schema = mongoose.Schema

module.exports = (db) ->

  userSchema = new Schema({
    email    : "string",
    password : "string"
  })

  userSchema

