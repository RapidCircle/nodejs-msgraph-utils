/**
 * A session store implementation for Connect & Express backed by an LowDB
 * datastore (either in-memory or file-persisted).
 *
 * For implementation requirements for Express 4.x and above, see:
 *   https://github.com/expressjs/session#session-store-implementation
 */

 module.exports = function(contextName) {
     return {
         info: require('debug')(`${contextName}:info`),
         warning: require('debug')(`${contextName}:warning`),
         error: require('debug')(`${contextName}:error`),
         verbose: require('debug')(`${contextName}:verbose`)
     }
 }