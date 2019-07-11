const util = require('util'),
    { pki, md, asn1 } = require('node-forge'),
    debug = require('nodejs-msgraph-utils/utils/logger.js')('AzureClientCertificateStrategy'),
    Strategy = require('passport-strategy');


/*
 * passport.js TLS client certificate strategy
 */
function AzureClientCertStrategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }
    if (!verify) throw new Error('Client cert authentication strategy requires a verify function');

    Strategy.call(this);
    this.name = 'client-cert';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
}

util.inherits(AzureClientCertStrategy, Strategy);

AzureClientCertStrategy.prototype.authenticate = function (req, options) {
    var that = this;

    try {
        const header = req.get('X-ARR-ClientCert');
        // if the X-ARR-ClientCert header is not set we are directly receiving the client certificate without network TLS offloading.
        // for this case we will let node.js handle auth. When the header is detected, the certificate is being created from the 
        // HTTP headers. 
        if (!header) {
            debug.verbose('Client certificate validation throught Node.JS directly.');
            // Requests must be authorized
            // (i.e. the certificate must be signed by at least one trusted CA)
            if (!req.socket.authorized) {
                that.fail();
            } else {
                var clientCert = req.socket.getPeerCertificate();

                // The cert must exist and be non-empty
                if (!clientCert || Object.getOwnPropertyNames(clientCert).length === 0) {
                    that.fail();
                } else {

                    var verified = function verified(err, user) {
                        if (err) { return that.error(err); }
                        if (!user) { return that.fail(); }
                        that.success(user);
                    };

                    if (this._passReqToCallback) {
                        this._verify(req, clientCert, verified);
                    } else {
                        this._verify(clientCert, verified);
                    }
                }
            }
        }
        else {
            debug.verbose('Client certificate validation throught Azure network layer.');
            // Convert from PEM to pki.CERT
            const pem = `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
            const incomingCert = pki.certificateFromPem(pem);

            // Validate the fingerprint / thumbprint of the certificate (use your own certificates' thumbprint)
            const fingerPrint = md.sha1.create().update(asn1.toDer(pki.certificateToAsn1(incomingCert)).getBytes()).digest().toHex();
            if (fingerPrint.toLowerCase() !== '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12') throw new Error('UNAUTHORIZED');

            // Validate time validity
            const currentDate = new Date();
            if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw new Error('UNAUTHORIZED');

            // Validate Issuer (use your own issuers' hash | alternative: compare it field by field like in the Azure documentation)
            if (incomingCert.issuer.hash.toLowerCase() !== '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12') throw new Error('UNAUTHORIZED');

            // Validate Subject (use your own subjects' hash | alternative: compare it field by field like in the Azure documentation)
            if (incomingCert.subject.hash.toLowerCase() !== '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12') throw new Error('UNAUTHORIZED');

            next();
        }
    }
    catch (e) {
        if (e instanceof Error && e.message === 'UNAUTHORIZED') {
            res.status(401).send();
        } else {
            next(e);
        }
    }
};

exports.Strategy = AzureClientCertStrategy;