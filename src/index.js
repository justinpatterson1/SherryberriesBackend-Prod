// File: src/index.js
'use strict';

const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';

// 1) On startup, verify the key is present and 32 bytes (hex)
if (!process.env.COUPON_ENCRYPTION_KEY) {
  throw new Error(
    'COUPON_ENCRYPTION_KEY is not set. Generate 32 random bytes (hex) and add it to your .env'
  );
}
const SECRET_KEY = Buffer.from(process.env.COUPON_ENCRYPTION_KEY, 'hex');
if (SECRET_KEY.length !== 32) {
  throw new Error(
    `COUPON_ENCRYPTION_KEY must be 32 bytes (64 hex chars). Current length: ${SECRET_KEY.length}`
  );
}

// 2) Utility: encrypt a plaintext → "ivHex:cipherHex"
function encryptText(plaintext) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// 3) Utility: decrypt "ivHex:cipherHex" → plaintext
function decryptText(encryptedPayload) {
  const [ivHex, cipherHex] = encryptedPayload.split(':');
  if (!ivHex || !cipherHex) {
    throw new Error('Invalid encrypted payload');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const cipherBuffer = Buffer.from(cipherHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(cipherBuffer),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

module.exports = {
  register({ strapi }) {
    // strapi.documents.use(async (context, next) => {
    //   const { uid, action, params } = context;
    //   // 4) If this isn’t the Coupon model, just pass through
    //   if (uid !== 'api::coupon.coupon') {
    //     return await next();
    //   }
    //   // 5) On create/update, encrypt the 'code' field
    //   if (action === 'create' || action === 'update') {
    //     const data = params.data || {};
    //     if (typeof data.code === 'string' && data.code.length > 0) {
    //       try {
    //         data.code = encryptText(data.code);
    //       } catch (err) {
    //         strapi.log.error('Error encrypting coupon code', err);
    //         throw err;
    //       }
    //     }
    //   }
    //   // 6) Call Strapi’s default logic (DB operations, etc.)
    //   await next();
    //   // 7) On find/findOne/findMany, decrypt the code in the result
    //   if (['find', 'findOne', 'findMany'].includes(action)) {
    //     const result = context.result;
    //     if (!result || result.data == null) {
    //       return;
    //     }
    //     // If single entry
    //     if (!Array.isArray(result.data)) {
    //       const record = result.data;
    //       if (record.attributes?.code) {
    //         try {
    //           record.attributes.code = decryptText(record.attributes.code);
    //         } catch (err) {
    //           strapi.log.error('Error decrypting coupon code', err);
    //           throw err;
    //         }
    //       }
    //     }
    //     // If multiple entries
    //     else {
    //       for (const record of result.data) {
    //         if (record.attributes?.code) {
    //           try {
    //             record.attributes.code = decryptText(record.attributes.code);
    //           } catch (err) {
    //             strapi.log.error('Error decrypting coupon code', err);
    //             throw err;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
  }
  // bootstrap({ strapi }) {},
  // destroy({ strapi }) {},
};
