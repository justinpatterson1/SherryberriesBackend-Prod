// config/env/production/plugins.js
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "mailgun",
      providerOptions: {
        apiKey: env("MAILGUN_API_KEY"),
        domain: env("MAILGUN_DOMAIN"),
      },
     settings: {
          defaultFrom: 'sherryvanessanichols@gmail.com', // The email you want to send from
          defaultReplyTo: 'sherryvanessanichols@gmail.com', // The reply-to email
        },
    },
  },
});
