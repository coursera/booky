"use strict";

const response = require('../slack/response');
const Message = require('../slack/message');
const Command = require('../slack/command');

const matcher = (command) => {
  return /^(hi|hello|yo|sup)\s*$/.test(command);
};

const hi = new Command(matcher, (slack, config) => {
  return new Promise((resolve, reject) => {
    resolve(new Message(`hi @${slack.user_name}, want to learn how to use ${config.slack.botName}? if so, try "/${config.slack.botName} help"`));
  });
});

hi.setHelp('hi', `say hello!`);

module.exports = hi;
