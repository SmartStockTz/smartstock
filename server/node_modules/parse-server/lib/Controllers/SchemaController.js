"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.classNameIsValid = classNameIsValid;
exports.fieldNameIsValid = fieldNameIsValid;
exports.invalidClassNameMessage = invalidClassNameMessage;
exports.buildMergedSchemaObject = buildMergedSchemaObject;
exports.VolatileClassesSchemas = exports.convertSchemaToAdapterSchema = exports.defaultColumns = exports.systemClasses = exports.load = exports.SchemaController = exports.default = void 0;

var _StorageAdapter = require("../Adapters/Storage/StorageAdapter");

var _DatabaseController = _interopRequireDefault(require("./DatabaseController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// This class handles schema validation, persistence, and modification.
//
// Each individual Schema object should be immutable. The helpers to
// do things with the Schema just return a new schema when the schema
// is changed.
//
// The canonical place to store this Schema is in the database itself,
// in a _SCHEMA collection. This is not the right way to do it for an
// open source framework, but it's backward compatible, so we're
// keeping it this way for now.
//
// In API-handling code, you should only use the Schema class via the
// DatabaseController. This will let us replace the schema logic for
// different databases.
// TODO: hide all schema logic inside the database adapter.
// -disable-next
const Parse = require('parse/node').Parse;

const defaultColumns = Object.freeze({
  // Contain the default columns for every parse object type (except _Join collection)
  _Default: {
    objectId: {
      type: 'String'
    },
    createdAt: {
      type: 'Date'
    },
    updatedAt: {
      type: 'Date'
    },
    ACL: {
      type: 'ACL'
    }
  },
  // The additional default columns for the _User collection (in addition to DefaultCols)
  _User: {
    username: {
      type: 'String'
    },
    password: {
      type: 'String'
    },
    email: {
      type: 'String'
    },
    emailVerified: {
      type: 'Boolean'
    },
    authData: {
      type: 'Object'
    }
  },
  // The additional default columns for the _Installation collection (in addition to DefaultCols)
  _Installation: {
    installationId: {
      type: 'String'
    },
    deviceToken: {
      type: 'String'
    },
    channels: {
      type: 'Array'
    },
    deviceType: {
      type: 'String'
    },
    pushType: {
      type: 'String'
    },
    GCMSenderId: {
      type: 'String'
    },
    timeZone: {
      type: 'String'
    },
    localeIdentifier: {
      type: 'String'
    },
    badge: {
      type: 'Number'
    },
    appVersion: {
      type: 'String'
    },
    appName: {
      type: 'String'
    },
    appIdentifier: {
      type: 'String'
    },
    parseVersion: {
      type: 'String'
    }
  },
  // The additional default columns for the _Role collection (in addition to DefaultCols)
  _Role: {
    name: {
      type: 'String'
    },
    users: {
      type: 'Relation',
      targetClass: '_User'
    },
    roles: {
      type: 'Relation',
      targetClass: '_Role'
    }
  },
  // The additional default columns for the _Session collection (in addition to DefaultCols)
  _Session: {
    restricted: {
      type: 'Boolean'
    },
    user: {
      type: 'Pointer',
      targetClass: '_User'
    },
    installationId: {
      type: 'String'
    },
    sessionToken: {
      type: 'String'
    },
    expiresAt: {
      type: 'Date'
    },
    createdWith: {
      type: 'Object'
    }
  },
  _Product: {
    productIdentifier: {
      type: 'String'
    },
    download: {
      type: 'File'
    },
    downloadName: {
      type: 'String'
    },
    icon: {
      type: 'File'
    },
    order: {
      type: 'Number'
    },
    title: {
      type: 'String'
    },
    subtitle: {
      type: 'String'
    }
  },
  _PushStatus: {
    pushTime: {
      type: 'String'
    },
    source: {
      type: 'String'
    },
    // rest or webui
    query: {
      type: 'String'
    },
    // the stringified JSON query
    payload: {
      type: 'String'
    },
    // the stringified JSON payload,
    title: {
      type: 'String'
    },
    expiry: {
      type: 'Number'
    },
    expiration_interval: {
      type: 'Number'
    },
    status: {
      type: 'String'
    },
    numSent: {
      type: 'Number'
    },
    numFailed: {
      type: 'Number'
    },
    pushHash: {
      type: 'String'
    },
    errorMessage: {
      type: 'Object'
    },
    sentPerType: {
      type: 'Object'
    },
    failedPerType: {
      type: 'Object'
    },
    sentPerUTCOffset: {
      type: 'Object'
    },
    failedPerUTCOffset: {
      type: 'Object'
    },
    count: {
      type: 'Number'
    } // tracks # of batches queued and pending

  },
  _JobStatus: {
    jobName: {
      type: 'String'
    },
    source: {
      type: 'String'
    },
    status: {
      type: 'String'
    },
    message: {
      type: 'String'
    },
    params: {
      type: 'Object'
    },
    // params received when calling the job
    finishedAt: {
      type: 'Date'
    }
  },
  _JobSchedule: {
    jobName: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    params: {
      type: 'String'
    },
    startAfter: {
      type: 'String'
    },
    daysOfWeek: {
      type: 'Array'
    },
    timeOfDay: {
      type: 'String'
    },
    lastRun: {
      type: 'Number'
    },
    repeatMinutes: {
      type: 'Number'
    }
  },
  _Hooks: {
    functionName: {
      type: 'String'
    },
    className: {
      type: 'String'
    },
    triggerName: {
      type: 'String'
    },
    url: {
      type: 'String'
    }
  },
  _GlobalConfig: {
    objectId: {
      type: 'String'
    },
    params: {
      type: 'Object'
    }
  },
  _Audience: {
    objectId: {
      type: 'String'
    },
    name: {
      type: 'String'
    },
    query: {
      type: 'String'
    },
    //storing query as JSON string to prevent "Nested keys should not contain the '$' or '.' characters" error
    lastUsed: {
      type: 'Date'
    },
    timesUsed: {
      type: 'Number'
    }
  }
});
exports.defaultColumns = defaultColumns;
const requiredColumns = Object.freeze({
  _Product: ['productIdentifier', 'icon', 'order', 'title', 'subtitle'],
  _Role: ['name', 'ACL']
});
const systemClasses = Object.freeze(['_User', '_Installation', '_Role', '_Session', '_Product', '_PushStatus', '_JobStatus', '_JobSchedule', '_Audience']);
exports.systemClasses = systemClasses;
const volatileClasses = Object.freeze(['_JobStatus', '_PushStatus', '_Hooks', '_GlobalConfig', '_JobSchedule', '_Audience']); // 10 alpha numberic chars + uppercase

const userIdRegex = /^[a-zA-Z0-9]{10}$/; // Anything that start with role

const roleRegex = /^role:.*/; // * permission

const publicRegex = /^\*$/;
const requireAuthenticationRegex = /^requiresAuthentication$/;
const permissionKeyRegex = Object.freeze([userIdRegex, roleRegex, publicRegex, requireAuthenticationRegex]);

function verifyPermissionKey(key) {
  const result = permissionKeyRegex.reduce((isGood, regEx) => {
    isGood = isGood || key.match(regEx) != null;
    return isGood;
  }, false);

  if (!result) {
    throw new Parse.Error(Parse.Error.INVALID_JSON, `'${key}' is not a valid key for class level permissions`);
  }
}

const CLPValidKeys = Object.freeze(['find', 'count', 'get', 'create', 'update', 'delete', 'addField', 'readUserFields', 'writeUserFields']);

function validateCLP(perms, fields) {
  if (!perms) {
    return;
  }

  Object.keys(perms).forEach(operation => {
    if (CLPValidKeys.indexOf(operation) == -1) {
      throw new Parse.Error(Parse.Error.INVALID_JSON, `${operation} is not a valid operation for class level permissions`);
    }

    if (!perms[operation]) {
      return;
    }

    if (operation === 'readUserFields' || operation === 'writeUserFields') {
      if (!Array.isArray(perms[operation])) {
        // -disable-next
        throw new Parse.Error(Parse.Error.INVALID_JSON, `'${perms[operation]}' is not a valid value for class level permissions ${operation}`);
      } else {
        perms[operation].forEach(key => {
          if (!fields[key] || fields[key].type != 'Pointer' || fields[key].targetClass != '_User') {
            throw new Parse.Error(Parse.Error.INVALID_JSON, `'${key}' is not a valid column for class level pointer permissions ${operation}`);
          }
        });
      }

      return;
    } // -disable-next


    Object.keys(perms[operation]).forEach(key => {
      verifyPermissionKey(key); // -disable-next

      const perm = perms[operation][key];

      if (perm !== true) {
        // -disable-next
        throw new Parse.Error(Parse.Error.INVALID_JSON, `'${perm}' is not a valid value for class level permissions ${operation}:${key}:${perm}`);
      }
    });
  });
}

const joinClassRegex = /^_Join:[A-Za-z0-9_]+:[A-Za-z0-9_]+/;
const classAndFieldRegex = /^[A-Za-z][A-Za-z0-9_]*$/;

function classNameIsValid(className) {
  // Valid classes must:
  return (// Be one of _User, _Installation, _Role, _Session OR
    systemClasses.indexOf(className) > -1 || // Be a join table OR
    joinClassRegex.test(className) || // Include only alpha-numeric and underscores, and not start with an underscore or number
    fieldNameIsValid(className)
  );
} // Valid fields must be alpha-numeric, and not start with an underscore or number


function fieldNameIsValid(fieldName) {
  return classAndFieldRegex.test(fieldName);
} // Checks that it's not trying to clobber one of the default fields of the class.


function fieldNameIsValidForClass(fieldName, className) {
  if (!fieldNameIsValid(fieldName)) {
    return false;
  }

  if (defaultColumns._Default[fieldName]) {
    return false;
  }

  if (defaultColumns[className] && defaultColumns[className][fieldName]) {
    return false;
  }

  return true;
}

function invalidClassNameMessage(className) {
  return 'Invalid classname: ' + className + ', classnames can only have alphanumeric characters and _, and must start with an alpha character ';
}

const invalidJsonError = new Parse.Error(Parse.Error.INVALID_JSON, 'invalid JSON');
const validNonRelationOrPointerTypes = ['Number', 'String', 'Boolean', 'Date', 'Object', 'Array', 'GeoPoint', 'File', 'Bytes', 'Polygon']; // Returns an error suitable for throwing if the type is invalid

const fieldTypeIsInvalid = ({
  type,
  targetClass
}) => {
  if (['Pointer', 'Relation'].indexOf(type) >= 0) {
    if (!targetClass) {
      return new Parse.Error(135, `type ${type} needs a class name`);
    } else if (typeof targetClass !== 'string') {
      return invalidJsonError;
    } else if (!classNameIsValid(targetClass)) {
      return new Parse.Error(Parse.Error.INVALID_CLASS_NAME, invalidClassNameMessage(targetClass));
    } else {
      return undefined;
    }
  }

  if (typeof type !== 'string') {
    return invalidJsonError;
  }

  if (validNonRelationOrPointerTypes.indexOf(type) < 0) {
    return new Parse.Error(Parse.Error.INCORRECT_TYPE, `invalid field type: ${type}`);
  }

  return undefined;
};

const convertSchemaToAdapterSchema = schema => {
  schema = injectDefaultSchema(schema);
  delete schema.fields.ACL;
  schema.fields._rperm = {
    type: 'Array'
  };
  schema.fields._wperm = {
    type: 'Array'
  };

  if (schema.className === '_User') {
    delete schema.fields.password;
    schema.fields._hashed_password = {
      type: 'String'
    };
  }

  return schema;
};

exports.convertSchemaToAdapterSchema = convertSchemaToAdapterSchema;

const convertAdapterSchemaToParseSchema = (_ref) => {
  let schema = _extends({}, _ref);

  delete schema.fields._rperm;
  delete schema.fields._wperm;
  schema.fields.ACL = {
    type: 'ACL'
  };

  if (schema.className === '_User') {
    delete schema.fields.authData; //Auth data is implicit

    delete schema.fields._hashed_password;
    schema.fields.password = {
      type: 'String'
    };
  }

  if (schema.indexes && Object.keys(schema.indexes).length === 0) {
    delete schema.indexes;
  }

  return schema;
};

class SchemaData {
  constructor(allSchemas = []) {
    this.__data = {};
    allSchemas.forEach(schema => {
      Object.defineProperty(this, schema.className, {
        get: () => {
          if (!this.__data[schema.className]) {
            const data = {};
            data.fields = injectDefaultSchema(schema).fields;
            data.classLevelPermissions = schema.classLevelPermissions;
            data.indexes = schema.indexes;
            this.__data[schema.className] = data;
          }

          return this.__data[schema.className];
        }
      });
    }); // Inject the in-memory classes

    volatileClasses.forEach(className => {
      Object.defineProperty(this, className, {
        get: () => {
          if (!this.__data[className]) {
            const schema = injectDefaultSchema({
              className,
              fields: {},
              classLevelPermissions: {}
            });
            const data = {};
            data.fields = schema.fields;
            data.classLevelPermissions = schema.classLevelPermissions;
            data.indexes = schema.indexes;
            this.__data[className] = data;
          }

          return this.__data[className];
        }
      });
    });
  }

}

const injectDefaultSchema = ({
  className,
  fields,
  classLevelPermissions,
  indexes
}) => {
  const defaultSchema = {
    className,
    fields: _objectSpread({}, defaultColumns._Default, defaultColumns[className] || {}, fields),
    classLevelPermissions
  };

  if (indexes && Object.keys(indexes).length !== 0) {
    defaultSchema.indexes = indexes;
  }

  return defaultSchema;
};

const _HooksSchema = {
  className: '_Hooks',
  fields: defaultColumns._Hooks
};
const _GlobalConfigSchema = {
  className: '_GlobalConfig',
  fields: defaultColumns._GlobalConfig
};

const _PushStatusSchema = convertSchemaToAdapterSchema(injectDefaultSchema({
  className: '_PushStatus',
  fields: {},
  classLevelPermissions: {}
}));

const _JobStatusSchema = convertSchemaToAdapterSchema(injectDefaultSchema({
  className: '_JobStatus',
  fields: {},
  classLevelPermissions: {}
}));

const _JobScheduleSchema = convertSchemaToAdapterSchema(injectDefaultSchema({
  className: '_JobSchedule',
  fields: {},
  classLevelPermissions: {}
}));

const _AudienceSchema = convertSchemaToAdapterSchema(injectDefaultSchema({
  className: '_Audience',
  fields: defaultColumns._Audience,
  classLevelPermissions: {}
}));

const VolatileClassesSchemas = [_HooksSchema, _JobStatusSchema, _JobScheduleSchema, _PushStatusSchema, _GlobalConfigSchema, _AudienceSchema];
exports.VolatileClassesSchemas = VolatileClassesSchemas;

const dbTypeMatchesObjectType = (dbType, objectType) => {
  if (dbType.type !== objectType.type) return false;
  if (dbType.targetClass !== objectType.targetClass) return false;
  if (dbType === objectType.type) return true;
  if (dbType.type === objectType.type) return true;
  return false;
};

const typeToString = type => {
  if (typeof type === 'string') {
    return type;
  }

  if (type.targetClass) {
    return `${type.type}<${type.targetClass}>`;
  }

  return `${type.type}`;
}; // Stores the entire schema of the app in a weird hybrid format somewhere between
// the mongo format and the Parse format. Soon, this will all be Parse format.


class SchemaController {
  constructor(databaseAdapter, schemaCache) {
    this._dbAdapter = databaseAdapter;
    this._cache = schemaCache;
    this.schemaData = new SchemaData();
  }

  reloadData(options = {
    clearCache: false
  }) {
    let promise = Promise.resolve();

    if (options.clearCache) {
      promise = promise.then(() => {
        return this._cache.clear();
      });
    }

    if (this.reloadDataPromise && !options.clearCache) {
      return this.reloadDataPromise;
    }

    this.reloadDataPromise = promise.then(() => {
      return this.getAllClasses(options).then(allSchemas => {
        this.schemaData = new SchemaData(allSchemas);
        delete this.reloadDataPromise;
      }, err => {
        this.schemaData = new SchemaData();
        delete this.reloadDataPromise;
        throw err;
      });
    }).then(() => {});
    return this.reloadDataPromise;
  }

  getAllClasses(options = {
    clearCache: false
  }) {
    let promise = Promise.resolve();

    if (options.clearCache) {
      promise = this._cache.clear();
    }

    return promise.then(() => {
      return this._cache.getAllClasses();
    }).then(allClasses => {
      if (allClasses && allClasses.length && !options.clearCache) {
        return Promise.resolve(allClasses);
      }

      return this._dbAdapter.getAllClasses().then(allSchemas => allSchemas.map(injectDefaultSchema)).then(allSchemas => {
        return this._cache.setAllClasses(allSchemas).then(() => {
          return allSchemas;
        });
      });
    });
  }

  getOneSchema(className, allowVolatileClasses = false, options = {
    clearCache: false
  }) {
    let promise = Promise.resolve();

    if (options.clearCache) {
      promise = this._cache.clear();
    }

    return promise.then(() => {
      if (allowVolatileClasses && volatileClasses.indexOf(className) > -1) {
        const data = this.schemaData[className];
        return Promise.resolve({
          className,
          fields: data.fields,
          classLevelPermissions: data.classLevelPermissions,
          indexes: data.indexes
        });
      }

      return this._cache.getOneSchema(className).then(cached => {
        if (cached && !options.clearCache) {
          return Promise.resolve(cached);
        }

        return this._dbAdapter.getClass(className).then(injectDefaultSchema).then(result => {
          return this._cache.setOneSchema(className, result).then(() => {
            return result;
          });
        });
      });
    });
  } // Create a new class that includes the three default fields.
  // ACL is an implicit column that does not get an entry in the
  // _SCHEMAS database. Returns a promise that resolves with the
  // created schema, in mongo format.
  // on success, and rejects with an error on fail. Ensure you
  // have authorization (master key, or client class creation
  // enabled) before calling this function.


  addClassIfNotExists(className, fields = {}, classLevelPermissions, indexes = {}) {
    var validationError = this.validateNewClass(className, fields, classLevelPermissions);

    if (validationError) {
      return Promise.reject(validationError);
    }

    return this._dbAdapter.createClass(className, convertSchemaToAdapterSchema({
      fields,
      classLevelPermissions,
      indexes,
      className
    })).then(convertAdapterSchemaToParseSchema).then(res => {
      return this._cache.clear().then(() => {
        return Promise.resolve(res);
      });
    }).catch(error => {
      if (error && error.code === Parse.Error.DUPLICATE_VALUE) {
        throw new Parse.Error(Parse.Error.INVALID_CLASS_NAME, `Class ${className} already exists.`);
      } else {
        throw error;
      }
    });
  }

  updateClass(className, submittedFields, classLevelPermissions, indexes, database) {
    return this.getOneSchema(className).then(schema => {
      const existingFields = schema.fields;
      Object.keys(submittedFields).forEach(name => {
        const field = submittedFields[name];

        if (existingFields[name] && field.__op !== 'Delete') {
          throw new Parse.Error(255, `Field ${name} exists, cannot update.`);
        }

        if (!existingFields[name] && field.__op === 'Delete') {
          throw new Parse.Error(255, `Field ${name} does not exist, cannot delete.`);
        }
      });
      delete existingFields._rperm;
      delete existingFields._wperm;
      const newSchema = buildMergedSchemaObject(existingFields, submittedFields);
      const defaultFields = defaultColumns[className] || defaultColumns._Default;
      const fullNewSchema = Object.assign({}, newSchema, defaultFields);
      const validationError = this.validateSchemaData(className, newSchema, classLevelPermissions, Object.keys(existingFields));

      if (validationError) {
        throw new Parse.Error(validationError.code, validationError.error);
      } // Finally we have checked to make sure the request is valid and we can start deleting fields.
      // Do all deletions first, then a single save to _SCHEMA collection to handle all additions.


      const deletedFields = [];
      const insertedFields = [];
      Object.keys(submittedFields).forEach(fieldName => {
        if (submittedFields[fieldName].__op === 'Delete') {
          deletedFields.push(fieldName);
        } else {
          insertedFields.push(fieldName);
        }
      });
      let deletePromise = Promise.resolve();

      if (deletedFields.length > 0) {
        deletePromise = this.deleteFields(deletedFields, className, database);
      }

      return deletePromise // Delete Everything
      .then(() => this.reloadData({
        clearCache: true
      })) // Reload our Schema, so we have all the new values
      .then(() => {
        const promises = insertedFields.map(fieldName => {
          const type = submittedFields[fieldName];
          return this.enforceFieldExists(className, fieldName, type);
        });
        return Promise.all(promises);
      }).then(() => this.setPermissions(className, classLevelPermissions, newSchema)).then(() => this._dbAdapter.setIndexesWithSchemaFormat(className, indexes, schema.indexes, fullNewSchema)).then(() => this.reloadData({
        clearCache: true
      })) //TODO: Move this logic into the database adapter
      .then(() => {
        const schema = this.schemaData[className];
        const reloadedSchema = {
          className: className,
          fields: schema.fields,
          classLevelPermissions: schema.classLevelPermissions
        };

        if (schema.indexes && Object.keys(schema.indexes).length !== 0) {
          reloadedSchema.indexes = schema.indexes;
        }

        return reloadedSchema;
      });
    }).catch(error => {
      if (error === undefined) {
        throw new Parse.Error(Parse.Error.INVALID_CLASS_NAME, `Class ${className} does not exist.`);
      } else {
        throw error;
      }
    });
  } // Returns a promise that resolves successfully to the new schema
  // object or fails with a reason.


  enforceClassExists(className) {
    if (this.schemaData[className]) {
      return Promise.resolve(this);
    } // We don't have this class. Update the schema


    return this.addClassIfNotExists(className) // The schema update succeeded. Reload the schema
    .then(() => this.reloadData({
      clearCache: true
    })).catch(() => {
      // The schema update failed. This can be okay - it might
      // have failed because there's a race condition and a different
      // client is making the exact same schema update that we want.
      // So just reload the schema.
      return this.reloadData({
        clearCache: true
      });
    }).then(() => {
      // Ensure that the schema now validates
      if (this.schemaData[className]) {
        return this;
      } else {
        throw new Parse.Error(Parse.Error.INVALID_JSON, `Failed to add ${className}`);
      }
    }).catch(() => {
      // The schema still doesn't validate. Give up
      throw new Parse.Error(Parse.Error.INVALID_JSON, 'schema class name does not revalidate');
    });
  }

  validateNewClass(className, fields = {}, classLevelPermissions) {
    if (this.schemaData[className]) {
      throw new Parse.Error(Parse.Error.INVALID_CLASS_NAME, `Class ${className} already exists.`);
    }

    if (!classNameIsValid(className)) {
      return {
        code: Parse.Error.INVALID_CLASS_NAME,
        error: invalidClassNameMessage(className)
      };
    }

    return this.validateSchemaData(className, fields, classLevelPermissions, []);
  }

  validateSchemaData(className, fields, classLevelPermissions, existingFieldNames) {
    for (const fieldName in fields) {
      if (existingFieldNames.indexOf(fieldName) < 0) {
        if (!fieldNameIsValid(fieldName)) {
          return {
            code: Parse.Error.INVALID_KEY_NAME,
            error: 'invalid field name: ' + fieldName
          };
        }

        if (!fieldNameIsValidForClass(fieldName, className)) {
          return {
            code: 136,
            error: 'field ' + fieldName + ' cannot be added'
          };
        }

        const error = fieldTypeIsInvalid(fields[fieldName]);
        if (error) return {
          code: error.code,
          error: error.message
        };
      }
    }

    for (const fieldName in defaultColumns[className]) {
      fields[fieldName] = defaultColumns[className][fieldName];
    }

    const geoPoints = Object.keys(fields).filter(key => fields[key] && fields[key].type === 'GeoPoint');

    if (geoPoints.length > 1) {
      return {
        code: Parse.Error.INCORRECT_TYPE,
        error: 'currently, only one GeoPoint field may exist in an object. Adding ' + geoPoints[1] + ' when ' + geoPoints[0] + ' already exists.'
      };
    }

    validateCLP(classLevelPermissions, fields);
  } // Sets the Class-level permissions for a given className, which must exist.


  setPermissions(className, perms, newSchema) {
    if (typeof perms === 'undefined') {
      return Promise.resolve();
    }

    validateCLP(perms, newSchema);
    return this._dbAdapter.setClassLevelPermissions(className, perms);
  } // Returns a promise that resolves successfully to the new schema
  // object if the provided className-fieldName-type tuple is valid.
  // The className must already be validated.
  // If 'freeze' is true, refuse to update the schema for this field.


  enforceFieldExists(className, fieldName, type) {
    if (fieldName.indexOf('.') > 0) {
      // subdocument key (x.y) => ok if x is of type 'object'
      fieldName = fieldName.split('.')[0];
      type = 'Object';
    }

    if (!fieldNameIsValid(fieldName)) {
      throw new Parse.Error(Parse.Error.INVALID_KEY_NAME, `Invalid field name: ${fieldName}.`);
    } // If someone tries to create a new field with null/undefined as the value, return;


    if (!type) {
      return Promise.resolve(this);
    }

    return this.reloadData().then(() => {
      const expectedType = this.getExpectedType(className, fieldName);

      if (typeof type === 'string') {
        type = {
          type
        };
      }

      if (expectedType) {
        if (!dbTypeMatchesObjectType(expectedType, type)) {
          throw new Parse.Error(Parse.Error.INCORRECT_TYPE, `schema mismatch for ${className}.${fieldName}; expected ${typeToString(expectedType)} but got ${typeToString(type)}`);
        }

        return this;
      }

      return this._dbAdapter.addFieldIfNotExists(className, fieldName, type).then(() => {
        // The update succeeded. Reload the schema
        return this.reloadData({
          clearCache: true
        });
      }, error => {
        if (error.code == Parse.Error.INCORRECT_TYPE) {
          // Make sure that we throw errors when it is appropriate to do so.
          throw error;
        } // The update failed. This can be okay - it might have been a race
        // condition where another client updated the schema in the same
        // way that we wanted to. So, just reload the schema


        return this.reloadData({
          clearCache: true
        });
      }).then(() => {
        // Ensure that the schema now validates
        const expectedType = this.getExpectedType(className, fieldName);

        if (typeof type === 'string') {
          type = {
            type
          };
        }

        if (!expectedType || !dbTypeMatchesObjectType(expectedType, type)) {
          throw new Parse.Error(Parse.Error.INVALID_JSON, `Could not add field ${fieldName}`);
        } // Remove the cached schema


        this._cache.clear();

        return this;
      });
    });
  } // maintain compatibility


  deleteField(fieldName, className, database) {
    return this.deleteFields([fieldName], className, database);
  } // Delete fields, and remove that data from all objects. This is intended
  // to remove unused fields, if other writers are writing objects that include
  // this field, the field may reappear. Returns a Promise that resolves with
  // no object on success, or rejects with { code, error } on failure.
  // Passing the database and prefix is necessary in order to drop relation collections
  // and remove fields from objects. Ideally the database would belong to
  // a database adapter and this function would close over it or access it via member.


  deleteFields(fieldNames, className, database) {
    if (!classNameIsValid(className)) {
      throw new Parse.Error(Parse.Error.INVALID_CLASS_NAME, invalidClassNameMessage(className));
    }

    fieldNames.forEach(fieldName => {
      if (!fieldNameIsValid(fieldName)) {
        throw new Parse.Error(Parse.Error.INVALID_KEY_NAME, `invalid field name: ${fieldName}`);
      } //Don't allow deleting the default fields.


      if (!fieldNameIsValidForClass(fieldName, className)) {
        throw new Parse.Error(136, `field ${fieldName} cannot be changed`);
      }
    });
    return this.getOneSchema(className, false, {
      clearCache: true
    }).catch(error => {
      if (error === undefined) {
        throw new Parse.Error(Parse.Error.INVALID_CLASS_NAME, `Class ${className} does not exist.`);
      } else {
        throw error;
      }
    }).then(schema => {
      fieldNames.forEach(fieldName => {
        if (!schema.fields[fieldName]) {
          throw new Parse.Error(255, `Field ${fieldName} does not exist, cannot delete.`);
        }
      });

      const schemaFields = _objectSpread({}, schema.fields);

      return database.adapter.deleteFields(className, schema, fieldNames).then(() => {
        return Promise.all(fieldNames.map(fieldName => {
          const field = schemaFields[fieldName];

          if (field && field.type === 'Relation') {
            //For relations, drop the _Join table
            return database.adapter.deleteClass(`_Join:${fieldName}:${className}`);
          }

          return Promise.resolve();
        }));
      });
    }).then(() => {
      this._cache.clear();
    });
  } // Validates an object provided in REST format.
  // Returns a promise that resolves to the new schema if this object is
  // valid.


  validateObject(className, object, query) {
    let geocount = 0;
    let promise = this.enforceClassExists(className);

    for (const fieldName in object) {
      if (object[fieldName] === undefined) {
        continue;
      }

      const expected = getType(object[fieldName]);

      if (expected === 'GeoPoint') {
        geocount++;
      }

      if (geocount > 1) {
        // Make sure all field validation operations run before we return.
        // If not - we are continuing to run logic, but already provided response from the server.
        return promise.then(() => {
          return Promise.reject(new Parse.Error(Parse.Error.INCORRECT_TYPE, 'there can only be one geopoint field in a class'));
        });
      }

      if (!expected) {
        continue;
      }

      if (fieldName === 'ACL') {
        // Every object has ACL implicitly.
        continue;
      }

      promise = promise.then(schema => schema.enforceFieldExists(className, fieldName, expected));
    }

    promise = thenValidateRequiredColumns(promise, className, object, query);
    return promise;
  } // Validates that all the properties are set for the object


  validateRequiredColumns(className, object, query) {
    const columns = requiredColumns[className];

    if (!columns || columns.length == 0) {
      return Promise.resolve(this);
    }

    const missingColumns = columns.filter(function (column) {
      if (query && query.objectId) {
        if (object[column] && typeof object[column] === 'object') {
          // Trying to delete a required column
          return object[column].__op == 'Delete';
        } // Not trying to do anything there


        return false;
      }

      return !object[column];
    });

    if (missingColumns.length > 0) {
      throw new Parse.Error(Parse.Error.INCORRECT_TYPE, missingColumns[0] + ' is required.');
    }

    return Promise.resolve(this);
  }

  testPermissionsForClassName(className, aclGroup, operation) {
    return SchemaController.testPermissions(this.getClassLevelPermissions(className), aclGroup, operation);
  } // Tests that the class level permission let pass the operation for a given aclGroup


  static testPermissions(classPermissions, aclGroup, operation) {
    if (!classPermissions || !classPermissions[operation]) {
      return true;
    }

    const perms = classPermissions[operation];

    if (perms['*']) {
      return true;
    } // Check permissions against the aclGroup provided (array of userId/roles)


    if (aclGroup.some(acl => {
      return perms[acl] === true;
    })) {
      return true;
    }

    return false;
  } // Validates an operation passes class-level-permissions set in the schema


  static validatePermission(classPermissions, className, aclGroup, operation) {
    if (SchemaController.testPermissions(classPermissions, aclGroup, operation)) {
      return Promise.resolve();
    }

    if (!classPermissions || !classPermissions[operation]) {
      return true;
    }

    const perms = classPermissions[operation]; // If only for authenticated users
    // make sure we have an aclGroup

    if (perms['requiresAuthentication']) {
      // If aclGroup has * (public)
      if (!aclGroup || aclGroup.length == 0) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Permission denied, user needs to be authenticated.');
      } else if (aclGroup.indexOf('*') > -1 && aclGroup.length == 1) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Permission denied, user needs to be authenticated.');
      } // requiresAuthentication passed, just move forward
      // probably would be wise at some point to rename to 'authenticatedUser'


      return Promise.resolve();
    } // No matching CLP, let's check the Pointer permissions
    // And handle those later


    const permissionField = ['get', 'find', 'count'].indexOf(operation) > -1 ? 'readUserFields' : 'writeUserFields'; // Reject create when write lockdown

    if (permissionField == 'writeUserFields' && operation == 'create') {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, `Permission denied for action ${operation} on class ${className}.`);
    } // Process the readUserFields later


    if (Array.isArray(classPermissions[permissionField]) && classPermissions[permissionField].length > 0) {
      return Promise.resolve();
    }

    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, `Permission denied for action ${operation} on class ${className}.`);
  } // Validates an operation passes class-level-permissions set in the schema


  validatePermission(className, aclGroup, operation) {
    return SchemaController.validatePermission(this.getClassLevelPermissions(className), className, aclGroup, operation);
  }

  getClassLevelPermissions(className) {
    return this.schemaData[className] && this.schemaData[className].classLevelPermissions;
  } // Returns the expected type for a className+key combination
  // or undefined if the schema is not set


  getExpectedType(className, fieldName) {
    if (this.schemaData[className]) {
      const expectedType = this.schemaData[className].fields[fieldName];
      return expectedType === 'map' ? 'Object' : expectedType;
    }

    return undefined;
  } // Checks if a given class is in the schema.


  hasClass(className) {
    return this.reloadData().then(() => !!this.schemaData[className]);
  }

} // Returns a promise for a new Schema.


