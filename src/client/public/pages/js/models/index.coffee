bindable = require "bindable"
models = require("mojojs").models

models.set "user", new bindable.Object()
models.set "browser", new bindable.Object { name: "Chrome 18" }