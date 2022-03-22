'use strict';

/**
 * btsapi router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::btsapi.btsapi');
