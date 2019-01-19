#!/usr/bin/env node

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const https = require('https');
const fs = require('fs');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dashOptions = {allowInsecureHTTP: false};
const dashConfig = {
    "apps": [
        {
            "serverURL": "https://lb.fahamutech.com:8443/parse",
            "appId": "ssm",
            "masterKey": "joshua5715"
        }
    ],
    "trustProxy": 1,
    "users": [
        {
            "user": "fahamutech",
            "pass": "joshua5715"
        }
    ],
};
const api = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/ssm',
    appId: 'ssm',
    cloud: __dirname + '/cloud/main.js',
    masterKey: 'joshua5715',
    serverURL: 'http://ssm.fahamutech.com:8443/parse',
    liveQuery: {
        classNames: ['stocks', 'sales', 'orders', 'purchaseRefs', 'purchases', 'categories', 'units', 'suppliers'],
    }
});
const dash = new ParseDashboard(dashConfig, dashOptions);
//app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/parse', api);
app.use('/console', dash);

// Initialize a LiveQuery server instance, app is the express app of your Parse Server
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/lb.fahamutech.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/lb.fahamutech.com/cert.pem')
};

let server1 = https.createServer(options, app).listen(8443);
const parseLiveQueryServer = ParseServer.createLiveQueryServer(server1);
