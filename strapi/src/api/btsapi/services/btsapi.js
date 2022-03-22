'use strict';

/**
 * btsapi service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::btsapi.btsapi');
