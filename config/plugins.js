console.log('🔔 custom plugins.js loaded');


module.exports = ({env}) => ({
 upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        //baseUrl: env('AWS_BASE_URL'),
        rootPath: 'images/',
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION'),
          params: {
            ACL: env('AWS_ACL', 'public-read'),
            //signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('AWS_S3_BUCKET_NAME'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
    "users-permissions": {
        config: {
          jwtSecret: env('JWT_SECRET'), // Ensure this is set
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
