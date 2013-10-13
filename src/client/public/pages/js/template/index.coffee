pc = require "paperclip"
modifiers = require "./modifiers"

for name of modifiers
  pc.modifier name, modifiers[name]