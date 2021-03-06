import nodemailer from 'nodemailer';

const mailers = {
  mock     : require('./mock'),
  default  : require('./nodemailer')
};

export default function(app) {
  var type = app.config.emailer.service;
  app.logger.info('init emailer: ', type);
  var emailer = mailers[type] || mailers.default;
  app.emailer = emailer(app, app.config.emailer);
};
