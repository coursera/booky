# install

## npm

install the package directly from github with npm

```
npm install git@github.com:coursera/booky.git
```

## configure booky

copy config.js.template.txt into your module and add in your own parameters to authenticate to algolia

below are the params you will need to define

```
{
  slack: {
    apiToken: '', // generate this on slack
    token: '', // generate this on slack
    webhook: '', // generate this on slack
    botName: 'booky', //name it whatever you want
    botIconEmoji: 'book' // assign the bot an emoji icon
    // botIconUrl: '' // or assign it to some hosted image somewhere
  },
  algolia: {
    applicationId: '',
    apiKey: '',
    index: ''
  },
  gitbook: {
    url: ''
  }
};
```

## wire up this router to an existing express server

this module exposes a modular express router that can be wired up to any existing express router. 

here is an example of how to do that:

```
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var fs = require('fs');
  var path = require('path');
  var vhost = require('vhost');
  var booky = require('booky');
  var bookyConfig = require('./config.booky.js');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/booky', booky(bookyConfig));

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
  });
```
