console.log('🔔 custom plugins.js loaded');


module.exports = ({env}) => ({
  
 upload: {
    config: {
      provider: 'aws-s3-custom',
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
   'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwtExpiresIn: '7d',
      register: {
        emailConfirmation: true,
      },
      advanced: {
        email_confirmation: {
          // this is the URL the user will be redirected to after confirming
          redirect: env(
            'EMAIL_CONFIRMATION_REDIRECT'
          
          ),
        },
      },
    },
  },
    email: {
    config: {
      provider: 'mailgun',
      providerOptions: {
        key:    env('MAILGUN_API_KEY'),               // ← new name
        domain: env('MAILGUN_DOMAIN'),
        url:    env('MAILGUN_URL', 'https://api.mailgun.net'), // ← new name
      },
      settings: {
        defaultFrom: 'sherryvanessanichols@gmail.com',
        defaultReplyTo:'sherryvanessanichols@gmail.com',
      },
    },
  },
      'image-optimizer': {
    enabled: false,
  },

    
});


// config/plugins.js
// module.exports = ({ env }) => {
//   const isProd = env('NODE_ENV') === 'production';

//   // debug so you can see in Render logs whether the key is loaded
//   console.log('🔑 MAILGUN_API_KEY in prod:', env('MAILGUN_API_KEY'));

//   return {
//     email: {
//       config: {
//         provider: isProd ? 'mailgun' : 'smtp',
//         providerOptions: isProd
//           ? {
//               apiKey: env('MAILGUN_API_KEY'),
//               domain: env('MAILGUN_DOMAIN'),
//             }
//           : {
//               host: env('SMTP_HOST'),
//               port: env('SMTP_PORT'),
//               auth: {
//                 user: env('SMTP_USER'),
//                 pass: env('SMTP_PASS'),
//               },
//             },
//         settings: {
//           defaultFrom: env('MAILGUN_DEFAULT_FROM'),
//           defaultReplyTo: env('MAILGUN_DEFAULT_REPLY_TO'),
//         },
//       },
//     },
//   };
// };