exports.SchemaController = exports.default = SchemaController;

const load = (dbAdapter, schemaCache, options) => {
  const schema = new SchemaController(dbAdapter, schemaCache);
  return schema.reloadData(options).then(() => schema);
}; // Builds a new schema (in schema API response format) out of an
// existing mongo schema + a schemas API put request. This response
// does not include the default fields, as it is intended to be passed
// to mongoSchemaFromFieldsAndClassName. No validation is done here, it
// is done in mongoSchemaFromFieldsAndClassName.


exports.load = load;

function buildMergedSchemaObject(existingFields, putRequest) {
  const newSchema = {}; // -disable-next

  const sysSchemaField = Object.keys(defaultColumns).indexOf(existingFields._id) === -1 ? [] : Object.keys(defaultColumns[existingFields._id]);

  for (const oldField in existingFields) {
    if (oldField !== '_id' && oldField !== 'ACL' && oldField !== 'updatedAt' && oldField !== 'createdAt' && oldField !== 'objectId') {
      if (sysSchemaField.length > 0 && sysSchemaField.indexOf(oldField) !== -1) {
        continue;
      }

      const fieldIsDeleted = putRequest[oldField] && putRequest[oldField].__op === 'Delete';

      if (!fieldIsDeleted) {
        newSchema[oldField] = existingFields[oldField];
      }
    }
  }

  for (const newField in putRequest) {
    if (newField !== 'objectId' && putRequest[newField].__op !== 'Delete') {
      if (sysSchemaField.length > 0 && sysSchemaField.indexOf(newField) !== -1) {
        continue;
      }

      newSchema[newField] = putRequest[newField];
    }
  }

  return newSchema;
} // Given a schema promise, construct another schema promise that
// validates this field once the schema loads.


function thenValidateRequiredColumns(schemaPromise, className, object, query) {
  return schemaPromise.then(schema => {
    return schema.validateRequiredColumns(className, object, query);
  });
} // Gets the type from a REST API formatted object, where 'type' is
// extended past javascript types to include the rest of the Parse
// type system.
// The output should be a valid schema value.
// TODO: ensure that this is compatible with the format used in Open DB


function getType(obj) {
  const type = typeof obj;

  switch (type) {
    case 'boolean':
      return 'Boolean';

    case 'string':
      return 'String';

    case 'number':
      return 'Number';

    case 'map':
    case 'object':
      if (!obj) {
        return undefined;
      }

      return getObjectType(obj);

    case 'function':
    case 'symbol':
    case 'undefined':
    default:
      throw 'bad obj: ' + obj;
  }
} // This gets the type for non-JSON types like pointers and files, but
// also gets the appropriate type for $ operators.
// Returns null if the type is unknown.


