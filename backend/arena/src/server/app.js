const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');

module.exports = function () {
  const hbs = exphbs.create({
    defaultLayout: `${__dirname}/views/layout`,
    handlebars,
    partialsDir: `${__dirname}/views/partials/`,
    extname: 'hbs'
  });

  require('handlebars-helpers')({ handlebars });

  const app = express();

  const Config = require('../../../config/index.json');


  const defaultConfig = { queues: [] }
  defaultConfig.queues.push({
    "name": "addOns",
    "port": Config.redis.port,
    "host": Config.redis.host,
    "hostId": "RES"
  })
  Config.repositories.forEach(element => {
    defaultConfig.queues.push({
      "name": element.name + "_repeat",
      "port": Config.redis.port,
      "host": Config.redis.host,
      "hostId": "RES"
    })
    defaultConfig.queues.push({
      "name": element.name + "_fetch",
      "port": Config.redis.port,
      "host": Config.redis.host,
      "hostId": "RES"
    })
    defaultConfig.queues.push({
      "name": element.name + "_index",
      "port": Config.redis.port,
      "host": Config.redis.host,
      "hostId": "RES"
    })

  });


  const Queues = require('./queue');
  const queues = new Queues(defaultConfig);
  require('./views/helpers/handlebars')(handlebars, { queues });
  app.locals.Queues = queues;
  app.locals.appBasePath = '/arena/';

  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'hbs');
  app.set('json spaces', 2);

  app.engine('hbs', hbs.engine);

  app.use(bodyParser.json());

  return {
    app,
    Queues: app.locals.Queues
  };
};
