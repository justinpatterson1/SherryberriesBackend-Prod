module.exports = ({env})=> [
  'strapi::logger',
  'strapi::errors',
  {
        name: 'strapi::security',
        config: {
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              'connect-src': ["'self'", 'https:'],
              'img-src': [
                "'self'",
                'data:',
                'blob:',
                'market-assets.strapi.io',
                'sherryberries-prod-bucket.s3.us-east-2.amazonaws.com',
              ],
              'media-src': [
                "'self'",
                'data:',
                'blob:',
                'market-assets.strapi.io',
                'sherryberries-prod-bucket.s3.us-east-2.amazonaws.com',
              ],
              upgradeInsecureRequests: null,
            },
          },
        },
      },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      key: 'strapi.sess',         // Key used in the cookie
      maxAge: 86400000,           // Session expiration in ms (1 day)
      httpOnly: true,             // Prevent client-side access to the cookie
      secure: env('NODE_ENV') === 'production', // Use secure cookies in production
      sameSite: 'lax',            // Protect against CSRF
    },
  },
  'strapi::favicon',
  'strapi::public',
];
