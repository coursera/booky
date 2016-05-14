var Command = function(matcher, handler) {
  this.matcher = matcher;
  this.handler = handler;
  this._isDefault = false;
};

Command.prototype.setHelp = function(command, text) {
  this.help = {
    command: command,
    text: text
  };
};

Command.prototype.run = function(slack, config) {
  return this.handler(slack, config);  
};

Command.prototype.getHelp = function() {
  return this.help;
};

Command.prototype.setDefault = function(isDefault) {
  this._isDefault = isDefault;
};

Command.prototype.isDefault = function() {
  return this._isDefault;
};

Command.prototype.matches = function(command) {
  if (this.matcher instanceof RegExp) {
    return this.matcher.test(command);
  } else if (this.matcher instanceof Function) {
    return this.matcher(command);
  } else {
    return this.matcher === command;
  }
};

module.exports = Command;
