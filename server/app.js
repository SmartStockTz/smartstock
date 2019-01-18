#!/usr/bin/env node

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/ssm',
  appId: 'ssm',
  cloud: __dirname + '/cloud/main.js',
  masterKey: 'joshua5715',
  serverURL: 'https://lb.fahamutech.com:8443/parse',
  liveQuery: {
    classNames: ['stocks', 'sales', 'orders', 'purchaseRefs', 'purchases', 'categories', 'units', 'suppliers'],
  }
});

//app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/parse', api);

// Initialize a LiveQuery server instance, app is the express app of your Parse Server
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/lb.fahamutech.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/lb.fahamutech.com/cert.pem')
};
// const server = http.createServer(app).listen(1337, value => {
//   console.log('server connected at ---> : ' + 1337);
// });
let server1 = https.createServer(options, app).listen(8443);
const parseLiveQueryServer = ParseServer.createLiveQueryServer(server1);
// ParseServer.createLiveQueryServer(https, {
//     appId: 'ssm',
//     serverURL: 'https://localhost:8443.com/parse',
//     port: 8444
// });
