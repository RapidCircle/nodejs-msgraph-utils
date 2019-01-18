const supportedMetrics = require('nodejs-msgraph-utils/lookups/supportedMetrics.js');
const _ = require('lodash');

let someResource = retrieveResourceForSomePurpose();

let resourceTypeSupported = _.find(supportedMetrics, (metricType) => metricType === someResource.type);

if(resourceTypeSupported) {
    // perform API call
}
else {
    // dont call, safe time, drink tea.
}