function getObjectType(obj) {
  if (obj instanceof Array) {
    return 'Array';
  }

  if (obj.__type) {
    switch (obj.__type) {
      case 'Pointer':
        if (obj.className) {
          return {
            type: 'Pointer',
            targetClass: obj.className
          };
        }

        break;

      case 'Relation':
        if (obj.className) {
          return {
            type: 'Relation',
            targetClass: obj.className
          };
        }

        break;

      case 'File':
        if (obj.name) {
          return 'File';
        }

        break;

      case 'Date':
        if (obj.iso) {
          return 'Date';
        }

        break;

      case 'GeoPoint':
        if (obj.latitude != null && obj.longitude != null) {
          return 'GeoPoint';
        }

        break;

      case 'Bytes':
        if (obj.base64) {
          return 'Bytes';
        }

        break;

      case 'Polygon':
        if (obj.coordinates) {
          return 'Polygon';
        }

        break;
    }

    throw new Parse.Error(Parse.Error.INCORRECT_TYPE, 'This is not a valid ' + obj.__type);
  }

  if (obj['$ne']) {
    return getObjectType(obj['$ne']);
  }

  if (obj.__op) {
    switch (obj.__op) {
      case 'Increment':
        return 'Number';

      case 'Delete':
        return null;

      case 'Add':
      case 'AddUnique':
      case 'Remove':
        return 'Array';

      case 'AddRelation':
      case 'RemoveRelation':
        return {
          type: 'Relation',
          targetClass: obj.objects[0].className
        };

      case 'Batch':
        return getObjectType(obj.ops[0]);

      default:
        throw 'unexpected op: ' + obj.__op;
    }
  }

  return 'Object';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db250cm9sbGVycy9TY2hlbWFDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIlBhcnNlIiwicmVxdWlyZSIsImRlZmF1bHRDb2x1bW5zIiwiT2JqZWN0IiwiZnJlZXplIiwiX0RlZmF1bHQiLCJvYmplY3RJZCIsInR5cGUiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkQXQiLCJBQ0wiLCJfVXNlciIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlbWFpbCIsImVtYWlsVmVyaWZpZWQiLCJhdXRoRGF0YSIsIl9JbnN0YWxsYXRpb24iLCJpbnN0YWxsYXRpb25JZCIsImRldmljZVRva2VuIiwiY2hhbm5lbHMiLCJkZXZpY2VUeXBlIiwicHVzaFR5cGUiLCJHQ01TZW5kZXJJZCIsInRpbWVab25lIiwibG9jYWxlSWRlbnRpZmllciIsImJhZGdlIiwiYXBwVmVyc2lvbiIsImFwcE5hbWUiLCJhcHBJZGVudGlmaWVyIiwicGFyc2VWZXJzaW9uIiwiX1JvbGUiLCJuYW1lIiwidXNlcnMiLCJ0YXJnZXRDbGFzcyIsInJvbGVzIiwiX1Nlc3Npb24iLCJyZXN0cmljdGVkIiwidXNlciIsInNlc3Npb25Ub2tlbiIsImV4cGlyZXNBdCIsImNyZWF0ZWRXaXRoIiwiX1Byb2R1Y3QiLCJwcm9kdWN0SWRlbnRpZmllciIsImRvd25sb2FkIiwiZG93bmxvYWROYW1lIiwiaWNvbiIsIm9yZGVyIiwidGl0bGUiLCJzdWJ0aXRsZSIsIl9QdXNoU3RhdHVzIiwicHVzaFRpbWUiLCJzb3VyY2UiLCJxdWVyeSIsInBheWxvYWQiLCJleHBpcnkiLCJleHBpcmF0aW9uX2ludGVydmFsIiwic3RhdHVzIiwibnVtU2VudCIsIm51bUZhaWxlZCIsInB1c2hIYXNoIiwiZXJyb3JNZXNzYWdlIiwic2VudFBlclR5cGUiLCJmYWlsZWRQZXJUeXBlIiwic2VudFBlclVUQ09mZnNldCIsImZhaWxlZFBlclVUQ09mZnNldCIsImNvdW50IiwiX0pvYlN0YXR1cyIsImpvYk5hbWUiLCJtZXNzYWdlIiwicGFyYW1zIiwiZmluaXNoZWRBdCIsIl9Kb2JTY2hlZHVsZSIsImRlc2NyaXB0aW9uIiwic3RhcnRBZnRlciIsImRheXNPZldlZWsiLCJ0aW1lT2ZEYXkiLCJsYXN0UnVuIiwicmVwZWF0TWludXRlcyIsIl9Ib29rcyIsImZ1bmN0aW9uTmFtZSIsImNsYXNzTmFtZSIsInRyaWdnZXJOYW1lIiwidXJsIiwiX0dsb2JhbENvbmZpZyIsIl9BdWRpZW5jZSIsImxhc3RVc2VkIiwidGltZXNVc2VkIiwicmVxdWlyZWRDb2x1bW5zIiwic3lzdGVtQ2xhc3NlcyIsInZvbGF0aWxlQ2xhc3NlcyIsInVzZXJJZFJlZ2V4Iiwicm9sZVJlZ2V4IiwicHVibGljUmVnZXgiLCJyZXF1aXJlQXV0aGVudGljYXRpb25SZWdleCIsInBlcm1pc3Npb25LZXlSZWdleCIsInZlcmlmeVBlcm1pc3Npb25LZXkiLCJrZXkiLCJyZXN1bHQiLCJyZWR1Y2UiLCJpc0dvb2QiLCJyZWdFeCIsIm1hdGNoIiwiRXJyb3IiLCJJTlZBTElEX0pTT04iLCJDTFBWYWxpZEtleXMiLCJ2YWxpZGF0ZUNMUCIsInBlcm1zIiwiZmllbGRzIiwia2V5cyIsImZvckVhY2giLCJvcGVyYXRpb24iLCJpbmRleE9mIiwiQXJyYXkiLCJpc0FycmF5IiwicGVybSIsImpvaW5DbGFzc1JlZ2V4IiwiY2xhc3NBbmRGaWVsZFJlZ2V4IiwiY2xhc3NOYW1lSXNWYWxpZCIsInRlc3QiLCJmaWVsZE5hbWVJc1ZhbGlkIiwiZmllbGROYW1lIiwiZmllbGROYW1lSXNWYWxpZEZvckNsYXNzIiwiaW52YWxpZENsYXNzTmFtZU1lc3NhZ2UiLCJpbnZhbGlkSnNvbkVycm9yIiwidmFsaWROb25SZWxhdGlvbk9yUG9pbnRlclR5cGVzIiwiZmllbGRUeXBlSXNJbnZhbGlkIiwiSU5WQUxJRF9DTEFTU19OQU1FIiwidW5kZWZpbmVkIiwiSU5DT1JSRUNUX1RZUEUiLCJjb252ZXJ0U2NoZW1hVG9BZGFwdGVyU2NoZW1hIiwic2NoZW1hIiwiaW5qZWN0RGVmYXVsdFNjaGVtYSIsIl9ycGVybSIsIl93cGVybSIsIl9oYXNoZWRfcGFzc3dvcmQiLCJjb252ZXJ0QWRhcHRlclNjaGVtYVRvUGFyc2VTY2hlbWEiLCJpbmRleGVzIiwibGVuZ3RoIiwiU2NoZW1hRGF0YSIsImNvbnN0cnVjdG9yIiwiYWxsU2NoZW1hcyIsIl9fZGF0YSIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiZGF0YSIsImNsYXNzTGV2ZWxQZXJtaXNzaW9ucyIsImRlZmF1bHRTY2hlbWEiLCJfSG9va3NTY2hlbWEiLCJfR2xvYmFsQ29uZmlnU2NoZW1hIiwiX1B1c2hTdGF0dXNTY2hlbWEiLCJfSm9iU3RhdHVzU2NoZW1hIiwiX0pvYlNjaGVkdWxlU2NoZW1hIiwiX0F1ZGllbmNlU2NoZW1hIiwiVm9sYXRpbGVDbGFzc2VzU2NoZW1hcyIsImRiVHlwZU1hdGNoZXNPYmplY3RUeXBlIiwiZGJUeXBlIiwib2JqZWN0VHlwZSIsInR5cGVUb1N0cmluZyIsIlNjaGVtYUNvbnRyb2xsZXIiLCJkYXRhYmFzZUFkYXB0ZXIiLCJzY2hlbWFDYWNoZSIsIl9kYkFkYXB0ZXIiLCJfY2FjaGUiLCJzY2hlbWFEYXRhIiwicmVsb2FkRGF0YSIsIm9wdGlvbnMiLCJjbGVhckNhY2hlIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsImNsZWFyIiwicmVsb2FkRGF0YVByb21pc2UiLCJnZXRBbGxDbGFzc2VzIiwiZXJyIiwiYWxsQ2xhc3NlcyIsIm1hcCIsInNldEFsbENsYXNzZXMiLCJnZXRPbmVTY2hlbWEiLCJhbGxvd1ZvbGF0aWxlQ2xhc3NlcyIsImNhY2hlZCIsImdldENsYXNzIiwic2V0T25lU2NoZW1hIiwiYWRkQ2xhc3NJZk5vdEV4aXN0cyIsInZhbGlkYXRpb25FcnJvciIsInZhbGlkYXRlTmV3Q2xhc3MiLCJyZWplY3QiLCJjcmVhdGVDbGFzcyIsInJlcyIsImNhdGNoIiwiZXJyb3IiLCJjb2RlIiwiRFVQTElDQVRFX1ZBTFVFIiwidXBkYXRlQ2xhc3MiLCJzdWJtaXR0ZWRGaWVsZHMiLCJkYXRhYmFzZSIsImV4aXN0aW5nRmllbGRzIiwiZmllbGQiLCJfX29wIiwibmV3U2NoZW1hIiwiYnVpbGRNZXJnZWRTY2hlbWFPYmplY3QiLCJkZWZhdWx0RmllbGRzIiwiZnVsbE5ld1NjaGVtYSIsImFzc2lnbiIsInZhbGlkYXRlU2NoZW1hRGF0YSIsImRlbGV0ZWRGaWVsZHMiLCJpbnNlcnRlZEZpZWxkcyIsInB1c2giLCJkZWxldGVQcm9taXNlIiwiZGVsZXRlRmllbGRzIiwicHJvbWlzZXMiLCJlbmZvcmNlRmllbGRFeGlzdHMiLCJhbGwiLCJzZXRQZXJtaXNzaW9ucyIsInNldEluZGV4ZXNXaXRoU2NoZW1hRm9ybWF0IiwicmVsb2FkZWRTY2hlbWEiLCJlbmZvcmNlQ2xhc3NFeGlzdHMiLCJleGlzdGluZ0ZpZWxkTmFtZXMiLCJJTlZBTElEX0tFWV9OQU1FIiwiZ2VvUG9pbnRzIiwiZmlsdGVyIiwic2V0Q2xhc3NMZXZlbFBlcm1pc3Npb25zIiwic3BsaXQiLCJleHBlY3RlZFR5cGUiLCJnZXRFeHBlY3RlZFR5cGUiLCJhZGRGaWVsZElmTm90RXhpc3RzIiwiZGVsZXRlRmllbGQiLCJmaWVsZE5hbWVzIiwic2NoZW1hRmllbGRzIiwiYWRhcHRlciIsImRlbGV0ZUNsYXNzIiwidmFsaWRhdGVPYmplY3QiLCJvYmplY3QiLCJnZW9jb3VudCIsImV4cGVjdGVkIiwiZ2V0VHlwZSIsInRoZW5WYWxpZGF0ZVJlcXVpcmVkQ29sdW1ucyIsInZhbGlkYXRlUmVxdWlyZWRDb2x1bW5zIiwiY29sdW1ucyIsIm1pc3NpbmdDb2x1bW5zIiwiY29sdW1uIiwidGVzdFBlcm1pc3Npb25zRm9yQ2xhc3NOYW1lIiwiYWNsR3JvdXAiLCJ0ZXN0UGVybWlzc2lvbnMiLCJnZXRDbGFzc0xldmVsUGVybWlzc2lvbnMiLCJjbGFzc1Blcm1pc3Npb25zIiwic29tZSIsImFjbCIsInZhbGlkYXRlUGVybWlzc2lvbiIsIk9CSkVDVF9OT1RfRk9VTkQiLCJwZXJtaXNzaW9uRmllbGQiLCJPUEVSQVRJT05fRk9SQklEREVOIiwiaGFzQ2xhc3MiLCJsb2FkIiwiZGJBZGFwdGVyIiwicHV0UmVxdWVzdCIsInN5c1NjaGVtYUZpZWxkIiwiX2lkIiwib2xkRmllbGQiLCJmaWVsZElzRGVsZXRlZCIsIm5ld0ZpZWxkIiwic2NoZW1hUHJvbWlzZSIsIm9iaiIsImdldE9iamVjdFR5cGUiLCJfX3R5cGUiLCJpc28iLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImJhc2U2NCIsImNvb3JkaW5hdGVzIiwib2JqZWN0cyIsIm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFrQkE7O0FBQ0E7Ozs7Ozs7Ozs7QUFsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0JELEtBQXBDOztBQVdBLE1BQU1FLGNBQTBDLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQy9EO0FBQ0FDLEVBQUFBLFFBQVEsRUFBRTtBQUNSQyxJQUFBQSxRQUFRLEVBQUU7QUFBRUMsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FERjtBQUVSQyxJQUFBQSxTQUFTLEVBQUU7QUFBRUQsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FGSDtBQUdSRSxJQUFBQSxTQUFTLEVBQUU7QUFBRUYsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FISDtBQUlSRyxJQUFBQSxHQUFHLEVBQUU7QUFBRUgsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFKRyxHQUZxRDtBQVEvRDtBQUNBSSxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsUUFBUSxFQUFFO0FBQUVMLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBREw7QUFFTE0sSUFBQUEsUUFBUSxFQUFFO0FBQUVOLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBRkw7QUFHTE8sSUFBQUEsS0FBSyxFQUFFO0FBQUVQLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBSEY7QUFJTFEsSUFBQUEsYUFBYSxF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O0FBekNKOztBQTJDQSxVQUFNLElBQUk5USxLQUFLLENBQUN1RyxLQUFWLENBQ0p2RyxLQUFLLENBQUN1RyxLQUFOLENBQVkwQixjQURSLEVBRUoseUJBQXlCc0ksR0FBRyxDQUFDRSxNQUZ6QixDQUFOO0FBSUQ7O0FBQ0QsTUFBSUYsR0FBRyxDQUFDLEtBQUQsQ0FBUCxFQUFnQjtBQUNkLFdBQU9DLGFBQWEsQ0FBQ0QsR0FBRyxDQUFDLEtBQUQsQ0FBSixDQUFwQjtBQUNEOztBQUNELE1BQUlBLEdBQUcsQ0FBQ2hFLElBQVIsRUFBYztBQUNaLFlBQVFnRSxHQUFHLENBQUNoRSxJQUFaO0FBQ0UsV0FBSyxXQUFMO0FBQ0UsZUFBTyxRQUFQOztBQUNGLFdBQUssUUFBTDtBQUNFLGVBQU8sSUFBUDs7QUFDRixXQUFLLEtBQUw7QUFDQSxXQUFLLFdBQUw7QUFDQSxXQUFLLFFBQUw7QUFDRSxlQUFPLE9BQVA7O0FBQ0YsV0FBSyxhQUFMO0FBQ0EsV0FBSyxnQkFBTDtBQUNFLGVBQU87QUFDTGhNLFVBQUFBLElBQUksRUFBRSxVQUREO0FBRUwyQixVQUFBQSxXQUFXLEVBQUVxTyxHQUFHLENBQUNRLE9BQUosQ0FBWSxDQUFaLEVBQWU5TDtBQUZ2QixTQUFQOztBQUlGLFdBQUssT0FBTDtBQUNFLGVBQU91TCxhQUFhLENBQUNELEdBQUcsQ0FBQ1MsR0FBSixDQUFRLENBQVIsQ0FBRCxDQUFwQjs7QUFDRjtBQUNFLGNBQU0sb0JBQW9CVCxHQUFHLENBQUNoRSxJQUE5QjtBQWxCSjtBQW9CRDs7QUFDRCxTQUFPLFFBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vLyBUaGlzIGNsYXNzIGhhbmRsZXMgc2NoZW1hIHZhbGlkYXRpb24sIHBlcnNpc3RlbmNlLCBhbmQgbW9kaWZpY2F0aW9uLlxuLy9cbi8vIEVhY2ggaW5kaXZpZHVhbCBTY2hlbWEgb2JqZWN0IHNob3VsZCBiZSBpbW11dGFibGUuIFRoZSBoZWxwZXJzIHRvXG4vLyBkbyB0aGluZ3Mgd2l0aCB0aGUgU2NoZW1hIGp1c3QgcmV0dXJuIGEgbmV3IHNjaGVtYSB3aGVuIHRoZSBzY2hlbWFcbi8vIGlzIGNoYW5nZWQuXG4vL1xuLy8gVGhlIGNhbm9uaWNhbCBwbGFjZSB0byBzdG9yZSB0aGlzIFNjaGVtYSBpcyBpbiB0aGUgZGF0YWJhc2UgaXRzZWxmLFxuLy8gaW4gYSBfU0NIRU1BIGNvbGxlY3Rpb24uIFRoaXMgaXMgbm90IHRoZSByaWdodCB3YXkgdG8gZG8gaXQgZm9yIGFuXG4vLyBvcGVuIHNvdXJjZSBmcmFtZXdvcmssIGJ1dCBpdCdzIGJhY2t3YXJkIGNvbXBhdGlibGUsIHNvIHdlJ3JlXG4vLyBrZWVwaW5nIGl0IHRoaXMgd2F5IGZvciBub3cuXG4vL1xuLy8gSW4gQVBJLWhhbmRsaW5nIGNvZGUsIHlvdSBzaG91bGQgb25seSB1c2UgdGhlIFNjaGVtYSBjbGFzcyB2aWEgdGhlXG4vLyBEYXRhYmFzZUNvbnRyb2xsZXIuIFRoaXMgd2lsbCBsZXQgdXMgcmVwbGFjZSB0aGUgc2NoZW1hIGxvZ2ljIGZvclxuLy8gZGlmZmVyZW50IGRhdGFiYXNlcy5cbi8vIFRPRE86IGhpZGUgYWxsIHNjaGVtYSBsb2dpYyBpbnNpZGUgdGhlIGRhdGFiYXNlIGFkYXB0ZXIuXG4vLyBAZmxvdy1kaXNhYmxlLW5leHRcbmNvbnN0IFBhcnNlID0gcmVxdWlyZSgncGFyc2Uvbm9kZScpLlBhcnNlO1xuaW1wb3J0IHsgU3RvcmFnZUFkYXB0ZXIgfSBmcm9tICcuLi9BZGFwdGVycy9TdG9yYWdlL1N0b3JhZ2VBZGFwdGVyJztcbmltcG9ydCBEYXRhYmFzZUNvbnRyb2xsZXIgZnJvbSAnLi9EYXRhYmFzZUNvbnRyb2xsZXInO1xuaW1wb3J0IHR5cGUge1xuICBTY2hlbWEsXG4gIFNjaGVtYUZpZWxkcyxcbiAgQ2xhc3NMZXZlbFBlcm1pc3Npb25zLFxuICBTY2hlbWFGaWVsZCxcbiAgTG9hZFNjaGVtYU9wdGlvbnMsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBkZWZhdWx0Q29sdW1uczogeyBbc3RyaW5nXTogU2NoZW1hRmllbGRzIH0gPSBPYmplY3QuZnJlZXplKHtcbiAgLy8gQ29udGFpbiB0aGUgZGVmYXVsdCBjb2x1bW5zIGZvciBldmVyeSBwYXJzZSBvYmplY3QgdHlwZSAoZXhjZXB0IF9Kb2luIGNvbGxlY3Rpb24pXG4gIF9EZWZhdWx0OiB7XG4gICAgb2JqZWN0SWQ6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBjcmVhdGVkQXQ6IHsgdHlwZTogJ0RhdGUnIH0sXG4gICAgdXBkYXRlZEF0OiB7IHR5cGU6ICdEYXRlJyB9LFxuICAgIEFDTDogeyB0eXBlOiAnQUNMJyB9LFxuICB9LFxuICAvLyBUaGUgYWRkaXRpb25hbCBkZWZhdWx0IGNvbHVtbnMgZm9yIHRoZSBfVXNlciBjb2xsZWN0aW9uIChpbiBhZGRpdGlvbiB0byBEZWZhdWx0Q29scylcbiAgX1VzZXI6IHtcbiAgICB1c2VybmFtZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHBhc3N3b3JkOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgZW1haWw6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBlbWFpbFZlcmlmaWVkOiB7IHR5cGU6ICdCb29sZWFuJyB9LFxuICAgIGF1dGhEYXRhOiB7IHR5cGU6ICdPYmplY3QnIH0sXG4gIH0sXG4gIC8vIFRoZSBhZGRpdGlvbmFsIGRlZmF1bHQgY29sdW1ucyBmb3IgdGhlIF9JbnN0YWxsYXRpb24gY29sbGVjdGlvbiAoaW4gYWRkaXRpb24gdG8gRGVmYXVsdENvbHMpXG4gIF9JbnN0YWxsYXRpb246IHtcbiAgICBpbnN0YWxsYXRpb25JZDogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIGRldmljZVRva2VuOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgY2hhbm5lbHM6IHsgdHlwZTogJ0FycmF5JyB9LFxuICAgIGRldmljZVR5cGU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBwdXNoVHlwZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIEdDTVNlbmRlcklkOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgdGltZVpvbmU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBsb2NhbGVJZGVudGlmaWVyOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgYmFkZ2U6IHsgdHlwZTogJ051bWJlcicgfSxcbiAgICBhcHBWZXJzaW9uOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgYXBwTmFtZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIGFwcElkZW50aWZpZXI6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBwYXJzZVZlcnNpb246IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgfSxcbiAgLy8gVGhlIGFkZGl0aW9uYWwgZGVmYXVsdCBjb2x1bW5zIGZvciB0aGUgX1JvbGUgY29sbGVjdGlvbiAoaW4gYWRkaXRpb24gdG8gRGVmYXVsdENvbHMpXG4gIF9Sb2xlOiB7XG4gICAgbmFtZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHVzZXJzOiB7IHR5cGU6ICdSZWxhdGlvbicsIHRhcmdldENsYXNzOiAnX1VzZXInIH0sXG4gICAgcm9sZXM6IHsgdHlwZTogJ1JlbGF0aW9uJywgdGFyZ2V0Q2xhc3M6ICdfUm9sZScgfSxcbiAgfSxcbiAgLy8gVGhlIGFkZGl0aW9uYWwgZGVmYXVsdCBjb2x1bW5zIGZvciB0aGUgX1Nlc3Npb24gY29sbGVjdGlvbiAoaW4gYWRkaXRpb24gdG8gRGVmYXVsdENvbHMpXG4gIF9TZXNzaW9uOiB7XG4gICAgcmVzdHJpY3RlZDogeyB0eXBlOiAnQm9vbGVhbicgfSxcbiAgICB1c2VyOiB7IHR5cGU6ICdQb2ludGVyJywgdGFyZ2V0Q2xhc3M6ICdfVXNlcicgfSxcbiAgICBpbnN0YWxsYXRpb25JZDogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHNlc3Npb25Ub2tlbjogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIGV4cGlyZXNBdDogeyB0eXBlOiAnRGF0ZScgfSxcbiAgICBjcmVhdGVkV2l0aDogeyB0eXBlOiAnT2JqZWN0JyB9LFxuICB9LFxuICBfUHJvZHVjdDoge1xuICAgIHByb2R1Y3RJZGVudGlmaWVyOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgZG93bmxvYWQ6IHsgdHlwZTogJ0ZpbGUnIH0sXG4gICAgZG93bmxvYWROYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgaWNvbjogeyB0eXBlOiAnRmlsZScgfSxcbiAgICBvcmRlcjogeyB0eXBlOiAnTnVtYmVyJyB9LFxuICAgIHRpdGxlOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgc3VidGl0bGU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgfSxcbiAgX1B1c2hTdGF0dXM6IHtcbiAgICBwdXNoVGltZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHNvdXJjZTogeyB0eXBlOiAnU3RyaW5nJyB9LCAvLyByZXN0IG9yIHdlYnVpXG4gICAgcXVlcnk6IHsgdHlwZTogJ1N0cmluZycgfSwgLy8gdGhlIHN0cmluZ2lmaWVkIEpTT04gcXVlcnlcbiAgICBwYXlsb2FkOiB7IHR5cGU6ICdTdHJpbmcnIH0sIC8vIHRoZSBzdHJpbmdpZmllZCBKU09OIHBheWxvYWQsXG4gICAgdGl0bGU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBleHBpcnk6IHsgdHlwZTogJ051bWJlcicgfSxcbiAgICBleHBpcmF0aW9uX2ludGVydmFsOiB7IHR5cGU6ICdOdW1iZXInIH0sXG4gICAgc3RhdHVzOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgbnVtU2VudDogeyB0eXBlOiAnTnVtYmVyJyB9LFxuICAgIG51bUZhaWxlZDogeyB0eXBlOiAnTnVtYmVyJyB9LFxuICAgIHB1c2hIYXNoOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgZXJyb3JNZXNzYWdlOiB7IHR5cGU6ICdPYmplY3QnIH0sXG4gICAgc2VudFBlclR5cGU6IHsgdHlwZTogJ09iamVjdCcgfSxcbiAgICBmYWlsZWRQZXJUeXBlOiB7IHR5cGU6ICdPYmplY3QnIH0sXG4gICAgc2VudFBlclVUQ09mZnNldDogeyB0eXBlOiAnT2JqZWN0JyB9LFxuICAgIGZhaWxlZFBlclVUQ09mZnNldDogeyB0eXBlOiAnT2JqZWN0JyB9LFxuICAgIGNvdW50OiB7IHR5cGU6ICdOdW1iZXInIH0sIC8vIHRyYWNrcyAjIG9mIGJhdGNoZXMgcXVldWVkIGFuZCBwZW5kaW5nXG4gIH0sXG4gIF9Kb2JTdGF0dXM6IHtcbiAgICBqb2JOYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgc291cmNlOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgc3RhdHVzOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgbWVzc2FnZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHBhcmFtczogeyB0eXBlOiAnT2JqZWN0JyB9LCAvLyBwYXJhbXMgcmVjZWl2ZWQgd2hlbiBjYWxsaW5nIHRoZSBqb2JcbiAgICBmaW5pc2hlZEF0OiB7IHR5cGU6ICdEYXRlJyB9LFxuICB9LFxuICBfSm9iU2NoZWR1bGU6IHtcbiAgICBqb2JOYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgZGVzY3JpcHRpb246IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBwYXJhbXM6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICBzdGFydEFmdGVyOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgZGF5c09mV2VlazogeyB0eXBlOiAnQXJyYXknIH0sXG4gICAgdGltZU9mRGF5OiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgbGFzdFJ1bjogeyB0eXBlOiAnTnVtYmVyJyB9LFxuICAgIHJlcGVhdE1pbnV0ZXM6IHsgdHlwZTogJ051bWJlcicgfSxcbiAgfSxcbiAgX0hvb2tzOiB7XG4gICAgZnVuY3Rpb25OYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgY2xhc3NOYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgdHJpZ2dlck5hbWU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICB1cmw6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgfSxcbiAgX0dsb2JhbENvbmZpZzoge1xuICAgIG9iamVjdElkOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgcGFyYW1zOiB7IHR5cGU6ICdPYmplY3QnIH0sXG4gIH0sXG4gIF9BdWRpZW5jZToge1xuICAgIG9iamVjdElkOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgbmFtZTogeyB0eXBlOiAnU3RyaW5nJyB9LFxuICAgIHF1ZXJ5OiB7IHR5cGU6ICdTdHJpbmcnIH0sIC8vc3RvcmluZyBxdWVyeSBhcyBKU09OIHN0cmluZyB0byBwcmV2ZW50IFwiTmVzdGVkIGtleXMgc2hvdWxkIG5vdCBjb250YWluIHRoZSAnJCcgb3IgJy4nIGNoYXJhY3RlcnNcIiBlcnJvclxuICAgIGxhc3RVc2VkOiB7IHR5cGU6ICdEYXRlJyB9LFxuICAgIHRpbWVzVXNlZDogeyB0eXBlOiAnTnVtYmVyJyB9LFxuICB9LFxufSk7XG5cbmNvbnN0IHJlcXVpcmVkQ29sdW1ucyA9IE9iamVjdC5mcmVlemUoe1xuICBfUHJvZHVjdDogWydwcm9kdWN0SWRlbnRpZmllcicsICdpY29uJywgJ29yZGVyJywgJ3RpdGxlJywgJ3N1YnRpdGxlJ10sXG4gIF9Sb2xlOiBbJ25hbWUnLCAnQUNMJ10sXG59KTtcblxuY29uc3Qgc3lzdGVtQ2xhc3NlcyA9IE9iamVjdC5mcmVlemUoW1xuICAnX1VzZXInLFxuICAnX0luc3RhbGxhdGlvbicsXG4gICdfUm9sZScsXG4gICdfU2Vzc2lvbicsXG4gICdfUHJvZHVjdCcsXG4gICdfUHVzaFN0YXR1cycsXG4gICdfSm9iU3RhdHVzJyxcbiAgJ19Kb2JTY2hlZHVsZScsXG4gICdfQXVkaWVuY2UnLFxuXSk7XG5cbmNvbnN0IHZvbGF0aWxlQ2xhc3NlcyA9IE9iamVjdC5mcmVlemUoW1xuICAnX0pvYlN0YXR1cycsXG4gICdfUHVzaFN0YXR1cycsXG4gICdfSG9va3MnLFxuICAnX0dsb2JhbENvbmZpZycsXG4gICdfSm9iU2NoZWR1bGUnLFxuICAnX0F1ZGllbmNlJyxcbl0pO1xuXG4vLyAxMCBhbHBoYSBudW1iZXJpYyBjaGFycyArIHVwcGVyY2FzZVxuY29uc3QgdXNlcklkUmVnZXggPSAvXlthLXpBLVowLTldezEwfSQvO1xuLy8gQW55dGhpbmcgdGhhdCBzdGFydCB3aXRoIHJvbGVcbmNvbnN0IHJvbGVSZWdleCA9IC9ecm9sZTouKi87XG4vLyAqIHBlcm1pc3Npb25cbmNvbnN0IHB1YmxpY1JlZ2V4ID0gL15cXCokLztcblxuY29uc3QgcmVxdWlyZUF1dGhlbnRpY2F0aW9uUmVnZXggPSAvXnJlcXVpcmVzQXV0aGVudGljYXRpb24kLztcblxuY29uc3QgcGVybWlzc2lvbktleVJlZ2V4ID0gT2JqZWN0LmZyZWV6ZShbXG4gIHVzZXJJZFJlZ2V4LFxuICByb2xlUmVnZXgsXG4gIHB1YmxpY1JlZ2V4LFxuICByZXF1aXJlQXV0aGVudGljYXRpb25SZWdleCxcbl0pO1xuXG5mdW5jdGlvbiB2ZXJpZnlQZXJtaXNzaW9uS2V5KGtleSkge1xuICBjb25zdCByZXN1bHQgPSBwZXJtaXNzaW9uS2V5UmVnZXgucmVkdWNlKChpc0dvb2QsIHJlZ0V4KSA9PiB7XG4gICAgaXNHb29kID0gaXNHb29kIHx8IGtleS5tYXRjaChyZWdFeCkgIT0gbnVsbDtcbiAgICByZXR1cm4gaXNHb29kO1xuICB9LCBmYWxzZSk7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgYCcke2tleX0nIGlzIG5vdCBhIHZhbGlkIGtleSBmb3IgY2xhc3MgbGV2ZWwgcGVybWlzc2lvbnNgXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBDTFBWYWxpZEtleXMgPSBPYmplY3QuZnJlZXplKFtcbiAgJ2ZpbmQnLFxuICAnY291bnQnLFxuICAnZ2V0JyxcbiAgJ2NyZWF0ZScsXG4gICd1cGRhdGUnLFxuICAnZGVsZXRlJyxcbiAgJ2FkZEZpZWxkJyxcbiAgJ3JlYWRVc2VyRmllbGRzJyxcbiAgJ3dyaXRlVXNlckZpZWxkcycsXG5dKTtcbmZ1bmN0aW9uIHZhbGlkYXRlQ0xQKHBlcm1zOiBDbGFzc0xldmVsUGVybWlzc2lvbnMsIGZpZWxkczogU2NoZW1hRmllbGRzKSB7XG4gIGlmICghcGVybXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgT2JqZWN0LmtleXMocGVybXMpLmZvckVhY2gob3BlcmF0aW9uID0+IHtcbiAgICBpZiAoQ0xQVmFsaWRLZXlzLmluZGV4T2Yob3BlcmF0aW9uKSA9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgIGAke29wZXJhdGlvbn0gaXMgbm90IGEgdmFsaWQgb3BlcmF0aW9uIGZvciBjbGFzcyBsZXZlbCBwZXJtaXNzaW9uc2BcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICghcGVybXNbb3BlcmF0aW9uXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcGVyYXRpb24gPT09ICdyZWFkVXNlckZpZWxkcycgfHwgb3BlcmF0aW9uID09PSAnd3JpdGVVc2VyRmllbGRzJykge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBlcm1zW29wZXJhdGlvbl0pKSB7XG4gICAgICAgIC8vIEBmbG93LWRpc2FibGUtbmV4dFxuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIGAnJHtcbiAgICAgICAgICAgIHBlcm1zW29wZXJhdGlvbl1cbiAgICAgICAgICB9JyBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgY2xhc3MgbGV2ZWwgcGVybWlzc2lvbnMgJHtvcGVyYXRpb259YFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybXNbb3BlcmF0aW9uXS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWZpZWxkc1trZXldIHx8XG4gICAgICAgICAgICBmaWVsZHNba2V5XS50eXBlICE9ICdQb2ludGVyJyB8fFxuICAgICAgICAgICAgZmllbGRzW2tleV0udGFyZ2V0Q2xhc3MgIT0gJ19Vc2VyJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgICAgIGAnJHtrZXl9JyBpcyBub3QgYSB2YWxpZCBjb2x1bW4gZm9yIGNsYXNzIGxldmVsIHBvaW50ZXIgcGVybWlzc2lvbnMgJHtvcGVyYXRpb259YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEBmbG93LWRpc2FibGUtbmV4dFxuICAgIE9iamVjdC5rZXlzKHBlcm1zW29wZXJhdGlvbl0pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHZlcmlmeVBlcm1pc3Npb25LZXkoa2V5KTtcbiAgICAgIC8vIEBmbG93LWRpc2FibGUtbmV4dFxuICAgICAgY29uc3QgcGVybSA9IHBlcm1zW29wZXJhdGlvbl1ba2V5XTtcbiAgICAgIGlmIChwZXJtICE9PSB0cnVlKSB7XG4gICAgICAgIC8vIEBmbG93LWRpc2FibGUtbmV4dFxuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIGAnJHtwZXJtfScgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGNsYXNzIGxldmVsIHBlcm1pc3Npb25zICR7b3BlcmF0aW9ufToke2tleX06JHtwZXJtfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5jb25zdCBqb2luQ2xhc3NSZWdleCA9IC9eX0pvaW46W0EtWmEtejAtOV9dKzpbQS1aYS16MC05X10rLztcbmNvbnN0IGNsYXNzQW5kRmllbGRSZWdleCA9IC9eW0EtWmEtel1bQS1aYS16MC05X10qJC87XG5mdW5jdGlvbiBjbGFzc05hbWVJc1ZhbGlkKGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFZhbGlkIGNsYXNzZXMgbXVzdDpcbiAgcmV0dXJuIChcbiAgICAvLyBCZSBvbmUgb2YgX1VzZXIsIF9JbnN0YWxsYXRpb24sIF9Sb2xlLCBfU2Vzc2lvbiBPUlxuICAgIHN5c3RlbUNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpID4gLTEgfHxcbiAgICAvLyBCZSBhIGpvaW4gdGFibGUgT1JcbiAgICBqb2luQ2xhc3NSZWdleC50ZXN0KGNsYXNzTmFtZSkgfHxcbiAgICAvLyBJbmNsdWRlIG9ubHkgYWxwaGEtbnVtZXJpYyBhbmQgdW5kZXJzY29yZXMsIGFuZCBub3Qgc3RhcnQgd2l0aCBhbiB1bmRlcnNjb3JlIG9yIG51bWJlclxuICAgIGZpZWxkTmFtZUlzVmFsaWQoY2xhc3NOYW1lKVxuICApO1xufVxuXG4vLyBWYWxpZCBmaWVsZHMgbXVzdCBiZSBhbHBoYS1udW1lcmljLCBhbmQgbm90IHN0YXJ0IHdpdGggYW4gdW5kZXJzY29yZSBvciBudW1iZXJcbmZ1bmN0aW9uIGZpZWxkTmFtZUlzVmFsaWQoZmllbGROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsYXNzQW5kRmllbGRSZWdleC50ZXN0KGZpZWxkTmFtZSk7XG59XG5cbi8vIENoZWNrcyB0aGF0IGl0J3Mgbm90IHRyeWluZyB0byBjbG9iYmVyIG9uZSBvZiB0aGUgZGVmYXVsdCBmaWVsZHMgb2YgdGhlIGNsYXNzLlxuZnVuY3Rpb24gZmllbGROYW1lSXNWYWxpZEZvckNsYXNzKFxuICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgY2xhc3NOYW1lOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICBpZiAoIWZpZWxkTmFtZUlzVmFsaWQoZmllbGROYW1lKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZGVmYXVsdENvbHVtbnMuX0RlZmF1bHRbZmllbGROYW1lXSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZGVmYXVsdENvbHVtbnNbY2xhc3NOYW1lXSAmJiBkZWZhdWx0Q29sdW1uc1tjbGFzc05hbWVdW2ZpZWxkTmFtZV0pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGludmFsaWRDbGFzc05hbWVNZXNzYWdlKGNsYXNzTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIChcbiAgICAnSW52YWxpZCBjbGFzc25hbWU6ICcgK1xuICAgIGNsYXNzTmFtZSArXG4gICAgJywgY2xhc3NuYW1lcyBjYW4gb25seSBoYXZlIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGFuZCBfLCBhbmQgbXVzdCBzdGFydCB3aXRoIGFuIGFscGhhIGNoYXJhY3RlciAnXG4gICk7XG59XG5cbmNvbnN0IGludmFsaWRKc29uRXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgJ2ludmFsaWQgSlNPTidcbik7XG5jb25zdCB2YWxpZE5vblJlbGF0aW9uT3JQb2ludGVyVHlwZXMgPSBbXG4gICdOdW1iZXInLFxuICAnU3RyaW5nJyxcbiAgJ0Jvb2xlYW4nLFxuICAnRGF0ZScsXG4gICdPYmplY3QnLFxuICAnQXJyYXknLFxuICAnR2VvUG9pbnQnLFxuICAnRmlsZScsXG4gICdCeXRlcycsXG4gICdQb2x5Z29uJyxcbl07XG4vLyBSZXR1cm5zIGFuIGVycm9yIHN1aXRhYmxlIGZvciB0aHJvd2luZyBpZiB0aGUgdHlwZSBpcyBpbnZhbGlkXG5jb25zdCBmaWVsZFR5cGVJc0ludmFsaWQgPSAoeyB0eXBlLCB0YXJnZXRDbGFzcyB9KSA9PiB7XG4gIGlmIChbJ1BvaW50ZXInLCAnUmVsYXRpb24nXS5pbmRleE9mKHR5cGUpID49IDApIHtcbiAgICBpZiAoIXRhcmdldENsYXNzKSB7XG4gICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKDEzNSwgYHR5cGUgJHt0eXBlfSBuZWVkcyBhIGNsYXNzIG5hbWVgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRDbGFzcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBpbnZhbGlkSnNvbkVycm9yO1xuICAgIH0gZWxzZSBpZiAoIWNsYXNzTmFtZUlzVmFsaWQodGFyZ2V0Q2xhc3MpKSB7XG4gICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0NMQVNTX05BTUUsXG4gICAgICAgIGludmFsaWRDbGFzc05hbWVNZXNzYWdlKHRhcmdldENsYXNzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBpbnZhbGlkSnNvbkVycm9yO1xuICB9XG4gIGlmICh2YWxpZE5vblJlbGF0aW9uT3JQb2ludGVyVHlwZXMuaW5kZXhPZih0eXBlKSA8IDApIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgUGFyc2UuRXJyb3IuSU5DT1JSRUNUX1RZUEUsXG4gICAgICBgaW52YWxpZCBmaWVsZCB0eXBlOiAke3R5cGV9YFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IGNvbnZlcnRTY2hlbWFUb0FkYXB0ZXJTY2hlbWEgPSAoc2NoZW1hOiBhbnkpID0+IHtcbiAgc2NoZW1hID0gaW5qZWN0RGVmYXVsdFNjaGVtYShzY2hlbWEpO1xuICBkZWxldGUgc2NoZW1hLmZpZWxkcy5BQ0w7XG4gIHNjaGVtYS5maWVsZHMuX3JwZXJtID0geyB0eXBlOiAnQXJyYXknIH07XG4gIHNjaGVtYS5maWVsZHMuX3dwZXJtID0geyB0eXBlOiAnQXJyYXknIH07XG5cbiAgaWYgKHNjaGVtYS5jbGFzc05hbWUgPT09ICdfVXNlcicpIHtcbiAgICBkZWxldGUgc2NoZW1hLmZpZWxkcy5wYXNzd29yZDtcbiAgICBzY2hlbWEuZmllbGRzLl9oYXNoZWRfcGFzc3dvcmQgPSB7IHR5cGU6ICdTdHJpbmcnIH07XG4gIH1cblxuICByZXR1cm4gc2NoZW1hO1xufTtcblxuY29uc3QgY29udmVydEFkYXB0ZXJTY2hlbWFUb1BhcnNlU2NoZW1hID0gKHsgLi4uc2NoZW1hIH0pID0+IHtcbiAgZGVsZXRlIHNjaGVtYS5maWVsZHMuX3JwZXJtO1xuICBkZWxldGUgc2NoZW1hLmZpZWxkcy5fd3Blcm07XG5cbiAgc2NoZW1hLmZpZWxkcy5BQ0wgPSB7IHR5cGU6ICdBQ0wnIH07XG5cbiAgaWYgKHNjaGVtYS5jbGFzc05hbWUgPT09ICdfVXNlcicpIHtcbiAgICBkZWxldGUgc2NoZW1hLmZpZWxkcy5hdXRoRGF0YTsgLy9BdXRoIGRhdGEgaXMgaW1wbGljaXRcbiAgICBkZWxldGUgc2NoZW1hLmZpZWxkcy5faGFzaGVkX3Bhc3N3b3JkO1xuICAgIHNjaGVtYS5maWVsZHMucGFzc3dvcmQgPSB7IHR5cGU6ICdTdHJpbmcnIH07XG4gIH1cblxuICBpZiAoc2NoZW1hLmluZGV4ZXMgJiYgT2JqZWN0LmtleXMoc2NoZW1hLmluZGV4ZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlbGV0ZSBzY2hlbWEuaW5kZXhlcztcbiAgfVxuXG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5jbGFzcyBTY2hlbWFEYXRhIHtcbiAgX19kYXRhOiBhbnk7XG4gIGNvbnN0cnVjdG9yKGFsbFNjaGVtYXMgPSBbXSkge1xuICAgIHRoaXMuX19kYXRhID0ge307XG4gICAgYWxsU2NoZW1hcy5mb3JFYWNoKHNjaGVtYSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2NoZW1hLmNsYXNzTmFtZSwge1xuICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuX19kYXRhW3NjaGVtYS5jbGFzc05hbWVdKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmZpZWxkcyA9IGluamVjdERlZmF1bHRTY2hlbWEoc2NoZW1hKS5maWVsZHM7XG4gICAgICAgICAgICBkYXRhLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucyA9IHNjaGVtYS5jbGFzc0xldmVsUGVybWlzc2lvbnM7XG4gICAgICAgICAgICBkYXRhLmluZGV4ZXMgPSBzY2hlbWEuaW5kZXhlcztcbiAgICAgICAgICAgIHRoaXMuX19kYXRhW3NjaGVtYS5jbGFzc05hbWVdID0gZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19kYXRhW3NjaGVtYS5jbGFzc05hbWVdO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbmplY3QgdGhlIGluLW1lbW9yeSBjbGFzc2VzXG4gICAgdm9sYXRpbGVDbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBjbGFzc05hbWUsIHtcbiAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9fZGF0YVtjbGFzc05hbWVdKSB7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWEgPSBpbmplY3REZWZhdWx0U2NoZW1hKHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICBmaWVsZHM6IHt9LFxuICAgICAgICAgICAgICBjbGFzc0xldmVsUGVybWlzc2lvbnM6IHt9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmZpZWxkcyA9IHNjaGVtYS5maWVsZHM7XG4gICAgICAgICAgICBkYXRhLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucyA9IHNjaGVtYS5jbGFzc0xldmVsUGVybWlzc2lvbnM7XG4gICAgICAgICAgICBkYXRhLmluZGV4ZXMgPSBzY2hlbWEuaW5kZXhlcztcbiAgICAgICAgICAgIHRoaXMuX19kYXRhW2NsYXNzTmFtZV0gPSBkYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5fX2RhdGFbY2xhc3NOYW1lXTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGluamVjdERlZmF1bHRTY2hlbWEgPSAoe1xuICBjbGFzc05hbWUsXG4gIGZpZWxkcyxcbiAgY2xhc3NMZXZlbFBlcm1pc3Npb25zLFxuICBpbmRleGVzLFxufTogU2NoZW1hKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRTY2hlbWE6IFNjaGVtYSA9IHtcbiAgICBjbGFzc05hbWUsXG4gICAgZmllbGRzOiB7XG4gICAgICAuLi5kZWZhdWx0Q29sdW1ucy5fRGVmYXVsdCxcbiAgICAgIC4uLihkZWZhdWx0Q29sdW1uc1tjbGFzc05hbWVdIHx8IHt9KSxcbiAgICAgIC4uLmZpZWxkcyxcbiAgICB9LFxuICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgfTtcbiAgaWYgKGluZGV4ZXMgJiYgT2JqZWN0LmtleXMoaW5kZXhlcykubGVuZ3RoICE9PSAwKSB7XG4gICAgZGVmYXVsdFNjaGVtYS5pbmRleGVzID0gaW5kZXhlcztcbiAgfVxuICByZXR1cm4gZGVmYXVsdFNjaGVtYTtcbn07XG5cbmNvbnN0IF9Ib29rc1NjaGVtYSA9IHsgY2xhc3NOYW1lOiAnX0hvb2tzJywgZmllbGRzOiBkZWZhdWx0Q29sdW1ucy5fSG9va3MgfTtcbmNvbnN0IF9HbG9iYWxDb25maWdTY2hlbWEgPSB7XG4gIGNsYXNzTmFtZTogJ19HbG9iYWxDb25maWcnLFxuICBmaWVsZHM6IGRlZmF1bHRDb2x1bW5zLl9HbG9iYWxDb25maWcsXG59O1xuY29uc3QgX1B1c2hTdGF0dXNTY2hlbWEgPSBjb252ZXJ0U2NoZW1hVG9BZGFwdGVyU2NoZW1hKFxuICBpbmplY3REZWZhdWx0U2NoZW1hKHtcbiAgICBjbGFzc05hbWU6ICdfUHVzaFN0YXR1cycsXG4gICAgZmllbGRzOiB7fSxcbiAgICBjbGFzc0xldmVsUGVybWlzc2lvbnM6IHt9LFxuICB9KVxuKTtcbmNvbnN0IF9Kb2JTdGF0dXNTY2hlbWEgPSBjb252ZXJ0U2NoZW1hVG9BZGFwdGVyU2NoZW1hKFxuICBpbmplY3REZWZhdWx0U2NoZW1hKHtcbiAgICBjbGFzc05hbWU6ICdfSm9iU3RhdHVzJyxcbiAgICBmaWVsZHM6IHt9LFxuICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9uczoge30sXG4gIH0pXG4pO1xuY29uc3QgX0pvYlNjaGVkdWxlU2NoZW1hID0gY29udmVydFNjaGVtYVRvQWRhcHRlclNjaGVtYShcbiAgaW5qZWN0RGVmYXVsdFNjaGVtYSh7XG4gICAgY2xhc3NOYW1lOiAnX0pvYlNjaGVkdWxlJyxcbiAgICBmaWVsZHM6IHt9LFxuICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9uczoge30sXG4gIH0pXG4pO1xuY29uc3QgX0F1ZGllbmNlU2NoZW1hID0gY29udmVydFNjaGVtYVRvQWRhcHRlclNjaGVtYShcbiAgaW5qZWN0RGVmYXVsdFNjaGVtYSh7XG4gICAgY2xhc3NOYW1lOiAnX0F1ZGllbmNlJyxcbiAgICBmaWVsZHM6IGRlZmF1bHRDb2x1bW5zLl9BdWRpZW5jZSxcbiAgICBjbGFzc0xldmVsUGVybWlzc2lvbnM6IHt9LFxuICB9KVxuKTtcbmNvbnN0IFZvbGF0aWxlQ2xhc3Nlc1NjaGVtYXMgPSBbXG4gIF9Ib29rc1NjaGVtYSxcbiAgX0pvYlN0YXR1c1NjaGVtYSxcbiAgX0pvYlNjaGVkdWxlU2NoZW1hLFxuICBfUHVzaFN0YXR1c1NjaGVtYSxcbiAgX0dsb2JhbENvbmZpZ1NjaGVtYSxcbiAgX0F1ZGllbmNlU2NoZW1hLFxuXTtcblxuY29uc3QgZGJUeXBlTWF0Y2hlc09iamVjdFR5cGUgPSAoXG4gIGRiVHlwZTogU2NoZW1hRmllbGQgfCBzdHJpbmcsXG4gIG9iamVjdFR5cGU6IFNjaGVtYUZpZWxkXG4pID0+IHtcbiAgaWYgKGRiVHlwZS50eXBlICE9PSBvYmplY3RUeXBlLnR5cGUpIHJldHVybiBmYWxzZTtcbiAgaWYgKGRiVHlwZS50YXJnZXRDbGFzcyAhPT0gb2JqZWN0VHlwZS50YXJnZXRDbGFzcykgcmV0dXJuIGZhbHNlO1xuICBpZiAoZGJUeXBlID09PSBvYmplY3RUeXBlLnR5cGUpIHJldHVybiB0cnVlO1xuICBpZiAoZGJUeXBlLnR5cGUgPT09IG9iamVjdFR5cGUudHlwZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHR5cGVUb1N0cmluZyA9ICh0eXBlOiBTY2hlbWFGaWVsZCB8IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuICBpZiAodHlwZS50YXJnZXRDbGFzcykge1xuICAgIHJldHVybiBgJHt0eXBlLnR5cGV9PCR7dHlwZS50YXJnZXRDbGFzc30+YDtcbiAgfVxuICByZXR1cm4gYCR7dHlwZS50eXBlfWA7XG59O1xuXG4vLyBTdG9yZXMgdGhlIGVudGlyZSBzY2hlbWEgb2YgdGhlIGFwcCBpbiBhIHdlaXJkIGh5YnJpZCBmb3JtYXQgc29tZXdoZXJlIGJldHdlZW5cbi8vIHRoZSBtb25nbyBmb3JtYXQgYW5kIHRoZSBQYXJzZSBmb3JtYXQuIFNvb24sIHRoaXMgd2lsbCBhbGwgYmUgUGFyc2UgZm9ybWF0LlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hQ29udHJvbGxlciB7XG4gIF9kYkFkYXB0ZXI6IFN0b3JhZ2VBZGFwdGVyO1xuICBzY2hlbWFEYXRhOiB7IFtzdHJpbmddOiBTY2hlbWEgfTtcbiAgX2NhY2hlOiBhbnk7XG4gIHJlbG9hZERhdGFQcm9taXNlOiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoZGF0YWJhc2VBZGFwdGVyOiBTdG9yYWdlQWRhcHRlciwgc2NoZW1hQ2FjaGU6IGFueSkge1xuICAgIHRoaXMuX2RiQWRhcHRlciA9IGRhdGFiYXNlQWRhcHRlcjtcbiAgICB0aGlzLl9jYWNoZSA9IHNjaGVtYUNhY2hlO1xuICAgIHRoaXMuc2NoZW1hRGF0YSA9IG5ldyBTY2hlbWFEYXRhKCk7XG4gIH1cblxuICByZWxvYWREYXRhKG9wdGlvbnM6IExvYWRTY2hlbWFPcHRpb25zID0geyBjbGVhckNhY2hlOiBmYWxzZSB9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChvcHRpb25zLmNsZWFyQ2FjaGUpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGUuY2xlYXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZWxvYWREYXRhUHJvbWlzZSAmJiAhb3B0aW9ucy5jbGVhckNhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxvYWREYXRhUHJvbWlzZTtcbiAgICB9XG4gICAgdGhpcy5yZWxvYWREYXRhUHJvbWlzZSA9IHByb21pc2VcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsQ2xhc3NlcyhvcHRpb25zKS50aGVuKFxuICAgICAgICAgIGFsbFNjaGVtYXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY2hlbWFEYXRhID0gbmV3IFNjaGVtYURhdGEoYWxsU2NoZW1hcyk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5yZWxvYWREYXRhUHJvbWlzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjaGVtYURhdGEgPSBuZXcgU2NoZW1hRGF0YSgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucmVsb2FkRGF0YVByb21pc2U7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHt9KTtcbiAgICByZXR1cm4gdGhpcy5yZWxvYWREYXRhUHJvbWlzZTtcbiAgfVxuXG4gIGdldEFsbENsYXNzZXMoXG4gICAgb3B0aW9uczogTG9hZFNjaGVtYU9wdGlvbnMgPSB7IGNsZWFyQ2FjaGU6IGZhbHNlIH1cbiAgKTogUHJvbWlzZTxBcnJheTxTY2hlbWE+PiB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAob3B0aW9ucy5jbGVhckNhY2hlKSB7XG4gICAgICBwcm9taXNlID0gdGhpcy5fY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldEFsbENsYXNzZXMoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihhbGxDbGFzc2VzID0+IHtcbiAgICAgICAgaWYgKGFsbENsYXNzZXMgJiYgYWxsQ2xhc3Nlcy5sZW5ndGggJiYgIW9wdGlvbnMuY2xlYXJDYWNoZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYWxsQ2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiQWRhcHRlclxuICAgICAgICAgIC5nZXRBbGxDbGFzc2VzKClcbiAgICAgICAgICAudGhlbihhbGxTY2hlbWFzID0+IGFsbFNjaGVtYXMubWFwKGluamVjdERlZmF1bHRTY2hlbWEpKVxuICAgICAgICAgIC50aGVuKGFsbFNjaGVtYXMgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLnNldEFsbENsYXNzZXMoYWxsU2NoZW1hcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBhbGxTY2hlbWFzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldE9uZVNjaGVtYShcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBhbGxvd1ZvbGF0aWxlQ2xhc3NlczogYm9vbGVhbiA9IGZhbHNlLFxuICAgIG9wdGlvbnM6IExvYWRTY2hlbWFPcHRpb25zID0geyBjbGVhckNhY2hlOiBmYWxzZSB9XG4gICk6IFByb21pc2U8U2NoZW1hPiB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAob3B0aW9ucy5jbGVhckNhY2hlKSB7XG4gICAgICBwcm9taXNlID0gdGhpcy5fY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAoYWxsb3dWb2xhdGlsZUNsYXNzZXMgJiYgdm9sYXRpbGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnNjaGVtYURhdGFbY2xhc3NOYW1lXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgIGZpZWxkczogZGF0YS5maWVsZHMsXG4gICAgICAgICAgY2xhc3NMZXZlbFBlcm1pc3Npb25zOiBkYXRhLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgICAgICAgICBpbmRleGVzOiBkYXRhLmluZGV4ZXMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldE9uZVNjaGVtYShjbGFzc05hbWUpLnRoZW4oY2FjaGVkID0+IHtcbiAgICAgICAgaWYgKGNhY2hlZCAmJiAhb3B0aW9ucy5jbGVhckNhY2hlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjYWNoZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kYkFkYXB0ZXJcbiAgICAgICAgICAuZ2V0Q2xhc3MoY2xhc3NOYW1lKVxuICAgICAgICAgIC50aGVuKGluamVjdERlZmF1bHRTY2hlbWEpXG4gICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZS5zZXRPbmVTY2hlbWEoY2xhc3NOYW1lLCByZXN1bHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBjbGFzcyB0aGF0IGluY2x1ZGVzIHRoZSB0aHJlZSBkZWZhdWx0IGZpZWxkcy5cbiAgLy8gQUNMIGlzIGFuIGltcGxpY2l0IGNvbHVtbiB0aGF0IGRvZXMgbm90IGdldCBhbiBlbnRyeSBpbiB0aGVcbiAgLy8gX1NDSEVNQVMgZGF0YWJhc2UuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGVcbiAgLy8gY3JlYXRlZCBzY2hlbWEsIGluIG1vbmdvIGZvcm1hdC5cbiAgLy8gb24gc3VjY2VzcywgYW5kIHJlamVjdHMgd2l0aCBhbiBlcnJvciBvbiBmYWlsLiBFbnN1cmUgeW91XG4gIC8vIGhhdmUgYXV0aG9yaXphdGlvbiAobWFzdGVyIGtleSwgb3IgY2xpZW50IGNsYXNzIGNyZWF0aW9uXG4gIC8vIGVuYWJsZWQpIGJlZm9yZSBjYWxsaW5nIHRoaXMgZnVuY3Rpb24uXG4gIGFkZENsYXNzSWZOb3RFeGlzdHMoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgZmllbGRzOiBTY2hlbWFGaWVsZHMgPSB7fSxcbiAgICBjbGFzc0xldmVsUGVybWlzc2lvbnM6IGFueSxcbiAgICBpbmRleGVzOiBhbnkgPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB2YXIgdmFsaWRhdGlvbkVycm9yID0gdGhpcy52YWxpZGF0ZU5ld0NsYXNzKFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZmllbGRzLFxuICAgICAgY2xhc3NMZXZlbFBlcm1pc3Npb25zXG4gICAgKTtcbiAgICBpZiAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodmFsaWRhdGlvbkVycm9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZGJBZGFwdGVyXG4gICAgICAuY3JlYXRlQ2xhc3MoXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgY29udmVydFNjaGVtYVRvQWRhcHRlclNjaGVtYSh7XG4gICAgICAgICAgZmllbGRzLFxuICAgICAgICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgICAgICAgICBpbmRleGVzLFxuICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC50aGVuKGNvbnZlcnRBZGFwdGVyU2NoZW1hVG9QYXJzZVNjaGVtYSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZS5jbGVhcigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yICYmIGVycm9yLmNvZGUgPT09IFBhcnNlLkVycm9yLkRVUExJQ0FURV9WQUxVRSkge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgIGBDbGFzcyAke2NsYXNzTmFtZX0gYWxyZWFkeSBleGlzdHMuYFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ2xhc3MoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc3VibWl0dGVkRmllbGRzOiBTY2hlbWFGaWVsZHMsXG4gICAgY2xhc3NMZXZlbFBlcm1pc3Npb25zOiBhbnksXG4gICAgaW5kZXhlczogYW55LFxuICAgIGRhdGFiYXNlOiBEYXRhYmFzZUNvbnRyb2xsZXJcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T25lU2NoZW1hKGNsYXNzTmFtZSlcbiAgICAgIC50aGVuKHNjaGVtYSA9PiB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nRmllbGRzID0gc2NoZW1hLmZpZWxkcztcbiAgICAgICAgT2JqZWN0LmtleXMoc3VibWl0dGVkRmllbGRzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gc3VibWl0dGVkRmllbGRzW25hbWVdO1xuICAgICAgICAgIGlmIChleGlzdGluZ0ZpZWxkc1tuYW1lXSAmJiBmaWVsZC5fX29wICE9PSAnRGVsZXRlJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKDI1NSwgYEZpZWxkICR7bmFtZX0gZXhpc3RzLCBjYW5ub3QgdXBkYXRlLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWV4aXN0aW5nRmllbGRzW25hbWVdICYmIGZpZWxkLl9fb3AgPT09ICdEZWxldGUnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICAgIDI1NSxcbiAgICAgICAgICAgICAgYEZpZWxkICR7bmFtZX0gZG9lcyBub3QgZXhpc3QsIGNhbm5vdCBkZWxldGUuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlbGV0ZSBleGlzdGluZ0ZpZWxkcy5fcnBlcm07XG4gICAgICAgIGRlbGV0ZSBleGlzdGluZ0ZpZWxkcy5fd3Blcm07XG4gICAgICAgIGNvbnN0IG5ld1NjaGVtYSA9IGJ1aWxkTWVyZ2VkU2NoZW1hT2JqZWN0KFxuICAgICAgICAgIGV4aXN0aW5nRmllbGRzLFxuICAgICAgICAgIHN1Ym1pdHRlZEZpZWxkc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCBkZWZhdWx0RmllbGRzID1cbiAgICAgICAgICBkZWZhdWx0Q29sdW1uc1tjbGFzc05hbWVdIHx8IGRlZmF1bHRDb2x1bW5zLl9EZWZhdWx0O1xuICAgICAgICBjb25zdCBmdWxsTmV3U2NoZW1hID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3U2NoZW1hLCBkZWZhdWx0RmllbGRzKTtcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gdGhpcy52YWxpZGF0ZVNjaGVtYURhdGEoXG4gICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgIG5ld1NjaGVtYSxcbiAgICAgICAgICBjbGFzc0xldmVsUGVybWlzc2lvbnMsXG4gICAgICAgICAgT2JqZWN0LmtleXMoZXhpc3RpbmdGaWVsZHMpXG4gICAgICAgICk7XG4gICAgICAgIGlmICh2YWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IodmFsaWRhdGlvbkVycm9yLmNvZGUsIHZhbGlkYXRpb25FcnJvci5lcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbGx5IHdlIGhhdmUgY2hlY2tlZCB0byBtYWtlIHN1cmUgdGhlIHJlcXVlc3QgaXMgdmFsaWQgYW5kIHdlIGNhbiBzdGFydCBkZWxldGluZyBmaWVsZHMuXG4gICAgICAgIC8vIERvIGFsbCBkZWxldGlvbnMgZmlyc3QsIHRoZW4gYSBzaW5nbGUgc2F2ZSB0byBfU0NIRU1BIGNvbGxlY3Rpb24gdG8gaGFuZGxlIGFsbCBhZGRpdGlvbnMuXG4gICAgICAgIGNvbnN0IGRlbGV0ZWRGaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IGluc2VydGVkRmllbGRzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKHN1Ym1pdHRlZEZpZWxkcykuZm9yRWFjaChmaWVsZE5hbWUgPT4ge1xuICAgICAgICAgIGlmIChzdWJtaXR0ZWRGaWVsZHNbZmllbGROYW1lXS5fX29wID09PSAnRGVsZXRlJykge1xuICAgICAgICAgICAgZGVsZXRlZEZpZWxkcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2VydGVkRmllbGRzLnB1c2goZmllbGROYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBkZWxldGVQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGlmIChkZWxldGVkRmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkZWxldGVQcm9taXNlID0gdGhpcy5kZWxldGVGaWVsZHMoZGVsZXRlZEZpZWxkcywgY2xhc3NOYW1lLCBkYXRhYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBkZWxldGVQcm9taXNlIC8vIERlbGV0ZSBFdmVyeXRoaW5nXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnJlbG9hZERhdGEoeyBjbGVhckNhY2hlOiB0cnVlIH0pKSAvLyBSZWxvYWQgb3VyIFNjaGVtYSwgc28gd2UgaGF2ZSBhbGwgdGhlIG5ldyB2YWx1ZXNcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBpbnNlcnRlZEZpZWxkcy5tYXAoZmllbGROYW1lID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gc3VibWl0dGVkRmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5mb3JjZUZpZWxkRXhpc3RzKGNsYXNzTmFtZSwgZmllbGROYW1lLCB0eXBlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5zZXRQZXJtaXNzaW9ucyhjbGFzc05hbWUsIGNsYXNzTGV2ZWxQZXJtaXNzaW9ucywgbmV3U2NoZW1hKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5fZGJBZGFwdGVyLnNldEluZGV4ZXNXaXRoU2NoZW1hRm9ybWF0KFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICBpbmRleGVzLFxuICAgICAgICAgICAgICAgIHNjaGVtYS5pbmRleGVzLFxuICAgICAgICAgICAgICAgIGZ1bGxOZXdTY2hlbWFcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5yZWxvYWREYXRhKHsgY2xlYXJDYWNoZTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIC8vVE9ETzogTW92ZSB0aGlzIGxvZ2ljIGludG8gdGhlIGRhdGFiYXNlIGFkYXB0ZXJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5zY2hlbWFEYXRhW2NsYXNzTmFtZV07XG4gICAgICAgICAgICAgIGNvbnN0IHJlbG9hZGVkU2NoZW1hOiBTY2hlbWEgPSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgZmllbGRzOiBzY2hlbWEuZmllbGRzLFxuICAgICAgICAgICAgICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9uczogc2NoZW1hLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKHNjaGVtYS5pbmRleGVzICYmIE9iamVjdC5rZXlzKHNjaGVtYS5pbmRleGVzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICByZWxvYWRlZFNjaGVtYS5pbmRleGVzID0gc2NoZW1hLmluZGV4ZXM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHJlbG9hZGVkU2NoZW1hO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBpZiAoZXJyb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgIGBDbGFzcyAke2NsYXNzTmFtZX0gZG9lcyBub3QgZXhpc3QuYFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBzdWNjZXNzZnVsbHkgdG8gdGhlIG5ldyBzY2hlbWFcbiAgLy8gb2JqZWN0IG9yIGZhaWxzIHdpdGggYSByZWFzb24uXG4gIGVuZm9yY2VDbGFzc0V4aXN0cyhjbGFzc05hbWU6IHN0cmluZyk6IFByb21pc2U8U2NoZW1hQ29udHJvbGxlcj4ge1xuICAgIGlmICh0aGlzLnNjaGVtYURhdGFbY2xhc3NOYW1lXSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzKTtcbiAgICB9XG4gICAgLy8gV2UgZG9uJ3QgaGF2ZSB0aGlzIGNsYXNzLiBVcGRhdGUgdGhlIHNjaGVtYVxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmFkZENsYXNzSWZOb3RFeGlzdHMoY2xhc3NOYW1lKVxuICAgICAgICAvLyBUaGUgc2NoZW1hIHVwZGF0ZSBzdWNjZWVkZWQuIFJlbG9hZCB0aGUgc2NoZW1hXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMucmVsb2FkRGF0YSh7IGNsZWFyQ2FjaGU6IHRydWUgfSkpXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gVGhlIHNjaGVtYSB1cGRhdGUgZmFpbGVkLiBUaGlzIGNhbiBiZSBva2F5IC0gaXQgbWlnaHRcbiAgICAgICAgICAvLyBoYXZlIGZhaWxlZCBiZWNhdXNlIHRoZXJlJ3MgYSByYWNlIGNvbmRpdGlvbiBhbmQgYSBkaWZmZXJlbnRcbiAgICAgICAgICAvLyBjbGllbnQgaXMgbWFraW5nIHRoZSBleGFjdCBzYW1lIHNjaGVtYSB1cGRhdGUgdGhhdCB3ZSB3YW50LlxuICAgICAgICAgIC8vIFNvIGp1c3QgcmVsb2FkIHRoZSBzY2hlbWEuXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVsb2FkRGF0YSh7IGNsZWFyQ2FjaGU6IHRydWUgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUgc2NoZW1hIG5vdyB2YWxpZGF0ZXNcbiAgICAgICAgICBpZiAodGhpcy5zY2hlbWFEYXRhW2NsYXNzTmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICAgICAgYEZhaWxlZCB0byBhZGQgJHtjbGFzc05hbWV9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gVGhlIHNjaGVtYSBzdGlsbCBkb2Vzbid0IHZhbGlkYXRlLiBHaXZlIHVwXG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICAgJ3NjaGVtYSBjbGFzcyBuYW1lIGRvZXMgbm90IHJldmFsaWRhdGUnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgdmFsaWRhdGVOZXdDbGFzcyhcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBmaWVsZHM6IFNjaGVtYUZpZWxkcyA9IHt9LFxuICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9uczogYW55XG4gICk6IGFueSB7XG4gICAgaWYgKHRoaXMuc2NoZW1hRGF0YVtjbGFzc05hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfQ0xBU1NfTkFNRSxcbiAgICAgICAgYENsYXNzICR7Y2xhc3NOYW1lfSBhbHJlYWR5IGV4aXN0cy5gXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoIWNsYXNzTmFtZUlzVmFsaWQoY2xhc3NOYW1lKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogUGFyc2UuRXJyb3IuSU5WQUxJRF9DTEFTU19OQU1FLFxuICAgICAgICBlcnJvcjogaW52YWxpZENsYXNzTmFtZU1lc3NhZ2UoY2xhc3NOYW1lKSxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlU2NoZW1hRGF0YShcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgICAgIFtdXG4gICAgKTtcbiAgfVxuXG4gIHZhbGlkYXRlU2NoZW1hRGF0YShcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBmaWVsZHM6IFNjaGVtYUZpZWxkcyxcbiAgICBjbGFzc0xldmVsUGVybWlzc2lvbnM6IENsYXNzTGV2ZWxQZXJtaXNzaW9ucyxcbiAgICBleGlzdGluZ0ZpZWxkTmFtZXM6IEFycmF5PHN0cmluZz5cbiAgKSB7XG4gICAgZm9yIChjb25zdCBmaWVsZE5hbWUgaW4gZmllbGRzKSB7XG4gICAgICBpZiAoZXhpc3RpbmdGaWVsZE5hbWVzLmluZGV4T2YoZmllbGROYW1lKSA8IDApIHtcbiAgICAgICAgaWYgKCFmaWVsZE5hbWVJc1ZhbGlkKGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogUGFyc2UuRXJyb3IuSU5WQUxJRF9LRVlfTkFNRSxcbiAgICAgICAgICAgIGVycm9yOiAnaW52YWxpZCBmaWVsZCBuYW1lOiAnICsgZmllbGROYW1lLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFmaWVsZE5hbWVJc1ZhbGlkRm9yQ2xhc3MoZmllbGROYW1lLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDEzNixcbiAgICAgICAgICAgIGVycm9yOiAnZmllbGQgJyArIGZpZWxkTmFtZSArICcgY2Fubm90IGJlIGFkZGVkJyxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVycm9yID0gZmllbGRUeXBlSXNJbnZhbGlkKGZpZWxkc1tmaWVsZE5hbWVdKTtcbiAgICAgICAgaWYgKGVycm9yKSByZXR1cm4geyBjb2RlOiBlcnJvci5jb2RlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmllbGROYW1lIGluIGRlZmF1bHRDb2x1bW5zW2NsYXNzTmFtZV0pIHtcbiAgICAgIGZpZWxkc1tmaWVsZE5hbWVdID0gZGVmYXVsdENvbHVtbnNbY2xhc3NOYW1lXVtmaWVsZE5hbWVdO1xuICAgIH1cblxuICAgIGNvbnN0IGdlb1BvaW50cyA9IE9iamVjdC5rZXlzKGZpZWxkcykuZmlsdGVyKFxuICAgICAga2V5ID0+IGZpZWxkc1trZXldICYmIGZpZWxkc1trZXldLnR5cGUgPT09ICdHZW9Qb2ludCdcbiAgICApO1xuICAgIGlmIChnZW9Qb2ludHMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogUGFyc2UuRXJyb3IuSU5DT1JSRUNUX1RZUEUsXG4gICAgICAgIGVycm9yOlxuICAgICAgICAgICdjdXJyZW50bHksIG9ubHkgb25lIEdlb1BvaW50IGZpZWxkIG1heSBleGlzdCBpbiBhbiBvYmplY3QuIEFkZGluZyAnICtcbiAgICAgICAgICBnZW9Qb2ludHNbMV0gK1xuICAgICAgICAgICcgd2hlbiAnICtcbiAgICAgICAgICBnZW9Qb2ludHNbMF0gK1xuICAgICAgICAgICcgYWxyZWFkeSBleGlzdHMuJyxcbiAgICAgIH07XG4gICAgfVxuICAgIHZhbGlkYXRlQ0xQKGNsYXNzTGV2ZWxQZXJtaXNzaW9ucywgZmllbGRzKTtcbiAgfVxuXG4gIC8vIFNldHMgdGhlIENsYXNzLWxldmVsIHBlcm1pc3Npb25zIGZvciBhIGdpdmVuIGNsYXNzTmFtZSwgd2hpY2ggbXVzdCBleGlzdC5cbiAgc2V0UGVybWlzc2lvbnMoY2xhc3NOYW1lOiBzdHJpbmcsIHBlcm1zOiBhbnksIG5ld1NjaGVtYTogU2NoZW1hRmllbGRzKSB7XG4gICAgaWYgKHR5cGVvZiBwZXJtcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdmFsaWRhdGVDTFAocGVybXMsIG5ld1NjaGVtYSk7XG4gICAgcmV0dXJuIHRoaXMuX2RiQWRhcHRlci5zZXRDbGFzc0xldmVsUGVybWlzc2lvbnMoY2xhc3NOYW1lLCBwZXJtcyk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHN1Y2Nlc3NmdWxseSB0byB0aGUgbmV3IHNjaGVtYVxuICAvLyBvYmplY3QgaWYgdGhlIHByb3ZpZGVkIGNsYXNzTmFtZS1maWVsZE5hbWUtdHlwZSB0dXBsZSBpcyB2YWxpZC5cbiAgLy8gVGhlIGNsYXNzTmFtZSBtdXN0IGFscmVhZHkgYmUgdmFsaWRhdGVkLlxuICAvLyBJZiAnZnJlZXplJyBpcyB0cnVlLCByZWZ1c2UgdG8gdXBkYXRlIHRoZSBzY2hlbWEgZm9yIHRoaXMgZmllbGQuXG4gIGVuZm9yY2VGaWVsZEV4aXN0cyhcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgICB0eXBlOiBzdHJpbmcgfCBTY2hlbWFGaWVsZFxuICApIHtcbiAgICBpZiAoZmllbGROYW1lLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgIC8vIHN1YmRvY3VtZW50IGtleSAoeC55KSA9PiBvayBpZiB4IGlzIG9mIHR5cGUgJ29iamVjdCdcbiAgICAgIGZpZWxkTmFtZSA9IGZpZWxkTmFtZS5zcGxpdCgnLicpWzBdO1xuICAgICAgdHlwZSA9ICdPYmplY3QnO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkTmFtZUlzVmFsaWQoZmllbGROYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0tFWV9OQU1FLFxuICAgICAgICBgSW52YWxpZCBmaWVsZCBuYW1lOiAke2ZpZWxkTmFtZX0uYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBJZiBzb21lb25lIHRyaWVzIHRvIGNyZWF0ZSBhIG5ldyBmaWVsZCB3aXRoIG51bGwvdW5kZWZpbmVkIGFzIHRoZSB2YWx1ZSwgcmV0dXJuO1xuICAgIGlmICghdHlwZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWxvYWREYXRhKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBleHBlY3RlZFR5cGUgPSB0aGlzLmdldEV4cGVjdGVkVHlwZShjbGFzc05hbWUsIGZpZWxkTmFtZSk7XG4gICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHR5cGUgPSB7IHR5cGUgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4cGVjdGVkVHlwZSkge1xuICAgICAgICBpZiAoIWRiVHlwZU1hdGNoZXNPYmplY3RUeXBlKGV4cGVjdGVkVHlwZSwgdHlwZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5JTkNPUlJFQ1RfVFlQRSxcbiAgICAgICAgICAgIGBzY2hlbWEgbWlzbWF0Y2ggZm9yICR7Y2xhc3NOYW1lfS4ke2ZpZWxkTmFtZX07IGV4cGVjdGVkICR7dHlwZVRvU3RyaW5nKFxuICAgICAgICAgICAgICBleHBlY3RlZFR5cGVcbiAgICAgICAgICAgICl9IGJ1dCBnb3QgJHt0eXBlVG9TdHJpbmcodHlwZSl9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9kYkFkYXB0ZXJcbiAgICAgICAgLmFkZEZpZWxkSWZOb3RFeGlzdHMoY2xhc3NOYW1lLCBmaWVsZE5hbWUsIHR5cGUpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSB1cGRhdGUgc3VjY2VlZGVkLiBSZWxvYWQgdGhlIHNjaGVtYVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsb2FkRGF0YSh7IGNsZWFyQ2FjaGU6IHRydWUgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IuY29kZSA9PSBQYXJzZS5FcnJvci5JTkNPUlJFQ1RfVFlQRSkge1xuICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB3ZSB0aHJvdyBlcnJvcnMgd2hlbiBpdCBpcyBhcHByb3ByaWF0ZSB0byBkbyBzby5cbiAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGUgdXBkYXRlIGZhaWxlZC4gVGhpcyBjYW4gYmUgb2theSAtIGl0IG1pZ2h0IGhhdmUgYmVlbiBhIHJhY2VcbiAgICAgICAgICAgIC8vIGNvbmRpdGlvbiB3aGVyZSBhbm90aGVyIGNsaWVudCB1cGRhdGVkIHRoZSBzY2hlbWEgaW4gdGhlIHNhbWVcbiAgICAgICAgICAgIC8vIHdheSB0aGF0IHdlIHdhbnRlZCB0by4gU28sIGp1c3QgcmVsb2FkIHRoZSBzY2hlbWFcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbG9hZERhdGEoeyBjbGVhckNhY2hlOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIHNjaGVtYSBub3cgdmFsaWRhdGVzXG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRUeXBlID0gdGhpcy5nZXRFeHBlY3RlZFR5cGUoY2xhc3NOYW1lLCBmaWVsZE5hbWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHR5cGUgPSB7IHR5cGUgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFleHBlY3RlZFR5cGUgfHwgIWRiVHlwZU1hdGNoZXNPYmplY3RUeXBlKGV4cGVjdGVkVHlwZSwgdHlwZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICAgICBgQ291bGQgbm90IGFkZCBmaWVsZCAke2ZpZWxkTmFtZX1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGNhY2hlZCBzY2hlbWFcbiAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIG1haW50YWluIGNvbXBhdGliaWxpdHlcbiAgZGVsZXRlRmllbGQoXG4gICAgZmllbGROYW1lOiBzdHJpbmcsXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgZGF0YWJhc2U6IERhdGFiYXNlQ29udHJvbGxlclxuICApIHtcbiAgICByZXR1cm4gdGhpcy5kZWxldGVGaWVsZHMoW2ZpZWxkTmFtZV0sIGNsYXNzTmFtZSwgZGF0YWJhc2UpO1xuICB9XG5cbiAgLy8gRGVsZXRlIGZpZWxkcywgYW5kIHJlbW92ZSB0aGF0IGRhdGEgZnJvbSBhbGwgb2JqZWN0cy4gVGhpcyBpcyBpbnRlbmRlZFxuICAvLyB0byByZW1vdmUgdW51c2VkIGZpZWxkcywgaWYgb3RoZXIgd3JpdGVycyBhcmUgd3JpdGluZyBvYmplY3RzIHRoYXQgaW5jbHVkZVxuICAvLyB0aGlzIGZpZWxkLCB0aGUgZmllbGQgbWF5IHJlYXBwZWFyLiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGhcbiAgLy8gbm8gb2JqZWN0IG9uIHN1Y2Nlc3MsIG9yIHJlamVjdHMgd2l0aCB7IGNvZGUsIGVycm9yIH0gb24gZmFpbHVyZS5cbiAgLy8gUGFzc2luZyB0aGUgZGF0YWJhc2UgYW5kIHByZWZpeCBpcyBuZWNlc3NhcnkgaW4gb3JkZXIgdG8gZHJvcCByZWxhdGlvbiBjb2xsZWN0aW9uc1xuICAvLyBhbmQgcmVtb3ZlIGZpZWxkcyBmcm9tIG9iamVjdHMuIElkZWFsbHkgdGhlIGRhdGFiYXNlIHdvdWxkIGJlbG9uZyB0b1xuICAvLyBhIGRhdGFiYXNlIGFkYXB0ZXIgYW5kIHRoaXMgZnVuY3Rpb24gd291bGQgY2xvc2Ugb3ZlciBpdCBvciBhY2Nlc3MgaXQgdmlhIG1lbWJlci5cbiAgZGVsZXRlRmllbGRzKFxuICAgIGZpZWxkTmFtZXM6IEFycmF5PHN0cmluZz4sXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgZGF0YWJhc2U6IERhdGFiYXNlQ29udHJvbGxlclxuICApIHtcbiAgICBpZiAoIWNsYXNzTmFtZUlzVmFsaWQoY2xhc3NOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0NMQVNTX05BTUUsXG4gICAgICAgIGludmFsaWRDbGFzc05hbWVNZXNzYWdlKGNsYXNzTmFtZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZmllbGROYW1lcy5mb3JFYWNoKGZpZWxkTmFtZSA9PiB7XG4gICAgICBpZiAoIWZpZWxkTmFtZUlzVmFsaWQoZmllbGROYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9LRVlfTkFNRSxcbiAgICAgICAgICBgaW52YWxpZCBmaWVsZCBuYW1lOiAke2ZpZWxkTmFtZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvL0Rvbid0IGFsbG93IGRlbGV0aW5nIHRoZSBkZWZhdWx0IGZpZWxkcy5cbiAgICAgIGlmICghZmllbGROYW1lSXNWYWxpZEZvckNsYXNzKGZpZWxkTmFtZSwgY2xhc3NOYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoMTM2LCBgZmllbGQgJHtmaWVsZE5hbWV9IGNhbm5vdCBiZSBjaGFuZ2VkYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5nZXRPbmVTY2hlbWEoY2xhc3NOYW1lLCBmYWxzZSwgeyBjbGVhckNhY2hlOiB0cnVlIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBpZiAoZXJyb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgIGBDbGFzcyAke2NsYXNzTmFtZX0gZG9lcyBub3QgZXhpc3QuYFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihzY2hlbWEgPT4ge1xuICAgICAgICBmaWVsZE5hbWVzLmZvckVhY2goZmllbGROYW1lID0+IHtcbiAgICAgICAgICBpZiAoIXNjaGVtYS5maWVsZHNbZmllbGROYW1lXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgICAyNTUsXG4gICAgICAgICAgICAgIGBGaWVsZCAke2ZpZWxkTmFtZX0gZG9lcyBub3QgZXhpc3QsIGNhbm5vdCBkZWxldGUuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNjaGVtYUZpZWxkcyA9IHsgLi4uc2NoZW1hLmZpZWxkcyB9O1xuICAgICAgICByZXR1cm4gZGF0YWJhc2UuYWRhcHRlclxuICAgICAgICAgIC5kZWxldGVGaWVsZHMoY2xhc3NOYW1lLCBzY2hlbWEsIGZpZWxkTmFtZXMpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICBmaWVsZE5hbWVzLm1hcChmaWVsZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gc2NoZW1hRmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICYmIGZpZWxkLnR5cGUgPT09ICdSZWxhdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgIC8vRm9yIHJlbGF0aW9ucywgZHJvcCB0aGUgX0pvaW4gdGFibGVcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhYmFzZS5hZGFwdGVyLmRlbGV0ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBgX0pvaW46JHtmaWVsZE5hbWV9OiR7Y2xhc3NOYW1lfWBcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBWYWxpZGF0ZXMgYW4gb2JqZWN0IHByb3ZpZGVkIGluIFJFU1QgZm9ybWF0LlxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBuZXcgc2NoZW1hIGlmIHRoaXMgb2JqZWN0IGlzXG4gIC8vIHZhbGlkLlxuICB2YWxpZGF0ZU9iamVjdChjbGFzc05hbWU6IHN0cmluZywgb2JqZWN0OiBhbnksIHF1ZXJ5OiBhbnkpIHtcbiAgICBsZXQgZ2VvY291bnQgPSAwO1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5lbmZvcmNlQ2xhc3NFeGlzdHMoY2xhc3NOYW1lKTtcbiAgICBmb3IgKGNvbnN0IGZpZWxkTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChvYmplY3RbZmllbGROYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBnZXRUeXBlKG9iamVjdFtmaWVsZE5hbWVdKTtcbiAgICAgIGlmIChleHBlY3RlZCA9PT0gJ0dlb1BvaW50Jykge1xuICAgICAgICBnZW9jb3VudCsrO1xuICAgICAgfVxuICAgICAgaWYgKGdlb2NvdW50ID4gMSkge1xuICAgICAgICAvLyBNYWtlIHN1cmUgYWxsIGZpZWxkIHZhbGlkYXRpb24gb3BlcmF0aW9ucyBydW4gYmVmb3JlIHdlIHJldHVybi5cbiAgICAgICAgLy8gSWYgbm90IC0gd2UgYXJlIGNvbnRpbnVpbmcgdG8gcnVuIGxvZ2ljLCBidXQgYWxyZWFkeSBwcm92aWRlZCByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgICAgIG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5DT1JSRUNUX1RZUEUsXG4gICAgICAgICAgICAgICd0aGVyZSBjYW4gb25seSBiZSBvbmUgZ2VvcG9pbnQgZmllbGQgaW4gYSBjbGFzcydcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghZXhwZWN0ZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnQUNMJykge1xuICAgICAgICAvLyBFdmVyeSBvYmplY3QgaGFzIEFDTCBpbXBsaWNpdGx5LlxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihzY2hlbWEgPT5cbiAgICAgICAgc2NoZW1hLmVuZm9yY2VGaWVsZEV4aXN0cyhjbGFzc05hbWUsIGZpZWxkTmFtZSwgZXhwZWN0ZWQpXG4gICAgICApO1xuICAgIH1cbiAgICBwcm9taXNlID0gdGhlblZhbGlkYXRlUmVxdWlyZWRDb2x1bW5zKHByb21pc2UsIGNsYXNzTmFtZSwgb2JqZWN0LCBxdWVyeSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBWYWxpZGF0ZXMgdGhhdCBhbGwgdGhlIHByb3BlcnRpZXMgYXJlIHNldCBmb3IgdGhlIG9iamVjdFxuICB2YWxpZGF0ZVJlcXVpcmVkQ29sdW1ucyhjbGFzc05hbWU6IHN0cmluZywgb2JqZWN0OiBhbnksIHF1ZXJ5OiBhbnkpIHtcbiAgICBjb25zdCBjb2x1bW5zID0gcmVxdWlyZWRDb2x1bW5zW2NsYXNzTmFtZV07XG4gICAgaWYgKCFjb2x1bW5zIHx8IGNvbHVtbnMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3QgbWlzc2luZ0NvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcihmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgIGlmIChxdWVyeSAmJiBxdWVyeS5vYmplY3RJZCkge1xuICAgICAgICBpZiAob2JqZWN0W2NvbHVtbl0gJiYgdHlwZW9mIG9iamVjdFtjb2x1bW5dID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vIFRyeWluZyB0byBkZWxldGUgYSByZXF1aXJlZCBjb2x1bW5cbiAgICAgICAgICByZXR1cm4gb2JqZWN0W2NvbHVtbl0uX19vcCA9PSAnRGVsZXRlJztcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3QgdHJ5aW5nIHRvIGRvIGFueXRoaW5nIHRoZXJlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhb2JqZWN0W2NvbHVtbl07XG4gICAgfSk7XG5cbiAgICBpZiAobWlzc2luZ0NvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5JTkNPUlJFQ1RfVFlQRSxcbiAgICAgICAgbWlzc2luZ0NvbHVtbnNbMF0gKyAnIGlzIHJlcXVpcmVkLidcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gIH1cblxuICB0ZXN0UGVybWlzc2lvbnNGb3JDbGFzc05hbWUoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgYWNsR3JvdXA6IHN0cmluZ1tdLFxuICAgIG9wZXJhdGlvbjogc3RyaW5nXG4gICkge1xuICAgIHJldHVybiBTY2hlbWFDb250cm9sbGVyLnRlc3RQZXJtaXNzaW9ucyhcbiAgICAgIHRoaXMuZ2V0Q2xhc3NMZXZlbFBlcm1pc3Npb25zKGNsYXNzTmFtZSksXG4gICAgICBhY2xHcm91cCxcbiAgICAgIG9wZXJhdGlvblxuICAgICk7XG4gIH1cblxuICAvLyBUZXN0cyB0aGF0IHRoZSBjbGFzcyBsZXZlbCBwZXJtaXNzaW9uIGxldCBwYXNzIHRoZSBvcGVyYXRpb24gZm9yIGEgZ2l2ZW4gYWNsR3JvdXBcbiAgc3RhdGljIHRlc3RQZXJtaXNzaW9ucyhcbiAgICBjbGFzc1Blcm1pc3Npb25zOiA/YW55LFxuICAgIGFjbEdyb3VwOiBzdHJpbmdbXSxcbiAgICBvcGVyYXRpb246IHN0cmluZ1xuICApOiBib29sZWFuIHtcbiAgICBpZiAoIWNsYXNzUGVybWlzc2lvbnMgfHwgIWNsYXNzUGVybWlzc2lvbnNbb3BlcmF0aW9uXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHBlcm1zID0gY2xhc3NQZXJtaXNzaW9uc1tvcGVyYXRpb25dO1xuICAgIGlmIChwZXJtc1snKiddKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgcGVybWlzc2lvbnMgYWdhaW5zdCB0aGUgYWNsR3JvdXAgcHJvdmlkZWQgKGFycmF5IG9mIHVzZXJJZC9yb2xlcylcbiAgICBpZiAoXG4gICAgICBhY2xHcm91cC5zb21lKGFjbCA9PiB7XG4gICAgICAgIHJldHVybiBwZXJtc1thY2xdID09PSB0cnVlO1xuICAgICAgfSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBWYWxpZGF0ZXMgYW4gb3BlcmF0aW9uIHBhc3NlcyBjbGFzcy1sZXZlbC1wZXJtaXNzaW9ucyBzZXQgaW4gdGhlIHNjaGVtYVxuICBzdGF0aWMgdmFsaWRhdGVQZXJtaXNzaW9uKFxuICAgIGNsYXNzUGVybWlzc2lvbnM6ID9hbnksXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgYWNsR3JvdXA6IHN0cmluZ1tdLFxuICAgIG9wZXJhdGlvbjogc3RyaW5nXG4gICkge1xuICAgIGlmIChcbiAgICAgIFNjaGVtYUNvbnRyb2xsZXIudGVzdFBlcm1pc3Npb25zKGNsYXNzUGVybWlzc2lvbnMsIGFjbEdyb3VwLCBvcGVyYXRpb24pXG4gICAgKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFjbGFzc1Blcm1pc3Npb25zIHx8ICFjbGFzc1Blcm1pc3Npb25zW29wZXJhdGlvbl0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtcyA9IGNsYXNzUGVybWlzc2lvbnNbb3BlcmF0aW9uXTtcbiAgICAvLyBJZiBvbmx5IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzXG4gICAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYW4gYWNsR3JvdXBcbiAgICBpZiAocGVybXNbJ3JlcXVpcmVzQXV0aGVudGljYXRpb24nXSkge1xuICAgICAgLy8gSWYgYWNsR3JvdXAgaGFzICogKHB1YmxpYylcbiAgICAgIGlmICghYWNsR3JvdXAgfHwgYWNsR3JvdXAubGVuZ3RoID09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAgICAgJ1Blcm1pc3Npb24gZGVuaWVkLCB1c2VyIG5lZWRzIHRvIGJlIGF1dGhlbnRpY2F0ZWQuJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChhY2xHcm91cC5pbmRleE9mKCcqJykgPiAtMSAmJiBhY2xHcm91cC5sZW5ndGggPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuT0JKRUNUX05PVF9GT1VORCxcbiAgICAgICAgICAnUGVybWlzc2lvbiBkZW5pZWQsIHVzZXIgbmVlZHMgdG8gYmUgYXV0aGVudGljYXRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvLyByZXF1aXJlc0F1dGhlbnRpY2F0aW9uIHBhc3NlZCwganVzdCBtb3ZlIGZvcndhcmRcbiAgICAgIC8vIHByb2JhYmx5IHdvdWxkIGJlIHdpc2UgYXQgc29tZSBwb2ludCB0byByZW5hbWUgdG8gJ2F1dGhlbnRpY2F0ZWRVc2VyJ1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIC8vIE5vIG1hdGNoaW5nIENMUCwgbGV0J3MgY2hlY2sgdGhlIFBvaW50ZXIgcGVybWlzc2lvbnNcbiAgICAvLyBBbmQgaGFuZGxlIHRob3NlIGxhdGVyXG4gICAgY29uc3QgcGVybWlzc2lvbkZpZWxkID1cbiAgICAgIFsnZ2V0JywgJ2ZpbmQnLCAnY291bnQnXS5pbmRleE9mKG9wZXJhdGlvbikgPiAtMVxuICAgICAgICA/ICdyZWFkVXNlckZpZWxkcydcbiAgICAgICAgOiAnd3JpdGVVc2VyRmllbGRzJztcblxuICAgIC8vIFJlamVjdCBjcmVhdGUgd2hlbiB3cml0ZSBsb2NrZG93blxuICAgIGlmIChwZXJtaXNzaW9uRmllbGQgPT0gJ3dyaXRlVXNlckZpZWxkcycgJiYgb3BlcmF0aW9uID09ICdjcmVhdGUnKSB7XG4gICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgIFBhcnNlLkVycm9yLk9QRVJBVElPTl9GT1JCSURERU4sXG4gICAgICAgIGBQZXJtaXNzaW9uIGRlbmllZCBmb3IgYWN0aW9uICR7b3BlcmF0aW9ufSBvbiBjbGFzcyAke2NsYXNzTmFtZX0uYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQcm9jZXNzIHRoZSByZWFkVXNlckZpZWxkcyBsYXRlclxuICAgIGlmIChcbiAgICAgIEFycmF5LmlzQXJyYXkoY2xhc3NQZXJtaXNzaW9uc1twZXJtaXNzaW9uRmllbGRdKSAmJlxuICAgICAgY2xhc3NQZXJtaXNzaW9uc1twZXJtaXNzaW9uRmllbGRdLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgUGFyc2UuRXJyb3IuT1BFUkFUSU9OX0ZPUkJJRERFTixcbiAgICAgIGBQZXJtaXNzaW9uIGRlbmllZCBmb3IgYWN0aW9uICR7b3BlcmF0aW9ufSBvbiBjbGFzcyAke2NsYXNzTmFtZX0uYFxuICAgICk7XG4gIH1cblxuICAvLyBWYWxpZGF0ZXMgYW4gb3BlcmF0aW9uIHBhc3NlcyBjbGFzcy1sZXZlbC1wZXJtaXNzaW9ucyBzZXQgaW4gdGhlIHNjaGVtYVxuICB2YWxpZGF0ZVBlcm1pc3Npb24oY2xhc3NOYW1lOiBzdHJpbmcsIGFjbEdyb3VwOiBzdHJpbmdbXSwgb3BlcmF0aW9uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2NoZW1hQ29udHJvbGxlci52YWxpZGF0ZVBlcm1pc3Npb24oXG4gICAgICB0aGlzLmdldENsYXNzTGV2ZWxQZXJtaXNzaW9ucyhjbGFzc05hbWUpLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgYWNsR3JvdXAsXG4gICAgICBvcGVyYXRpb25cbiAgICApO1xuICB9XG5cbiAgZ2V0Q2xhc3NMZXZlbFBlcm1pc3Npb25zKGNsYXNzTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5zY2hlbWFEYXRhW2NsYXNzTmFtZV0gJiZcbiAgICAgIHRoaXMuc2NoZW1hRGF0YVtjbGFzc05hbWVdLmNsYXNzTGV2ZWxQZXJtaXNzaW9uc1xuICAgICk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBleHBlY3RlZCB0eXBlIGZvciBhIGNsYXNzTmFtZStrZXkgY29tYmluYXRpb25cbiAgLy8gb3IgdW5kZWZpbmVkIGlmIHRoZSBzY2hlbWEgaXMgbm90IHNldFxuICBnZXRFeHBlY3RlZFR5cGUoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgZmllbGROYW1lOiBzdHJpbmdcbiAgKTogPyhTY2hlbWFGaWVsZCB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNjaGVtYURhdGFbY2xhc3NOYW1lXSkge1xuICAgICAgY29uc3QgZXhwZWN0ZWRUeXBlID0gdGhpcy5zY2hlbWFEYXRhW2NsYXNzTmFtZV0uZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICByZXR1cm4gZXhwZWN0ZWRUeXBlID09PSAnbWFwJyA/ICdPYmplY3QnIDogZXhwZWN0ZWRUeXBlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gQ2hlY2tzIGlmIGEgZ2l2ZW4gY2xhc3MgaXMgaW4gdGhlIHNjaGVtYS5cbiAgaGFzQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5yZWxvYWREYXRhKCkudGhlbigoKSA9PiAhIXRoaXMuc2NoZW1hRGF0YVtjbGFzc05hbWVdKTtcbiAgfVxufVxuXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYSBuZXcgU2NoZW1hLlxuY29uc3QgbG9hZCA9IChcbiAgZGJBZGFwdGVyOiBTdG9yYWdlQWRhcHRlcixcbiAgc2NoZW1hQ2FjaGU6IGFueSxcbiAgb3B0aW9uczogYW55XG4pOiBQcm9taXNlPFNjaGVtYUNvbnRyb2xsZXI+ID0+IHtcbiAgY29uc3Qgc2NoZW1hID0gbmV3IFNjaGVtYUNvbnRyb2xsZXIoZGJBZGFwdGVyLCBzY2hlbWFDYWNoZSk7XG4gIHJldHVybiBzY2hlbWEucmVsb2FkRGF0YShvcHRpb25zKS50aGVuKCgpID0+IHNjaGVtYSk7XG59O1xuXG4vLyBCdWlsZHMgYSBuZXcgc2NoZW1hIChpbiBzY2hlbWEgQVBJIHJlc3BvbnNlIGZvcm1hdCkgb3V0IG9mIGFuXG4vLyBleGlzdGluZyBtb25nbyBzY2hlbWEgKyBhIHNjaGVtYXMgQVBJIHB1dCByZXF1ZXN0LiBUaGlzIHJlc3BvbnNlXG4vLyBkb2VzIG5vdCBpbmNsdWRlIHRoZSBkZWZhdWx0IGZpZWxkcywgYXMgaXQgaXMgaW50ZW5kZWQgdG8gYmUgcGFzc2VkXG4vLyB0byBtb25nb1NjaGVtYUZyb21GaWVsZHNBbmRDbGFzc05hbWUuIE5vIHZhbGlkYXRpb24gaXMgZG9uZSBoZXJlLCBpdFxuLy8gaXMgZG9uZSBpbiBtb25nb1NjaGVtYUZyb21GaWVsZHNBbmRDbGFzc05hbWUuXG5mdW5jdGlvbiBidWlsZE1lcmdlZFNjaGVtYU9iamVjdChcbiAgZXhpc3RpbmdGaWVsZHM6IFNjaGVtYUZpZWxkcyxcbiAgcHV0UmVxdWVzdDogYW55XG4pOiBTY2hlbWFGaWVsZHMge1xuICBjb25zdCBuZXdTY2hlbWEgPSB7fTtcbiAgLy8gQGZsb3ctZGlzYWJsZS1uZXh0XG4gIGNvbnN0IHN5c1NjaGVtYUZpZWxkID1cbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0Q29sdW1ucykuaW5kZXhPZihleGlzdGluZ0ZpZWxkcy5faWQpID09PSAtMVxuICAgICAgPyBbXVxuICAgICAgOiBPYmplY3Qua2V5cyhkZWZhdWx0Q29sdW1uc1tleGlzdGluZ0ZpZWxkcy5faWRdKTtcbiAgZm9yIChjb25zdCBvbGRGaWVsZCBpbiBleGlzdGluZ0ZpZWxkcykge1xuICAgIGlmIChcbiAgICAgIG9sZEZpZWxkICE9PSAnX2lkJyAmJlxuICAgICAgb2xkRmllbGQgIT09ICdBQ0wnICYmXG4gICAgICBvbGRGaWVsZCAhPT0gJ3VwZGF0ZWRBdCcgJiZcbiAgICAgIG9sZEZpZWxkICE9PSAnY3JlYXRlZEF0JyAmJlxuICAgICAgb2xkRmllbGQgIT09ICdvYmplY3RJZCdcbiAgICApIHtcbiAgICAgIGlmIChcbiAgICAgICAgc3lzU2NoZW1hRmllbGQubGVuZ3RoID4gMCAmJlxuICAgICAgICBzeXNTY2hlbWFGaWVsZC5pbmRleE9mKG9sZEZpZWxkKSAhPT0gLTFcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpZWxkSXNEZWxldGVkID1cbiAgICAgICAgcHV0UmVxdWVzdFtvbGRGaWVsZF0gJiYgcHV0UmVxdWVzdFtvbGRGaWVsZF0uX19vcCA9PT0gJ0RlbGV0ZSc7XG4gICAgICBpZiAoIWZpZWxkSXNEZWxldGVkKSB7XG4gICAgICAgIG5ld1NjaGVtYVtvbGRGaWVsZF0gPSBleGlzdGluZ0ZpZWxkc1tvbGRGaWVsZF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZvciAoY29uc3QgbmV3RmllbGQgaW4gcHV0UmVxdWVzdCkge1xuICAgIGlmIChuZXdGaWVsZCAhPT0gJ29iamVjdElkJyAmJiBwdXRSZXF1ZXN0W25ld0ZpZWxkXS5fX29wICE9PSAnRGVsZXRlJykge1xuICAgICAgaWYgKFxuICAgICAgICBzeXNTY2hlbWFGaWVsZC5sZW5ndGggPiAwICYmXG4gICAgICAgIHN5c1NjaGVtYUZpZWxkLmluZGV4T2YobmV3RmllbGQpICE9PSAtMVxuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbmV3U2NoZW1hW25ld0ZpZWxkXSA9IHB1dFJlcXVlc3RbbmV3RmllbGRdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3U2NoZW1hO1xufVxuXG4vLyBHaXZlbiBhIHNjaGVtYSBwcm9taXNlLCBjb25zdHJ1Y3QgYW5vdGhlciBzY2hlbWEgcHJvbWlzZSB0aGF0XG4vLyB2YWxpZGF0ZXMgdGhpcyBmaWVsZCBvbmNlIHRoZSBzY2hlbWEgbG9hZHMuXG5mdW5jdGlvbiB0aGVuVmFsaWRhdGVSZXF1aXJlZENvbHVtbnMoc2NoZW1hUHJvbWlzZSwgY2xhc3NOYW1lLCBvYmplY3QsIHF1ZXJ5KSB7XG4gIHJldHVybiBzY2hlbWFQcm9taXNlLnRoZW4oc2NoZW1hID0+IHtcbiAgICByZXR1cm4gc2NoZW1hLnZhbGlkYXRlUmVxdWlyZWRDb2x1bW5zKGNsYXNzTmFtZSwgb2JqZWN0LCBxdWVyeSk7XG4gIH0pO1xufVxuXG4vLyBHZXRzIHRoZSB0eXBlIGZyb20gYSBSRVNUIEFQSSBmb3JtYXR0ZWQgb2JqZWN0LCB3aGVyZSAndHlwZScgaXNcbi8vIGV4dGVuZGVkIHBhc3QgamF2YXNjcmlwdCB0eXBlcyB0byBpbmNsdWRlIHRoZSByZXN0IG9mIHRoZSBQYXJzZVxuLy8gdHlwZSBzeXN0ZW0uXG4vLyBUaGUgb3V0cHV0IHNob3VsZCBiZSBhIHZhbGlkIHNjaGVtYSB2YWx1ZS5cbi8vIFRPRE86IGVuc3VyZSB0aGF0IHRoaXMgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBmb3JtYXQgdXNlZCBpbiBPcGVuIERCXG5mdW5jdGlvbiBnZXRUeXBlKG9iajogYW55KTogPyhTY2hlbWFGaWVsZCB8IHN0cmluZykge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIG9iajtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gJ0Jvb2xlYW4nO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gJ1N0cmluZyc7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiAnTnVtYmVyJztcbiAgICBjYXNlICdtYXAnOlxuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdldE9iamVjdFR5cGUob2JqKTtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgY2FzZSAnc3ltYm9sJzpcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyAnYmFkIG9iajogJyArIG9iajtcbiAgfVxufVxuXG4vLyBUaGlzIGdldHMgdGhlIHR5cGUgZm9yIG5vbi1KU09OIHR5cGVzIGxpa2UgcG9pbnRlcnMgYW5kIGZpbGVzLCBidXRcbi8vIGFsc28gZ2V0cyB0aGUgYXBwcm9wcmlhdGUgdHlwZSBmb3IgJCBvcGVyYXRvcnMuXG4vLyBSZXR1cm5zIG51bGwgaWYgdGhlIHR5cGUgaXMgdW5rbm93bi5cbmZ1bmN0aW9uIGdldE9iamVjdFR5cGUob2JqKTogPyhTY2hlbWFGaWVsZCB8IHN0cmluZykge1xuICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gJ0FycmF5JztcbiAgfVxuICBpZiAob2JqLl9fdHlwZSkge1xuICAgIHN3aXRjaCAob2JqLl9fdHlwZSkge1xuICAgICAgY2FzZSAnUG9pbnRlcic6XG4gICAgICAgIGlmIChvYmouY2xhc3NOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludGVyJyxcbiAgICAgICAgICAgIHRhcmdldENsYXNzOiBvYmouY2xhc3NOYW1lLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdSZWxhdGlvbic6XG4gICAgICAgIGlmIChvYmouY2xhc3NOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdSZWxhdGlvbicsXG4gICAgICAgICAgICB0YXJnZXRDbGFzczogb2JqLmNsYXNzTmFtZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRmlsZSc6XG4gICAgICAgIGlmIChvYmoubmFtZSkge1xuICAgICAgICAgIHJldHVybiAnRmlsZSc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgaWYgKG9iai5pc28pIHtcbiAgICAgICAgICByZXR1cm4gJ0RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnR2VvUG9pbnQnOlxuICAgICAgICBpZiAob2JqLmxhdGl0dWRlICE9IG51bGwgJiYgb2JqLmxvbmdpdHVkZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuICdHZW9Qb2ludCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCeXRlcyc6XG4gICAgICAgIGlmIChvYmouYmFzZTY0KSB7XG4gICAgICAgICAgcmV0dXJuICdCeXRlcyc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgICAgaWYgKG9iai5jb29yZGluYXRlcykge1xuICAgICAgICAgIHJldHVybiAnUG9seWdvbic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgIFBhcnNlLkVycm9yLklOQ09SUkVDVF9UWVBFLFxuICAgICAgJ1RoaXMgaXMgbm90IGEgdmFsaWQgJyArIG9iai5fX3R5cGVcbiAgICApO1xuICB9XG4gIGlmIChvYmpbJyRuZSddKSB7XG4gICAgcmV0dXJuIGdldE9iamVjdFR5cGUob2JqWyckbmUnXSk7XG4gIH1cbiAgaWYgKG9iai5fX29wKSB7XG4gICAgc3dpdGNoIChvYmouX19vcCkge1xuICAgICAgY2FzZSAnSW5jcmVtZW50JzpcbiAgICAgICAgcmV0dXJuICdOdW1iZXInO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBjYXNlICdBZGQnOlxuICAgICAgY2FzZSAnQWRkVW5pcXVlJzpcbiAgICAgIGNhc2UgJ1JlbW92ZSc6XG4gICAgICAgIHJldHVybiAnQXJyYXknO1xuICAgICAgY2FzZSAnQWRkUmVsYXRpb24nOlxuICAgICAgY2FzZSAnUmVtb3ZlUmVsYXRpb24nOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdSZWxhdGlvbicsXG4gICAgICAgICAgdGFyZ2V0Q2xhc3M6IG9iai5vYmplY3RzWzBdLmNsYXNzTmFtZSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ0JhdGNoJzpcbiAgICAgICAgcmV0dXJuIGdldE9iamVjdFR5cGUob2JqLm9wc1swXSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyAndW5leHBlY3RlZCBvcDogJyArIG9iai5fX29wO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJ09iamVjdCc7XG59XG5cbmV4cG9ydCB7XG4gIGxvYWQsXG4gIGNsYXNzTmFtZUlzVmFsaWQsXG4gIGZpZWxkTmFtZUlzVmFsaWQsXG4gIGludmFsaWRDbGFzc05hbWVNZXNzYWdlLFxuICBidWlsZE1lcmdlZFNjaGVtYU9iamVjdCxcbiAgc3lzdGVtQ2xhc3NlcyxcbiAgZGVmYXVsdENvbHVtbnMsXG4gIGNvbnZlcnRTY2hlbWFUb0FkYXB0ZXJTY2hlbWEsXG4gIFZvbGF0aWxlQ2xhc3Nlc1NjaGVtYXMsXG4gIFNjaGVtYUNvbnRyb2xsZXIsXG59O1xuIl19