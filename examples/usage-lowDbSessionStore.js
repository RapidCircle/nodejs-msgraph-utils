var session = require('express-session');
var express = require('express');

var app = express();

const sessionFile = path.resolve(__dirname, '../data/sessions.json');
const LowDbSessionStore = require('nodejs-msgraph-utils/stores/lowDbSessionStore.js');

// Session middleware
app.use(session({
    secret: 'YouBigSecret',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 365 * 24 * 3600 * 1000   // One year for example
    },
    store: new LowDbSessionStore({ filename: sessionFile })
}));