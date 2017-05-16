"use strict";

const Message = require('../slack/message');
const Command = require('../slack/command');
const algoliasearch = require('algoliasearch');

const what = new Command(/search/, (slack, config, command) => {
  const tokenized = /\s*(?:search)?\s*(.*)/.exec(slack.text);
  const query = tokenized && tokenized.length ? tokenized[1] : null;

  return new Promise((resolve, reject) => {
    if (query) {
      resolve(command.buildResponse('searching ... i\'ll be right back'));

      const client = algoliasearch(config.algolia.applicationId, config.algolia.apiKey);
      const index = client.initIndex(config.algolia.index);
      const message = new Message(config.slack);

      message.setChannel('@' + slack.user_name);

      index.search(query, {hitsPerPage: 5})
        .then((content) => {
          if (content.hits && content.hits.length) {
            message.setText(`i found at least ${content.hits.length} pages that mention _"${query}"_`);
            content.hits.forEach((hit) => {
              const text = hit._highlightResult.body.value.replace(/(<em>)/igm, '*').replace(/(<\/em>)/igm, '*');
              message.addAttachment({
                title:hit.title, 
                title_link:config.gitbook.url + hit.url, 
                text:text,
                mrkdwn_in: ['text']});
            });
          } else {
            message.setText(`sorry, i couldn't find anything that looks related to _${query}_`);
          }
          message.post();
        }).catch((err) => {
          message.setText(`sorry, search failed with ${err}`);
          message.post();
        });
    } else {
      const badText = 'yes? what would you like to search for?';
      resolve(command.buldResponse(badText));
    }
  });
});

what.setHelp('[search] query', 'search your gitbook pages');
what.setDefault(true);

module.exports = what;
