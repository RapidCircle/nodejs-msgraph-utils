/**
 * A session store implementation for Connect & Express backed by an LowDB
 * datastore (either in-memory or file-persisted).
 *
 * For implementation requirements for Express 4.x and above, see:
 *   https://github.com/expressjs/session#session-store-implementation
 */

'use strict';

// Node.js core modules
const path = require('path');
const util = require('util');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// "Constants"
const ONE_DAY = 86400000;
const TWO_WEEKS = 14 * ONE_DAY;


/**
 * Returns a constructor with the specified Connect middleware's Store class as
 * its prototype.
 *
 * @param {Function} connect Connect-compatible session middleware (e.g. Express 3.x, express-session)
 * @api public
 */
module.exports = function (connect) {



    /**
     * Express and/or Connect's session Store
     */
    // connect.Store => Express 5.x/4.x and Connect 3.x with `require('express-session')`
    // connect.session.Store => Express 3.x/2.x and Connect 2.x/1.x  with `express`
    var Store = connect.Store || connect.session.Store;


    /**
     * Create a new session store, backed by an NeDB datastore
     * @constructor
     * @param {Object}   options                        Primarily options to configure the data store
     * @param {String}   options.filename               Relative file path where session data will be persisted; if none, a default of 'data/sessions.json' will be used.
     */
    function LowDbSessionStore(options) {
        var onLoadFn, _this = this;

        if (!(_this instanceof LowDbSessionStore)) {
            return new LowDbSessionStore(options);
        }

        options = options || {};

        // ...and the `filename` option is falsy, provide a default value for the `filename` option
        options.filename = options.filename || path.join('data', 'sessions.json');


        // Ensure some default expiry period (max age) is specified
        _this._defaultExpiry =
            (
                typeof options.defaultExpiry === 'number' &&
                Number.isFinite(options.defaultExpiry) &&
                options.defaultExpiry > 0
            ) ?
                parseInt(options.defaultExpiry, 10) :
                TWO_WEEKS;

        // Apply the base constructor
        Store.call(_this, options);

        // Create the datastore (basically equivalent to an isolated Collection in MongoDB)
        _this.db = low(new FileSync(options.filename));

        _this.db.defaults({
            sessions: {}
        }).write();

    }


    // Inherit from Connect/Express's core session store
    util.inherits(LowDbSessionStore, Store);


    /**
     * Create or update a single session's data
     */
    LowDbSessionStore.prototype.set = function (sessionId, session, callback) {
        // Handle rolling expiration dates
        var expirationDate;
        if (session && session.cookie && session.cookie.expires) {
            expirationDate = new Date(session.cookie.expires);
        }
        else {
            expirationDate = new Date(Date.now() + this._defaultExpiry);
        }

        // Ensure that the Cookie in the `session` is safely serialized
        var sess = {};
        Object.keys(session).forEach(function (key) {
            if (key === 'cookie' && typeof session[key].toJSON === 'function') {
                sess[key] = session[key].toJSON();
            }
            else {
                sess[key] = session[key];
            }
        });

        this.db.set(`sessions.${sessionId}`, { session: sess, expiresAt: expirationDate }).write();
        return callback(null);
    };


    /**
     * Touch a single session's data to update the time of its last access
     */
    LowDbSessionStore.prototype.touch = function (sessionId, session, callback) {
        var touchSetOp = {};

        // Handle rolling expiration dates
        if (session && session.cookie && session.cookie.expires) {
            touchSetOp.expiresAt = new Date(session.cookie.expires);
        }

        // IMPORTANT: NeDB datastores auto-buffer their commands until the database is loaded
        this.db.set(`sessions.${sessionId}.expiresAt`, touchSetOp.expiresAt).write();
        return callback(null);
    };


    /**
     * Get a single session's data
     */
    LowDbSessionStore.prototype.get = function (sessionId, callback) {
        var _this = this;
        let existingDoc = _this.db.get(`sessions.${sessionId}`).value();
        if (existingDoc) {
            // If the existing record does not have an expiration and/or has not yet expired, return it
            console.log(new Date(), existingDoc.expiresAt);
            console.log(new Date() < new Date(existingDoc.expiresAt));
            if (existingDoc.session && !existingDoc.expiresAt || new Date() < new Date(existingDoc.expiresAt)) {
                return callback(null, existingDoc.session);
            }
            // Otherwise it is an expired session, so destroy it!
            else {
                return _this.destroy(
                    sessionId,
                    function (destroyErr) {
                        return callback(destroyErr, null);
                    }
                );
            }
        }
        else {
            return callback(null, null);
        }
    };


    /**
     * Get ALL sessions' data
     */
    LowDbSessionStore.prototype.all = function (callback) {
        var _this = this;

        let existingDocs = this.db('sessions').value();
        let sessions = [];

        for (let _id in existingDocs) {
            let existingDoc = existingDocs[_id];
            if (existingDoc.session && !existingDoc.expiresAt || new Date() < existingDoc.expiresAt) {
                sessions.push(existingDoc.session);
            }
            // Otherwise it is an expired session, so destroy it! ...AND remove it from the result list
            else {
                // NOTE: The following action makes this `filter`-ing callback an impure function as it has side effects (removing stale sessions)!
                _this.destroy(
                    _id,
                    function (destroyErr) {
                        if (destroyErr) {
                            // Give consumers a way to observe these `destroy` failures, if desired
                            _this.emit('error', destroyErr);
                        }
                    }
                );
            }
        }

        return callback(null, sessions);
    };


    /**
     * Count ALL sessions
     */
    LowDbSessionStore.prototype.length = function (callback) {
        this.all(
            function (err, sessions) {
                return callback(err, (sessions || []).length);
            }
        );
    };


    /**
     * Remove a single session
     */
    LowDbSessionStore.prototype.destroy = function (sessionId, callback) {
        this.db.unset(`sessions.${sessionId}`).write();
        return callback(null);
    };


    /**
     * Remove ALL sessions
     */
    LowDbSessionStore.prototype.clear = function (callback) {
        this.db.set(`sessions`, {}).write();
    };


    return LowDbSessionStore;
};
