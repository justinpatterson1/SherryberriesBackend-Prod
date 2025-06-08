'use strict';

/**
 * aftercare service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::aftercare.aftercare');
