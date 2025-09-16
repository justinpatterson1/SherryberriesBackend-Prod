'use strict';

var fp = require('lodash/fp');
var clientS3 = require('@aws-sdk/client-s3');
var s3RequestPresigner = require('@aws-sdk/s3-request-presigner');
var utils = require('../../../../node_modules/@strapi/provider-upload-aws-s3/dist/utils.js');

const assertUrlProtocol = url => {
  return /^\w*:\/\//.test(url);
};

const getConfig = ({ baseUrl, rootPath, s3Options, ...legacyS3Options }) => {
  if (Object.keys(legacyS3Options).length > 0) {
    process.emitWarning(
      "S3 configuration options passed at root level of the plugin's providerOptions is deprecated and will be removed in a future release. Please wrap them inside the 's3Options:{}' property."
    );
  }

  const credentials = utils.extractCredentials({
    s3Options,
    ...legacyS3Options
  });

  const config = {
    ...s3Options,
    ...legacyS3Options,
    ...(credentials ? { credentials } : {})
  };

  config.params.ACL = fp.getOr(
    clientS3.ObjectCannedACL.public_read,
    ['params', 'ACL'],
    config
  );

  return config;
};

var index = {
  init({ baseUrl, rootPath, s3Options, ...legacyS3Options }) {
    const config = getConfig({
      baseUrl,
      rootPath,
      s3Options,
      ...legacyS3Options
    });
    const s3Client = new clientS3.S3Client(config);

    // Disable AWS SDK checksum middleware entirely
    if (s3Client.middlewareStack?.remove) {
      s3Client.middlewareStack.remove('FlexibleChecksumsMiddleware');
      s3Client.middlewareStack.remove('FlexibleChecksums');
    }

    const filePrefix = rootPath ? `${rootPath.replace(/\/+$/, '')}/` : '';
    const getFileKey = file => {
      const path = file.path ? `${file.path}/` : '';
      return `${filePrefix}${path}${file.hash}${file.ext}`;
    };

    const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } =
      clientS3;

    // Upload using direct PutObjectCommand with S3 native checksum validation
    const upload = async (file, customParams = {}) => {
      const fileKey = getFileKey(file);
      const body = file.stream || Buffer.from(file.buffer, 'binary');

      await s3Client.send(
        new PutObjectCommand({
          Bucket: config.params.Bucket,
          Key: fileKey,
          Body: body,
          ACL: config.params.ACL,
          ContentType: file.mime,
          ChecksumAlgorithm: 'CRC32C',
          ...customParams
        })
      );

      // Construct public URL
      if (baseUrl) {
        file.url = `${baseUrl}/${fileKey}`;
      } else {
        file.url = `https://${config.params.Bucket}.s3.${config.region}.amazonaws.com/${fileKey}`;
      }
    };

    const uploadStream = (file, customParams = {}) =>
      upload(file, customParams);

    const deleteFn = (file, customParams = {}) => {
      const key = getFileKey(file);
      return s3Client.send(
        new DeleteObjectCommand({
          Bucket: config.params.Bucket,
          Key: key,
          ...customParams
        })
      );
    };

    const getSignedUrl = async (file, customParams = {}) => {
      if (!utils.isUrlFromBucket(file.url, config.params.Bucket, baseUrl)) {
        return { url: file.url };
      }
      const fileKey = getFileKey(file);
      const url = await s3RequestPresigner.getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: config.params.Bucket,
          Key: fileKey,
          ...customParams
        }),
        { expiresIn: fp.getOr(15 * 60, ['params', 'signedUrlExpires'], config) }
      );

      return { url };
    };

    return {
      isPrivate() {
        return config.params.ACL === 'private';
      },
      getSignedUrl,
      upload,
      uploadStream,
      delete: deleteFn
    };
  }
};

module.exports = index;
//# sourceMappingURL=index.js.map
