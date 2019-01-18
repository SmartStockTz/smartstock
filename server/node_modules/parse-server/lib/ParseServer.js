"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Options = require("./Options");

var _defaults = _interopRequireDefault(require("./defaults"));

var logging = _interopRequireWildcard(require("./logger"));

var _Config = _interopRequireDefault(require("./Config"));

var _PromiseRouter = _interopRequireDefault(require("./PromiseRouter"));

var _requiredParameter = _interopRequireDefault(require("./requiredParameter"));

var _AnalyticsRouter = require("./Routers/AnalyticsRouter");

var _ClassesRouter = require("./Routers/ClassesRouter");

var _FeaturesRouter = require("./Routers/FeaturesRouter");

var _FilesRouter = require("./Routers/FilesRouter");

var _FunctionsRouter = require("./Routers/FunctionsRouter");

var _GlobalConfigRouter = require("./Routers/GlobalConfigRouter");

var _HooksRouter = require("./Routers/HooksRouter");

var _IAPValidationRouter = require("./Routers/IAPValidationRouter");

var _InstallationsRouter = require("./Routers/InstallationsRouter");

var _LogsRouter = require("./Routers/LogsRouter");

var _ParseLiveQueryServer = require("./LiveQuery/ParseLiveQueryServer");

var _PublicAPIRouter = require("./Routers/PublicAPIRouter");

var _PushRouter = require("./Routers/PushRouter");

var _CloudCodeRouter = require("./Routers/CloudCodeRouter");

var _RolesRouter = require("./Routers/RolesRouter");

var _SchemasRouter = require("./Routers/SchemasRouter");

var _SessionsRouter = require("./Routers/SessionsRouter");

var _UsersRouter = require("./Routers/UsersRouter");

var _PurgeRouter = require("./Routers/PurgeRouter");

var _AudiencesRouter = require("./Routers/AudiencesRouter");

var _AggregateRouter = require("./Routers/AggregateRouter");

var _ParseServerRESTController = require("./ParseServerRESTController");

