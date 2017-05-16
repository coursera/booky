"use strict";

const Command = require('../slack/command');
const fs = require('fs');
const path = require('path');

const help = new Command(/(help)|[?]/, (slack, config, command) => {
  const tokenized = /(?:(?:help)|[?])(?:\s+([^\s]+))?/.exec(slack.text.trim());
  const commands = tokenized[1];
  const fullHelp = !commands;

  let text = fullHelp ? 'happy to help! i can do many booky things, like:\n\n' : slack.command + ' ' + slack.text + '\n\n';

  fs.readdirSync(__dirname).forEach(function(file) {
    let moduleName = path.basename(file, '.js');
    if (moduleName != 'help') {
      let module = require('./' + file);
      if (module && module.getHelp) {
        let commandHelp = module.getHelp();

        if (commandHelp) {
          if (fullHelp) {
            text += slack.command + ' ' + commandHelp.command + '\n';
            text += commandHelp.text + '\n\n';
          } else if (module.matches(commands)) {
            text += slack.command + ' ' + commandHelp.command + '\n' + commandHelp.text + '\n';
          }
        }
      }
    } else if (fullHelp) {
      text += slack.command + ' help\n';
    } else if (commands === 'help') {
      text += slack.command + ' help\n';
      text += 'helps you again and again\n\n';
    }
  });

  if (fullHelp) {
    text += slack.command + ' ?\n';
  } else if (commands && text === '') {
    text += 'i can not help you with _' + commands + '_ right now.';
  }

  return new Promise((resolve, reject) => {
    resolve(command.buildResponse(text));
  });
});

module.exports = help;
