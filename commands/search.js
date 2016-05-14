"use strict";

const response = require('../slack/response');
const Message = require('../slack/message');
const Command = require('../slack/command');
const algoliasearch = require('algoliasearch');

const what = new Command(/search/, (slack, config) => {
  const tokenized = /\s*(?:search)?\s*(.*)/.exec(slack.text);
  const query = tokenized && tokenized.length ? tokenized[1] : null;

  return new Promise((resolve, reject) => {
    if (query) {
      resolve(new Message('searching ... i\'ll be right back'));

      const client = algoliasearch(config.algolia.applicationId, config.algolia.apiKey);
      const index = client.initIndex(config.algolia.index);

      index.search(query, {hitsPerPage: 5})
        .then((content) => {
          if (content.hits && content.hits.length) {
            const message = new Message(`i found at least ${content.hits.length} pages that mention _"${query}"_`);
            content.hits.forEach((hit) => {
              const text = hit._highlightResult.body.value.replace(/(<em>)/igm, '*').replace(/(<\/em>)/igm, '*');
              message.addAttachment({
                title:hit.title, 
                title_link:config.gitbook.url + hit.url, 
                text:text,
                mrkdwn_in: ['text']});
            });
            response.sendTo(slack.user_name, message, config.slack);
          } else {
            const none = new Message(`sorry, i couldn't find anything that looks related to _${query}_`);
            response.sendTo(slack.user_name, none, config.slack);
          }
        }).catch((err) => {
          response.send(slack.response_url, new Message(`sorry, search failed with ${err}`));
        });
    } else {
      const badText = 'yes? what would you like to search for?';
      resolve(new Message(badText));
    }
  });
});

what.setHelp('[search] query', 'search your gitbook pages');
what.setDefault(true);

module.exports = what;
