console.log('🔔 custom plugins.js loaded');

module.exports = ({ env }) => {
  // Debug environment variables
  console.log('🔍 Email config debug:');
  console.log('POSTMARK_SERVER_TOKEN:', env('POSTMARK_SERVER_TOKEN') ? 'SET' : 'NOT SET');
  console.log('POSTMARK_DEFAULT_FROM:', env('POSTMARK_DEFAULT_FROM'));
  console.log('POSTMARK_SMTP_HOST:', env('POSTMARK_SMTP_HOST'));
  
  return {
  upload: {
    config: {
      provider: 'aws-s3-custom',
      providerOptions: {
        //baseUrl: env('AWS_BASE_URL'),
        rootPath: 'images/',
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY')
          },
          region: env('AWS_REGION'),
          params: {
            ACL: env('AWS_ACL', 'public-read'),
            //signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('AWS_S3_BUCKET_NAME')
          }
        }
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {}
      }
    }
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwtExpiresIn: '7d',
      register: {
        emailConfirmation: true
      },
      advanced: {
        // must be true to expose /api/auth/send-email-confirmation
        email_confirmation: true,
        // where users click the link will send them
        email_confirmation_redirection: env('EMAIL_CONFIRMATION_REDIRECT')
      }
    }
  },
  // Postmark via Nodemailer SMTP
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('POSTMARK_SMTP_HOST', 'smtp.postmarkapp.com'),
        port: env.int('POSTMARK_SMTP_PORT', 587),
        auth: {
          user: env('POSTMARK_SERVER_TOKEN') || 'your_postmark_server_token',
          pass: env('POSTMARK_SERVER_TOKEN') || 'your_postmark_server_token'
        },
        secure: env.bool('POSTMARK_SMTP_SECURE', false), // false for 587, true for 465
      },
      settings: {
        defaultFrom: env('POSTMARK_DEFAULT_FROM', 'sherryberries@gmail.com'),
        defaultReplyTo: env('POSTMARK_DEFAULT_REPLY_TO', 'sherryberries@gmail.com')
      }
    }
  },
  'image-optimizer': {
    enabled: false
  }
  };
};

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
