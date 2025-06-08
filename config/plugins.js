module.exports = ({env}) => ({
    upload: {
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall:250
        },
      },
    "users-permissions": {
        config: {
          jwtSecret: env('JWT_SECRET', 'your-jwt-secret'), // Ensure this is set
          jwtExpiresIn: '7d', // Customize expiration time (optional)
          register: {
            emailConfirmation: true,
          },
        },
      },
    email: {
        provider: 'mailgun', // Use the Mailgun provider
        providerOptions: {
          apiKey:env('MAILGUN_APIKEY'), // Replace with your Mailgun API key
          domain: env('MAILGUN_DOMAIN'), // Replace with your Mailgun domain (e.g., mg.yourdomain.com)
        },
        settings: {
          defaultFrom: 'sherryvanessanichols@gmail.com', // The email you want to send from
          defaultReplyTo: 'sherryvanessanichols@gmail.com', // The reply-to email
        },
      },
});
