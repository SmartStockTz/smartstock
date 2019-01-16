#!/usr/bin/env node

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
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
    serverURL: 'http://lb.fahamutech.com/parse',
    liveQuery: {
        classNames: ['stocks', 'sales', 'orders', 'purchaseRefs', 'purchases', 'categories', 'units', 'suppliers']
    }
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/parse', api);

// Initialize a LiveQuery server instance, app is the express app of your Parse Server
let httpServer = require('http').createServer(app);
httpServer.listen(1995);
ParseServer.createLiveQueryServer(httpServer);
