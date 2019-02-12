/**
 * A simple logger that leverages 'debug' to provide multiple levels of logging
 *
 */

 module.exports = function(contextName) {
     return {
         info: require('debug')(`info:${contextName}`),
         warning: require('debug')(`warning:${contextName}`),
         error: require('debug')(`error:${contextName}`),
         verbose: require('debug')(`verbose:${contextName}`)
     }
 }