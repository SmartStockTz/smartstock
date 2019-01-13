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
  // cloud: '/home/fahamu/WebstormProjects/smartstockclient/cloud/main.js',
  masterKey: 'joshua5715',
  serverURL: 'http://localhost:3000/parse',
  liveQuery: {
    classNames: ['stocks', 'sales', 'purchases', 'categories', 'units', 'suppliers']
  }
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/parse', api);

// Initialize a LiveQuery server instance, app is the express app of your Parse Server
let httpServer = require('http').createServer(app);
httpServer.listen(3000);
ParseServer.createLiveQueryServer(httpServer);


/**
 * Event listener for HTTP server "error" event.
 */

// function onError(error) {
//     if (error.syscall !== 'listen') {
//         throw error;
//     }
//
//     const bind = typeof port === 'string'
//         ? 'Pipe ' + port
//         : 'Port ' + port;
//
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//         case 'EACCES':
//             console.error(bind + ' requires elevated privileges');
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(bind + ' is already in use');
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//     const addr = httpServer.address();
//     const bind = typeof addr === 'string'
//         ? 'pipe ' + addr
//         : 'port ' + addr.port;
//     debug('Listening on ' + bind);
// }


// app.listen(1337, function () {
//     console.log('parse server running')
// });

// module.exports = app;
