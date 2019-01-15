const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const ParseDashboard = require('parse-dashboard');

const dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": "http://localhost/parse",
            "appId": "ssm",
            "masterKey": "joshua5715",
        }
    ],
    "users": [
        {
            "user":"lb",
            "pass":"lbserver"
        }
    ],
});


app.use('/', dashboard);

module.exports = app;
