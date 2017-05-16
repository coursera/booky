"use strict";

const express = require('express');
const router = express.Router({strict:true});
const url = require('url');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');

module.exports = (config) => {

  router.post('/', (req, res) => {
    const params = req.body;
    const requestToken = params.token;
    const commandText = params.text || '';
    const commands = fs.readdirSync(__dirname + '/commands');

    let commandDefault;
    let commandRun = false;

    if (requestToken !== config.slack.token) {
      res.status(403).send('Invalid request token ' + requestToken);
    } else {
      let module;
      let command;
  
      while(commands.length > 0) {
        module = commands.pop();
        command = require('./commands/' + module);

        if (command.matches(commandText)) {
          commandRun = true;
          command.run(params, config).then((message) => {
            if (message) {
              res.json(message);
            } else {
              res.send('');
            }
          }).catch((err) => {
            res.status(500);
          });
          break;
        } else if (command.isDefault()){
          commandDefault = command;
        }
      };

      if (!commandRun) {
        if (commandDefault) {
          commandDefault.run(params, config).then((message) => {
            if (message) {
              res.json(message);
            } else {
              res.send('');
            }
          }).catch((err) => { 
            res.status(500); 
          });
        } else {
          res.status(500);
        }
      }
    }
  });

  return router;
};