var controllers = _interopRequireWildcard(require("./Controllers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ParseServer - open-source compatible API Server for Parse apps
var batch = require('./batch'),
    bodyParser = require('body-parser'),
    express = require('express'),
    middlewares = require('./middlewares'),
    Parse = require('parse/node').Parse,
    path = require('path');

// Mutate the Parse object to add the Cloud Code handlers
addParseCloud(); // ParseServer works like a constructor of an express app.
// The args that we understand are:
// "analyticsAdapter": an adapter class for analytics
// "filesAdapter": a class like GridFSBucketAdapter providing create, get,
//                 and delete
// "loggerAdapter": a class like WinstonLoggerAdapter providing info, error,
//                 and query
// "jsonLogs": log as structured JSON objects
// "databaseURI": a uri like mongodb://localhost:27017/dbname to tell us
//          what database this Parse API connects to.
// "cloud": relative location to cloud code to require, or a function
//          that is given an instance of Parse as a parameter.  Use this instance of Parse
//          to register your cloud code hooks and functions.
// "appId": the application id to host
// "masterKey": the master key for requests to this app
// "collectionPrefix": optional prefix for database collection names
// "fileKey": optional key from Parse dashboard for supporting older files
//            hosted by Parse
// "clientKey": optional key from Parse dashboard
// "dotNetKey": optional key from Parse dashboard
// "restAPIKey": optional key from Parse dashboard
// "webhookKey": optional key from Parse dashboard
// "javascriptKey": optional key from Parse dashboard
// "push": optional key from configure push
// "sessionLength": optional length in seconds for how long Sessions should be valid for
// "maxLimit": optional upper bound for what can be specified for the 'limit' parameter on queries

class ParseServer {
  /**
   * @constructor
   * @param {ParseServerOptions} options the parse server initialization options
   */
  constructor(options) {
    injectDefaults(options);
    const {
      appId = (0, _requiredParameter.default)('You must provide an appId!'),
      masterKey = (0, _requiredParameter.default)('You must provide a masterKey!'),
      cloud,
      javascriptKey,
      serverURL = (0, _requiredParameter.default)('You must provide a serverURL!'),
      __indexBuildCompletionCallbackForTests = () => {}
    } = options; // Initialize the node client SDK automatically

    Parse.initialize(appId, javascriptKey || 'unused', masterKey);
    Parse.serverURL = serverURL;
    const allControllers = controllers.getControllers(options);
    const {
      loggerController,
      databaseController,
      hooksController
    } = allControllers;
    this.config = _Config.default.put(Object.assign({}, options, allControllers));
    logging.setLogger(loggerController);
    const dbInitPromise = databaseController.performInitialization();
    hooksController.load(); // Note: Tests will start to fail if any validation happens after this is called.

    if (process.env.TESTING) {
      __indexBuildCompletionCallbackForTests(dbInitPromise);
    }

    if (cloud) {
      addParseCloud();

      if (typeof cloud === 'function') {
        cloud(Parse);
      } else if (typeof cloud === 'string') {
        require(path.resolve(process.cwd(), cloud));
      } else {
        throw "argument 'cloud' must either be a string or a function";
      }
    }
  }

  get app() {
    if (!this._app) {
      this._app = ParseServer.app(this.config);
    }

    return this._app;
  }

  handleShutdown() {
    const {
      adapter
    } = this.config.databaseController;

    if (adapter && typeof adapter.handleShutdown === 'function') {
      adapter.handleShutdown();
    }
  }
  /**
   * @static
   * Create an express app for the parse server
   * @param {Object} options let you specify the maxUploadSize when creating the express app  */


  static app({
    maxUploadSize = '20mb',
    appId
  }) {
    // This app serves the Parse API directly.
    // It's the equivalent of https://api.parse.com/1 in the hosted Parse API.
    var api = express(); //api.use("/apps", express.static(__dirname + "/public"));
    // File handling needs to be before default middlewares are applied

    api.use('/', middlewares.allowCrossDomain, new _FilesRouter.FilesRouter().expressRouter({
      maxUploadSize: maxUploadSize
    }));
    api.use('/health', function (req, res) {
      res.json({
        status: 'ok'
      });
    });
    api.use('/', bodyParser.urlencoded({
      extended: false
    }), new _PublicAPIRouter.PublicAPIRouter().expressRouter());
    api.use(bodyParser.json({
      type: '*/*',
      limit: maxUploadSize
    }));
    api.use(middlewares.allowCrossDomain);
    api.use(middlewares.allowMethodOverride);
    api.use(middlewares.handleParseHeaders);
    const appRouter = ParseServer.promiseRouter({
      appId
    });
    api.use(appRouter.expressRouter());
    api.use(middlewares.handleParseErrors); // run the following when not testing

    if (!process.env.TESTING) {
      //This causes tests to spew some useless warnings, so disable in test

      /* istanbul ignore next */
      process.on('uncaughtException', err => {
        if (err.code === 'EADDRINUSE') {
          // user-friendly message for this common error
          process.stderr.write(`Unable to listen on port ${err.port}. The port is already in use.`);
          process.exit(0);
        } else {
          throw err;
        }
      }); // verify the server url after a 'mount' event is received

      /* istanbul ignore next */

      api.on('mount', function () {
        ParseServer.verifyServerUrl();
      });
    }

    if (process.env.PARSE_SERVER_ENABLE_EXPERIMENTAL_DIRECT_ACCESS === '1') {
      Parse.CoreManager.setRESTController((0, _ParseServerRESTController.ParseServerRESTController)(appId, appRouter));
    }

    return api;
  }

  static promiseRouter({
    appId
  }) {
    const routers = [new _ClassesRouter.ClassesRouter(), new _UsersRouter.UsersRouter(), new _SessionsRouter.SessionsRouter(), new _RolesRouter.RolesRouter(), new _AnalyticsRouter.AnalyticsRouter(), new _InstallationsRouter.InstallationsRouter(), new _FunctionsRouter.FunctionsRouter(), new _SchemasRouter.SchemasRouter(), new _PushRouter.PushRouter(), new _LogsRouter.LogsRouter(), new _IAPValidationRouter.IAPValidationRouter(), new _FeaturesRouter.FeaturesRouter(), new _GlobalConfigRouter.GlobalConfigRouter(), new _PurgeRouter.PurgeRouter(), new _HooksRouter.HooksRouter(), new _CloudCodeRouter.CloudCodeRouter(), new _AudiencesRouter.AudiencesRouter(), new _AggregateRouter.AggregateRouter()];
    const routes = routers.reduce((memo, router) => {
      return memo.concat(router.routes);
    }, []);
    const appRouter = new _PromiseRouter.default(routes, appId);
    batch.mountOnto(appRouter);
    return appRouter;
  }
  /**
   * starts the parse server's express app
   * @param {ParseServerOptions} options to use to start the server
   * @param {Function} callback called when the server has started
   * @returns {ParseServer} the parse server instance
   */


  start(options, callback) {
    const app = express();

    if (options.middleware) {
      let middleware;

      if (typeof options.middleware == 'string') {
        middleware = require(path.resolve(process.cwd(), options.middleware));
      } else {
        middleware = options.middleware; // use as-is let express fail
      }

      app.use(middleware);
    }

    app.use(options.mountPath, this.app);
    const server = app.listen(options.port, options.host, callback);
    this.server = server;

    if (options.startLiveQueryServer || options.liveQueryServerOptions) {
      this.liveQueryServer = ParseServer.createLiveQueryServer(server, options.liveQueryServerOptions);
    }
    /* istanbul ignore next */


    if (!process.env.TESTING) {
      configureListeners(this);
    }

    this.expressApp = app;
    return this;
  }
  /**
   * Creates a new ParseServer and starts it.
   * @param {ParseServerOptions} options used to start the server
   * @param {Function} callback called when the server has started
   * @returns {ParseServer} the parse server instance
   */


  static start(options, callback) {
    const parseServer = new ParseServer(options);
    return parseServer.start(options, callback);
  }
  /**
   * Helper method to create a liveQuery server
   * @static
   * @param {Server} httpServer an optional http server to pass
   * @param {LiveQueryServerOptions} config options fot he liveQueryServer
   * @returns {ParseLiveQueryServer} the live query server instance
   */


  static createLiveQueryServer(httpServer, config) {
    if (!httpServer || config && config.port) {
      var app = express();
      httpServer = require('http').createServer(app);
      httpServer.listen(config.port);
    }

    return new _ParseLiveQueryServer.ParseLiveQueryServer(httpServer, config);
  }

  static verifyServerUrl(callback) {
    // perform a health check on the serverURL value
    if (Parse.serverURL) {
      const request = require('./request');

      request({
        url: Parse.serverURL.replace(/\/$/, '') + '/health'
      }).catch(response => response).then(response => {
        const json = response.data || null;

        if (response.status !== 200 || !json || json && json.status !== 'ok') {
          /* eslint-disable no-console */
          console.warn(`\nWARNING, Unable to connect to '${Parse.serverURL}'.` + ` Cloud code and push notifications may be unavailable!\n`);
          /* eslint-enable no-console */

          if (callback) {
            callback(false);
          }
        } else {
          if (callback) {
            callback(true);
          }
        }
      });
    }
  }

}

function addParseCloud() {
  const ParseCloud = require('./cloud-code/Parse.Cloud');

  Object.assign(Parse.Cloud, ParseCloud);
  global.Parse = Parse;
}

function injectDefaults(options) {
  Object.keys(_defaults.default).forEach(key => {
    if (!options.hasOwnProperty(key)) {
      options[key] = _defaults.default[key];
    }
  });

  if (!options.hasOwnProperty('serverURL')) {
    options.serverURL = `http://localhost:${options.port}${options.mountPath}`;
  }

  options.userSensitiveFields = Array.from(new Set(options.userSensitiveFields.concat(_defaults.default.userSensitiveFields, options.userSensitiveFields)));
  options.masterKeyIps = Array.from(new Set(options.masterKeyIps.concat(_defaults.default.masterKeyIps, options.masterKeyIps)));
} // Those can't be tested as it requires a subprocess

/* istanbul ignore next */


function configureListeners(parseServer) {
  const server = parseServer.server;
  const sockets = {};
  /* Currently, express doesn't shut down immediately after receiving SIGINT/SIGTERM if it has client connections that haven't timed out. (This is a known issue with node - https://github.com/nodejs/node/issues/2642)
    This function, along with `destroyAliveConnections()`, intend to fix this behavior such that parse server will close all open connections and initiate the shutdown process as soon as it receives a SIGINT/SIGTERM signal. */

  server.on('connection', socket => {
    const socketId = socket.remoteAddress + ':' + socket.remotePort;
    sockets[socketId] = socket;
    socket.on('close', () => {
      delete sockets[socketId];
    });
  });

  const destroyAliveConnections = function () {
    for (const socketId in sockets) {
      try {
        sockets[socketId].destroy();
      } catch (e) {
        /* */
      }
    }
  };

  const handleShutdown = function () {
    process.stdout.write('Termination signal received. Shutting down.');
    destroyAliveConnections();
    server.close();
    parseServer.handleShutdown();
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

var _default = ParseServer;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QYXJzZVNlcnZlci5qcyJdLCJuYW1lcyI6WyJiYXRjaCIsInJlcXVpcmUiLCJib2R5UGFyc2VyIiwiZXhwcmVzcyIsIm1pZGRsZXdhcmVzIiwiUGFyc2UiLCJwYXRoIiwiYWRkUGFyc2VDbG91ZCIsIlBhcnNlU2VydmVyIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiaW5qZWN0RGVmYXVsdHMiLCJhcHBJZCIsIm1hc3RlcktleSIsImNsb3VkIiwiamF2YXNjcmlwdEtleSIsInNlcnZlclVSTCIsIl9faW5kZXhCdWlsZENvbXBsZXRpb25DYWxsYmFja0ZvclRlc3RzIiwiaW5pdGlhbGl6ZSIsImFsbENvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJnZXRDb250cm9sbGVycyIsImxvZ2dlckNvbnRyb2xsZXIiLCJkYXRhYmFzZUNvbnRyb2xsZXIiLCJob29rc0NvbnRyb2xsZXIiLCJjb25maWciLCJDb25maWciLCJwdXQiLCJPYmplY3QiLCJhc3NpZ24iLCJsb2dnaW5nIiwic2V0TG9nZ2VyIiwiZGJJbml0UHJvbWlzZSIsInBlcmZvcm1Jbml0aWFsaXphdGlvbiIsImxvYWQiLCJwcm9jZXNzIiwiZW52IiwiVEVTVElORyIsInJlc29sdmUiLCJjd2QiLCJhcHAiLCJfYXBwIiwiaGFuZGxlU2h1dGRvd24iLCJhZGFwdGVyIiwibWF4VXBsb2FkU2l6ZSIsImFwaSIsInVzZSIsImFsbG93Q3Jvc3NEb21haW4iLCJGaWxlc1JvdXRlciIsImV4cHJlc3NSb3V0ZXIiLCJyZXEiLCJyZXMiLCJqc29uIiwic3RhdHVzIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwiUHVibGljQVBJUm91dGVyIiwidHlwZSIsImxpbWl0IiwiYWxsb3dNZXRob2RPdmVycmlkZSIsImhhbmRsZVBhcnNlSGVhZGVycyIsImFwcFJvdXRlciIsInByb21pc2VSb3V0ZXIiLCJoYW5kbGVQYXJzZUVycm9ycyIsIm9uIiwiZXJyIiwiY29kZSIsInN0ZGVyciIsIndyaXRlIiwicG9ydCIsImV4aXQiLCJ2ZXJpZnlTZXJ2ZXJVcmwiLCJQQVJTRV9TRVJWRVJfRU5BQkxFX0VYUEVSSU1FTlRBTF9ESVJFQ1RfQUNDRVNTIiwiQ29yZU1hbmFnZXIiLCJzZXRSRVNUQ29udHJvbGxlciIsInJvdXRlcnMiLCJDbGFzc2VzUm91dGVyIiwiVXNlcnNSb3V0ZXIiLCJTZXNzaW9uc1JvdXRlciIsIlJvbGVzUm91dGVyIiwiQW5hbHl0aWNzUm91dGVyIiwiSW5zdGFsbGF0aW9uc1JvdXRlciIsIkZ1bmN0aW9uc1JvdXRlciIsIlNjaGVtYXNSb3V0ZXIiLCJQdXNoUm91dGVyIiwiTG9nc1JvdXRlciIsIklBUFZhbGlkYXRpb25Sb3V0ZXIiLCJGZWF0dXJlc1JvdXRlciIsIkdsb2JhbENvbmZpZ1JvdXRlciIsIlB1cmdlUm91dGVyIiwiSG9va3NSb3V0ZXIiLCJDbG91ZENvZGVSb3V0ZXIiLCJBdWRpZW5jZXNSb3V0ZXIiLCJBZ2dyZWdhdGVSb3V0ZXIiLCJyb3V0ZXMiLCJyZWR1Y2UiLCJtZW1vIiwicm91dGVyIiwiY29uY2F0IiwiUHJvbWlzZVJvdXRlciIsIm1vdW50T250byIsInN0YXJ0IiwiY2FsbGJhY2siLCJtaWRkbGV3YXJlIiwibW91bnRQYXRoIiwic2VydmVyIiwibGlzdGVuIiwiaG9zdCIsInN0YXJ0TGl2ZVF1ZXJ5U2VydmVyIiwibGl2ZVF1ZXJ5U2VydmVyT3B0aW9ucyIsImxpdmVRdWVyeVNlcnZlciIsImNyZWF0ZUxpdmVRdWVyeVNlcnZlciIsImNvbmZpZ3VyZUxpc3RlbmVycyIsImV4cHJlc3NBcHAiLCJwYXJzZVNlcnZlciIsImh0dHBTZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJQYXJzZUxpdmVRdWVyeVNlcnZlciIsInJlcXVlc3QiLCJ1cmwiLCJyZXBsYWNlIiwiY2F0Y2giLCJyZXNwb25zZSIsInRoZW4iLCJkYXRhIiwiY29uc29sZSIsIndhcm4iLCJQYXJzZUNsb3VkIiwiQ2xvdWQiLCJnbG9iYWwiLCJrZXlzIiwiZGVmYXVsdHMiLCJmb3JFYWNoIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJ1c2VyU2Vuc2l0aXZlRmllbGRzIiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwibWFzdGVyS2V5SXBzIiwic29ja2V0cyIsInNvY2tldCIsInNvY2tldElkIiwicmVtb3RlQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJkZXN0cm95QWxpdmVDb25uZWN0aW9ucyIsImRlc3Ryb3kiLCJlIiwic3Rkb3V0IiwiY2xvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFTQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBdENBO0FBRUEsSUFBSUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFuQjtBQUFBLElBQ0VDLFVBQVUsR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FEdEI7QUFBQSxJQUVFRSxPQUFPLEdBQUdGLE9BQU8sQ0FBQyxTQUFELENBRm5CO0FBQUEsSUFHRUcsV0FBVyxHQUFHSCxPQUFPLENBQUMsZUFBRCxDQUh2QjtBQUFBLElBSUVJLEtBQUssR0FBR0osT0FBTyxDQUFDLFlBQUQsQ0FBUCxDQUFzQkksS0FKaEM7QUFBQSxJQUtFQyxJQUFJLEdBQUdMLE9BQU8sQ0FBQyxNQUFELENBTGhCOztBQXFDQTtBQUNBTSxhQUFhLEcsQ0FFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1DLFdBQU4sQ0FBa0I7QUFDaEI7Ozs7QUFJQUMsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQThCO0FBQ3ZDQyxJQUFBQSxjQUFjLENBQUNELE9B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RUFuQyxFQUFBQSxNQUFNLENBQUN6QyxFQUFQLENBQVUsWUFBVixFQUF3QjZFLE1BQU0sSUFBSTtBQUNoQyxVQUFNQyxRQUFRLEdBQUdELE1BQU0sQ0FBQ0UsYUFBUCxHQUF1QixHQUF2QixHQUE2QkYsTUFBTSxDQUFDRyxVQUFyRDtBQUNBSixJQUFBQSxPQUFPLENBQUNFLFFBQUQsQ0FBUCxHQUFvQkQsTUFBcEI7QUFDQUEsSUFBQUEsTUFBTSxDQUFDN0UsRUFBUCxDQUFVLE9BQVYsRUFBbUIsTUFBTTtBQUN2QixhQUFPNEUsT0FBTyxDQUFDRSxRQUFELENBQWQ7QUFDRCxLQUZEO0FBR0QsR0FORDs7QUFRQSxRQUFNRyx1QkFBdUIsR0FBRyxZQUFXO0FBQ3pDLFNBQUssTUFBTUgsUUFBWCxJQUF1QkYsT0FBdkIsRUFBZ0M7QUFDOUIsVUFBSTtBQUNGQSxRQUFBQSxPQUFPLENBQUNFLFFBQUQsQ0FBUCxDQUFrQkksT0FBbEI7QUFDRCxPQUZELENBRUUsT0FBT0MsQ0FBUCxFQUFVO0FBQ1Y7QUFDRDtBQUNGO0FBQ0YsR0FSRDs7QUFVQSxRQUFNekcsY0FBYyxHQUFHLFlBQVc7QUFDaENQLElBQUFBLE9BQU8sQ0FBQ2lILE1BQVIsQ0FBZWhGLEtBQWYsQ0FBcUIsNkNBQXJCO0FBQ0E2RSxJQUFBQSx1QkFBdUI7QUFDdkJ4QyxJQUFBQSxNQUFNLENBQUM0QyxLQUFQO0FBQ0FuQyxJQUFBQSxXQUFXLENBQUN4RSxjQUFaO0FBQ0QsR0FMRDs7QUFNQVAsRUFBQUEsT0FBTyxDQUFDNkIsRUFBUixDQUFXLFNBQVgsRUFBc0J0QixjQUF0QjtBQUNBUCxFQUFBQSxPQUFPLENBQUM2QixFQUFSLENBQVcsUUFBWCxFQUFxQnRCLGNBQXJCO0FBQ0Q7O2VBRWNsQyxXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUGFyc2VTZXJ2ZXIgLSBvcGVuLXNvdXJjZSBjb21wYXRpYmxlIEFQSSBTZXJ2ZXIgZm9yIFBhcnNlIGFwcHNcblxudmFyIGJhdGNoID0gcmVxdWlyZSgnLi9iYXRjaCcpLFxuICBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKSxcbiAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKSxcbiAgbWlkZGxld2FyZXMgPSByZXF1aXJlKCcuL21pZGRsZXdhcmVzJyksXG4gIFBhcnNlID0gcmVxdWlyZSgncGFyc2Uvbm9kZScpLlBhcnNlLFxuICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5pbXBvcnQgeyBQYXJzZVNlcnZlck9wdGlvbnMsIExpdmVRdWVyeVNlcnZlck9wdGlvbnMgfSBmcm9tICcuL09wdGlvbnMnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgbG9nZ2luZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vQ29uZmlnJztcbmltcG9ydCBQcm9taXNlUm91dGVyIGZyb20gJy4vUHJvbWlzZVJvdXRlcic7XG5pbXBvcnQgcmVxdWlyZWRQYXJhbWV0ZXIgZnJvbSAnLi9yZXF1aXJlZFBhcmFtZXRlcic7XG5pbXBvcnQgeyBBbmFseXRpY3NSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvQW5hbHl0aWNzUm91dGVyJztcbmltcG9ydCB7IENsYXNzZXNSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvQ2xhc3Nlc1JvdXRlcic7XG5pbXBvcnQgeyBGZWF0dXJlc1JvdXRlciB9IGZyb20gJy4vUm91dGVycy9GZWF0dXJlc1JvdXRlcic7XG5pbXBvcnQgeyBGaWxlc1JvdXRlciB9IGZyb20gJy4vUm91dGVycy9GaWxlc1JvdXRlcic7XG5pbXBvcnQgeyBGdW5jdGlvbnNSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvRnVuY3Rpb25zUm91dGVyJztcbmltcG9ydCB7IEdsb2JhbENvbmZpZ1JvdXRlciB9IGZyb20gJy4vUm91dGVycy9HbG9iYWxDb25maWdSb3V0ZXInO1xuaW1wb3J0IHsgSG9va3NSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvSG9va3NSb3V0ZXInO1xuaW1wb3J0IHsgSUFQVmFsaWRhdGlvblJvdXRlciB9IGZyb20gJy4vUm91dGVycy9JQVBWYWxpZGF0aW9uUm91dGVyJztcbmltcG9ydCB7IEluc3RhbGxhdGlvbnNSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvSW5zdGFsbGF0aW9uc1JvdXRlcic7XG5pbXBvcnQgeyBMb2dzUm91dGVyIH0gZnJvbSAnLi9Sb3V0ZXJzL0xvZ3NSb3V0ZXInO1xuaW1wb3J0IHsgUGFyc2VMaXZlUXVlcnlTZXJ2ZXIgfSBmcm9tICcuL0xpdmVRdWVyeS9QYXJzZUxpdmVRdWVyeVNlcnZlcic7XG5pbXBvcnQgeyBQdWJsaWNBUElSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvUHVibGljQVBJUm91dGVyJztcbmltcG9ydCB7IFB1c2hSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvUHVzaFJvdXRlcic7XG5pbXBvcnQgeyBDbG91ZENvZGVSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvQ2xvdWRDb2RlUm91dGVyJztcbmltcG9ydCB7IFJvbGVzUm91dGVyIH0gZnJvbSAnLi9Sb3V0ZXJzL1JvbGVzUm91dGVyJztcbmltcG9ydCB7IFNjaGVtYXNSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvU2NoZW1hc1JvdXRlcic7XG5pbXBvcnQgeyBTZXNzaW9uc1JvdXRlciB9IGZyb20gJy4vUm91dGVycy9TZXNzaW9uc1JvdXRlcic7XG5pbXBvcnQgeyBVc2Vyc1JvdXRlciB9IGZyb20gJy4vUm91dGVycy9Vc2Vyc1JvdXRlcic7XG5pbXBvcnQgeyBQdXJnZVJvdXRlciB9IGZyb20gJy4vUm91dGVycy9QdXJnZVJvdXRlcic7XG5pbXBvcnQgeyBBdWRpZW5jZXNSb3V0ZXIgfSBmcm9tICcuL1JvdXRlcnMvQXVkaWVuY2VzUm91dGVyJztcbmltcG9ydCB7IEFnZ3JlZ2F0ZVJvdXRlciB9IGZyb20gJy4vUm91dGVycy9BZ2dyZWdhdGVSb3V0ZXInO1xuXG5pbXBvcnQgeyBQYXJzZVNlcnZlclJFU1RDb250cm9sbGVyIH0gZnJvbSAnLi9QYXJzZVNlcnZlclJFU1RDb250cm9sbGVyJztcbmltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJy4vQ29udHJvbGxlcnMnO1xuLy8gTXV0YXRlIHRoZSBQYXJzZSBvYmplY3QgdG8gYWRkIHRoZSBDbG91ZCBDb2RlIGhhbmRsZXJzXG5hZGRQYXJzZUNsb3VkKCk7XG5cbi8vIFBhcnNlU2VydmVyIHdvcmtzIGxpa2UgYSBjb25zdHJ1Y3RvciBvZiBhbiBleHByZXNzIGFwcC5cbi8vIFRoZSBhcmdzIHRoYXQgd2UgdW5kZXJzdGFuZCBhcmU6XG4vLyBcImFuYWx5dGljc0FkYXB0ZXJcIjogYW4gYWRhcHRlciBjbGFzcyBmb3IgYW5hbHl0aWNzXG4vLyBcImZpbGVzQWRhcHRlclwiOiBhIGNsYXNzIGxpa2UgR3JpZEZTQnVja2V0QWRhcHRlciBwcm92aWRpbmcgY3JlYXRlLCBnZXQsXG4vLyAgICAgICAgICAgICAgICAgYW5kIGRlbGV0ZVxuLy8gXCJsb2dnZXJBZGFwdGVyXCI6IGEgY2xhc3MgbGlrZSBXaW5zdG9uTG9nZ2VyQWRhcHRlciBwcm92aWRpbmcgaW5mbywgZXJyb3IsXG4vLyAgICAgICAgICAgICAgICAgYW5kIHF1ZXJ5XG4vLyBcImpzb25Mb2dzXCI6IGxvZyBhcyBzdHJ1Y3R1cmVkIEpTT04gb2JqZWN0c1xuLy8gXCJkYXRhYmFzZVVSSVwiOiBhIHVyaSBsaWtlIG1vbmdvZGI6Ly9sb2NhbGhvc3Q6MjcwMTcvZGJuYW1lIHRvIHRlbGwgdXNcbi8vICAgICAgICAgIHdoYXQgZGF0YWJhc2UgdGhpcyBQYXJzZSBBUEkgY29ubmVjdHMgdG8uXG4vLyBcImNsb3VkXCI6IHJlbGF0aXZlIGxvY2F0aW9uIHRvIGNsb3VkIGNvZGUgdG8gcmVxdWlyZSwgb3IgYSBmdW5jdGlvblxuLy8gICAgICAgICAgdGhhdCBpcyBnaXZlbiBhbiBpbnN0YW5jZSBvZiBQYXJzZSBhcyBhIHBhcmFtZXRlci4gIFVzZSB0aGlzIGluc3RhbmNlIG9mIFBhcnNlXG4vLyAgICAgICAgICB0byByZWdpc3RlciB5b3VyIGNsb3VkIGNvZGUgaG9va3MgYW5kIGZ1bmN0aW9ucy5cbi8vIFwiYXBwSWRcIjogdGhlIGFwcGxpY2F0aW9uIGlkIHRvIGhvc3Rcbi8vIFwibWFzdGVyS2V5XCI6IHRoZSBtYXN0ZXIga2V5IGZvciByZXF1ZXN0cyB0byB0aGlzIGFwcFxuLy8gXCJjb2xsZWN0aW9uUHJlZml4XCI6IG9wdGlvbmFsIHByZWZpeCBmb3IgZGF0YWJhc2UgY29sbGVjdGlvbiBuYW1lc1xuLy8gXCJmaWxlS2V5XCI6IG9wdGlvbmFsIGtleSBmcm9tIFBhcnNlIGRhc2hib2FyZCBmb3Igc3VwcG9ydGluZyBvbGRlciBmaWxlc1xuLy8gICAgICAgICAgICBob3N0ZWQgYnkgUGFyc2Vcbi8vIFwiY2xpZW50S2V5XCI6IG9wdGlvbmFsIGtleSBmcm9tIFBhcnNlIGRhc2hib2FyZFxuLy8gXCJkb3ROZXRLZXlcIjogb3B0aW9uYWwga2V5IGZyb20gUGFyc2UgZGFzaGJvYXJkXG4vLyBcInJlc3RBUElLZXlcIjogb3B0aW9uYWwga2V5IGZyb20gUGFyc2UgZGFzaGJvYXJkXG4vLyBcIndlYmhvb2tLZXlcIjogb3B0aW9uYWwga2V5IGZyb20gUGFyc2UgZGFzaGJvYXJkXG4vLyBcImphdmFzY3JpcHRLZXlcIjogb3B0aW9uYWwga2V5IGZyb20gUGFyc2UgZGFzaGJvYXJkXG4vLyBcInB1c2hcIjogb3B0aW9uYWwga2V5IGZyb20gY29uZmlndXJlIHB1c2hcbi8vIFwic2Vzc2lvbkxlbmd0aFwiOiBvcHRpb25hbCBsZW5ndGggaW4gc2Vjb25kcyBmb3IgaG93IGxvbmcgU2Vzc2lvbnMgc2hvdWxkIGJlIHZhbGlkIGZvclxuLy8gXCJtYXhMaW1pdFwiOiBvcHRpb25hbCB1cHBlciBib3VuZCBmb3Igd2hhdCBjYW4gYmUgc3BlY2lmaWVkIGZvciB0aGUgJ2xpbWl0JyBwYXJhbWV0ZXIgb24gcXVlcmllc1xuXG5jbGFzcyBQYXJzZVNlcnZlciB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtQYXJzZVNlcnZlck9wdGlvbnN9IG9wdGlvbnMgdGhlIHBhcnNlIHNlcnZlciBpbml0aWFsaXphdGlvbiBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQYXJzZVNlcnZlck9wdGlvbnMpIHtcbiAgICBpbmplY3REZWZhdWx0cyhvcHRpb25zKTtcbiAgICBjb25zdCB7XG4gICAgICBhcHBJZCA9IHJlcXVpcmVkUGFyYW1ldGVyKCdZb3UgbXVzdCBwcm92aWRlIGFuIGFwcElkIScpLFxuICAgICAgbWFzdGVyS2V5ID0gcmVxdWlyZWRQYXJhbWV0ZXIoJ1lvdSBtdXN0IHByb3ZpZGUgYSBtYXN0ZXJLZXkhJyksXG4gICAgICBjbG91ZCxcbiAgICAgIGphdmFzY3JpcHRLZXksXG4gICAgICBzZXJ2ZXJVUkwgPSByZXF1aXJlZFBhcmFtZXRlcignWW91IG11c3QgcHJvdmlkZSBhIHNlcnZlclVSTCEnKSxcbiAgICAgIF9faW5kZXhCdWlsZENvbXBsZXRpb25DYWxsYmFja0ZvclRlc3RzID0gKCkgPT4ge30sXG4gICAgfSA9IG9wdGlvbnM7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgbm9kZSBjbGllbnQgU0RLIGF1dG9tYXRpY2FsbHlcbiAgICBQYXJzZS5pbml0aWFsaXplKGFwcElkLCBqYXZhc2NyaXB0S2V5IHx8ICd1bnVzZWQnLCBtYXN0ZXJLZXkpO1xuICAgIFBhcnNlLnNlcnZlclVSTCA9IHNlcnZlclVSTDtcblxuICAgIGNvbnN0IGFsbENvbnRyb2xsZXJzID0gY29udHJvbGxlcnMuZ2V0Q29udHJvbGxlcnMob3B0aW9ucyk7XG5cbiAgICBjb25zdCB7XG4gICAgICBsb2dnZXJDb250cm9sbGVyLFxuICAgICAgZGF0YWJhc2VDb250cm9sbGVyLFxuICAgICAgaG9va3NDb250cm9sbGVyLFxuICAgIH0gPSBhbGxDb250cm9sbGVycztcbiAgICB0aGlzLmNvbmZpZyA9IENvbmZpZy5wdXQoT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgYWxsQ29udHJvbGxlcnMpKTtcblxuICAgIGxvZ2dpbmcuc2V0TG9nZ2VyKGxvZ2dlckNvbnRyb2xsZXIpO1xuICAgIGNvbnN0IGRiSW5pdFByb21pc2UgPSBkYXRhYmFzZUNvbnRyb2xsZXIucGVyZm9ybUluaXRpYWxpemF0aW9uKCk7XG4gICAgaG9va3NDb250cm9sbGVyLmxvYWQoKTtcblxuICAgIC8vIE5vdGU6IFRlc3RzIHdpbGwgc3RhcnQgdG8gZmFpbCBpZiBhbnkgdmFsaWRhdGlvbiBoYXBwZW5zIGFmdGVyIHRoaXMgaXMgY2FsbGVkLlxuICAgIGlmIChwcm9jZXNzLmVudi5URVNUSU5HKSB7XG4gICAgICBfX2luZGV4QnVpbGRDb21wbGV0aW9uQ2FsbGJhY2tGb3JUZXN0cyhkYkluaXRQcm9taXNlKTtcbiAgICB9XG5cbiAgICBpZiAoY2xvdWQpIHtcbiAgICAgIGFkZFBhcnNlQ2xvdWQoKTtcbiAgICAgIGlmICh0eXBlb2YgY2xvdWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2xvdWQoUGFyc2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2xvdWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcXVpcmUocGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGNsb3VkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcImFyZ3VtZW50ICdjbG91ZCcgbXVzdCBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgYSBmdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBhcHAoKSB7XG4gICAgaWYgKCF0aGlzLl9hcHApIHtcbiAgICAgIHRoaXMuX2FwcCA9IFBhcnNlU2VydmVyLmFwcCh0aGlzLmNvbmZpZyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hcHA7XG4gIH1cblxuICBoYW5kbGVTaHV0ZG93bigpIHtcbiAgICBjb25zdCB7IGFkYXB0ZXIgfSA9IHRoaXMuY29uZmlnLmRhdGFiYXNlQ29udHJvbGxlcjtcbiAgICBpZiAoYWRhcHRlciAmJiB0eXBlb2YgYWRhcHRlci5oYW5kbGVTaHV0ZG93biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYWRhcHRlci5oYW5kbGVTaHV0ZG93bigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAc3RhdGljXG4gICAqIENyZWF0ZSBhbiBleHByZXNzIGFwcCBmb3IgdGhlIHBhcnNlIHNlcnZlclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBsZXQgeW91IHNwZWNpZnkgdGhlIG1heFVwbG9hZFNpemUgd2hlbiBjcmVhdGluZyB0aGUgZXhwcmVzcyBhcHAgICovXG4gIHN0YXRpYyBhcHAoeyBtYXhVcGxvYWRTaXplID0gJzIwbWInLCBhcHBJZCB9KSB7XG4gICAgLy8gVGhpcyBhcHAgc2VydmVzIHRoZSBQYXJzZSBBUEkgZGlyZWN0bHkuXG4gICAgLy8gSXQncyB0aGUgZXF1aXZhbGVudCBvZiBodHRwczovL2FwaS5wYXJzZS5jb20vMSBpbiB0aGUgaG9zdGVkIFBhcnNlIEFQSS5cbiAgICB2YXIgYXBpID0gZXhwcmVzcygpO1xuICAgIC8vYXBpLnVzZShcIi9hcHBzXCIsIGV4cHJlc3Muc3RhdGljKF9fZGlybmFtZSArIFwiL3B1YmxpY1wiKSk7XG4gICAgLy8gRmlsZSBoYW5kbGluZyBuZWVkcyB0byBiZSBiZWZvcmUgZGVmYXVsdCBtaWRkbGV3YXJlcyBhcmUgYXBwbGllZFxuICAgIGFwaS51c2UoXG4gICAgICAnLycsXG4gICAgICBtaWRkbGV3YXJlcy5hbGxvd0Nyb3NzRG9tYWluLFxuICAgICAgbmV3IEZpbGVzUm91dGVyKCkuZXhwcmVzc1JvdXRlcih7XG4gICAgICAgIG1heFVwbG9hZFNpemU6IG1heFVwbG9hZFNpemUsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBhcGkudXNlKCcvaGVhbHRoJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgc3RhdHVzOiAnb2snLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhcGkudXNlKFxuICAgICAgJy8nLFxuICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pLFxuICAgICAgbmV3IFB1YmxpY0FQSVJvdXRlcigpLmV4cHJlc3NSb3V0ZXIoKVxuICAgICk7XG5cbiAgICBhcGkudXNlKGJvZHlQYXJzZXIuanNvbih7IHR5cGU6ICcqLyonLCBsaW1pdDogbWF4VXBsb2FkU2l6ZSB9KSk7XG4gICAgYXBpLnVzZShtaWRkbGV3YXJlcy5hbGxvd0Nyb3NzRG9tYWluKTtcbiAgICBhcGkudXNlKG1pZGRsZXdhcmVzLmFsbG93TWV0aG9kT3ZlcnJpZGUpO1xuICAgIGFwaS51c2UobWlkZGxld2FyZXMuaGFuZGxlUGFyc2VIZWFkZXJzKTtcblxuICAgIGNvbnN0IGFwcFJvdXRlciA9IFBhcnNlU2VydmVyLnByb21pc2VSb3V0ZXIoeyBhcHBJZCB9KTtcbiAgICBhcGkudXNlKGFwcFJvdXRlci5leHByZXNzUm91dGVyKCkpO1xuXG4gICAgYXBpLnVzZShtaWRkbGV3YXJlcy5oYW5kbGVQYXJzZUVycm9ycyk7XG5cbiAgICAvLyBydW4gdGhlIGZvbGxvd2luZyB3aGVuIG5vdCB0ZXN0aW5nXG4gICAgaWYgKCFwcm9jZXNzLmVudi5URVNUSU5HKSB7XG4gICAgICAvL1RoaXMgY2F1c2VzIHRlc3RzIHRvIHNwZXcgc29tZSB1c2VsZXNzIHdhcm5pbmdzLCBzbyBkaXNhYmxlIGluIHRlc3RcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VBRERSSU5VU0UnKSB7XG4gICAgICAgICAgLy8gdXNlci1mcmllbmRseSBtZXNzYWdlIGZvciB0aGlzIGNvbW1vbiBlcnJvclxuICAgICAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBsaXN0ZW4gb24gcG9ydCAke2Vyci5wb3J0fS4gVGhlIHBvcnQgaXMgYWxyZWFkeSBpbiB1c2UuYFxuICAgICAgICAgICk7XG4gICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyB2ZXJpZnkgdGhlIHNlcnZlciB1cmwgYWZ0ZXIgYSAnbW91bnQnIGV2ZW50IGlzIHJlY2VpdmVkXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgYXBpLm9uKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBQYXJzZVNlcnZlci52ZXJpZnlTZXJ2ZXJVcmwoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5lbnYuUEFSU0VfU0VSVkVSX0VOQUJMRV9FWFBFUklNRU5UQUxfRElSRUNUX0FDQ0VTUyA9PT0gJzEnKSB7XG4gICAgICBQYXJzZS5Db3JlTWFuYWdlci5zZXRSRVNUQ29udHJvbGxlcihcbiAgICAgICAgUGFyc2VTZXJ2ZXJSRVNUQ29udHJvbGxlcihhcHBJZCwgYXBwUm91dGVyKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwaTtcbiAgfVxuXG4gIHN0YXRpYyBwcm9taXNlUm91dGVyKHsgYXBwSWQgfSkge1xuICAgIGNvbnN0IHJvdXRlcnMgPSBbXG4gICAgICBuZXcgQ2xhc3Nlc1JvdXRlcigpLFxuICAgICAgbmV3IFVzZXJzUm91dGVyKCksXG4gICAgICBuZXcgU2Vzc2lvbnNSb3V0ZXIoKSxcbiAgICAgIG5ldyBSb2xlc1JvdXRlcigpLFxuICAgICAgbmV3IEFuYWx5dGljc1JvdXRlcigpLFxuICAgICAgbmV3IEluc3RhbGxhdGlvbnNSb3V0ZXIoKSxcbiAgICAgIG5ldyBGdW5jdGlvbnNSb3V0ZXIoKSxcbiAgICAgIG5ldyBTY2hlbWFzUm91dGVyKCksXG4gICAgICBuZXcgUHVzaFJvdXRlcigpLFxuICAgICAgbmV3IExvZ3NSb3V0ZXIoKSxcbiAgICAgIG5ldyBJQVBWYWxpZGF0aW9uUm91dGVyKCksXG4gICAgICBuZXcgRmVhdHVyZXNSb3V0ZXIoKSxcbiAgICAgIG5ldyBHbG9iYWxDb25maWdSb3V0ZXIoKSxcbiAgICAgIG5ldyBQdXJnZVJvdXRlcigpLFxuICAgICAgbmV3IEhvb2tzUm91dGVyKCksXG4gICAgICBuZXcgQ2xvdWRDb2RlUm91dGVyKCksXG4gICAgICBuZXcgQXVkaWVuY2VzUm91dGVyKCksXG4gICAgICBuZXcgQWdncmVnYXRlUm91dGVyKCksXG4gICAgXTtcblxuICAgIGNvbnN0IHJvdXRlcyA9IHJvdXRlcnMucmVkdWNlKChtZW1vLCByb3V0ZXIpID0+IHtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChyb3V0ZXIucm91dGVzKTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBhcHBSb3V0ZXIgPSBuZXcgUHJvbWlzZVJvdXRlcihyb3V0ZXMsIGFwcElkKTtcblxuICAgIGJhdGNoLm1vdW50T250byhhcHBSb3V0ZXIpO1xuICAgIHJldHVybiBhcHBSb3V0ZXI7XG4gIH1cblxuICAvKipcbiAgICogc3RhcnRzIHRoZSBwYXJzZSBzZXJ2ZXIncyBleHByZXNzIGFwcFxuICAgKiBAcGFyYW0ge1BhcnNlU2VydmVyT3B0aW9uc30gb3B0aW9ucyB0byB1c2UgdG8gc3RhcnQgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2VydmVyIGhhcyBzdGFydGVkXG4gICAqIEByZXR1cm5zIHtQYXJzZVNlcnZlcn0gdGhlIHBhcnNlIHNlcnZlciBpbnN0YW5jZVxuICAgKi9cbiAgc3RhcnQob3B0aW9uczogUGFyc2VTZXJ2ZXJPcHRpb25zLCBjYWxsYmFjazogPygpID0+IHZvaWQpIHtcbiAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG4gICAgaWYgKG9wdGlvbnMubWlkZGxld2FyZSkge1xuICAgICAgbGV0IG1pZGRsZXdhcmU7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMubWlkZGxld2FyZSA9PSAnc3RyaW5nJykge1xuICAgICAgICBtaWRkbGV3YXJlID0gcmVxdWlyZShwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgb3B0aW9ucy5taWRkbGV3YXJlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtaWRkbGV3YXJlID0gb3B0aW9ucy5taWRkbGV3YXJlOyAvLyB1c2UgYXMtaXMgbGV0IGV4cHJlc3MgZmFpbFxuICAgICAgfVxuICAgICAgYXBwLnVzZShtaWRkbGV3YXJlKTtcbiAgICB9XG5cbiAgICBhcHAudXNlKG9wdGlvbnMubW91bnRQYXRoLCB0aGlzLmFwcCk7XG4gICAgY29uc3Qgc2VydmVyID0gYXBwLmxpc3RlbihvcHRpb25zLnBvcnQsIG9wdGlvbnMuaG9zdCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuXG4gICAgaWYgKG9wdGlvbnMuc3RhcnRMaXZlUXVlcnlTZXJ2ZXIgfHwgb3B0aW9ucy5saXZlUXVlcnlTZXJ2ZXJPcHRpb25zKSB7XG4gICAgICB0aGlzLmxpdmVRdWVyeVNlcnZlciA9IFBhcnNlU2VydmVyLmNyZWF0ZUxpdmVRdWVyeVNlcnZlcihcbiAgICAgICAgc2VydmVyLFxuICAgICAgICBvcHRpb25zLmxpdmVRdWVyeVNlcnZlck9wdGlvbnNcbiAgICAgICk7XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKCFwcm9jZXNzLmVudi5URVNUSU5HKSB7XG4gICAgICBjb25maWd1cmVMaXN0ZW5lcnModGhpcyk7XG4gICAgfVxuICAgIHRoaXMuZXhwcmVzc0FwcCA9IGFwcDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFBhcnNlU2VydmVyIGFuZCBzdGFydHMgaXQuXG4gICAqIEBwYXJhbSB7UGFyc2VTZXJ2ZXJPcHRpb25zfSBvcHRpb25zIHVzZWQgdG8gc3RhcnQgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgc2VydmVyIGhhcyBzdGFydGVkXG4gICAqIEByZXR1cm5zIHtQYXJzZVNlcnZlcn0gdGhlIHBhcnNlIHNlcnZlciBpbnN0YW5jZVxuICAgKi9cbiAgc3RhdGljIHN0YXJ0KG9wdGlvbnM6IFBhcnNlU2VydmVyT3B0aW9ucywgY2FsbGJhY2s6ID8oKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgcGFyc2VTZXJ2ZXIgPSBuZXcgUGFyc2VTZXJ2ZXIob3B0aW9ucyk7XG4gICAgcmV0dXJuIHBhcnNlU2VydmVyLnN0YXJ0KG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIGNyZWF0ZSBhIGxpdmVRdWVyeSBzZXJ2ZXJcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1NlcnZlcn0gaHR0cFNlcnZlciBhbiBvcHRpb25hbCBodHRwIHNlcnZlciB0byBwYXNzXG4gICAqIEBwYXJhbSB7TGl2ZVF1ZXJ5U2VydmVyT3B0aW9uc30gY29uZmlnIG9wdGlvbnMgZm90IGhlIGxpdmVRdWVyeVNlcnZlclxuICAgKiBAcmV0dXJucyB7UGFyc2VMaXZlUXVlcnlTZXJ2ZXJ9IHRoZSBsaXZlIHF1ZXJ5IHNlcnZlciBpbnN0YW5jZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUxpdmVRdWVyeVNlcnZlcihodHRwU2VydmVyLCBjb25maWc6IExpdmVRdWVyeVNlcnZlck9wdGlvbnMpIHtcbiAgICBpZiAoIWh0dHBTZXJ2ZXIgfHwgKGNvbmZpZyAmJiBjb25maWcucG9ydCkpIHtcbiAgICAgIHZhciBhcHAgPSBleHByZXNzKCk7XG4gICAgICBodHRwU2VydmVyID0gcmVxdWlyZSgnaHR0cCcpLmNyZWF0ZVNlcnZlcihhcHApO1xuICAgICAgaHR0cFNlcnZlci5saXN0ZW4oY29uZmlnLnBvcnQpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBhcnNlTGl2ZVF1ZXJ5U2VydmVyKGh0dHBTZXJ2ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBzdGF0aWMgdmVyaWZ5U2VydmVyVXJsKGNhbGxiYWNrKSB7XG4gICAgLy8gcGVyZm9ybSBhIGhlYWx0aCBjaGVjayBvbiB0aGUgc2VydmVyVVJMIHZhbHVlXG4gICAgaWYgKFBhcnNlLnNlcnZlclVSTCkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuICAgICAgcmVxdWVzdCh7IHVybDogUGFyc2Uuc2VydmVyVVJMLnJlcGxhY2UoL1xcLyQvLCAnJykgKyAnL2hlYWx0aCcgfSlcbiAgICAgICAgLmNhdGNoKHJlc3BvbnNlID0+IHJlc3BvbnNlKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgY29uc3QganNvbiA9IHJlc3BvbnNlLmRhdGEgfHwgbnVsbDtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgIT09IDIwMCB8fFxuICAgICAgICAgICAgIWpzb24gfHxcbiAgICAgICAgICAgIChqc29uICYmIGpzb24uc3RhdHVzICE9PSAnb2snKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICBgXFxuV0FSTklORywgVW5hYmxlIHRvIGNvbm5lY3QgdG8gJyR7UGFyc2Uuc2VydmVyVVJMfScuYCArXG4gICAgICAgICAgICAgICAgYCBDbG91ZCBjb2RlIGFuZCBwdXNoIG5vdGlmaWNhdGlvbnMgbWF5IGJlIHVuYXZhaWxhYmxlIVxcbmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRQYXJzZUNsb3VkKCkge1xuICBjb25zdCBQYXJzZUNsb3VkID0gcmVxdWlyZSgnLi9jbG91ZC1jb2RlL1BhcnNlLkNsb3VkJyk7XG4gIE9iamVjdC5hc3NpZ24oUGFyc2UuQ2xvdWQsIFBhcnNlQ2xvdWQpO1xuICBnbG9iYWwuUGFyc2UgPSBQYXJzZTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0RGVmYXVsdHMob3B0aW9uczogUGFyc2VTZXJ2ZXJPcHRpb25zKSB7XG4gIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IGRlZmF1bHRzW2tleV07XG4gICAgfVxuICB9KTtcblxuICBpZiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3NlcnZlclVSTCcpKSB7XG4gICAgb3B0aW9ucy5zZXJ2ZXJVUkwgPSBgaHR0cDovL2xvY2FsaG9zdDoke29wdGlvbnMucG9ydH0ke29wdGlvbnMubW91bnRQYXRofWA7XG4gIH1cblxuICBvcHRpb25zLnVzZXJTZW5zaXRpdmVGaWVsZHMgPSBBcnJheS5mcm9tKFxuICAgIG5ldyBTZXQoXG4gICAgICBvcHRpb25zLnVzZXJTZW5zaXRpdmVGaWVsZHMuY29uY2F0KFxuICAgICAgICBkZWZhdWx0cy51c2VyU2Vuc2l0aXZlRmllbGRzLFxuICAgICAgICBvcHRpb25zLnVzZXJTZW5zaXRpdmVGaWVsZHNcbiAgICAgIClcbiAgICApXG4gICk7XG5cbiAgb3B0aW9ucy5tYXN0ZXJLZXlJcHMgPSBBcnJheS5mcm9tKFxuICAgIG5ldyBTZXQoXG4gICAgICBvcHRpb25zLm1hc3RlcktleUlwcy5jb25jYXQoZGVmYXVsdHMubWFzdGVyS2V5SXBzLCBvcHRpb25zLm1hc3RlcktleUlwcylcbiAgICApXG4gICk7XG59XG5cbi8vIFRob3NlIGNhbid0IGJlIHRlc3RlZCBhcyBpdCByZXF1aXJlcyBhIHN1YnByb2Nlc3Ncbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBjb25maWd1cmVMaXN0ZW5lcnMocGFyc2VTZXJ2ZXIpIHtcbiAgY29uc3Qgc2VydmVyID0gcGFyc2VTZXJ2ZXIuc2VydmVyO1xuICBjb25zdCBzb2NrZXRzID0ge307XG4gIC8qIEN1cnJlbnRseSwgZXhwcmVzcyBkb2Vzbid0IHNodXQgZG93biBpbW1lZGlhdGVseSBhZnRlciByZWNlaXZpbmcgU0lHSU5UL1NJR1RFUk0gaWYgaXQgaGFzIGNsaWVudCBjb25uZWN0aW9ucyB0aGF0IGhhdmVuJ3QgdGltZWQgb3V0LiAoVGhpcyBpcyBhIGtub3duIGlzc3VlIHdpdGggbm9kZSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvMjY0MilcbiAgICBUaGlzIGZ1bmN0aW9uLCBhbG9uZyB3aXRoIGBkZXN0cm95QWxpdmVDb25uZWN0aW9ucygpYCwgaW50ZW5kIHRvIGZpeCB0aGlzIGJlaGF2aW9yIHN1Y2ggdGhhdCBwYXJzZSBzZXJ2ZXIgd2lsbCBjbG9zZSBhbGwgb3BlbiBjb25uZWN0aW9ucyBhbmQgaW5pdGlhdGUgdGhlIHNodXRkb3duIHByb2Nlc3MgYXMgc29vbiBhcyBpdCByZWNlaXZlcyBhIFNJR0lOVC9TSUdURVJNIHNpZ25hbC4gKi9cbiAgc2VydmVyLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICBjb25zdCBzb2NrZXRJZCA9IHNvY2tldC5yZW1vdGVBZGRyZXNzICsgJzonICsgc29ja2V0LnJlbW90ZVBvcnQ7XG4gICAgc29ja2V0c1tzb2NrZXRJZF0gPSBzb2NrZXQ7XG4gICAgc29ja2V0Lm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIGRlbGV0ZSBzb2NrZXRzW3NvY2tldElkXTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgZGVzdHJveUFsaXZlQ29ubmVjdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGNvbnN0IHNvY2tldElkIGluIHNvY2tldHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNvY2tldHNbc29ja2V0SWRdLmRlc3Ryb3koKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLyogKi9cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlU2h1dGRvd24gPSBmdW5jdGlvbigpIHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnVGVybWluYXRpb24gc2lnbmFsIHJlY2VpdmVkLiBTaHV0dGluZyBkb3duLicpO1xuICAgIGRlc3Ryb3lBbGl2ZUNvbm5lY3Rpb25zKCk7XG4gICAgc2VydmVyLmNsb3NlKCk7XG4gICAgcGFyc2VTZXJ2ZXIuaGFuZGxlU2h1dGRvd24oKTtcbiAgfTtcbiAgcHJvY2Vzcy5vbignU0lHVEVSTScsIGhhbmRsZVNodXRkb3duKTtcbiAgcHJvY2Vzcy5vbignU0lHSU5UJywgaGFuZGxlU2h1dGRvd24pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJzZVNlcnZlcjtcbiJdfQ==