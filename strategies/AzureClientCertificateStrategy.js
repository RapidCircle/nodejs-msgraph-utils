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
    var clientCert;

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
                clientCert = req.socket.getPeerCertificate();
            }
        }
        else {
            debug.verbose('Client certificate validation throught Azure network layer.');
            if (!process.env.AZ_VALIDATE_ISSUER_THUMBPRINT) throw new Error("ISSUER_THUMBPRINT_NOTSET");
            // Convert from PEM to pki.CERT
            const pem = `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
            clientCert = pki.certificateFromPem(pem);

            // Validate the fingerprint / thumbprint of the certificate (use your own certificates' thumbprint)
            if (process.env.AZ_VALIDATE_CERTIFICATE_THUMBPRINT) {
                const fingerPrint = md.sha1.create().update(asn1.toDer(pki.certificateToAsn1(clientCert)).getBytes()).digest().toHex();
                if (fingerPrint.toLowerCase() !== process.env.AZ_VALIDATE_CERTIFICATE_THUMBPRINT) throw new Error('UNAUTHORIZED');
            }
            // Validate time validity
            const currentDate = new Date();
            if (currentDate < clientCert.validity.notBefore || currentDate > clientCert.validity.notAfter) throw new Error('UNAUTHORIZED');

            // Validate Issuer (use your own issuers' hash | alternative: compare it field by field like in the Azure documentation)
            process.env.AZ_VALIDATE_ISSUER_THUMBPRINT
            if (clientCert.issuer.hash.toLowerCase() !== process.env.AZ_VALIDATE_ISSUER_THUMBPRINT) throw new Error('UNAUTHORIZED');
        }
    }
    catch (e) {
        if (e instanceof Error && e.message === 'UNAUTHORIZED') {
            that.fail();
            res.status(401).send();
        } else {
            debug.error('Error during Client Certificate authentication.', e);
            next(e);
        }
    }

    // The cert must exist and be non-empty
    if (!clientCert || Object.getOwnPropertyNames(clientCert).length === 0) {
        that.fail();
    } else {

        var verified = function verified(err, user) {
            if (err) {
                return that.error(err);
            }
            if (!user) {
                return that.fail();
            }
            that.success(user);
        };

        if (this._passReqToCallback) {
            this._verify(req, clientCert, verified);
        } else {
            this._verify(clientCert, verified);
        }
    }
};

exports.Strategy = AzureClientCertStrategy;