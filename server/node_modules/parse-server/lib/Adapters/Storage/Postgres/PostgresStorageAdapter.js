"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PostgresStorageAdapter = void 0;

var _PostgresClient = require("./PostgresClient");

var _node = _interopRequireDefault(require("parse/node"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sql = _interopRequireDefault(require("./sql"));

var _StorageAdapter = require("../StorageAdapter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PostgresRelationDoesNotExistError = '42P01';
const PostgresDuplicateRelationError = '42P07';
const PostgresDuplicateColumnError = '42701';
const PostgresMissingColumnError = '42703';
const PostgresDuplicateObjectError = '42710';
const PostgresUniqueIndexViolationError = '23505';
const PostgresTransactionAbortedError = '25P02';

const logger = require('../../../logger');

const debug = function (...args) {
  args = ['PG: ' + arguments[0]].concat(args.slice(1, args.length));
  const log = logger.getLogger();
  log.debug.apply(log, args);
};

const parseTypeToPostgresType = type => {
  switch (type.type) {
    case 'String':
      return 'text';

    case 'Date':
      return 'timestamp with time zone';

    case 'Object':
      return 'jsonb';

    case 'File':
      return 'text';

    case 'Boolean':
      return 'boolean';

    case 'Pointer':
      return 'char(10)';

    case 'Number':
      return 'double precision';

    case 'GeoPoint':
      return 'point';

    case 'Bytes':
      return 'jsonb';

    case 'Polygon':
      return 'polygon';

    case 'Array':
      if (type.contents && type.contents.type === 'String') {
        return 'text[]';
      } else {
        return 'jsonb';
      }

    default:
      throw `no type for ${JSON.stringify(type)} yet`;
  }
};

const ParseToPosgresComparator = {
  $gt: '>',
  $lt: '<',
  $gte: '>=',
  $lte: '<='
};
const mongoAggregateToPostgres = {
  $dayOfMonth: 'DAY',
  $dayOfWeek: 'DOW',
  $dayOfYear: 'DOY',
  $isoDayOfWeek: 'ISODOW',
  $isoWeekYear: 'ISOYEAR',
  $hour: 'HOUR',
  $minute: 'MINUTE',
  $second: 'SECOND',
  $millisecond: 'MILLISECONDS',
  $month: 'MONTH',
  $week: 'WEEK',
  $year: 'YEAR'
};

const toPostgresValue = value => {
  if (typeof value === 'object') {
    if (value.__type === 'Date') {
      return value.iso;
    }

    if (value.__type === 'File') {
      return value.name;
    }
  }

  return value;
};

const transformValue = value => {
  if (typeof value === 'object' && value.__type === 'Pointer') {
    return value.objectId;
  }

  return value;
}; // Duplicate from then mongo adapter...


const emptyCLPS = Object.freeze({
  find: {},
  get: {},
  create: {},
  update: {},
  delete: {},
  addField: {}
});
const defaultCLPS = Object.freeze({
  find: {
    '*': true
  },
  get: {
    '*': true
  },
  create: {
    '*': true
  },
  update: {
    '*': true
  },
  delete: {
    '*': true
  },
  addField: {
    '*': true
  }
});

const toParseSchema = schema => {
  if (schema.className === '_User') {
    delete schema.fields._hashed_password;
  }

  if (schema.fields) {
    delete schema.fields._wperm;
    delete schema.fields._rperm;
  }

  let clps = defaultCLPS;

  if (schema.classLevelPermissions) {
    clps = _objectSpread({}, emptyCLPS, schema.classLevelPermissions);
  }

  let indexes = {};

  if (schema.indexes) {
    indexes = _objectSpread({}, schema.indexes);
  }

  return {
    className: schema.className,
    fields: schema.fields,
    classLevelPermissions: clps,
    indexes
  };
};

const toPostgresSchema = schema => {
  if (!schema) {
    return schema;
  }

  schema.fields = schema.fields || {};
  schema.fields._wperm = {
    type: 'Array',
    contents: {
      type: 'String'
    }
  };
  schema.fields._rperm = {
    type: 'Array',
    contents: {
      type: 'String'
    }
  };

  if (schema.className === '_User') {
    schema.fields._hashed_password = {
      type: 'String'
    };
    schema.fields._password_history = {
      type: 'Array'
    };
  }

  return schema;
};

const handleDotFields = object => {
  Object.keys(object).forEach(fieldName => {
    if (fieldName.indexOf('.') > -1) {
      const components = fieldName.split('.');
      const first = components.shift();
      object[first] = object[first] || {};
      let currentObj = object[first];
      let next;
      let value = object[fieldName];

      if (value && value.__op === 'Delete') {
        value = undefined;
      }
      /* eslint-disable no-cond-assign */


      while (next = components.shift()) {
        /* eslint-enable no-cond-assign */
        currentObj[next] = currentObj[next] || {};

        if (components.length === 0) {
          currentObj[next] = value;
        }

        currentObj = currentObj[next];
      }

      delete object[fieldName];
    }
  });
  return object;
};

const transformDotFieldToComponents = fieldName => {
  return fieldName.split('.').map((cmpt, index) => {
    if (index === 0) {
      return `"${cmpt}"`;
    }

    return `'${cmpt}'`;
  });
};

const transformDotField = fieldName => {
  if (fieldName.indexOf('.') === -1) {
    return `"${fieldName}"`;
  }

  const components = transformDotFieldToComponents(fieldName);
  let name = components.slice(0, components.length - 1).join('->');
  name += '->>' + components[components.length - 1];
  return name;
};

const transformAggregateField = fieldName => {
  if (typeof fieldName !== 'string') {
    return fieldName;
  }

  if (fieldName === '$_created_at') {
    return 'createdAt';
  }

  if (fieldName === '$_updated_at') {
    return 'updatedAt';
  }

  return fieldName.substr(1);
};

const validateKeys = object => {
  if (typeof object == 'object') {
    for (const key in object) {
      if (typeof object[key] == 'object') {
        validateKeys(object[key]);
      }

      if (key.includes('$') || key.includes('.')) {
        throw new _node.default.Error(_node.default.Error.INVALID_NESTED_KEY, "Nested keys should not contain the '$' or '.' characters");
      }
    }
  }
}; // Returns the list of join tables on a schema


const joinTablesForSchema = schema => {
  const list = [];

  if (schema) {
    Object.keys(schema.fields).forEach(field => {
      if (schema.fields[field].type === 'Relation') {
        list.push(`_Join:${field}:${schema.className}`);
      }
    });
  }

  return list;
};

const buildWhereClause = ({
  schema,
  query,
  index
}) => {
  const patterns = [];
  let values = [];
  const sorts = [];
  schema = toPostgresSchema(schema);

  for (const fieldName in query) {
    const isArrayField = schema.fields && schema.fields[fieldName] && schema.fields[fieldName].type === 'Array';
    const initialPatternsLength = patterns.length;
    const fieldValue = query[fieldName]; // nothingin the schema, it's gonna blow up

    if (!schema.fields[fieldName]) {
      // as it won't exist
      if (fieldValue && fieldValue.$exists === false) {
        continue;
      }
    }

    if (fieldName.indexOf('.') >= 0) {
      let name = transformDotField(fieldName);

      if (fieldValue === null) {
        patterns.push(`${name} IS NULL`);
      } else {
        if (fieldValue.$in) {
          const inPatterns = [];
          name = transformDotFieldToComponents(fieldName).join('->');
          fieldValue.$in.forEach(listElem => {
            if (typeof listElem === 'string') {
              inPatterns.push(`"${listElem}"`);
            } else {
              inPatterns.push(`${listElem}`);
            }
          });
          patterns.push(`(${name})::jsonb @> '[${inPatterns.join()}]'::jsonb`);
        } else if (fieldValue.$regex) {// Handle later
        } else {
          patterns.push(`${name} = '${fieldValue}'`);
        }
      }
    } else if (fieldValue === null || fieldValue === undefined) {
      patterns.push(`$${index}:name IS NULL`);
      values.push(fieldName);
      index += 1;
      continue;
    } else if (typeof fieldValue === 'string') {
      patterns.push(`$${index}:name = $${index + 1}`);
      values.push(fieldName, fieldValue);
      index += 2;
    } else if (typeof fieldValue === 'boolean') {
      patterns.push(`$${index}:name = $${index + 1}`); // Can't cast boolean to double precision

      if (schema.fields[fieldName] && schema.fields[fieldName].type === 'Number') {
        // Should always return zero results
        const MAX_INT_PLUS_ONE = 9223372036854775808;
        values.push(fieldName, MAX_INT_PLUS_ONE);
      } else {
        values.push(fieldName, fieldValue);
      }

      index += 2;
    } else if (typeof fieldValue === 'number') {
      patterns.push(`$${index}:name = $${index + 1}`);
      values.push(fieldName, fieldValue);
      index += 2;
    } else if (['$or', '$nor', '$and'].includes(fieldName)) {
      const clauses = [];
      const clauseValues = [];
      fieldValue.forEach(subQuery => {
        const clause = buildWhereClause({
          schema,
          query: subQuery,
          index
        });

        if (clause.pattern.length > 0) {
          clauses.push(clause.pattern);
          clauseValues.push(...clause.values);
          index += clause.values.length;
        }
      });
      const orOrAnd = fieldName === '$and' ? ' AND ' : ' OR ';
      const not = fieldName === '$nor' ? ' NOT ' : '';
      patterns.push(`${not}(${clauses.join(orOrAnd)})`);
      values.push(...clauseValues);
    }

    if (fieldValue.$ne !== undefined) {
      if (isArrayField) {
        fieldValue.$ne = JSON.stringify([fieldValue.$ne]);
        patterns.push(`NOT array_contains($${index}:name, $${index + 1})`);
      } else {
        if (fieldValue.$ne === null) {
          patterns.push(`$${index}:name IS NOT NULL`);
          values.push(fieldName);
          index += 1;
          continue;
        } else {
          // if not null, we need to manually exclude null
          patterns.push(`($${index}:name <> $${index + 1} OR $${index}:name IS NULL)`);
        }
      } // TODO: support arrays


      values.push(fieldName, fieldValue.$ne);
      index += 2;
    }

    if (fieldValue.$eq !== undefined) {
      if (fieldValue.$eq === null) {
        patterns.push(`$${index}:name IS NULL`);
        values.push(fieldName);
        index += 1;
      } else {
        patterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue.$eq);
        index += 2;
      }
    }

    const isInOrNin = Array.isArray(fieldValue.$in) || Array.isArray(fieldValue.$nin);

    if (Array.isArray(fieldValue.$in) && isArrayField && schema.fields[fieldName].contents && schema.fields[fieldName].contents.type === 'String') {
      const inPatterns = [];
      let allowNull = false;
      values.push(fieldName);
      fieldValue.$in.forEach((listElem, listIndex) => {
        if (listElem === null) {
          allowNull = true;
        } else {
          values.push(listElem);
          inPatterns.push(`$${index + 1 + listIndex - (allowNull ? 1 : 0)}`);
        }
      });

      if (allowNull) {
        patterns.push(`($${index}:name IS NULL OR $${index}:name && ARRAY[${inPatterns.join()}])`);
      } else {
        patterns.push(`$${index}:name && ARRAY[${inPatterns.join()}]`);
      }

      index = index + 1 + inPatterns.length;
    } else if (isInOrNin) {
      var createConstraint = (baseArray, notIn) => {
        const not = notIn ? ' NOT ' : '';

        if (baseArray.length > 0) {
          if (isArrayField) {
            patterns.push(`${not} array_contains($${index}:name, $${index + 1})`);
            values.push(fieldName, JSON.stringify(baseArray));
            index += 2;
          } else {
            // Handle Nested Dot Notation Above
            if (fieldName.indexOf('.') >= 0) {
              return;
            }

            const inPatterns = [];
            values.push(fieldName);
            baseArray.forEach((listElem, listIndex) => {
              if (listElem !== null) {
                values.push(listElem);
                inPatterns.push(`$${index + 1 + listIndex}`);
              }
            });
            patterns.push(`$${index}:name ${not} IN (${inPatterns.join()})`);
            index = index + 1 + inPatterns.length;
          }
        } else if (!notIn) {
          values.push(fieldName);
          patterns.push(`$${index}:name IS NULL`);
          index = index + 1;
        } else {
          // Handle empty array
          if (notIn) {
            patterns.push('1 = 1'); // Return all values
          } else {
            patterns.push('1 = 2'); // Return no values
          }
        }
      };

      if (fieldValue.$in) {
        createConstraint(_lodash.default.flatMap(fieldValue.$in, elt => elt), false);
      }

      if (fieldValue.$nin) {
        createConstraint(_lodash.default.flatMap(fieldValue.$nin, elt => elt), true);
      }
    } else if (typeof fieldValue.$in !== 'undefined') {
      throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $in value');
    } else if (typeof fieldValue.$nin !== 'undefined') {
      throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $nin value');
    }

    if (Array.isArray(fieldValue.$all) && isArrayField) {
      if (isAnyValueRegexStartsWith(fieldValue.$all)) {
        if (!isAllValuesRegexOrNone(fieldValue.$all)) {
          throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'All $all values must be of regex type or none: ' + fieldValue.$all);
        }

        for (let i = 0; i < fieldValue.$all.length; i += 1) {
          const value = processRegexPattern(fieldValue.$all[i].$regex);
          fieldValue.$all[i] = value.substring(1) + '%';
        }

        patterns.push(`array_contains_all_regex($${index}:name, $${index + 1}::jsonb)`);
      } else {
        patterns.push(`array_contains_all($${index}:name, $${index + 1}::jsonb)`);
      }

      values.push(fieldName, JSON.stringify(fieldValue.$all));
      index += 2;
    }

    if (typeof fieldValue.$exists !== 'undefined') {
      if (fieldValue.$exists) {
        patterns.push(`$${index}:name IS NOT NULL`);
      } else {
        patterns.push(`$${index}:name IS NULL`);
      }

      values.push(fieldName);
      index += 1;
    }

    if (fieldValue.$containedBy) {
      const arr = fieldValue.$containedBy;

      if (!(arr instanceof Array)) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $containedBy: should be an array`);
      }

      patterns.push(`$${index}:name <@ $${index + 1}::jsonb`);
      values.push(fieldName, JSON.stringify(arr));
      index += 2;
    }

    if (fieldValue.$text) {
      const search = fieldValue.$text.$search;
      let language = 'english';

      if (typeof search !== 'object') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $search, should be object`);
      }

      if (!search.$term || typeof search.$term !== 'string') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $term, should be string`);
      }

      if (search.$language && typeof search.$language !== 'string') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $language, should be string`);
      } else if (search.$language) {
        language = search.$language;
      }

      if (search.$caseSensitive && typeof search.$caseSensitive !== 'boolean') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $caseSensitive, should be boolean`);
      } else if (search.$caseSensitive) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $caseSensitive not supported, please use $regex or create a separate lower case column.`);
      }

      if (search.$diacriticSensitive && typeof search.$diacriticSensitive !== 'boolean') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $diacriticSensitive, should be boolean`);
      } else if (search.$diacriticSensitive === false) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, `bad $text: $diacriticSensitive - false not supported, install Postgres Unaccent Extension`);
      }

      patterns.push(`to_tsvector($${index}, $${index + 1}:name) @@ to_tsquery($${index + 2}, $${index + 3})`);
      values.push(language, fieldName, language, search.$term);
      index += 4;
    }

    if (fieldValue.$nearSphere) {
      const point = fieldValue.$nearSphere;
      const distance = fieldValue.$maxDistance;
      const distanceInKM = distance * 6371 * 1000;
      patterns.push(`ST_distance_sphere($${index}:name::geometry, POINT($${index + 1}, $${index + 2})::geometry) <= $${index + 3}`);
      sorts.push(`ST_distance_sphere($${index}:name::geometry, POINT($${index + 1}, $${index + 2})::geometry) ASC`);
      values.push(fieldName, point.longitude, point.latitude, distanceInKM);
      index += 4;
    }

    if (fieldValue.$within && fieldValue.$within.$box) {
      const box = fieldValue.$within.$box;
      const left = box[0].longitude;
      const bottom = box[0].latitude;
      const right = box[1].longitude;
      const top = box[1].latitude;
      patterns.push(`$${index}:name::point <@ $${index + 1}::box`);
      values.push(fieldName, `((${left}, ${bottom}), (${right}, ${top}))`);
      index += 2;
    }

    if (fieldValue.$geoWithin && fieldValue.$geoWithin.$centerSphere) {
      const centerSphere = fieldValue.$geoWithin.$centerSphere;

      if (!(centerSphere instanceof Array) || centerSphere.length < 2) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value; $centerSphere should be an array of Parse.GeoPoint and distance');
      } // Get point, convert to geo point if necessary and validate


      let point = centerSphere[0];

      if (point instanceof Array && point.length === 2) {
        point = new _node.default.GeoPoint(point[1], point[0]);
      } else if (!GeoPointCoder.isValidJSON(point)) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value; $centerSphere geo point invalid');
      }

      _node.default.GeoPoint._validate(point.latitude, point.longitude); // Get distance and validate


      const distance = centerSphere[1];

      if (isNaN(distance) || distance < 0) {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value; $centerSphere distance invalid');
      }

      const distanceInKM = distance * 6371 * 1000;
      patterns.push(`ST_distance_sphere($${index}:name::geometry, POINT($${index + 1}, $${index + 2})::geometry) <= $${index + 3}`);
      values.push(fieldName, point.longitude, point.latitude, distanceInKM);
      index += 4;
    }

    if (fieldValue.$geoWithin && fieldValue.$geoWithin.$polygon) {
      const polygon = fieldValue.$geoWithin.$polygon;
      let points;

      if (typeof polygon === 'object' && polygon.__type === 'Polygon') {
        if (!polygon.coordinates || polygon.coordinates.length < 3) {
          throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value; Polygon.coordinates should contain at least 3 lon/lat pairs');
        }

        points = polygon.coordinates;
      } else if (polygon instanceof Array) {
        if (polygon.length < 3) {
          throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value; $polygon should contain at least 3 GeoPoints');
        }

        points = polygon;
      } else {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, "bad $geoWithin value; $polygon should be Polygon object or Array of Parse.GeoPoint's");
      }

      points = points.map(point => {
        if (point instanceof Array && point.length === 2) {
          _node.default.GeoPoint._validate(point[1], point[0]);

          return `(${point[0]}, ${point[1]})`;
        }

        if (typeof point !== 'object' || point.__type !== 'GeoPoint') {
          throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoWithin value');
        } else {
          _node.default.GeoPoint._validate(point.latitude, point.longitude);
        }

        return `(${point.longitude}, ${point.latitude})`;
      }).join(', ');
      patterns.push(`$${index}:name::point <@ $${index + 1}::polygon`);
      values.push(fieldName, `(${points})`);
      index += 2;
    }

    if (fieldValue.$geoIntersects && fieldValue.$geoIntersects.$point) {
      const point = fieldValue.$geoIntersects.$point;

      if (typeof point !== 'object' || point.__type !== 'GeoPoint') {
        throw new _node.default.Error(_node.default.Error.INVALID_JSON, 'bad $geoIntersect value; $point should be GeoPoint');
      } else {
        _node.default.GeoPoint._validate(point.latitude, point.longitude);
      }

      patterns.push(`$${index}:name::polygon @> $${index + 1}::point`);
      values.push(fieldName, `(${point.longitude}, ${point.latitude})`);
      index += 2;
    }

    if (fieldValue.$regex) {
      let regex = fieldValue.$regex;
      let operator = '~';
      const opts = fieldValue.$options;

      if (opts) {
        if (opts.indexOf('i') >= 0) {
          operator = '~*';
        }

        if (opts.indexOf('x') >= 0) {
          regex = removeWhiteSpace(regex);
        }
      }

      const name = transformDotField(fieldName);
      regex = processRegexPattern(regex);
      patterns.push(`$${index}:raw ${operator} '$${index + 1}:raw'`);
      values.push(name, regex);
      index += 2;
    }

    if (fieldValue.__type === 'Pointer') {
      if (isArrayField) {
        patterns.push(`array_contains($${index}:name, $${index + 1})`);
        values.push(fieldName, JSON.stringify([fieldValue]));
        index += 2;
      } else {
        patterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue.objectId);
        index += 2;
      }
    }

    if (fieldValue.__type === 'Date') {
      patterns.push(`$${index}:name = $${index + 1}`);
      values.push(fieldName, fieldValue.iso);
      index += 2;
    }

    if (fieldValue.__type === 'GeoPoint') {
      patterns.push('$' + index + ':name ~= POINT($' + (index + 1) + ', $' + (index + 2) + ')');
      values.push(fieldName, fieldValue.longitude, fieldValue.latitude);
      index += 3;
    }

    if (fieldValue.__type === 'Polygon') {
      const value = convertPolygonToSQL(fieldValue.coordinates);
      patterns.push(`$${index}:name ~= $${index + 1}::polygon`);
      values.push(fieldName, value);
      index += 2;
    }

    Object.keys(ParseToPosgresComparator).forEach(cmp => {
      if (fieldValue[cmp] || fieldValue[cmp] === 0) {
        const pgComparator = ParseToPosgresComparator[cmp];
        patterns.push(`$${index}:name ${pgComparator} $${index + 1}`);
        values.push(fieldName, toPostgresValue(fieldValue[cmp]));
        index += 2;
      }
    });

    if (initialPatternsLength === patterns.length) {
      throw new _node.default.Error(_node.default.Error.OPERATION_FORBIDDEN, `Postgres doesn't support this query type yet ${JSON.stringify(fieldValue)}`);
    }
  }

  values = values.map(transformValue);
  return {
    pattern: patterns.join(' AND '),
    values,
    sorts
  };
};

class PostgresStorageAdapter {
  // Private
  constructor({
    uri,
    collectionPrefix = '',
    databaseOptions
  }) {
    this._collectionPrefix = collectionPrefix;
    const {
      client,
      pgp
    } = (0, _PostgresClient.createClient)(uri, databaseOptions);
    this._client = client;
    this._pgp = pgp;
    this.canSortOnJoinTables = false;
  }

  handleShutdown() {
    if (!this._client) {
      return;
    }

    this._client.$pool.end();
  }

  _ensureSchemaCollectionExists(conn) {
    conn = conn || this._client;
    return conn.none('CREATE TABLE IF NOT EXISTS "_SCHEMA" ( "className" varChar(120), "schema" jsonb, "isParseClass" bool, PRIMARY KEY ("className") )').catch(error => {
      if (error.code === PostgresDuplicateRelationError || error.code === PostgresUniqueIndexViolationError || error.code === PostgresDuplicateObjectError) {// Table already exists, must have been created by a different request. Ignore error.
      } else {
        throw error;
      }
    });
  }

  classExists(name) {
    return this._client.one('SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)', [name], a => a.exists);
  }

  setClassLevelPermissions(className, CLPs) {
    const self = this;
    return this._client.task('set-class-level-permissions', function* (t) {
      yield self._ensureSchemaCollectionExists(t);
      const values = [className, 'schema', 'classLevelPermissions', JSON.stringify(CLPs)];
      yield t.none(`UPDATE "_SCHEMA" SET $2:name = json_object_set_key($2:name, $3::text, $4::jsonb) WHERE "className"=$1`, values);
    });
  }

  setIndexesWithSchemaFormat(className, submittedIndexes, existingIndexes = {}, fields, conn) {
    conn = conn || this._client;
    const self = this;

    if (submittedIndexes === undefined) {
      return Promise.resolve();
    }

    if (Object.keys(existingIndexes).length === 0) {
      existingIndexes = {
        _id_: {
          _id: 1
        }
      };
    }

    const deletedIndexes = [];
    const insertedIndexes = [];
    Object.keys(submittedIndexes).forEach(name => {
      const field = submittedIndexes[name];

      if (existingIndexes[name] && field.__op !== 'Delete') {
        throw new _node.default.Error(_node.default.Error.INVALID_QUERY, `Index ${name} exists, cannot update.`);
      }

      if (!existingIndexes[name] && field.__op === 'Delete') {
        throw new _node.default.Error(_node.default.Error.INVALID_QUERY, `Index ${name} does not exist, cannot delete.`);
      }

      if (field.__op === 'Delete') {
        deletedIndexes.push(name);
        delete existingIndexes[name];
      } else {
        Object.keys(field).forEach(key => {
          if (!fields.hasOwnProperty(key)) {
            throw new _node.default.Error(_node.default.Error.INVALID_QUERY, `Field ${key} does not exist, cannot add index.`);
          }
        });
        existingIndexes[name] = field;
        insertedIndexes.push({
          key: field,
          name
        });
      }
    });
    return conn.tx('set-indexes-with-schema-format', function* (t) {
      if (insertedIndexes.length > 0) {
        yield self.createIndexes(className, insertedIndexes, t);
      }

      if (deletedIndexes.length > 0) {
        yield self.dropIndexes(className, deletedIndexes, t);
      }

      yield self._ensureSchemaCollectionExists(t);
      yield t.none('UPDATE "_SCHEMA" SET $2:name = json_object_set_key($2:name, $3::text, $4::jsonb) WHERE "className"=$1', [className, 'schema', 'indexes', JSON.stringify(existingIndexes)]);
    });
  }

  createClass(className, schema, conn) {
    conn = conn || this._client;
    return conn.tx('create-class', t => {
      const q1 = this.createTable(className, schema, t);
      const q2 = t.none('INSERT INTO "_SCHEMA" ("className", "schema", "isParseClass") VALUES ($<className>, $<schema>, true)', {
        className,
        schema
      });
      const q3 = this.setIndexesWithSchemaFormat(className, schema.indexes, {}, schema.fields, t);
      return t.batch([q1, q2, q3]);
    }).then(() => {
      return toParseSchema(schema);
    }).catch(err => {
      if (err.data[0].result.code === PostgresTransactionAbortedError) {
        err = err.data[1].result;
      }

      if (err.code === PostgresUniqueIndexViolationError && err.detail.includes(className)) {
        throw new _node.default.Error(_node.default.Error.DUPLICATE_VALUE, `Class ${className} already exists.`);
      }

      throw err;
    });
  } // Just create a table, do not insert in schema


  createTable(className, schema, conn) {
    conn = conn || this._client;
    const self = this;
    debug('createTable', className, schema);
    const valuesArray = [];
    const patternsArray = [];
    const fields = Object.assign({}, schema.fields);

    if (className === '_User') {
      fields._email_verify_token_expires_at = {
        type: 'Date'
      };
      fields._email_verify_token = {
        type: 'String'
      };
      fields._account_lockout_expires_at = {
        type: 'Date'
      };
      fields._failed_login_count = {
        type: 'Number'
      };
      fields._perishable_token = {
        type: 'String'
      };
      fields._perishable_token_expires_at = {
        type: 'Date'
      };
      fields._password_changed_at = {
        type: 'Date'
      };
      fields._password_history = {
        type: 'Array'
      };
    }

    let index = 2;
    const relations = [];
    Object.keys(fields).forEach(fieldName => {
      const parseType = fields[fieldName]; // Skip when it's a relation
      // We'll create the tables later

      if (parseType.type === 'Relation') {
        relations.push(fieldName);
        return;
      }

      if (['_rperm', '_wperm'].indexOf(fieldName) >= 0) {
        parseType.contents = {
          type: 'String'
        };
      }

      valuesArray.push(fieldName);
      valuesArray.push(parseTypeToPostgresType(parseType));
      patternsArray.push(`$${index}:name $${index + 1}:raw`);

      if (fieldName === 'objectId') {
        patternsArray.push(`PRIMARY KEY ($${index}:name)`);
      }

      index = index + 2;
    });
    const qs = `CREATE TABLE IF NOT EXISTS $1:name (${patternsArray.join()})`;
    const values = [className, ...valuesArray];
    debug(qs, values);
    return conn.task('create-table', function* (t) {
      try {
        yield self._ensureSchemaCollectionExists(t);
        yield t.none(qs, values);
      } catch (error) {
        if (error.code !== PostgresDuplicateRelationError) {
          throw error;
        } // ELSE: Table already exists, must have been created by a different request. Ignore the error.

      }

      yield t.tx('create-table-tx', tx => {
        return tx.batch(relations.map(fieldName => {
          return tx.none('CREATE TABLE IF NOT EXISTS $<joinTable:name> ("relatedId" varChar(120), "owningId" varChar(120), PRIMARY KEY("relatedId", "owningId") )', {
            joinTable: `_Join:${fieldName}:${className}`
          });
        }));
      });
    });
  }

  schemaUpgrade(className, schema, conn) {
    debug('schemaUpgrade', {
      className,
      schema
    });
    conn = conn || this._client;
    const self = this;
    return conn.tx('schema-upgrade', function* (t) {
      const columns = yield t.map('SELECT column_name FROM information_schema.columns WHERE table_name = $<className>', {
        className
      }, a => a.column_name);
      const newColumns = Object.keys(schema.fields).filter(item => columns.indexOf(item) === -1).map(fieldName => self.addFieldIfNotExists(className, fieldName, schema.fields[fieldName], t));
      yield t.batch(newColumns);
    });
  }

  addFieldIfNotExists(className, fieldName, type, conn) {
    // TODO: Must be revised for invalid logic...
    debug('addFieldIfNotExists', {
      className,
      fieldName,
      type
    });
    conn = conn || this._client;
    const self = this;
    return conn.tx('add-field-if-not-exists', function* (t) {
      if (type.type !== 'Relation') {
        try {
          yield t.none('ALTER TABLE $<className:name> ADD COLUMN $<fieldName:name> $<postgresType:raw>', {
            className,
            fieldName,
            postgresType: parseTypeToPostgresType(type)
          });
        } catch (error) {
          if (error.code === PostgresRelationDoesNotExistError) {
            return yield self.createClass(className, {
              fields: {
                [fieldName]: type
              }
            }, t);
          }

          if (error.code !== PostgresDuplicateColumnError) {
            throw error;
          } // Column already exists, created by other request. Carry on to see if it's the right type.

        }
      } else {
        yield t.none('CREATE TABLE IF NOT EXISTS $<joinTable:name> ("relatedId" varChar(120), "owningId" varChar(120), PRIMARY KEY("relatedId", "owningId") )', {
          joinTable: `_Join:${fieldName}:${className}`
        });
      }

      const result = yield t.any('SELECT "schema" FROM "_SCHEMA" WHERE "className" = $<className> and ("schema"::json->\'fields\'->$<fieldName>) is not null', {
        className,
        fieldName
      });

      if (result[0]) {
        throw 'Attempted to add a field that already exists';
      } else {
        const path = `{fields,${fieldName}}`;
        yield t.none('UPDATE "_SCHEMA" SET "schema"=jsonb_set("schema", $<path>, $<type>)  WHERE "className"=$<className>', {
          path,
          type,
          className
        });
      }
    });
  } // Drops a collection. Resolves with true if it was a Parse Schema (eg. _User, Custom, etc.)
  // and resolves with false if it wasn't (eg. a join table). Rejects if deletion was impossible.


  deleteClass(className) {
    const operations = [{
      query: `DROP TABLE IF EXISTS $1:name`,
      values: [className]
    }, {
      query: `DELETE FROM "_SCHEMA" WHERE "className" = $1`,
      values: [className]
    }];
    return this._client.tx(t => t.none(this._pgp.helpers.concat(operations))).then(() => className.indexOf('_Join:') != 0); // resolves with false when _Join table
  } // Delete all data known to this adapter. Used for testing.


  deleteAllClasses() {
    const now = new Date().getTime();
    const helpers = this._pgp.helpers;
    debug('deleteAllClasses');
    return this._client.task('delete-all-classes', function* (t) {
      try {
        const results = yield t.any('SELECT * FROM "_SCHEMA"');
        const joins = results.reduce((list, schema) => {
          return list.concat(joinTablesForSchema(schema.schema));
        }, []);
        const classes = ['_SCHEMA', '_PushStatus', '_JobStatus', '_JobSchedule', '_Hooks', '_GlobalConfig', '_Audience', ...results.map(result => result.className), ...joins];
        const queries = classes.map(className => ({
          query: 'DROP TABLE IF EXISTS $<className:name>',
          values: {
            className
          }
        }));
        yield t.tx(tx => tx.none(helpers.concat(queries)));
      } catch (error) {
        if (error.code !== PostgresRelationDoesNotExistError) {
          throw error;
        } // No _SCHEMA collection. Don't delete anything.

      }
    }).then(() => {
      debug(`deleteAllClasses done in ${new Date().getTime() - now}`);
    });
  } // Remove the column and all the data. For Relations, the _Join collection is handled
  // specially, this function does not delete _Join columns. It should, however, indicate
  // that the relation fields does not exist anymore. In mongo, this means removing it from
  // the _SCHEMA collection.  There should be no actual data in the collection under the same name
  // as the relation column, so it's fine to attempt to delete it. If the fields listed to be
  // deleted do not exist, this function should return successfully anyways. Checking for
  // attempts to delete non-existent fields is the responsibility of Parse Server.
  // This function is not obligated to delete fields atomically. It is given the field
  // names in a list so that databases that are capable of deleting fields atomically
  // may do so.
  // Returns a Promise.


  deleteFields(className, schema, fieldNames) {
    debug('deleteFields', className, fieldNames);
    fieldNames = fieldNames.reduce((list, fieldName) => {
      const field = schema.fields[fieldName];

      if (field.type !== 'Relation') {
        list.push(fieldName);
      }

      delete schema.fields[fieldName];
      return list;
    }, []);
    const values = [className, ...fieldNames];
    const columns = fieldNames.map((name, idx) => {
      return `$${idx + 2}:name`;
    }).join(', DROP COLUMN');
    return this._client.tx('delete-fields', function* (t) {
      yield t.none('UPDATE "_SCHEMA" SET "schema"=$<schema> WHERE "className"=$<className>', {
        schema,
        className
      });

      if (values.length > 1) {
        yield t.none(`ALTER TABLE $1:name DROP COLUMN ${columns}`, values);
      }
    });
  } // Return a promise for all schemas known to this adapter, in Parse format. In case the
  // schemas cannot be retrieved, returns a promise that rejects. Requirements for the
  // rejection reason are TBD.


  getAllClasses() {
    const self = this;
    return this._client.task('get-all-classes', function* (t) {
      yield self._ensureSchemaCollectionExists(t);
      return yield t.map('SELECT * FROM "_SCHEMA"', null, row => toParseSchema(_objectSpread({
        className: row.className
      }, row.schema)));
    });
  } // Return a promise for the schema with the given name, in Parse format. If
  // this adapter doesn't know about the schema, return a promise that rejects with
  // undefined as the reason.


  getClass(className) {
    debug('getClass', className);
    return this._client.any('SELECT * FROM "_SCHEMA" WHERE "className"=$<className>', {
      className
    }).then(result => {
      if (result.length !== 1) {
        throw undefined;
      }

      return result[0].schema;
    }).then(toParseSchema);
  } // TODO: remove the mongo format dependency in the return value


  createObject(className, schema, object) {
    debug('createObject', className, object);
    let columnsArray = [];
    const valuesArray = [];
    schema = toPostgresSchema(schema);
    const geoPoints = {};
    object = handleDotFields(object);
    validateKeys(object);
    Object.keys(object).forEach(fieldName => {
      if (object[fieldName] === null) {
        return;
      }

      var authDataMatch = fieldName.match(/^_auth_data_([a-zA-Z0-9_]+)$/);

      if (authDataMatch) {
        var provider = authDataMatch[1];
        object['authData'] = object['authData'] || {};
        object['authData'][provider] = object[fieldName];
        delete object[fieldName];
        fieldName = 'authData';
      }

      columnsArray.push(fieldName);

      if (!schema.fields[fieldName] && className === '_User') {
        if (fieldName === '_email_verify_token' || fieldName === '_failed_login_count' || fieldName === '_perishable_token' || fieldName === '_password_history') {
          valuesArray.push(object[fieldName]);
        }

        if (fieldName === '_email_verify_token_expires_at') {
          if (object[fieldName]) {
            valuesArray.push(object[fieldName].iso);
          } else {
            valuesArray.push(null);
          }
        }

        if (fieldName === '_account_lockout_expires_at' || fieldName === '_perishable_token_expires_at' || fieldName === '_password_changed_at') {
          if (object[fieldName]) {
            valuesArray.push(object[fieldName].iso);
          } else {
            valuesArray.push(null);
          }
        }

        return;
      }

      switch (schema.fields[fieldName].type) {
        case 'Date':
          if (object[fieldName]) {
            valuesArray.push(object[fieldName].iso);
          } else {
            valuesArray.push(null);
          }

          break;

        case 'Pointer':
          valuesArray.push(object[fieldName].objectId);
          break;

        case 'Array':
          if (['_rperm', '_wperm'].indexOf(fieldName) >= 0) {
            valuesArray.push(object[fieldName]);
          } else {
            valuesArray.push(JSON.stringify(object[fieldName]));
          }

          break;

        case 'Object':
        case 'Bytes':
        case 'String':
        case 'Number':
        case 'Boolean':
          valuesArray.push(object[fieldName]);
          break;

        case 'File':
          valuesArray.push(object[fieldName].name);
          break;

        case 'Polygon':
          {
            const value = convertPolygonToSQL(object[fieldName].coordinates);
            valuesArray.push(value);
            break;
          }

        case 'GeoPoint':
          // pop the point and process later
          geoPoints[fieldName] = object[fieldName];
          columnsArray.pop();
          break;

        default:
          throw `Type ${schema.fields[fieldName].type} not supported yet`;
      }
    });
    columnsArray = columnsArray.concat(Object.keys(geoPoints));
    const initialValues = valuesArray.map((val, index) => {
      let termination = '';
      const fieldName = columnsArray[index];

      if (['_rperm', '_wperm'].indexOf(fieldName) >= 0) {
        termination = '::text[]';
      } else if (schema.fields[fieldName] && schema.fields[fieldName].type === 'Array') {
        termination = '::jsonb';
      }

      return `$${index + 2 + columnsArray.length}${termination}`;
    });
    const geoPointsInjects = Object.keys(geoPoints).map(key => {
      const value = geoPoints[key];
      valuesArray.push(value.longitude, value.latitude);
      const l = valuesArray.length + columnsArray.length;
      return `POINT($${l}, $${l + 1})`;
    });
    const columnsPattern = columnsArray.map((col, index) => `$${index + 2}:name`).join();
    const valuesPattern = initialValues.concat(geoPointsInjects).join();
    const qs = `INSERT INTO $1:name (${columnsPattern}) VALUES (${valuesPattern})`;
    const values = [className, ...columnsArray, ...valuesArray];
    debug(qs, values);
    return this._client.none(qs, values).then(() => ({
      ops: [object]
    })).catch(error => {
      if (error.code === PostgresUniqueIndexViolationError) {
        const err = new _node.default.Error(_node.default.Error.DUPLICATE_VALUE, 'A duplicate value for a field with unique values was provided');
        err.underlyingError = error;

        if (error.constraint) {
          const matches = error.constraint.match(/unique_([a-zA-Z]+)/);

          if (matches && Array.isArray(matches)) {
            err.userInfo = {
              duplicated_field: matches[1]
            };
          }
        }

        error = err;
      }

      throw error;
    });
  } // Remove all objects that match the given Parse Query.
  // If no objects match, reject with OBJECT_NOT_FOUND. If objects are found and deleted, resolve with undefined.
  // If there is some other error, reject with INTERNAL_SERVER_ERROR.


  deleteObjectsByQuery(className, schema, query) {
    debug('deleteObjectsByQuery', className, query);
    const values = [className];
    const index = 2;
    const where = buildWhereClause({
      schema,
      index,
      query
    });
    values.push(...where.values);

    if (Object.keys(query).length === 0) {
      where.pattern = 'TRUE';
    }

    const qs = `WITH deleted AS (DELETE FROM $1:name WHERE ${where.pattern} RETURNING *) SELECT count(*) FROM deleted`;
    debug(qs, values);
    return this._client.one(qs, values, a => +a.count).then(count => {
      if (count === 0) {
        throw new _node.default.Error(_node.default.Error.OBJECT_NOT_FOUND, 'Object not found.');
      } else {
        return count;
      }
    }).catch(error => {
      if (error.code !== PostgresRelationDoesNotExistError) {
        throw error;
      } // ELSE: Don't delete anything if doesn't exist

    });
  } // Return value not currently well specified.


  findOneAndUpdate(className, schema, query, update) {
    debug('findOneAndUpdate', className, query, update);
    return this.updateObjectsByQuery(className, schema, query, update).then(val => val[0]);
  } // Apply the update to all objects that match the given Parse Query.


  updateObjectsByQuery(className, schema, query, update) {
    debug('updateObjectsByQuery', className, query, update);
    const updatePatterns = [];
    const values = [className];
    let index = 2;
    schema = toPostgresSchema(schema);

    const originalUpdate = _objectSpread({}, update); // Set flag for dot notation fields


    const dotNotationOptions = {};
    Object.keys(update).forEach(fieldName => {
      if (fieldName.indexOf('.') > -1) {
        const components = fieldName.split('.');
        const first = components.shift();
        dotNotationOptions[first] = true;
      } else {
        dotNotationOptions[fieldName] = false;
      }
    });
    update = handleDotFields(update); // Resolve authData first,
    // So we don't end up with multiple key updates

    for (const fieldName in update) {
      const authDataMatch = fieldName.match(/^_auth_data_([a-zA-Z0-9_]+)$/);

      if (authDataMatch) {
        var provider = authDataMatch[1];
        const value = update[fieldName];
        delete update[fieldName];
        update['authData'] = update['authData'] || {};
        update['authData'][provider] = value;
      }
    }

    for (const fieldName in update) {
      const fieldValue = update[fieldName]; // Drop any undefined values.

      if (typeof fieldValue === 'undefined') {
        delete update[fieldName];
      } else if (fieldValue === null) {
        updatePatterns.push(`$${index}:name = NULL`);
        values.push(fieldName);
        index += 1;
      } else if (fieldName == 'authData') {
        // This recursively sets the json_object
        // Only 1 level deep
        const generate = (jsonb, key, value) => {
          return `json_object_set_key(COALESCE(${jsonb}, '{}'::jsonb), ${key}, ${value})::jsonb`;
        };

        const lastKey = `$${index}:name`;
        const fieldNameIndex = index;
        index += 1;
        values.push(fieldName);
        const update = Object.keys(fieldValue).reduce((lastKey, key) => {
          const str = generate(lastKey, `$${index}::text`, `$${index + 1}::jsonb`);
          index += 2;
          let value = fieldValue[key];

          if (value) {
            if (value.__op === 'Delete') {
              value = null;
            } else {
              value = JSON.stringify(value);
            }
          }

          values.push(key, value);
          return str;
        }, lastKey);
        updatePatterns.push(`$${fieldNameIndex}:name = ${update}`);
      } else if (fieldValue.__op === 'Increment') {
        updatePatterns.push(`$${index}:name = COALESCE($${index}:name, 0) + $${index + 1}`);
        values.push(fieldName, fieldValue.amount);
        index += 2;
      } else if (fieldValue.__op === 'Add') {
        updatePatterns.push(`$${index}:name = array_add(COALESCE($${index}:name, '[]'::jsonb), $${index + 1}::jsonb)`);
        values.push(fieldName, JSON.stringify(fieldValue.objects));
        index += 2;
      } else if (fieldValue.__op === 'Delete') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, null);
        index += 2;
      } else if (fieldValue.__op === 'Remove') {
        updatePatterns.push(`$${index}:name = array_remove(COALESCE($${index}:name, '[]'::jsonb), $${index + 1}::jsonb)`);
        values.push(fieldName, JSON.stringify(fieldValue.objects));
        index += 2;
      } else if (fieldValue.__op === 'AddUnique') {
        updatePatterns.push(`$${index}:name = array_add_unique(COALESCE($${index}:name, '[]'::jsonb), $${index + 1}::jsonb)`);
        values.push(fieldName, JSON.stringify(fieldValue.objects));
        index += 2;
      } else if (fieldName === 'updatedAt') {
        //TODO: stop special casing this. It should check for __type === 'Date' and use .iso
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue);
        index += 2;
      } else if (typeof fieldValue === 'string') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue);
        index += 2;
      } else if (typeof fieldValue === 'boolean') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue);
        index += 2;
      } else if (fieldValue.__type === 'Pointer') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue.objectId);
        index += 2;
      } else if (fieldValue.__type === 'Date') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, toPostgresValue(fieldValue));
        index += 2;
      } else if (fieldValue instanceof Date) {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue);
        index += 2;
      } else if (fieldValue.__type === 'File') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, toPostgresValue(fieldValue));
        index += 2;
      } else if (fieldValue.__type === 'GeoPoint') {
        updatePatterns.push(`$${index}:name = POINT($${index + 1}, $${index + 2})`);
        values.push(fieldName, fieldValue.longitude, fieldValue.latitude);
        index += 3;
      } else if (fieldValue.__type === 'Polygon') {
        const value = convertPolygonToSQL(fieldValue.coordinates);
        updatePatterns.push(`$${index}:name = $${index + 1}::polygon`);
        values.push(fieldName, value);
        index += 2;
      } else if (fieldValue.__type === 'Relation') {// noop
      } else if (typeof fieldValue === 'number') {
        updatePatterns.push(`$${index}:name = $${index + 1}`);
        values.push(fieldName, fieldValue);
        index += 2;
      } else if (typeof fieldValue === 'object' && schema.fields[fieldName] && schema.fields[fieldName].type === 'Object') {
        // Gather keys to increment
        const keysToIncrement = Object.keys(originalUpdate).filter(k => {
          // choose top level fields that have a delete operation set
          // Note that Object.keys is iterating over the **original** update object
          // and that some of the keys of the original update could be null or undefined:
          // (See the above check `if (fieldValue === null || typeof fieldValue == "undefined")`)
          const value = originalUpdate[k];
          return value && value.__op === 'Increment' && k.split('.').length === 2 && k.split('.')[0] === fieldName;
        }).map(k => k.split('.')[1]);
        let incrementPatterns = '';

        if (keysToIncrement.length > 0) {
          incrementPatterns = ' || ' + keysToIncrement.map(c => {
            const amount = fieldValue[c].amount;
            return `CONCAT('{"${c}":', COALESCE($${index}:name->>'${c}','0')::int + ${amount}, '}')::jsonb`;
          }).join(' || '); // Strip the keys

          keysToIncrement.forEach(key => {
            delete fieldValue[key];
          });
        }

        const keysToDelete = Object.keys(originalUpdate).filter(k => {
          // choose top level fields that have a delete operation set.
          const value = originalUpdate[k];
          return value && value.__op === 'Delete' && k.split('.').length === 2 && k.split('.')[0] === fieldName;
        }).map(k => k.split('.')[1]);
        const deletePatterns = keysToDelete.reduce((p, c, i) => {
          return p + ` - '$${index + 1 + i}:value'`;
        }, ''); // Override Object

        let updateObject = "'{}'::jsonb";

        if (dotNotationOptions[fieldName]) {
          // Merge Object
          updateObject = `COALESCE($${index}:name, '{}'::jsonb)`;
        }

        updatePatterns.push(`$${index}:name = (${updateObject} ${deletePatterns} ${incrementPatterns} || $${index + 1 + keysToDelete.length}::jsonb )`);
        values.push(fieldName, ...keysToDelete, JSON.stringify(fieldValue));
        index += 2 + keysToDelete.length;
      } else if (Array.isArray(fieldValue) && schema.fields[fieldName] && schema.fields[fieldName].type === 'Array') {
        const expectedType = parseTypeToPostgresType(schema.fields[fieldName]);

        if (expectedType === 'text[]') {
          updatePatterns.push(`$${index}:name = $${index + 1}::text[]`);
          values.push(fieldName, fieldValue);
          index += 2;
        } else {
          values.push(fieldName);

          const buildSQLArray = fieldValue => {
            let pattern = 'json_build_array(';

            for (let i = 0; i < fieldValue.length; i += 1) {
              const element = fieldValue[i];
              let type = '';

              if (Array.isArray(element)) {
                pattern += buildSQLArray(element) + ',';
                continue;
              } else if (typeof element == 'object') {
                type = '::json';
              }

              values.push(element);
              pattern += `$${index + 1}${type},`;
              index += 1;
            } // remove last comma


            if (fieldValue.length > 0) {
              pattern = pattern.slice(0, -1);
            }

            pattern += ')';
            return pattern;
          };

          const sql = `$${index}:name = ${buildSQLArray(fieldValue)}`;
          updatePatterns.push(sql);
          index += 1;
        }
      } else {
        debug('Not supported update', fieldName, fieldValue);
        return Promise.reject(new _node.default.Error(_node.default.Error.OPERATION_FORBIDDEN, `Postgres doesn't support update ${JSON.stringify(fieldValue)} yet`));
      }
    }

    const where = buildWhereClause({
      schema,
      index,
      query
    });
    values.push(...where.values);
    const whereClause = where.pattern.length > 0 ? `WHERE ${where.pattern}` : '';
    const qs = `UPDATE $1:name SET ${updatePatterns.join()} ${whereClause} RETURNING *`;
    debug('update: ', qs, values);
    return this._client.any(qs, values);
  } // Hopefully, we can get rid of this. It's only used for config and hooks.


  upsertOneObject(className, schema, query, update) {
    debug('upsertOneObject', {
      className,
      query,
      update
    });
    const createValue = Object.assign({}, query, update);
    return this.createObject(className, schema, createValue).catch(error => {
      // ignore duplicate value errors as it's upsert
      if (error.code !== _node.default.Error.DUPLICATE_VALUE) {
        throw error;
      }

      return this.findOneAndUpdate(className, schema, query, update);
    });
  }

  find(className, schema, query, {
    skip,
    limit,
    sort,
    keys
  }) {
    debug('find', className, query, {
      skip,
      limit,
      sort,
      keys
    });
    const hasLimit = limit !== undefined;
    const hasSkip = skip !== undefined;
    let values = [className];
    const where = buildWhereClause({
      schema,
      query,
      index: 2
    });
    values.push(...where.values);
    const wherePattern = where.pattern.length > 0 ? `WHERE ${where.pattern}` : '';
    const limitPattern = hasLimit ? `LIMIT $${values.length + 1}` : '';

    if (hasLimit) {
      values.push(limit);
    }

    const skipPattern = hasSkip ? `OFFSET $${values.length + 1}` : '';

    if (hasSkip) {
      values.push(skip);
    }

    let sortPattern = '';

    if (sort) {
      const sortCopy = sort;
      const sorting = Object.keys(sort).map(key => {
        const transformKey = transformDotFieldToComponents(key).join('->'); // Using $idx pattern gives:  non-integer constant in ORDER BY

        if (sortCopy[key] === 1) {
          return `${transformKey} ASC`;
        }

        return `${transformKey} DESC`;
      }).join();
      sortPattern = sort !== undefined && Object.keys(sort).length > 0 ? `ORDER BY ${sorting}` : '';
    }

    if (where.sorts && Object.keys(where.sorts).length > 0) {
      sortPattern = `ORDER BY ${where.sorts.join()}`;
    }

    let columns = '*';

    if (keys) {
      // Exclude empty keys
      // Replace ACL by it's keys
      keys = keys.reduce((memo, key) => {
        if (key === 'ACL') {
          memo.push('_rperm');
          memo.push('_wperm');
        } else if (key.length > 0) {
          memo.push(key);
        }

        return memo;
      }, []);
      columns = keys.map((key, index) => {
        if (key === '$score') {
          return `ts_rank_cd(to_tsvector($${2}, $${3}:name), to_tsquery($${4}, $${5}), 32) as score`;
        }

        return `$${index + values.length + 1}:name`;
      }).join();
      values = values.concat(keys);
    }

    const qs = `SELECT ${columns} FROM $1:name ${wherePattern} ${sortPattern} ${limitPattern} ${skipPattern}`;
    debug(qs, values);
    return this._client.any(qs, values).catch(error => {
      // Query on non existing table, don't crash
      if (error.code !== PostgresRelationDoesNotExistError) {
        throw error;
      }

      return [];
    }).then(results => results.map(object => this.postgresObjectToParseObject(className, object, schema)));
  } // Converts from a postgres-format object to a REST-format object.
  // Does not strip out anything based on a lack of authentication.


  postgresObjectToParseObject(className, object, schema) {
    Object.keys(schema.fields).forEach(fieldName => {
      if (schema.fields[fieldName].type === 'Pointer' && object[fieldName]) {
        object[fieldName] = {
          objectId: object[fieldName],
          __type: 'Pointer',
          className: schema.fields[fieldName].targetClass
        };
      }

      if (schema.fields[fieldName].type === 'Relation') {
        object[fieldName] = {
          __type: 'Relation',
          className: schema.fields[fieldName].targetClass
        };
      }

      if (object[fieldName] && schema.fields[fieldName].type === 'GeoPoint') {
        object[fieldName] = {
          __type: 'GeoPoint',
          latitude: object[fieldName].y,
          longitude: object[fieldName].x
        };
      }

      if (object[fieldName] && schema.fields[fieldName].type === 'Polygon') {
        let coords = object[fieldName];
        coords = coords.substr(2, coords.length - 4).split('),(');
        coords = coords.map(point => {
          return [parseFloat(point.split(',')[1]), parseFloat(point.split(',')[0])];
        });
        object[fieldName] = {
          __type: 'Polygon',
          coordinates: coords
        };
      }

      if (object[fieldName] && schema.fields[fieldName].type === 'File') {
        object[fieldName] = {
          __type: 'File',
          name: object[fieldName]
        };
      }
    }); //TODO: remove this reliance on the mongo format. DB adapter shouldn't know there is a difference between created at and any other date field.

    if (object.createdAt) {
      object.createdAt = object.createdAt.toISOString();
    }

    if (object.updatedAt) {
      object.updatedAt = object.updatedAt.toISOString();
    }

    if (object.expiresAt) {
      object.expiresAt = {
        __type: 'Date',
        iso: object.expiresAt.toISOString()
      };
    }

    if (object._email_verify_token_expires_at) {
      object._email_verify_token_expires_at = {
        __type: 'Date',
        iso: object._email_verify_token_expires_at.toISOString()
      };
    }

    if (object._account_lockout_expires_at) {
      object._account_lockout_expires_at = {
        __type: 'Date',
        iso: object._account_lockout_expires_at.toISOString()
      };
    }

    if (object._perishable_token_expires_at) {
      object._perishable_token_expires_at = {
        __type: 'Date',
        iso: object._perishable_token_expires_at.toISOString()
      };
    }

    if (object._password_changed_at) {
      object._password_changed_at = {
        __type: 'Date',
        iso: object._password_changed_at.toISOString()
      };
    }

    for (const fieldName in object) {
      if (object[fieldName] === null) {
        delete object[fieldName];
      }

      if (object[fieldName] instanceof Date) {
        object[fieldName] = {
          __type: 'Date',
          iso: object[fieldName].toISOString()
        };
      }
    }

    return object;
  } // Create a unique index. Unique indexes on nullable fields are not allowed. Since we don't
  // currently know which fields are nullable and which aren't, we ignore that criteria.
  // As such, we shouldn't expose this function to users of parse until we have an out-of-band
  // Way of determining if a field is nullable. Undefined doesn't count against uniqueness,
  // which is why we use sparse indexes.


  ensureUniqueness(className, schema, fieldNames) {
    // Use the same name for every ensureUniqueness attempt, because postgres
    // Will happily create the same index with multiple names.
    const constraintName = `unique_${fieldNames.sort().join('_')}`;
    const constraintPatterns = fieldNames.map((fieldName, index) => `$${index + 3}:name`);
    const qs = `ALTER TABLE $1:name ADD CONSTRAINT $2:name UNIQUE (${constraintPatterns.join()})`;
    return this._client.none(qs, [className, constraintName, ...fieldNames]).catch(error => {
      if (error.code === PostgresDuplicateRelationError && error.message.includes(constraintName)) {// Index already exists. Ignore error.
      } else if (error.code === PostgresUniqueIndexViolationError && error.message.includes(constraintName)) {
        // Cast the error into the proper parse error
        throw new _node.default.Error(_node.default.Error.DUPLICATE_VALUE, 'A duplicate value for a field with unique values was provided');
      } else {
        throw error;
      }
    });
  } // Executes a count.


  count(className, schema, query) {
    debug('count', className, query);
    const values = [className];
    const where = buildWhereClause({
      schema,
      query,
      index: 2
    });
    values.push(...where.values);
    const wherePattern = where.pattern.length > 0 ? `WHERE ${where.pattern}` : '';
    const qs = `SELECT count(*) FROM $1:name ${wherePattern}`;
    return this._client.one(qs, values, a => +a.count).catch(error => {
      if (error.code !== PostgresRelationDoesNotExistError) {
        throw error;
      }

      return 0;
    });
  }

  distinct(className, schema, query, fieldName) {
    debug('distinct', className, query);
    let field = fieldName;
    let column = fieldName;
    const isNested = fieldName.indexOf('.') >= 0;

    if (isNested) {
      field = transformDotFieldToComponents(fieldName).join('->');
      column = fieldName.split('.')[0];
    }

    const isArrayField = schema.fields && schema.fields[fieldName] && schema.fields[fieldName].type === 'Array';
    const isPointerField = schema.fields && schema.fields[fieldName] && schema.fields[fieldName].type === 'Pointer';
    const values = [field, column, className];
    const where = buildWhereClause({
      schema,
      query,
      index: 4
    });
    values.push(...where.values);
    const wherePattern = where.pattern.length > 0 ? `WHERE ${where.pattern}` : '';
    const transformer = isArrayField ? 'jsonb_array_elements' : 'ON';
    let qs = `SELECT DISTINCT ${transformer}($1:name) $2:name FROM $3:name ${wherePattern}`;

    if (isNested) {
      qs = `SELECT DISTINCT ${transformer}($1:raw) $2:raw FROM $3:name ${wherePattern}`;
    }

    debug(qs, values);
    return this._client.any(qs, values).catch(error => {
      if (error.code === PostgresMissingColumnError) {
        return [];
      }

      throw error;
    }).then(results => {
      if (!isNested) {
        results = results.filter(object => object[field] !== null);
        return results.map(object => {
          if (!isPointerField) {
            return object[field];
          }

          return {
            __type: 'Pointer',
            className: schema.fields[fieldName].targetClass,
            objectId: object[field]
          };
        });
      }

      const child = fieldName.split('.')[1];
      return results.map(object => object[column][child]);
    }).then(results => results.map(object => this.postgresObjectToParseObject(className, object, schema)));
  }

  aggregate(className, schema, pipeline) {
    debug('aggregate', className, pipeline);
    const values = [className];
    let index = 2;
    let columns = [];
    let countField = null;
    let groupValues = null;
    let wherePattern = '';
    let limitPattern = '';
    let skipPattern = '';
    let sortPattern = '';
    let groupPattern = '';

    for (let i = 0; i < pipeline.length; i += 1) {
      const stage = pipeline[i];

      if (stage.$group) {
        for (const field in stage.$group) {
          const value = stage.$group[field];

          if (value === null || value === undefined) {
            continue;
          }

          if (field === '_id' && typeof value === 'string' && value !== '') {
            columns.push(`$${index}:name AS "objectId"`);
            groupPattern = `GROUP BY $${index}:name`;
            values.push(transformAggregateField(value));
            index += 1;
            continue;
          }

          if (field === '_id' && typeof value === 'object' && Object.keys(value).length !== 0) {
            groupValues = value;
            const groupByFields = [];

            for (const alias in value) {
              const operation = Object.keys(value[alias])[0];
              const source = transformAggregateField(value[alias][operation]);

              if (mongoAggregateToPostgres[operation]) {
                if (!groupByFields.includes(`"${source}"`)) {
                  groupByFields.push(`"${source}"`);
                }

                columns.push(`EXTRACT(${mongoAggregateToPostgres[operation]} FROM $${index}:name AT TIME ZONE 'UTC') AS $${index + 1}:name`);
                values.push(source, alias);
                index += 2;
              }
            }

            groupPattern = `GROUP BY $${index}:raw`;
            values.push(groupByFields.join());
            index += 1;
            continue;
          }

          if (value.$sum) {
            if (typeof value.$sum === 'string') {
              columns.push(`SUM($${index}:name) AS $${index + 1}:name`);
              values.push(transformAggregateField(value.$sum), field);
              index += 2;
            } else {
              countField = field;
              columns.push(`COUNT(*) AS $${index}:name`);
              values.push(field);
              index += 1;
            }
          }

          if (value.$max) {
            columns.push(`MAX($${index}:name) AS $${index + 1}:name`);
            values.push(transformAggregateField(value.$max), field);
            index += 2;
          }

          if (value.$min) {
            columns.push(`MIN($${index}:name) AS $${index + 1}:name`);
            values.push(transformAggregateField(value.$min), field);
            index += 2;
          }

          if (value.$avg) {
            columns.push(`AVG($${index}:name) AS $${index + 1}:name`);
            values.push(transformAggregateField(value.$avg), field);
            index += 2;
          }
        }
      } else {
        columns.push('*');
      }

      if (stage.$project) {
        if (columns.includes('*')) {
          columns = [];
        }

        for (const field in stage.$project) {
          const value = stage.$project[field];

          if (value === 1 || value === true) {
            columns.push(`$${index}:name`);
            values.push(field);
            index += 1;
          }
        }
      }

      if (stage.$match) {
        const patterns = [];
        const orOrAnd = stage.$match.hasOwnProperty('$or') ? ' OR ' : ' AND ';

        if (stage.$match.$or) {
          const collapse = {};
          stage.$match.$or.forEach(element => {
            for (const key in element) {
              collapse[key] = element[key];
            }
          });
          stage.$match = collapse;
        }

        for (const field in stage.$match) {
          const value = stage.$match[field];
          const matchPatterns = [];
          Object.keys(ParseToPosgresComparator).forEach(cmp => {
            if (value[cmp]) {
              const pgComparator = ParseToPosgresComparator[cmp];
              matchPatterns.push(`$${index}:name ${pgComparator} $${index + 1}`);
              values.push(field, toPostgresValue(value[cmp]));
              index += 2;
            }
          });

          if (matchPatterns.length > 0) {
            patterns.push(`(${matchPatterns.join(' AND ')})`);
          }

          if (schema.fields[field] && schema.fields[field].type && matchPatterns.length === 0) {
            patterns.push(`$${index}:name = $${index + 1}`);
            values.push(field, value);
            index += 2;
          }
        }

        wherePattern = patterns.length > 0 ? `WHERE ${patterns.join(` ${orOrAnd} `)}` : '';
      }

      if (stage.$limit) {
        limitPattern = `LIMIT $${index}`;
        values.push(stage.$limit);
        index += 1;
      }

      if (stage.$skip) {
        skipPattern = `OFFSET $${index}`;
        values.push(stage.$skip);
        index += 1;
      }

      if (stage.$sort) {
        const sort = stage.$sort;
        const keys = Object.keys(sort);
        const sorting = keys.map(key => {
          const transformer = sort[key] === 1 ? 'ASC' : 'DESC';
          const order = `$${index}:name ${transformer}`;
          index += 1;
          return order;
        }).join();
        values.push(...keys);
        sortPattern = sort !== undefined && sorting.length > 0 ? `ORDER BY ${sorting}` : '';
      }
    }

    const qs = `SELECT ${columns.join()} FROM $1:name ${wherePattern} ${sortPattern} ${limitPattern} ${skipPattern} ${groupPattern}`;
    debug(qs, values);
    return this._client.map(qs, values, a => this.postgresObjectToParseObject(className, a, schema)).then(results => {
      results.forEach(result => {
        if (!result.hasOwnProperty('objectId')) {
          result.objectId = null;
        }

        if (groupValues) {
          result.objectId = {};

          for (const key in groupValues) {
            result.objectId[key] = result[key];
            delete result[key];
          }
        }

        if (countField) {
          result[countField] = parseInt(result[countField], 10);
        }
      });
      return results;
    });
  }

  performInitialization({
    VolatileClassesSchemas
  }) {
    // TODO: This method needs to be rewritten to make proper use of connections (@vitaly-t)
    debug('performInitialization');
    const promises = VolatileClassesSchemas.map(schema => {
      return this.createTable(schema.className, schema).catch(err => {
        if (err.code === PostgresDuplicateRelationError || err.code === _node.default.Error.INVALID_CLASS_NAME) {
          return Promise.resolve();
        }

        throw err;
      }).then(() => this.schemaUpgrade(schema.className, schema));
    });
    return Promise.all(promises).then(() => {
      return this._client.tx('perform-initialization', t => {
        return t.batch([t.none(_sql.default.misc.jsonObjectSetKeys), t.none(_sql.default.array.add), t.none(_sql.default.array.addUnique), t.none(_sql.default.array.remove), t.none(_sql.default.array.containsAll), t.none(_sql.default.array.containsAllRegex), t.none(_sql.default.array.contains)]);
      });
    }).then(data => {
      debug(`initializationDone in ${data.duration}`);
    }).catch(error => {
      /* eslint-disable no-console */
      console.error(error);
    });
  }

  createIndexes(className, indexes, conn) {
    return (conn || this._client).tx(t => t.batch(indexes.map(i => {
      return t.none('CREATE INDEX $1:name ON $2:name ($3:name)', [i.name, className, i.key]);
    })));
  }

  createIndexesIfNeeded(className, fieldName, type, conn) {
    return (conn || this._client).none('CREATE INDEX $1:name ON $2:name ($3:name)', [fieldName, className, type]);
  }

  dropIndexes(className, indexes, conn) {
    const queries = indexes.map(i => ({
      query: 'DROP INDEX $1:name',
      values: i
    }));
    return (conn || this._client).tx(t => t.none(this._pgp.helpers.concat(queries)));
  }

  getIndexes(className) {
    const qs = 'SELECT * FROM pg_indexes WHERE tablename = ${className}';
    return this._client.any(qs, {
      className
    });
  }

  updateSchemaWithIndexes() {
    return Promise.resolve();
  }

}

exports.PostgresStorageAdapter = PostgresStorageAdapter;

function convertPolygonToSQL(polygon) {
  if (polygon.length < 3) {
    throw new _node.default.Error(_node.default.Error.INVALID_JSON, `Polygon must have at least 3 values`);
  }

  if (polygon[0][0] !== polygon[polygon.length - 1][0] || polygon[0][1] !== polygon[polygon.length - 1][1]) {
    polygon.push(polygon[0]);
  }

  const unique = polygon.filter((item, index, ar) => {
    let foundIndex = -1;

    for (let i = 0; i < ar.length; i += 1) {
      const pt = ar[i];

      if (pt[0] === item[0] && pt[1] === item[1]) {
        foundIndex = i;
        break;
      }
    }

    return foundIndex === index;
  });

  if (unique.length < 3) {
    throw new _node.default.Error(_node.default.Error.INTERNAL_SERVER_ERROR, 'GeoJSON: Loop must have at least 3 different vertices');
  }

  const points = polygon.map(point => {
    _node.default.GeoPoint._validate(parseFloat(point[1]), parseFloat(point[0]));

    return `(${point[1]}, ${point[0]})`;
  }).join(', ');
  return `(${points})`;
}

function removeWhiteSpace(regex) {
  if (!regex.endsWith('\n')) {
    regex += '\n';
  } // remove non escaped comments


  return regex.replace(/([^\\])#.*\n/gim, '$1') // remove lines starting with a comment
  .replace(/^#.*\n/gim, '') // remove non escaped whitespace
  .replace(/([^\\])\s+/gim, '$1') // remove whitespace at the beginning of a line
  .replace(/^\s+/, '').trim();
}

function processRegexPattern(s) {
  if (s && s.startsWith('^')) {
    // regex for startsWith
    return '^' + literalizeRegexPart(s.slice(1));
  } else if (s && s.endsWith('$')) {
    // regex for endsWith
    return literalizeRegexPart(s.slice(0, s.length - 1)) + '$';
  } // regex for contains


  return literalizeRegexPart(s);
}

function isStartsWithRegex(value) {
  if (!value || typeof value !== 'string' || !value.startsWith('^')) {
    return false;
  }

  const matches = value.match(/\^\\Q.*\\E/);
  return !!matches;
}

function isAllValuesRegexOrNone(values) {
  if (!values || !Array.isArray(values) || values.length === 0) {
    return true;
  }

  const firstValuesIsRegex = isStartsWithRegex(values[0].$regex);

  if (values.length === 1) {
    return firstValuesIsRegex;
  }

  for (let i = 1, length = values.length; i < length; ++i) {
    if (firstValuesIsRegex !== isStartsWithRegex(values[i].$regex)) {
      return false;
    }
  }

  return true;
}

function isAnyValueRegexStartsWith(values) {
  return values.some(function (value) {
    return isStartsWithRegex(value.$regex);
  });
}

function createLiteralRegex(remaining) {
  return remaining.split('').map(c => {
    if (c.match(/[0-9a-zA-Z]/) !== null) {
      // don't escape alphanumeric characters
      return c;
    } // escape everything else (single quotes with single quotes, everything else with a backslash)


    return c === `'` ? `''` : `\\${c}`;
  }).join('');
}

function literalizeRegexPart(s) {
  const matcher1 = /\\Q((?!\\E).*)\\E$/;
  const result1 = s.match(matcher1);

  if (result1 && result1.length > 1 && result1.index > -1) {
    // process regex that has a beginning and an end specified for the literal text
    const prefix = s.substr(0, result1.index);
    const remaining = result1[1];
    return literalizeRegexPart(prefix) + createLiteralRegex(remaining);
  } // process regex that has a beginning specified for the literal text


  const matcher2 = /\\Q((?!\\E).*)$/;
  const result2 = s.match(matcher2);

  if (result2 && result2.length > 1 && result2.index > -1) {
    const prefix = s.substr(0, result2.index);
    const remaining = result2[1];
    return literalizeRegexPart(prefix) + createLiteralRegex(remaining);
  } // remove all instances of \Q and \E from the remaining text & escape single quotes


  return s.replace(/([^\\])(\\E)/, '$1').replace(/([^\\])(\\Q)/, '$1').replace(/^\\E/, '').replace(/^\\Q/, '').replace(/([^'])'/, `$1''`).replace(/^'([^'])/, `''$1`);
}

var GeoPointCoder = {
  isValidJSON(value) {
    return typeof value === 'object' && value !== null && value.__type === 'GeoPoint';
  }

};
var _default = PostgresStorageAdapter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9BZGFwdGVycy9TdG9yYWdlL1Bvc3RncmVzL1Bvc3RncmVzU3RvcmFnZUFkYXB0ZXIuanMiXSwibmFtZXMiOlsiUG9zdGdyZXNSZWxhdGlvbkRvZXNOb3RFeGlzdEVycm9yIiwiUG9zdGdyZXNEdXBsaWNhdGVSZWxhdGlvbkVycm9yIiwiUG9zdGdyZXNEdXBsaWNhdGVDb2x1bW5FcnJvciIsIlBvc3RncmVzTWlzc2luZ0NvbHVtbkVycm9yIiwiUG9zdGdyZXNEdXBsaWNhdGVPYmplY3RFcnJvciIsIlBvc3RncmVzVW5pcXVlSW5kZXhWaW9sYXRpb25FcnJvciIsIlBvc3RncmVzVHJhbnNhY3Rpb25BYm9ydGVkRXJyb3IiLCJsb2dnZXIiLCJyZXF1aXJlIiwiZGVidWciLCJhcmdzIiwiYXJndW1lbnRzIiwiY29uY2F0Iiwic2xpY2UiLCJsZW5ndGgiLCJsb2ciLCJnZXRMb2dnZXIiLCJhcHBseSIsInBhcnNlVHlwZVRvUG9zdGdyZXNUeXBlIiwidHlwZSIsImNvbnRlbnRzIiwiSlNPTiIsInN0cmluZ2lmeSIsIlBhcnNlVG9Qb3NncmVzQ29tcGFyYXRvciIsIiRndCIsIiRsdCIsIiRndGUiLCIkbHRlIiwibW9uZ29BZ2dyZWdhdGVUb1Bvc3RncmVzIiwiJGRheU9mTW9udGgiLCIkZGF5T2ZXZWVrIiwiJGRheU9mWWVhciIsIiRpc29EYXlPZldlZWsiLCIkaXNvV2Vla1llYXIiLCIkaG91ciIsIiRtaW51dGUiLCIkc2Vjb25kIiwiJG1pbGxpc2Vjb25kIiwiJG1vbnRoIiwiJHdlZWsiLCIkeWVhciIsInRvUG9zdGdyZXNWYWx1ZSIsInZhbHVlIiwiX190eXBlIiwiaXNvIiwibmFtZSIsInRyYW5zZm9ybVZhbHVlIiwib2JqZWN0SWQiLCJlbXB0eUNMUFMiLCJPYmplY3QiLCJmcmVlemUiLCJmaW5kIiwiZ2V0IiwiY3JlYXRlIiwidXBkYXRlIiwiZGVsZXRlIiwiYWRkRmllbGQiLCJkZWZhdWx0Q0xQUyIsInRvUGFyc2VTY2hlbWEiLCJzY2hlbWEiLCJjbGFzc05hbWUiLCJmaWVsZHMiLCJfaGFzaGVkX3Bhc3N3b3JkIiwiX3dwZXJtIiwiX3JwZXJtIiwiY2xwcyIsImNsYXNzTGV2ZWxQZXJtaXNzaW9ucyIsImluZGV4ZXMiLCJ0b1Bvc3RncmVzU2NoZW1hIiwiX3Bhc3N3b3JkX2hpc3RvcnkiLCJoYW5kbGVEb3RGaWVsZHMiLCJvYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImZpZWxkTmFtZSIsImluZGV4T2YiLCJjb21wb25lbnRzIiwic3BsaXQiLCJmaXJzdCIsInNoaWZ0IiwiY3VycmVudE9iaiIsIm5leHQiLCJfX29wIiwidW5kZWZpbmVkIiwidHJhbnNmb3JtRG90RmllbGRUb0NvbXBvbmVudHMiLCJtYXAiLCJjbXB0IiwiaW5kZXgiLCJ0cmFuc2Zvcm1Eb3RGaWVsZCIsImpvaW4iLCJ0cmFuc2Zvcm1BZ2dyZWdhdGVGaWVsZCIsInN1YnN0ciIsInZhbGlkYXRlS2V5cyIsImtleSIsImluY2x1ZGVzIiwiUGFyc2UiLCJFcnJvciIsIklOVkFMSURfTkVTVEVEX0tFWSIsImpvaW5UYWJsZXNGb3JTY2hlbWEiLCJsaXN0IiwiZmllbGQiLCJwdXNoIiwiYnVpbGRXaGVyZUNsYXVzZSIsInF1ZXJ5IiwicGF0dGVybnMiLCJ2YWx1ZXMiLCJzb3J0cyIsImlzQXJyYXlGaWVsZCIsImluaXRpYWxQYXR0ZXJuc0xlbmd0aCIsImZpZWxkVmFsdWUiLCIkZXhpc3RzIiwiJGluIiwiaW5QYXR0ZXJucyIsImxpc3RFbGVtIiwiJHJlZ2V4IiwiTUFYX0lOVF9QTFVTX09ORSIsImNsYXVzZXMiLCJjbGF1c2VWYWx1ZXMiLCJzdWJRdWVyeSIsImNsYXVzZSIsInBhdHRlcm4iLCJvck9yQW5kIiwibm90IiwiJG5lIiwiJGVxIiwiaXNJbk9yTmluIiwiQXJyYXkiLCJpc0FycmF5IiwiJG5pbiIsImFsbG93TnVsbCIsImxpc3RJbmRleCIsImNyZWF0ZUNvbnN0cmFpbnQiLCJiYXNlQXJyYXkiLCJub3RJbiIsIl8iLCJmbGF0TWFwIiwiZWx0IiwiSU5WQUxJRF9KU09OIiwiJGFsbCIsImlzQW55VmFsdWVSZWdleFN0YXJ0c1dpdGgiLCJpc0FsbFZhbHVlc1JlZ2V4T3JOb25lIiwiaSIsInByb2Nlc3NSZWdleFBhdHRlcm4iLCJzdWJzdHJpbmciLCIkY29udGFpbmVkQnkiLCJhcnIiLCIkdGV4dCIsInNlYXJjaCIsIiRzZWFyY2giLCJsYW5ndWFnZSIsIiR0ZXJtIiwiJGxhbmd1YWdlIiwiJGNhc2VTZW5zaXRpdmUiLCIkZGlhY3JpdGljU2Vuc2l0aXZlIiwiJG5lYXJTcGhlcmUiLCJwb2ludCIsImRpc3RhbmNlIiwiJG1heERpc3RhbmNlIiwiZGlzdGFuY2VJbktNIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCIkd2l0aGluIiwiJGJveCIsImJveCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsInRvcCIsIiRnZW9XaXRoaW4iLCIkY2VudGVyU3BoZXJlIiwiY2VudGVyU3BoZXJlIiwiR2VvUG9pbnQiLCJHZW9Qb2ludENvZGVyIiwiaXNWYWxpZEpTT04iLCJfdmFsaWRhdGUiLCJpc05hTiIsIiRwb2x5Z29uIiwicG9seWdvbiIsInBvaW50cyIsImNvb3JkaW5hdGVzIiwiJGdlb0ludGVyc2VjdHMiLCIkcG9pbnQiLCJyZWdleCIsIm9wZXJhdG9yIiwib3B0cyIsIiRvcHRpb25zIiwicmVtb3ZlV2hpdGVTcGFjZSIsImNvbnZlcnRQb2x5Z29uVG9TUUwiLCJjbXAiLCJwZ0NvbXBhcmF0b3IiLCJPUEVSQVRJT05fRk9SQklEREVOIiwiUG9zdGdyZXNTdG9yYWdlQWRhcHRlciIsImNvbnN0cnVjdG9yIiwidXJpIiwiY29sbGVjdGlvblByZWZpeCIsImRhdGFiYXNlT3B0aW9ucyIsIl9jb2xsZWN0aW9uUHJlZml4IiwiY2xpZW50IiwicGdwIiwiX2NsaWVudCIsIl9wZ3AiLCJjYW5Tb3J0T25Kb2luVGFibGVzIiwiaGFuZGxlU2h1dGRvd24iLCIkcG9vbCIsImVuZCIsIl9lbnN1cmVTY2hlbWFDb2xsZWN0aW9uRXhpc3RzIiwiY29ubiIsIm5vbmUiLCJjYXRjaCIsImVycm9yIiwiY29kZSIsImNsYXNzRXhpc3RzIiwib25lIiwiYSIsImV4aXN0cyIsInNldENsYXNzTGV2ZWxQZXJtaXNzaW9ucyIsIkNMUHMiLCJzZWxmIiwidGFzayIsInQiLCJzZXRJbmRleGVzV2l0aFNjaGVtYUZvcm1hdCIsInN1Ym1pdHRlZEluZGV4ZXMiLCJleGlzdGluZ0luZGV4ZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIl9pZF8iLCJfaWQiLCJkZWxldGVkSW5kZXhlcyIsImluc2VydGVkSW5kZXhlcyIsIklOVkFMSURfUVVFUlkiLCJoYXNPd25Qcm9wZXJ0eSIsInR4IiwiY3JlYXRlSW5kZXhlcyIsImRyb3BJbmRleGVzIiwiY3JlYXRlQ2xhc3MiLCJxMSIsImNyZWF0ZVRhYmxlIiwicTIiLCJxMyIsImJhdGNoIiwidGhlbiIsImVyciIsImRhdGEiLCJyZXN1bHQiLCJkZXRhaWwiLCJEVVBMSUNBVEVfVkFMVUUiLCJ2YWx1ZXNBcnJheSIsInBhdHRlcm5zQXJyYXkiLCJhc3NpZ24iLCJfZW1haWxfdmVyaWZ5X3Rva2VuX2V4cGlyZXNfYXQiLCJfZW1haWxfdmVyaWZ5X3Rva2VuIiwiX2FjY291bnRfbG9ja291dF9leHBpcmVzX2F0IiwiX2ZhaWxlZF9sb2dpbl9jb3VudCIsIl9wZXJpc2hhYmxlX3Rva2VuIiwiX3BlcmlzaGFibGVfdG9rZW5fZXhwaXJlc19hdCIsIl9wYXNzd29yZF9jaGFuZ2VkX2F0IiwicmVsYXRpb25zIiwicGFyc2VUeXBlIiwicXMiLCJqb2luVGFibGUiLCJzY2hlbWFVcGdyYWRlIiwiY29sdW1ucyIsImNvbHVtbl9uYW1lIiwibmV3Q29sdW1ucyIsImZpbHRlciIsIml0ZW0iLCJhZGRGaWVsZElmTm90RXhpc3RzIiwicG9zdGdyZXNUeXBlIiwiYW55IiwicGF0aCIsImRlbGV0ZUNsYXNzIiwib3BlcmF0aW9ucyIsImhlbHBlcnMiLCJkZWxldGVBbGxDbGFzc2VzIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJyZXN1bHRzIiwiam9pbnMiLCJyZWR1Y2UiLCJjbGFzc2VzIiwicXVlcmllcyIsImRlbGV0ZUZpZWxkcyIsImZpZWxkTmFtZXMiLCJpZHgiLCJnZXRBbGxDbGFzc2VzIiwicm93IiwiZ2V0Q2xhc3MiLCJjcmVhdGVPYmplY3QiLCJjb2x1bW5zQXJyYXkiLCJnZW9Qb2ludHMiLCJhdXRoRGF0YU1hdGNoIiwibWF0Y2giLCJwcm92aWRlciIsInBvcCIsImluaXRpYWxWYWx1ZXMiLCJ2YWwiLCJ0ZXJtaW5hdGlvbiIsImdlb1BvaW50c0luamVjdHMiLCJsIiwiY29sdW1uc1BhdHRlcm4iLCJjb2wiLCJ2YWx1ZXNQYXR0ZXJuIiwib3BzIiwidW5kZXJseWluZ0Vycm9yIiwiY29uc3RyYWludCIsIm1hdGNoZXMiLCJ1c2VySW5mbyIsImR1cGxpY2F0ZWRfZmllbGQiLCJkZWxldGVPYmplY3RzQnlRdWVyeSIsIndoZXJlIiwiY291bnQiLCJPQkpFQ1RfTk9UX0ZPVU5EIiwiZmluZE9uZUFuZFVwZGF0ZSIsInVwZGF0ZU9iamVjdHNCeVF1ZXJ5IiwidXBkYXRlUGF0dGVybnMiLCJvcmlnaW5hbFVwZGF0ZSIsImRvdE5vdGF0aW9uT3B0aW9ucyIsImdlbmVyYXRlIiwianNvbmIiLCJsYXN0S2V5IiwiZmllbGROYW1lSW5kZXgiLCJzdHIiLCJhbW91bnQiLCJvYmplY3RzIiwia2V5c1RvSW5jcmVtZW50IiwiayIsImluY3JlbWVudFBhdHRlcm5zIiwiYyIsImtleXNUb0RlbGV0ZSIsImRlbGV0ZVBhdHRlcm5zIiwicCIsInVwZGF0ZU9iamVjdCIsImV4cGVjdGVkVHlwZSIsImJ1aWxkU1FMQXJyYXkiLCJlbGVtZW50Iiwic3FsIiwicmVqZWN0Iiwid2hlcmVDbGF1c2UiLCJ1cHNlcnRPbmVPYmplY3QiLCJjcmVhdGVWYWx1ZSIsInNraXAiLCJsaW1pdCIsInNvcnQiLCJoYXNMaW1pdCIsImhhc1NraXAiLCJ3aGVyZVBhdHRlcm4iLCJsaW1pdFBhdHRlcm4iLCJza2lwUGF0dGVybiIsInNvcnRQYXR0ZXJuIiwic29ydENvcHkiLCJzb3J0aW5nIiwidHJhbnNmb3JtS2V5IiwibWVtbyIsInBvc3RncmVzT2JqZWN0VG9QYXJzZU9iamVjdCIsInRhcmdldENsYXNzIiwieSIsIngiLCJjb29yZHMiLCJwYXJzZUZsb2F0IiwiY3JlYXRlZEF0IiwidG9JU09TdHJpbmciLCJ1cGRhdGVkQXQiLCJleHBpcmVzQXQiLCJlbnN1cmVVbmlxdWVuZXNzIiwiY29uc3RyYWludE5hbWUiLCJjb25zdHJhaW50UGF0dGVybnMiLCJtZXNzYWdlIiwiZGlzdGluY3QiLCJjb2x1bW4iLCJpc05lc3RlZCIsImlzUG9pbnRlckZpZWxkIiwidHJhbnNmb3JtZXIiLCJjaGlsZCIsImFnZ3JlZ2F0ZSIsInBpcGVsaW5lIiwiY291bnRGaWVsZCIsImdyb3VwVmFsdWVzIiwiZ3JvdXBQYXR0ZXJuIiwic3RhZ2UiLCIkZ3JvdXAiLCJncm91cEJ5RmllbGRzIiwiYWxpYXMiLCJvcGVyYXRpb24iLCJzb3VyY2UiLCIkc3VtIiwiJG1heCIsIiRtaW4iLCIkYXZnIiwiJHByb2plY3QiLCIkbWF0Y2giLCIkb3IiLCJjb2xsYXBzZSIsIm1hdGNoUGF0dGVybnMiLCIkbGltaXQiLCIkc2tpcCIsIiRzb3J0Iiwib3JkZXIiLCJwYXJzZUludCIsInBlcmZvcm1Jbml0aWFsaXphdGlvbiIsIlZvbGF0aWxlQ2xhc3Nlc1NjaGVtYXMiLCJwcm9taXNlcyIsIklOVkFMSURfQ0xBU1NfTkFNRSIsImFsbCIsIm1pc2MiLCJqc29uT2JqZWN0U2V0S2V5cyIsImFycmF5IiwiYWRkIiwiYWRkVW5pcXVlIiwicmVtb3ZlIiwiY29udGFpbnNBbGwiLCJjb250YWluc0FsbFJlZ2V4IiwiY29udGFpbnMiLCJkdXJhdGlvbiIsImNvbnNvbGUiLCJjcmVhdGVJbmRleGVzSWZOZWVkZWQiLCJnZXRJbmRleGVzIiwidXBkYXRlU2NoZW1hV2l0aEluZGV4ZXMiLCJ1bmlxdWUiLCJhciIsImZvdW5kSW5kZXgiLCJwdCIsIklOVEVSTkFMX1NFUlZFUl9FUlJPUiIsImVuZHNXaXRoIiwicmVwbGFjZSIsInRyaW0iLCJzIiwic3RhcnRzV2l0aCIsImxpdGVyYWxpemVSZWdleFBhcnQiLCJpc1N0YXJ0c1dpdGhSZWdleCIsImZpcnN0VmFsdWVzSXNSZWdleCIsInNvbWUiLCJjcmVhdGVMaXRlcmFsUmVnZXgiLCJyZW1haW5pbmciLCJtYXRjaGVyMSIsInJlc3VsdDEiLCJwcmVmaXgiLCJtYXRjaGVyMiIsInJlc3VsdDIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7QUFFQTs7QUFDQTs7QUFpQkE7Ozs7Ozs7O0FBZkEsTUFBTUEsaUNBQWlDLEdBQUcsT0FBMUM7QUFDQSxNQUFNQyw4QkFBOEIsR0FBRyxPQUF2QztBQUNBLE1BQU1DLDRCQUE0QixHQUFHLE9BQXJDO0FBQ0EsTUFBTUMsMEJBQTBCLEdBQUcsT0FBbkM7QUFDQSxNQUFNQyw0QkFBNEIsR0FBRyxPQUFyQztBQUNBLE1BQU1DLGlDQUFpQyxHQUFHLE9BQTFDO0FBQ0EsTUFBTUMsK0JBQStCLEdBQUcsT0FBeEM7O0FBQ0EsTUFBTUMsTUFBTSxHQUFHQyxPQUFPLENBQUMsaUJBQUQsQ0FBdEI7O0FBRUEsTUFBTUMsS0FBSyxHQUFHLFVBQVMsR0FBR0MsSUFBWixFQUF1QjtBQUNuQ0EsRUFBQUEsSUFBSSxHQUFHLENBQUMsU0FBU0MsU0FBUyxDQUFDLENBQUQsQ0FBbkIsRUFBd0JDLE1BQXhCLENBQStCRixJQUFJLENBQUNHLEtBQUwsQ0FBVyxDQUFYLEVBQWNILElBQUksQ0FBQ0ksTUFBbkIsQ0FBL0IsQ0FBUDtBQUNBLFFBQU1DLEdBQUcsR0FBR1IsTUFBTSxDQUFDUyxTQUFQLEVBQVo7QUFDQUQsRUFBQUEsR0FBRyxDQUFDTixLQUFKLENBQVVRLEtBQVYsQ0FBZ0JGLEdBQWhCLEVBQXFCTCxJQUFyQjtBQUNELENBSkQ7O0FBU0EsTUFBTVEsdUJBQXVCLEdBQUdDLElBQUksSUFBSTtBQUN0QyxVQUFRQSxJQUFJLENBQUNBLElBQWI7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLE1BQVA7O0FBQ0YsU0FBSyxNQUFMO0FBQ0UsYUFBTywwQkFBUDs7QUFDRixTQUFLLFFBQUw7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SixzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICcuL1Bvc3RncmVzQ2xpZW50Jztcbi8vIEBmbG93LWRpc2FibGUtbmV4dFxuaW1wb3J0IFBhcnNlIGZyb20gJ3BhcnNlL25vZGUnO1xuLy8gQGZsb3ctZGlzYWJsZS1uZXh0XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHNxbCBmcm9tICcuL3NxbCc7XG5cbmNvbnN0IFBvc3RncmVzUmVsYXRpb25Eb2VzTm90RXhpc3RFcnJvciA9ICc0MlAwMSc7XG5jb25zdCBQb3N0Z3Jlc0R1cGxpY2F0ZVJlbGF0aW9uRXJyb3IgPSAnNDJQMDcnO1xuY29uc3QgUG9zdGdyZXNEdXBsaWNhdGVDb2x1bW5FcnJvciA9ICc0MjcwMSc7XG5jb25zdCBQb3N0Z3Jlc01pc3NpbmdDb2x1bW5FcnJvciA9ICc0MjcwMyc7XG5jb25zdCBQb3N0Z3Jlc0R1cGxpY2F0ZU9iamVjdEVycm9yID0gJzQyNzEwJztcbmNvbnN0IFBvc3RncmVzVW5pcXVlSW5kZXhWaW9sYXRpb25FcnJvciA9ICcyMzUwNSc7XG5jb25zdCBQb3N0Z3Jlc1RyYW5zYWN0aW9uQWJvcnRlZEVycm9yID0gJzI1UDAyJztcbmNvbnN0IGxvZ2dlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2xvZ2dlcicpO1xuXG5jb25zdCBkZWJ1ZyA9IGZ1bmN0aW9uKC4uLmFyZ3M6IGFueSkge1xuICBhcmdzID0gWydQRzogJyArIGFyZ3VtZW50c1swXV0uY29uY2F0KGFyZ3Muc2xpY2UoMSwgYXJncy5sZW5ndGgpKTtcbiAgY29uc3QgbG9nID0gbG9nZ2VyLmdldExvZ2dlcigpO1xuICBsb2cuZGVidWcuYXBwbHkobG9nLCBhcmdzKTtcbn07XG5cbmltcG9ydCB7IFN0b3JhZ2VBZGFwdGVyIH0gZnJvbSAnLi4vU3RvcmFnZUFkYXB0ZXInO1xuaW1wb3J0IHR5cGUgeyBTY2hlbWFUeXBlLCBRdWVyeVR5cGUsIFF1ZXJ5T3B0aW9ucyB9IGZyb20gJy4uL1N0b3JhZ2VBZGFwdGVyJztcblxuY29uc3QgcGFyc2VUeXBlVG9Qb3N0Z3Jlc1R5cGUgPSB0eXBlID0+IHtcbiAgc3dpdGNoICh0eXBlLnR5cGUpIHtcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuICd0ZXh0JztcbiAgICBjYXNlICdEYXRlJzpcbiAgICAgIHJldHVybiAndGltZXN0YW1wIHdpdGggdGltZSB6b25lJztcbiAgICBjYXNlICdPYmplY3QnOlxuICAgICAgcmV0dXJuICdqc29uYic7XG4gICAgY2FzZSAnRmlsZSc6XG4gICAgICByZXR1cm4gJ3RleHQnO1xuICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgcmV0dXJuICdib29sZWFuJztcbiAgICBjYXNlICdQb2ludGVyJzpcbiAgICAgIHJldHVybiAnY2hhcigxMCknO1xuICAgIGNhc2UgJ051bWJlcic6XG4gICAgICByZXR1cm4gJ2RvdWJsZSBwcmVjaXNpb24nO1xuICAgIGNhc2UgJ0dlb1BvaW50JzpcbiAgICAgIHJldHVybiAncG9pbnQnO1xuICAgIGNhc2UgJ0J5dGVzJzpcbiAgICAgIHJldHVybiAnanNvbmInO1xuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgcmV0dXJuICdwb2x5Z29uJztcbiAgICBjYXNlICdBcnJheSc6XG4gICAgICBpZiAodHlwZS5jb250ZW50cyAmJiB0eXBlLmNvbnRlbnRzLnR5cGUgPT09ICdTdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiAndGV4dFtdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnanNvbmInO1xuICAgICAgfVxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBgbm8gdHlwZSBmb3IgJHtKU09OLnN0cmluZ2lmeSh0eXBlKX0geWV0YDtcbiAgfVxufTtcblxuY29uc3QgUGFyc2VUb1Bvc2dyZXNDb21wYXJhdG9yID0ge1xuICAkZ3Q6ICc+JyxcbiAgJGx0OiAnPCcsXG4gICRndGU6ICc+PScsXG4gICRsdGU6ICc8PScsXG59O1xuXG5jb25zdCBtb25nb0FnZ3JlZ2F0ZVRvUG9zdGdyZXMgPSB7XG4gICRkYXlPZk1vbnRoOiAnREFZJyxcbiAgJGRheU9mV2VlazogJ0RPVycsXG4gICRkYXlPZlllYXI6ICdET1knLFxuICAkaXNvRGF5T2ZXZWVrOiAnSVNPRE9XJyxcbiAgJGlzb1dlZWtZZWFyOiAnSVNPWUVBUicsXG4gICRob3VyOiAnSE9VUicsXG4gICRtaW51dGU6ICdNSU5VVEUnLFxuICAkc2Vjb25kOiAnU0VDT05EJyxcbiAgJG1pbGxpc2Vjb25kOiAnTUlMTElTRUNPTkRTJyxcbiAgJG1vbnRoOiAnTU9OVEgnLFxuICAkd2VlazogJ1dFRUsnLFxuICAkeWVhcjogJ1lFQVInLFxufTtcblxuY29uc3QgdG9Qb3N0Z3Jlc1ZhbHVlID0gdmFsdWUgPT4ge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09ICdEYXRlJykge1xuICAgICAgcmV0dXJuIHZhbHVlLmlzbztcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gJ0ZpbGUnKSB7XG4gICAgICByZXR1cm4gdmFsdWUubmFtZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuY29uc3QgdHJhbnNmb3JtVmFsdWUgPSB2YWx1ZSA9PiB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLl9fdHlwZSA9PT0gJ1BvaW50ZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlLm9iamVjdElkO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIER1cGxpY2F0ZSBmcm9tIHRoZW4gbW9uZ28gYWRhcHRlci4uLlxuY29uc3QgZW1wdHlDTFBTID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGZpbmQ6IHt9LFxuICBnZXQ6IHt9LFxuICBjcmVhdGU6IHt9LFxuICB1cGRhdGU6IHt9LFxuICBkZWxldGU6IHt9LFxuICBhZGRGaWVsZDoge30sXG59KTtcblxuY29uc3QgZGVmYXVsdENMUFMgPSBPYmplY3QuZnJlZXplKHtcbiAgZmluZDogeyAnKic6IHRydWUgfSxcbiAgZ2V0OiB7ICcqJzogdHJ1ZSB9LFxuICBjcmVhdGU6IHsgJyonOiB0cnVlIH0sXG4gIHVwZGF0ZTogeyAnKic6IHRydWUgfSxcbiAgZGVsZXRlOiB7ICcqJzogdHJ1ZSB9LFxuICBhZGRGaWVsZDogeyAnKic6IHRydWUgfSxcbn0pO1xuXG5jb25zdCB0b1BhcnNlU2NoZW1hID0gc2NoZW1hID0+IHtcbiAgaWYgKHNjaGVtYS5jbGFzc05hbWUgPT09ICdfVXNlcicpIHtcbiAgICBkZWxldGUgc2NoZW1hLmZpZWxkcy5faGFzaGVkX3Bhc3N3b3JkO1xuICB9XG4gIGlmIChzY2hlbWEuZmllbGRzKSB7XG4gICAgZGVsZXRlIHNjaGVtYS5maWVsZHMuX3dwZXJtO1xuICAgIGRlbGV0ZSBzY2hlbWEuZmllbGRzLl9ycGVybTtcbiAgfVxuICBsZXQgY2xwcyA9IGRlZmF1bHRDTFBTO1xuICBpZiAoc2NoZW1hLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucykge1xuICAgIGNscHMgPSB7IC4uLmVtcHR5Q0xQUywgLi4uc2NoZW1hLmNsYXNzTGV2ZWxQZXJtaXNzaW9ucyB9O1xuICB9XG4gIGxldCBpbmRleGVzID0ge307XG4gIGlmIChzY2hlbWEuaW5kZXhlcykge1xuICAgIGluZGV4ZXMgPSB7IC4uLnNjaGVtYS5pbmRleGVzIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBjbGFzc05hbWU6IHNjaGVtYS5jbGFzc05hbWUsXG4gICAgZmllbGRzOiBzY2hlbWEuZmllbGRzLFxuICAgIGNsYXNzTGV2ZWxQZXJtaXNzaW9uczogY2xwcyxcbiAgICBpbmRleGVzLFxuICB9O1xufTtcblxuY29uc3QgdG9Qb3N0Z3Jlc1NjaGVtYSA9IHNjaGVtYSA9PiB7XG4gIGlmICghc2NoZW1hKSB7XG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxuICBzY2hlbWEuZmllbGRzID0gc2NoZW1hLmZpZWxkcyB8fCB7fTtcbiAgc2NoZW1hLmZpZWxkcy5fd3Blcm0gPSB7IHR5cGU6ICdBcnJheScsIGNvbnRlbnRzOiB7IHR5cGU6ICdTdHJpbmcnIH0gfTtcbiAgc2NoZW1hLmZpZWxkcy5fcnBlcm0gPSB7IHR5cGU6ICdBcnJheScsIGNvbnRlbnRzOiB7IHR5cGU6ICdTdHJpbmcnIH0gfTtcbiAgaWYgKHNjaGVtYS5jbGFzc05hbWUgPT09ICdfVXNlcicpIHtcbiAgICBzY2hlbWEuZmllbGRzLl9oYXNoZWRfcGFzc3dvcmQgPSB7IHR5cGU6ICdTdHJpbmcnIH07XG4gICAgc2NoZW1hLmZpZWxkcy5fcGFzc3dvcmRfaGlzdG9yeSA9IHsgdHlwZTogJ0FycmF5JyB9O1xuICB9XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5jb25zdCBoYW5kbGVEb3RGaWVsZHMgPSBvYmplY3QgPT4ge1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goZmllbGROYW1lID0+IHtcbiAgICBpZiAoZmllbGROYW1lLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBjb25zdCBjb21wb25lbnRzID0gZmllbGROYW1lLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBmaXJzdCA9IGNvbXBvbmVudHMuc2hpZnQoKTtcbiAgICAgIG9iamVjdFtmaXJzdF0gPSBvYmplY3RbZmlyc3RdIHx8IHt9O1xuICAgICAgbGV0IGN1cnJlbnRPYmogPSBvYmplY3RbZmlyc3RdO1xuICAgICAgbGV0IG5leHQ7XG4gICAgICBsZXQgdmFsdWUgPSBvYmplY3RbZmllbGROYW1lXTtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5fX29wID09PSAnRGVsZXRlJykge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbmQtYXNzaWduICovXG4gICAgICB3aGlsZSAoKG5leHQgPSBjb21wb25lbnRzLnNoaWZ0KCkpKSB7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uZC1hc3NpZ24gKi9cbiAgICAgICAgY3VycmVudE9ialtuZXh0XSA9IGN1cnJlbnRPYmpbbmV4dF0gfHwge307XG4gICAgICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGN1cnJlbnRPYmpbbmV4dF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50T2JqID0gY3VycmVudE9ialtuZXh0XTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBvYmplY3RbZmllbGROYW1lXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufTtcblxuY29uc3QgdHJhbnNmb3JtRG90RmllbGRUb0NvbXBvbmVudHMgPSBmaWVsZE5hbWUgPT4ge1xuICByZXR1cm4gZmllbGROYW1lLnNwbGl0KCcuJykubWFwKChjbXB0LCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGBcIiR7Y21wdH1cImA7XG4gICAgfVxuICAgIHJldHVybiBgJyR7Y21wdH0nYDtcbiAgfSk7XG59O1xuXG5jb25zdCB0cmFuc2Zvcm1Eb3RGaWVsZCA9IGZpZWxkTmFtZSA9PiB7XG4gIGlmIChmaWVsZE5hbWUuaW5kZXhPZignLicpID09PSAtMSkge1xuICAgIHJldHVybiBgXCIke2ZpZWxkTmFtZX1cImA7XG4gIH1cbiAgY29uc3QgY29tcG9uZW50cyA9IHRyYW5zZm9ybURvdEZpZWxkVG9Db21wb25lbnRzKGZpZWxkTmFtZSk7XG4gIGxldCBuYW1lID0gY29tcG9uZW50cy5zbGljZSgwLCBjb21wb25lbnRzLmxlbmd0aCAtIDEpLmpvaW4oJy0+Jyk7XG4gIG5hbWUgKz0gJy0+PicgKyBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV07XG4gIHJldHVybiBuYW1lO1xufTtcblxuY29uc3QgdHJhbnNmb3JtQWdncmVnYXRlRmllbGQgPSBmaWVsZE5hbWUgPT4ge1xuICBpZiAodHlwZW9mIGZpZWxkTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmllbGROYW1lO1xuICB9XG4gIGlmIChmaWVsZE5hbWUgPT09ICckX2NyZWF0ZWRfYXQnKSB7XG4gICAgcmV0dXJuICdjcmVhdGVkQXQnO1xuICB9XG4gIGlmIChmaWVsZE5hbWUgPT09ICckX3VwZGF0ZWRfYXQnKSB7XG4gICAgcmV0dXJuICd1cGRhdGVkQXQnO1xuICB9XG4gIHJldHVybiBmaWVsZE5hbWUuc3Vic3RyKDEpO1xufTtcblxuY29uc3QgdmFsaWRhdGVLZXlzID0gb2JqZWN0ID0+IHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgPT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFsaWRhdGVLZXlzKG9iamVjdFtrZXldKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleS5pbmNsdWRlcygnJCcpIHx8IGtleS5pbmNsdWRlcygnLicpKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX05FU1RFRF9LRVksXG4gICAgICAgICAgXCJOZXN0ZWQga2V5cyBzaG91bGQgbm90IGNvbnRhaW4gdGhlICckJyBvciAnLicgY2hhcmFjdGVyc1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vLyBSZXR1cm5zIHRoZSBsaXN0IG9mIGpvaW4gdGFibGVzIG9uIGEgc2NoZW1hXG5jb25zdCBqb2luVGFibGVzRm9yU2NoZW1hID0gc2NoZW1hID0+IHtcbiAgY29uc3QgbGlzdCA9IFtdO1xuICBpZiAoc2NoZW1hKSB7XG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLmZpZWxkcykuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBpZiAoc2NoZW1hLmZpZWxkc1tmaWVsZF0udHlwZSA9PT0gJ1JlbGF0aW9uJykge1xuICAgICAgICBsaXN0LnB1c2goYF9Kb2luOiR7ZmllbGR9OiR7c2NoZW1hLmNsYXNzTmFtZX1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbGlzdDtcbn07XG5cbmludGVyZmFjZSBXaGVyZUNsYXVzZSB7XG4gIHBhdHRlcm46IHN0cmluZztcbiAgdmFsdWVzOiBBcnJheTxhbnk+O1xuICBzb3J0czogQXJyYXk8YW55Pjtcbn1cblxuY29uc3QgYnVpbGRXaGVyZUNsYXVzZSA9ICh7IHNjaGVtYSwgcXVlcnksIGluZGV4IH0pOiBXaGVyZUNsYXVzZSA9PiB7XG4gIGNvbnN0IHBhdHRlcm5zID0gW107XG4gIGxldCB2YWx1ZXMgPSBbXTtcbiAgY29uc3Qgc29ydHMgPSBbXTtcblxuICBzY2hlbWEgPSB0b1Bvc3RncmVzU2NoZW1hKHNjaGVtYSk7XG4gIGZvciAoY29uc3QgZmllbGROYW1lIGluIHF1ZXJ5KSB7XG4gICAgY29uc3QgaXNBcnJheUZpZWxkID1cbiAgICAgIHNjaGVtYS5maWVsZHMgJiZcbiAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSAmJlxuICAgICAgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLnR5cGUgPT09ICdBcnJheSc7XG4gICAgY29uc3QgaW5pdGlhbFBhdHRlcm5zTGVuZ3RoID0gcGF0dGVybnMubGVuZ3RoO1xuICAgIGNvbnN0IGZpZWxkVmFsdWUgPSBxdWVyeVtmaWVsZE5hbWVdO1xuXG4gICAgLy8gbm90aGluZ2luIHRoZSBzY2hlbWEsIGl0J3MgZ29ubmEgYmxvdyB1cFxuICAgIGlmICghc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdKSB7XG4gICAgICAvLyBhcyBpdCB3b24ndCBleGlzdFxuICAgICAgaWYgKGZpZWxkVmFsdWUgJiYgZmllbGRWYWx1ZS4kZXhpc3RzID09PSBmYWxzZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmllbGROYW1lLmluZGV4T2YoJy4nKSA+PSAwKSB7XG4gICAgICBsZXQgbmFtZSA9IHRyYW5zZm9ybURvdEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBpZiAoZmllbGRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGAke25hbWV9IElTIE5VTExgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWVsZFZhbHVlLiRpbikge1xuICAgICAgICAgIGNvbnN0IGluUGF0dGVybnMgPSBbXTtcbiAgICAgICAgICBuYW1lID0gdHJhbnNmb3JtRG90RmllbGRUb0NvbXBvbmVudHMoZmllbGROYW1lKS5qb2luKCctPicpO1xuICAgICAgICAgIGZpZWxkVmFsdWUuJGluLmZvckVhY2gobGlzdEVsZW0gPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBsaXN0RWxlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgaW5QYXR0ZXJucy5wdXNoKGBcIiR7bGlzdEVsZW19XCJgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGluUGF0dGVybnMucHVzaChgJHtsaXN0RWxlbX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwYXR0ZXJucy5wdXNoKGAoJHtuYW1lfSk6Ompzb25iIEA+ICdbJHtpblBhdHRlcm5zLmpvaW4oKX1dJzo6anNvbmJgKTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZFZhbHVlLiRyZWdleCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBsYXRlclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdHRlcm5zLnB1c2goYCR7bmFtZX0gPSAnJHtmaWVsZFZhbHVlfSdgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGRWYWx1ZSA9PT0gbnVsbCB8fCBmaWVsZFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lIElTIE5VTExgKTtcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICBpbmRleCArPSAxO1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCBmaWVsZFZhbHVlKTtcbiAgICAgIGluZGV4ICs9IDI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSA9ICQke2luZGV4ICsgMX1gKTtcbiAgICAgIC8vIENhbid0IGNhc3QgYm9vbGVhbiB0byBkb3VibGUgcHJlY2lzaW9uXG4gICAgICBpZiAoXG4gICAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSAmJlxuICAgICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZSA9PT0gJ051bWJlcidcbiAgICAgICkge1xuICAgICAgICAvLyBTaG91bGQgYWx3YXlzIHJldHVybiB6ZXJvIHJlc3VsdHNcbiAgICAgICAgY29uc3QgTUFYX0lOVF9QTFVTX09ORSA9IDkyMjMzNzIwMzY4NTQ3NzU4MDg7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgTUFYX0lOVF9QTFVTX09ORSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgfVxuICAgICAgaW5kZXggKz0gMjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWVsZFZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICB9IGVsc2UgaWYgKFsnJG9yJywgJyRub3InLCAnJGFuZCddLmluY2x1ZGVzKGZpZWxkTmFtZSkpIHtcbiAgICAgIGNvbnN0IGNsYXVzZXMgPSBbXTtcbiAgICAgIGNvbnN0IGNsYXVzZVZhbHVlcyA9IFtdO1xuICAgICAgZmllbGRWYWx1ZS5mb3JFYWNoKHN1YlF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgY2xhdXNlID0gYnVpbGRXaGVyZUNsYXVzZSh7IHNjaGVtYSwgcXVlcnk6IHN1YlF1ZXJ5LCBpbmRleCB9KTtcbiAgICAgICAgaWYgKGNsYXVzZS5wYXR0ZXJuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbGF1c2VzLnB1c2goY2xhdXNlLnBhdHRlcm4pO1xuICAgICAgICAgIGNsYXVzZVZhbHVlcy5wdXNoKC4uLmNsYXVzZS52YWx1ZXMpO1xuICAgICAgICAgIGluZGV4ICs9IGNsYXVzZS52YWx1ZXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb3JPckFuZCA9IGZpZWxkTmFtZSA9PT0gJyRhbmQnID8gJyBBTkQgJyA6ICcgT1IgJztcbiAgICAgIGNvbnN0IG5vdCA9IGZpZWxkTmFtZSA9PT0gJyRub3InID8gJyBOT1QgJyA6ICcnO1xuXG4gICAgICBwYXR0ZXJucy5wdXNoKGAke25vdH0oJHtjbGF1c2VzLmpvaW4ob3JPckFuZCl9KWApO1xuICAgICAgdmFsdWVzLnB1c2goLi4uY2xhdXNlVmFsdWVzKTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGRWYWx1ZS4kbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGlzQXJyYXlGaWVsZCkge1xuICAgICAgICBmaWVsZFZhbHVlLiRuZSA9IEpTT04uc3RyaW5naWZ5KFtmaWVsZFZhbHVlLiRuZV0pO1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGBOT1QgYXJyYXlfY29udGFpbnMoJCR7aW5kZXh9Om5hbWUsICQke2luZGV4ICsgMX0pYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZmllbGRWYWx1ZS4kbmUgPT09IG51bGwpIHtcbiAgICAgICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSBJUyBOT1QgTlVMTGApO1xuICAgICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBub3QgbnVsbCwgd2UgbmVlZCB0byBtYW51YWxseSBleGNsdWRlIG51bGxcbiAgICAgICAgICBwYXR0ZXJucy5wdXNoKFxuICAgICAgICAgICAgYCgkJHtpbmRleH06bmFtZSA8PiAkJHtpbmRleCArIDF9IE9SICQke2luZGV4fTpuYW1lIElTIE5VTEwpYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogc3VwcG9ydCBhcnJheXNcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZS4kbmUpO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICB9XG4gICAgaWYgKGZpZWxkVmFsdWUuJGVxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChmaWVsZFZhbHVlLiRlcSA9PT0gbnVsbCkge1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSBJUyBOVUxMYCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSA9ICQke2luZGV4ICsgMX1gKTtcbiAgICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCBmaWVsZFZhbHVlLiRlcSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGlzSW5Pck5pbiA9XG4gICAgICBBcnJheS5pc0FycmF5KGZpZWxkVmFsdWUuJGluKSB8fCBBcnJheS5pc0FycmF5KGZpZWxkVmFsdWUuJG5pbik7XG4gICAgaWYgKFxuICAgICAgQXJyYXkuaXNBcnJheShmaWVsZFZhbHVlLiRpbikgJiZcbiAgICAgIGlzQXJyYXlGaWVsZCAmJlxuICAgICAgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLmNvbnRlbnRzICYmXG4gICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0uY29udGVudHMudHlwZSA9PT0gJ1N0cmluZydcbiAgICApIHtcbiAgICAgIGNvbnN0IGluUGF0dGVybnMgPSBbXTtcbiAgICAgIGxldCBhbGxvd051bGwgPSBmYWxzZTtcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICBmaWVsZFZhbHVlLiRpbi5mb3JFYWNoKChsaXN0RWxlbSwgbGlzdEluZGV4KSA9PiB7XG4gICAgICAgIGlmIChsaXN0RWxlbSA9PT0gbnVsbCkge1xuICAgICAgICAgIGFsbG93TnVsbCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2gobGlzdEVsZW0pO1xuICAgICAgICAgIGluUGF0dGVybnMucHVzaChgJCR7aW5kZXggKyAxICsgbGlzdEluZGV4IC0gKGFsbG93TnVsbCA/IDEgOiAwKX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoYWxsb3dOdWxsKSB7XG4gICAgICAgIHBhdHRlcm5zLnB1c2goXG4gICAgICAgICAgYCgkJHtpbmRleH06bmFtZSBJUyBOVUxMIE9SICQke2luZGV4fTpuYW1lICYmIEFSUkFZWyR7aW5QYXR0ZXJucy5qb2luKCl9XSlgXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSAmJiBBUlJBWVske2luUGF0dGVybnMuam9pbigpfV1gKTtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gaW5kZXggKyAxICsgaW5QYXR0ZXJucy5sZW5ndGg7XG4gICAgfSBlbHNlIGlmIChpc0luT3JOaW4pIHtcbiAgICAgIHZhciBjcmVhdGVDb25zdHJhaW50ID0gKGJhc2VBcnJheSwgbm90SW4pID0+IHtcbiAgICAgICAgY29uc3Qgbm90ID0gbm90SW4gPyAnIE5PVCAnIDogJyc7XG4gICAgICAgIGlmIChiYXNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmIChpc0FycmF5RmllbGQpIHtcbiAgICAgICAgICAgIHBhdHRlcm5zLnB1c2goXG4gICAgICAgICAgICAgIGAke25vdH0gYXJyYXlfY29udGFpbnMoJCR7aW5kZXh9Om5hbWUsICQke2luZGV4ICsgMX0pYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgSlNPTi5zdHJpbmdpZnkoYmFzZUFycmF5KSk7XG4gICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgTmVzdGVkIERvdCBOb3RhdGlvbiBBYm92ZVxuICAgICAgICAgICAgaWYgKGZpZWxkTmFtZS5pbmRleE9mKCcuJykgPj0gMCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpblBhdHRlcm5zID0gW107XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICAgICAgYmFzZUFycmF5LmZvckVhY2goKGxpc3RFbGVtLCBsaXN0SW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGxpc3RFbGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gobGlzdEVsZW0pO1xuICAgICAgICAgICAgICAgIGluUGF0dGVybnMucHVzaChgJCR7aW5kZXggKyAxICsgbGlzdEluZGV4fWApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lICR7bm90fSBJTiAoJHtpblBhdHRlcm5zLmpvaW4oKX0pYCk7XG4gICAgICAgICAgICBpbmRleCA9IGluZGV4ICsgMSArIGluUGF0dGVybnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghbm90SW4pIHtcbiAgICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lIElTIE5VTExgKTtcbiAgICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBIYW5kbGUgZW1wdHkgYXJyYXlcbiAgICAgICAgICBpZiAobm90SW4pIHtcbiAgICAgICAgICAgIHBhdHRlcm5zLnB1c2goJzEgPSAxJyk7IC8vIFJldHVybiBhbGwgdmFsdWVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdHRlcm5zLnB1c2goJzEgPSAyJyk7IC8vIFJldHVybiBubyB2YWx1ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoZmllbGRWYWx1ZS4kaW4pIHtcbiAgICAgICAgY3JlYXRlQ29uc3RyYWludChfLmZsYXRNYXAoZmllbGRWYWx1ZS4kaW4sIGVsdCA9PiBlbHQpLCBmYWxzZSk7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRWYWx1ZS4kbmluKSB7XG4gICAgICAgIGNyZWF0ZUNvbnN0cmFpbnQoXy5mbGF0TWFwKGZpZWxkVmFsdWUuJG5pbiwgZWx0ID0+IGVsdCksIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpZWxkVmFsdWUuJGluICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLklOVkFMSURfSlNPTiwgJ2JhZCAkaW4gdmFsdWUnKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWVsZFZhbHVlLiRuaW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLCAnYmFkICRuaW4gdmFsdWUnKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaWVsZFZhbHVlLiRhbGwpICYmIGlzQXJyYXlGaWVsZCkge1xuICAgICAgaWYgKGlzQW55VmFsdWVSZWdleFN0YXJ0c1dpdGgoZmllbGRWYWx1ZS4kYWxsKSkge1xuICAgICAgICBpZiAoIWlzQWxsVmFsdWVzUmVnZXhPck5vbmUoZmllbGRWYWx1ZS4kYWxsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICAgICdBbGwgJGFsbCB2YWx1ZXMgbXVzdCBiZSBvZiByZWdleCB0eXBlIG9yIG5vbmU6ICcgKyBmaWVsZFZhbHVlLiRhbGxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZFZhbHVlLiRhbGwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHByb2Nlc3NSZWdleFBhdHRlcm4oZmllbGRWYWx1ZS4kYWxsW2ldLiRyZWdleCk7XG4gICAgICAgICAgZmllbGRWYWx1ZS4kYWxsW2ldID0gdmFsdWUuc3Vic3RyaW5nKDEpICsgJyUnO1xuICAgICAgICB9XG4gICAgICAgIHBhdHRlcm5zLnB1c2goXG4gICAgICAgICAgYGFycmF5X2NvbnRhaW5zX2FsbF9yZWdleCgkJHtpbmRleH06bmFtZSwgJCR7aW5kZXggKyAxfTo6anNvbmIpYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0dGVybnMucHVzaChcbiAgICAgICAgICBgYXJyYXlfY29udGFpbnNfYWxsKCQke2luZGV4fTpuYW1lLCAkJHtpbmRleCArIDF9Ojpqc29uYilgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIEpTT04uc3RyaW5naWZ5KGZpZWxkVmFsdWUuJGFsbCkpO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGZpZWxkVmFsdWUuJGV4aXN0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChmaWVsZFZhbHVlLiRleGlzdHMpIHtcbiAgICAgICAgcGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgSVMgTk9UIE5VTExgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lIElTIE5VTExgKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICBpbmRleCArPSAxO1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLiRjb250YWluZWRCeSkge1xuICAgICAgY29uc3QgYXJyID0gZmllbGRWYWx1ZS4kY29udGFpbmVkQnk7XG4gICAgICBpZiAoIShhcnIgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICBgYmFkICRjb250YWluZWRCeTogc2hvdWxkIGJlIGFuIGFycmF5YFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSA8QCAkJHtpbmRleCArIDF9Ojpqc29uYmApO1xuICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCBKU09OLnN0cmluZ2lmeShhcnIpKTtcbiAgICAgIGluZGV4ICs9IDI7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkVmFsdWUuJHRleHQpIHtcbiAgICAgIGNvbnN0IHNlYXJjaCA9IGZpZWxkVmFsdWUuJHRleHQuJHNlYXJjaDtcbiAgICAgIGxldCBsYW5ndWFnZSA9ICdlbmdsaXNoJztcbiAgICAgIGlmICh0eXBlb2Ygc2VhcmNoICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIGBiYWQgJHRleHQ6ICRzZWFyY2gsIHNob3VsZCBiZSBvYmplY3RgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIXNlYXJjaC4kdGVybSB8fCB0eXBlb2Ygc2VhcmNoLiR0ZXJtICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIGBiYWQgJHRleHQ6ICR0ZXJtLCBzaG91bGQgYmUgc3RyaW5nYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKHNlYXJjaC4kbGFuZ3VhZ2UgJiYgdHlwZW9mIHNlYXJjaC4kbGFuZ3VhZ2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgYGJhZCAkdGV4dDogJGxhbmd1YWdlLCBzaG91bGQgYmUgc3RyaW5nYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzZWFyY2guJGxhbmd1YWdlKSB7XG4gICAgICAgIGxhbmd1YWdlID0gc2VhcmNoLiRsYW5ndWFnZTtcbiAgICAgIH1cbiAgICAgIGlmIChzZWFyY2guJGNhc2VTZW5zaXRpdmUgJiYgdHlwZW9mIHNlYXJjaC4kY2FzZVNlbnNpdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgYGJhZCAkdGV4dDogJGNhc2VTZW5zaXRpdmUsIHNob3VsZCBiZSBib29sZWFuYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzZWFyY2guJGNhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICBgYmFkICR0ZXh0OiAkY2FzZVNlbnNpdGl2ZSBub3Qgc3VwcG9ydGVkLCBwbGVhc2UgdXNlICRyZWdleCBvciBjcmVhdGUgYSBzZXBhcmF0ZSBsb3dlciBjYXNlIGNvbHVtbi5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHNlYXJjaC4kZGlhY3JpdGljU2Vuc2l0aXZlICYmXG4gICAgICAgIHR5cGVvZiBzZWFyY2guJGRpYWNyaXRpY1NlbnNpdGl2ZSAhPT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICBgYmFkICR0ZXh0OiAkZGlhY3JpdGljU2Vuc2l0aXZlLCBzaG91bGQgYmUgYm9vbGVhbmBcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VhcmNoLiRkaWFjcml0aWNTZW5zaXRpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgYGJhZCAkdGV4dDogJGRpYWNyaXRpY1NlbnNpdGl2ZSAtIGZhbHNlIG5vdCBzdXBwb3J0ZWQsIGluc3RhbGwgUG9zdGdyZXMgVW5hY2NlbnQgRXh0ZW5zaW9uYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcGF0dGVybnMucHVzaChcbiAgICAgICAgYHRvX3RzdmVjdG9yKCQke2luZGV4fSwgJCR7aW5kZXggKyAxfTpuYW1lKSBAQCB0b190c3F1ZXJ5KCQke2luZGV4ICtcbiAgICAgICAgICAyfSwgJCR7aW5kZXggKyAzfSlgXG4gICAgICApO1xuICAgICAgdmFsdWVzLnB1c2gobGFuZ3VhZ2UsIGZpZWxkTmFtZSwgbGFuZ3VhZ2UsIHNlYXJjaC4kdGVybSk7XG4gICAgICBpbmRleCArPSA0O1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLiRuZWFyU3BoZXJlKSB7XG4gICAgICBjb25zdCBwb2ludCA9IGZpZWxkVmFsdWUuJG5lYXJTcGhlcmU7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IGZpZWxkVmFsdWUuJG1heERpc3RhbmNlO1xuICAgICAgY29uc3QgZGlzdGFuY2VJbktNID0gZGlzdGFuY2UgKiA2MzcxICogMTAwMDtcbiAgICAgIHBhdHRlcm5zLnB1c2goXG4gICAgICAgIGBTVF9kaXN0YW5jZV9zcGhlcmUoJCR7aW5kZXh9Om5hbWU6Omdlb21ldHJ5LCBQT0lOVCgkJHtpbmRleCArXG4gICAgICAgICAgMX0sICQke2luZGV4ICsgMn0pOjpnZW9tZXRyeSkgPD0gJCR7aW5kZXggKyAzfWBcbiAgICAgICk7XG4gICAgICBzb3J0cy5wdXNoKFxuICAgICAgICBgU1RfZGlzdGFuY2Vfc3BoZXJlKCQke2luZGV4fTpuYW1lOjpnZW9tZXRyeSwgUE9JTlQoJCR7aW5kZXggK1xuICAgICAgICAgIDF9LCAkJHtpbmRleCArIDJ9KTo6Z2VvbWV0cnkpIEFTQ2BcbiAgICAgICk7XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIHBvaW50LmxvbmdpdHVkZSwgcG9pbnQubGF0aXR1ZGUsIGRpc3RhbmNlSW5LTSk7XG4gICAgICBpbmRleCArPSA0O1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLiR3aXRoaW4gJiYgZmllbGRWYWx1ZS4kd2l0aGluLiRib3gpIHtcbiAgICAgIGNvbnN0IGJveCA9IGZpZWxkVmFsdWUuJHdpdGhpbi4kYm94O1xuICAgICAgY29uc3QgbGVmdCA9IGJveFswXS5sb25naXR1ZGU7XG4gICAgICBjb25zdCBib3R0b20gPSBib3hbMF0ubGF0aXR1ZGU7XG4gICAgICBjb25zdCByaWdodCA9IGJveFsxXS5sb25naXR1ZGU7XG4gICAgICBjb25zdCB0b3AgPSBib3hbMV0ubGF0aXR1ZGU7XG5cbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lOjpwb2ludCA8QCAkJHtpbmRleCArIDF9Ojpib3hgKTtcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgYCgoJHtsZWZ0fSwgJHtib3R0b219KSwgKCR7cmlnaHR9LCAke3RvcH0pKWApO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZmllbGRWYWx1ZS4kZ2VvV2l0aGluICYmIGZpZWxkVmFsdWUuJGdlb1dpdGhpbi4kY2VudGVyU3BoZXJlKSB7XG4gICAgICBjb25zdCBjZW50ZXJTcGhlcmUgPSBmaWVsZFZhbHVlLiRnZW9XaXRoaW4uJGNlbnRlclNwaGVyZTtcbiAgICAgIGlmICghKGNlbnRlclNwaGVyZSBpbnN0YW5jZW9mIEFycmF5KSB8fCBjZW50ZXJTcGhlcmUubGVuZ3RoIDwgMikge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICdiYWQgJGdlb1dpdGhpbiB2YWx1ZTsgJGNlbnRlclNwaGVyZSBzaG91bGQgYmUgYW4gYXJyYXkgb2YgUGFyc2UuR2VvUG9pbnQgYW5kIGRpc3RhbmNlJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gR2V0IHBvaW50LCBjb252ZXJ0IHRvIGdlbyBwb2ludCBpZiBuZWNlc3NhcnkgYW5kIHZhbGlkYXRlXG4gICAgICBsZXQgcG9pbnQgPSBjZW50ZXJTcGhlcmVbMF07XG4gICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSAmJiBwb2ludC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcG9pbnQgPSBuZXcgUGFyc2UuR2VvUG9pbnQocG9pbnRbMV0sIHBvaW50WzBdKTtcbiAgICAgIH0gZWxzZSBpZiAoIUdlb1BvaW50Q29kZXIuaXNWYWxpZEpTT04ocG9pbnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgJ2JhZCAkZ2VvV2l0aGluIHZhbHVlOyAkY2VudGVyU3BoZXJlIGdlbyBwb2ludCBpbnZhbGlkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHBvaW50LmxhdGl0dWRlLCBwb2ludC5sb25naXR1ZGUpO1xuICAgICAgLy8gR2V0IGRpc3RhbmNlIGFuZCB2YWxpZGF0ZVxuICAgICAgY29uc3QgZGlzdGFuY2UgPSBjZW50ZXJTcGhlcmVbMV07XG4gICAgICBpZiAoaXNOYU4oZGlzdGFuY2UpIHx8IGRpc3RhbmNlIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICdiYWQgJGdlb1dpdGhpbiB2YWx1ZTsgJGNlbnRlclNwaGVyZSBkaXN0YW5jZSBpbnZhbGlkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgZGlzdGFuY2VJbktNID0gZGlzdGFuY2UgKiA2MzcxICogMTAwMDtcbiAgICAgIHBhdHRlcm5zLnB1c2goXG4gICAgICAgIGBTVF9kaXN0YW5jZV9zcGhlcmUoJCR7aW5kZXh9Om5hbWU6Omdlb21ldHJ5LCBQT0lOVCgkJHtpbmRleCArXG4gICAgICAgICAgMX0sICQke2luZGV4ICsgMn0pOjpnZW9tZXRyeSkgPD0gJCR7aW5kZXggKyAzfWBcbiAgICAgICk7XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIHBvaW50LmxvbmdpdHVkZSwgcG9pbnQubGF0aXR1ZGUsIGRpc3RhbmNlSW5LTSk7XG4gICAgICBpbmRleCArPSA0O1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLiRnZW9XaXRoaW4gJiYgZmllbGRWYWx1ZS4kZ2VvV2l0aGluLiRwb2x5Z29uKSB7XG4gICAgICBjb25zdCBwb2x5Z29uID0gZmllbGRWYWx1ZS4kZ2VvV2l0aGluLiRwb2x5Z29uO1xuICAgICAgbGV0IHBvaW50cztcbiAgICAgIGlmICh0eXBlb2YgcG9seWdvbiA9PT0gJ29iamVjdCcgJiYgcG9seWdvbi5fX3R5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICBpZiAoIXBvbHlnb24uY29vcmRpbmF0ZXMgfHwgcG9seWdvbi5jb29yZGluYXRlcy5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICAgJ2JhZCAkZ2VvV2l0aGluIHZhbHVlOyBQb2x5Z29uLmNvb3JkaW5hdGVzIHNob3VsZCBjb250YWluIGF0IGxlYXN0IDMgbG9uL2xhdCBwYWlycydcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cyA9IHBvbHlnb24uY29vcmRpbmF0ZXM7XG4gICAgICB9IGVsc2UgaWYgKHBvbHlnb24gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBpZiAocG9seWdvbi5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICAgJ2JhZCAkZ2VvV2l0aGluIHZhbHVlOyAkcG9seWdvbiBzaG91bGQgY29udGFpbiBhdCBsZWFzdCAzIEdlb1BvaW50cydcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cyA9IHBvbHlnb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIFwiYmFkICRnZW9XaXRoaW4gdmFsdWU7ICRwb2x5Z29uIHNob3VsZCBiZSBQb2x5Z29uIG9iamVjdCBvciBBcnJheSBvZiBQYXJzZS5HZW9Qb2ludCdzXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHBvaW50cyA9IHBvaW50c1xuICAgICAgICAubWFwKHBvaW50ID0+IHtcbiAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSAmJiBwb2ludC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShwb2ludFsxXSwgcG9pbnRbMF0pO1xuICAgICAgICAgICAgcmV0dXJuIGAoJHtwb2ludFswXX0sICR7cG9pbnRbMV19KWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgcG9pbnQgIT09ICdvYmplY3QnIHx8IHBvaW50Ll9fdHlwZSAhPT0gJ0dlb1BvaW50Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgICAgICdiYWQgJGdlb1dpdGhpbiB2YWx1ZSdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShwb2ludC5sYXRpdHVkZSwgcG9pbnQubG9uZ2l0dWRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGAoJHtwb2ludC5sb25naXR1ZGV9LCAke3BvaW50LmxhdGl0dWRlfSlgO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignLCAnKTtcblxuICAgICAgcGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWU6OnBvaW50IDxAICQke2luZGV4ICsgMX06OnBvbHlnb25gKTtcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgYCgke3BvaW50c30pYCk7XG4gICAgICBpbmRleCArPSAyO1xuICAgIH1cbiAgICBpZiAoZmllbGRWYWx1ZS4kZ2VvSW50ZXJzZWN0cyAmJiBmaWVsZFZhbHVlLiRnZW9JbnRlcnNlY3RzLiRwb2ludCkge1xuICAgICAgY29uc3QgcG9pbnQgPSBmaWVsZFZhbHVlLiRnZW9JbnRlcnNlY3RzLiRwb2ludDtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQgIT09ICdvYmplY3QnIHx8IHBvaW50Ll9fdHlwZSAhPT0gJ0dlb1BvaW50Jykge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICdiYWQgJGdlb0ludGVyc2VjdCB2YWx1ZTsgJHBvaW50IHNob3VsZCBiZSBHZW9Qb2ludCdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShwb2ludC5sYXRpdHVkZSwgcG9pbnQubG9uZ2l0dWRlKTtcbiAgICAgIH1cbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lOjpwb2x5Z29uIEA+ICQke2luZGV4ICsgMX06OnBvaW50YCk7XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGAoJHtwb2ludC5sb25naXR1ZGV9LCAke3BvaW50LmxhdGl0dWRlfSlgKTtcbiAgICAgIGluZGV4ICs9IDI7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkVmFsdWUuJHJlZ2V4KSB7XG4gICAgICBsZXQgcmVnZXggPSBmaWVsZFZhbHVlLiRyZWdleDtcbiAgICAgIGxldCBvcGVyYXRvciA9ICd+JztcbiAgICAgIGNvbnN0IG9wdHMgPSBmaWVsZFZhbHVlLiRvcHRpb25zO1xuICAgICAgaWYgKG9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMuaW5kZXhPZignaScpID49IDApIHtcbiAgICAgICAgICBvcGVyYXRvciA9ICd+Kic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdHMuaW5kZXhPZigneCcpID49IDApIHtcbiAgICAgICAgICByZWdleCA9IHJlbW92ZVdoaXRlU3BhY2UocmVnZXgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5hbWUgPSB0cmFuc2Zvcm1Eb3RGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgcmVnZXggPSBwcm9jZXNzUmVnZXhQYXR0ZXJuKHJlZ2V4KTtcblxuICAgICAgcGF0dGVybnMucHVzaChgJCR7aW5kZXh9OnJhdyAke29wZXJhdG9yfSAnJCR7aW5kZXggKyAxfTpyYXcnYCk7XG4gICAgICB2YWx1ZXMucHVzaChuYW1lLCByZWdleCk7XG4gICAgICBpbmRleCArPSAyO1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLl9fdHlwZSA9PT0gJ1BvaW50ZXInKSB7XG4gICAgICBpZiAoaXNBcnJheUZpZWxkKSB7XG4gICAgICAgIHBhdHRlcm5zLnB1c2goYGFycmF5X2NvbnRhaW5zKCQke2luZGV4fTpuYW1lLCAkJHtpbmRleCArIDF9KWApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIEpTT04uc3RyaW5naWZ5KFtmaWVsZFZhbHVlXSkpO1xuICAgICAgICBpbmRleCArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZS5vYmplY3RJZCk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnRGF0ZScpIHtcbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCBmaWVsZFZhbHVlLmlzbyk7XG4gICAgICBpbmRleCArPSAyO1xuICAgIH1cblxuICAgIGlmIChmaWVsZFZhbHVlLl9fdHlwZSA9PT0gJ0dlb1BvaW50Jykge1xuICAgICAgcGF0dGVybnMucHVzaChcbiAgICAgICAgJyQnICtcbiAgICAgICAgICBpbmRleCArXG4gICAgICAgICAgJzpuYW1lIH49IFBPSU5UKCQnICtcbiAgICAgICAgICAoaW5kZXggKyAxKSArXG4gICAgICAgICAgJywgJCcgK1xuICAgICAgICAgIChpbmRleCArIDIpICtcbiAgICAgICAgICAnKSdcbiAgICAgICk7XG4gICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUubG9uZ2l0dWRlLCBmaWVsZFZhbHVlLmxhdGl0dWRlKTtcbiAgICAgIGluZGV4ICs9IDM7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udmVydFBvbHlnb25Ub1NRTChmaWVsZFZhbHVlLmNvb3JkaW5hdGVzKTtcbiAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lIH49ICQke2luZGV4ICsgMX06OnBvbHlnb25gKTtcbiAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgdmFsdWUpO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhQYXJzZVRvUG9zZ3Jlc0NvbXBhcmF0b3IpLmZvckVhY2goY21wID0+IHtcbiAgICAgIGlmIChmaWVsZFZhbHVlW2NtcF0gfHwgZmllbGRWYWx1ZVtjbXBdID09PSAwKSB7XG4gICAgICAgIGNvbnN0IHBnQ29tcGFyYXRvciA9IFBhcnNlVG9Qb3NncmVzQ29tcGFyYXRvcltjbXBdO1xuICAgICAgICBwYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSAke3BnQ29tcGFyYXRvcn0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIHRvUG9zdGdyZXNWYWx1ZShmaWVsZFZhbHVlW2NtcF0pKTtcbiAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChpbml0aWFsUGF0dGVybnNMZW5ndGggPT09IHBhdHRlcm5zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICBQYXJzZS5FcnJvci5PUEVSQVRJT05fRk9SQklEREVOLFxuICAgICAgICBgUG9zdGdyZXMgZG9lc24ndCBzdXBwb3J0IHRoaXMgcXVlcnkgdHlwZSB5ZXQgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICBmaWVsZFZhbHVlXG4gICAgICAgICl9YFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgdmFsdWVzID0gdmFsdWVzLm1hcCh0cmFuc2Zvcm1WYWx1ZSk7XG4gIHJldHVybiB7IHBhdHRlcm46IHBhdHRlcm5zLmpvaW4oJyBBTkQgJyksIHZhbHVlcywgc29ydHMgfTtcbn07XG5cbmV4cG9ydCBjbGFzcyBQb3N0Z3Jlc1N0b3JhZ2VBZGFwdGVyIGltcGxlbWVudHMgU3RvcmFnZUFkYXB0ZXIge1xuICBjYW5Tb3J0T25Kb2luVGFibGVzOiBib29sZWFuO1xuXG4gIC8vIFByaXZhdGVcbiAgX2NvbGxlY3Rpb25QcmVmaXg6IHN0cmluZztcbiAgX2NsaWVudDogYW55O1xuICBfcGdwOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoeyB1cmksIGNvbGxlY3Rpb25QcmVmaXggPSAnJywgZGF0YWJhc2VPcHRpb25zIH06IGFueSkge1xuICAgIHRoaXMuX2NvbGxlY3Rpb25QcmVmaXggPSBjb2xsZWN0aW9uUHJlZml4O1xuICAgIGNvbnN0IHsgY2xpZW50LCBwZ3AgfSA9IGNyZWF0ZUNsaWVudCh1cmksIGRhdGFiYXNlT3B0aW9ucyk7XG4gICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuX3BncCA9IHBncDtcbiAgICB0aGlzLmNhblNvcnRPbkpvaW5UYWJsZXMgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZVNodXRkb3duKCkge1xuICAgIGlmICghdGhpcy5fY2xpZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2NsaWVudC4kcG9vbC5lbmQoKTtcbiAgfVxuXG4gIF9lbnN1cmVTY2hlbWFDb2xsZWN0aW9uRXhpc3RzKGNvbm46IGFueSkge1xuICAgIGNvbm4gPSBjb25uIHx8IHRoaXMuX2NsaWVudDtcbiAgICByZXR1cm4gY29ublxuICAgICAgLm5vbmUoXG4gICAgICAgICdDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBcIl9TQ0hFTUFcIiAoIFwiY2xhc3NOYW1lXCIgdmFyQ2hhcigxMjApLCBcInNjaGVtYVwiIGpzb25iLCBcImlzUGFyc2VDbGFzc1wiIGJvb2wsIFBSSU1BUlkgS0VZIChcImNsYXNzTmFtZVwiKSApJ1xuICAgICAgKVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVycm9yLmNvZGUgPT09IFBvc3RncmVzRHVwbGljYXRlUmVsYXRpb25FcnJvciB8fFxuICAgICAgICAgIGVycm9yLmNvZGUgPT09IFBvc3RncmVzVW5pcXVlSW5kZXhWaW9sYXRpb25FcnJvciB8fFxuICAgICAgICAgIGVycm9yLmNvZGUgPT09IFBvc3RncmVzRHVwbGljYXRlT2JqZWN0RXJyb3JcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gVGFibGUgYWxyZWFkeSBleGlzdHMsIG11c3QgaGF2ZSBiZWVuIGNyZWF0ZWQgYnkgYSBkaWZmZXJlbnQgcmVxdWVzdC4gSWdub3JlIGVycm9yLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGNsYXNzRXhpc3RzKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLl9jbGllbnQub25lKFxuICAgICAgJ1NFTEVDVCBFWElTVFMgKFNFTEVDVCAxIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLnRhYmxlcyBXSEVSRSB0YWJsZV9uYW1lID0gJDEpJyxcbiAgICAgIFtuYW1lXSxcbiAgICAgIGEgPT4gYS5leGlzdHNcbiAgICApO1xuICB9XG5cbiAgc2V0Q2xhc3NMZXZlbFBlcm1pc3Npb25zKGNsYXNzTmFtZTogc3RyaW5nLCBDTFBzOiBhbnkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fY2xpZW50LnRhc2soJ3NldC1jbGFzcy1sZXZlbC1wZXJtaXNzaW9ucycsIGZ1bmN0aW9uKih0KSB7XG4gICAgICB5aWVsZCBzZWxmLl9lbnN1cmVTY2hlbWFDb2xsZWN0aW9uRXhpc3RzKHQpO1xuICAgICAgY29uc3QgdmFsdWVzID0gW1xuICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICdzY2hlbWEnLFxuICAgICAgICAnY2xhc3NMZXZlbFBlcm1pc3Npb25zJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoQ0xQcyksXG4gICAgICBdO1xuICAgICAgeWllbGQgdC5ub25lKFxuICAgICAgICBgVVBEQVRFIFwiX1NDSEVNQVwiIFNFVCAkMjpuYW1lID0ganNvbl9vYmplY3Rfc2V0X2tleSgkMjpuYW1lLCAkMzo6dGV4dCwgJDQ6Ompzb25iKSBXSEVSRSBcImNsYXNzTmFtZVwiPSQxYCxcbiAgICAgICAgdmFsdWVzXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0SW5kZXhlc1dpdGhTY2hlbWFGb3JtYXQoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc3VibWl0dGVkSW5kZXhlczogYW55LFxuICAgIGV4aXN0aW5nSW5kZXhlczogYW55ID0ge30sXG4gICAgZmllbGRzOiBhbnksXG4gICAgY29ubjogP2FueVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25uID0gY29ubiB8fCB0aGlzLl9jbGllbnQ7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHN1Ym1pdHRlZEluZGV4ZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZXhpc3RpbmdJbmRleGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGV4aXN0aW5nSW5kZXhlcyA9IHsgX2lkXzogeyBfaWQ6IDEgfSB9O1xuICAgIH1cbiAgICBjb25zdCBkZWxldGVkSW5kZXhlcyA9IFtdO1xuICAgIGNvbnN0IGluc2VydGVkSW5kZXhlcyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHN1Ym1pdHRlZEluZGV4ZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBjb25zdCBmaWVsZCA9IHN1Ym1pdHRlZEluZGV4ZXNbbmFtZV07XG4gICAgICBpZiAoZXhpc3RpbmdJbmRleGVzW25hbWVdICYmIGZpZWxkLl9fb3AgIT09ICdEZWxldGUnKSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX1FVRVJZLFxuICAgICAgICAgIGBJbmRleCAke25hbWV9IGV4aXN0cywgY2Fubm90IHVwZGF0ZS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIWV4aXN0aW5nSW5kZXhlc1tuYW1lXSAmJiBmaWVsZC5fX29wID09PSAnRGVsZXRlJykge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9RVUVSWSxcbiAgICAgICAgICBgSW5kZXggJHtuYW1lfSBkb2VzIG5vdCBleGlzdCwgY2Fubm90IGRlbGV0ZS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQuX19vcCA9PT0gJ0RlbGV0ZScpIHtcbiAgICAgICAgZGVsZXRlZEluZGV4ZXMucHVzaChuYW1lKTtcbiAgICAgICAgZGVsZXRlIGV4aXN0aW5nSW5kZXhlc1tuYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZpZWxkKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgaWYgKCFmaWVsZHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX1FVRVJZLFxuICAgICAgICAgICAgICBgRmllbGQgJHtrZXl9IGRvZXMgbm90IGV4aXN0LCBjYW5ub3QgYWRkIGluZGV4LmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZXhpc3RpbmdJbmRleGVzW25hbWVdID0gZmllbGQ7XG4gICAgICAgIGluc2VydGVkSW5kZXhlcy5wdXNoKHtcbiAgICAgICAgICBrZXk6IGZpZWxkLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjb25uLnR4KCdzZXQtaW5kZXhlcy13aXRoLXNjaGVtYS1mb3JtYXQnLCBmdW5jdGlvbioodCkge1xuICAgICAgaWYgKGluc2VydGVkSW5kZXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHlpZWxkIHNlbGYuY3JlYXRlSW5kZXhlcyhjbGFzc05hbWUsIGluc2VydGVkSW5kZXhlcywgdCk7XG4gICAgICB9XG4gICAgICBpZiAoZGVsZXRlZEluZGV4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB5aWVsZCBzZWxmLmRyb3BJbmRleGVzKGNsYXNzTmFtZSwgZGVsZXRlZEluZGV4ZXMsIHQpO1xuICAgICAgfVxuICAgICAgeWllbGQgc2VsZi5fZW5zdXJlU2NoZW1hQ29sbGVjdGlvbkV4aXN0cyh0KTtcbiAgICAgIHlpZWxkIHQubm9uZShcbiAgICAgICAgJ1VQREFURSBcIl9TQ0hFTUFcIiBTRVQgJDI6bmFtZSA9IGpzb25fb2JqZWN0X3NldF9rZXkoJDI6bmFtZSwgJDM6OnRleHQsICQ0Ojpqc29uYikgV0hFUkUgXCJjbGFzc05hbWVcIj0kMScsXG4gICAgICAgIFtjbGFzc05hbWUsICdzY2hlbWEnLCAnaW5kZXhlcycsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nSW5kZXhlcyldXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hVHlwZSwgY29ubjogP2FueSkge1xuICAgIGNvbm4gPSBjb25uIHx8IHRoaXMuX2NsaWVudDtcbiAgICByZXR1cm4gY29ublxuICAgICAgLnR4KCdjcmVhdGUtY2xhc3MnLCB0ID0+IHtcbiAgICAgICAgY29uc3QgcTEgPSB0aGlzLmNyZWF0ZVRhYmxlKGNsYXNzTmFtZSwgc2NoZW1hLCB0KTtcbiAgICAgICAgY29uc3QgcTIgPSB0Lm5vbmUoXG4gICAgICAgICAgJ0lOU0VSVCBJTlRPIFwiX1NDSEVNQVwiIChcImNsYXNzTmFtZVwiLCBcInNjaGVtYVwiLCBcImlzUGFyc2VDbGFzc1wiKSBWQUxVRVMgKCQ8Y2xhc3NOYW1lPiwgJDxzY2hlbWE+LCB0cnVlKScsXG4gICAgICAgICAgeyBjbGFzc05hbWUsIHNjaGVtYSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHEzID0gdGhpcy5zZXRJbmRleGVzV2l0aFNjaGVtYUZvcm1hdChcbiAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgc2NoZW1hLmluZGV4ZXMsXG4gICAgICAgICAge30sXG4gICAgICAgICAgc2NoZW1hLmZpZWxkcyxcbiAgICAgICAgICB0XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0LmJhdGNoKFtxMSwgcTIsIHEzXSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdG9QYXJzZVNjaGVtYShzY2hlbWEpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyLmRhdGFbMF0ucmVzdWx0LmNvZGUgPT09IFBvc3RncmVzVHJhbnNhY3Rpb25BYm9ydGVkRXJyb3IpIHtcbiAgICAgICAgICBlcnIgPSBlcnIuZGF0YVsxXS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVyci5jb2RlID09PSBQb3N0Z3Jlc1VuaXF1ZUluZGV4VmlvbGF0aW9uRXJyb3IgJiZcbiAgICAgICAgICBlcnIuZGV0YWlsLmluY2x1ZGVzKGNsYXNzTmFtZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuRFVQTElDQVRFX1ZBTFVFLFxuICAgICAgICAgICAgYENsYXNzICR7Y2xhc3NOYW1lfSBhbHJlYWR5IGV4aXN0cy5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIEp1c3QgY3JlYXRlIGEgdGFibGUsIGRvIG5vdCBpbnNlcnQgaW4gc2NoZW1hXG4gIGNyZWF0ZVRhYmxlKGNsYXNzTmFtZTogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYVR5cGUsIGNvbm46IGFueSkge1xuICAgIGNvbm4gPSBjb25uIHx8IHRoaXMuX2NsaWVudDtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkZWJ1ZygnY3JlYXRlVGFibGUnLCBjbGFzc05hbWUsIHNjaGVtYSk7XG4gICAgY29uc3QgdmFsdWVzQXJyYXkgPSBbXTtcbiAgICBjb25zdCBwYXR0ZXJuc0FycmF5ID0gW107XG4gICAgY29uc3QgZmllbGRzID0gT2JqZWN0LmFzc2lnbih7fSwgc2NoZW1hLmZpZWxkcyk7XG4gICAgaWYgKGNsYXNzTmFtZSA9PT0gJ19Vc2VyJykge1xuICAgICAgZmllbGRzLl9lbWFpbF92ZXJpZnlfdG9rZW5fZXhwaXJlc19hdCA9IHsgdHlwZTogJ0RhdGUnIH07XG4gICAgICBmaWVsZHMuX2VtYWlsX3ZlcmlmeV90b2tlbiA9IHsgdHlwZTogJ1N0cmluZycgfTtcbiAgICAgIGZpZWxkcy5fYWNjb3VudF9sb2Nrb3V0X2V4cGlyZXNfYXQgPSB7IHR5cGU6ICdEYXRlJyB9O1xuICAgICAgZmllbGRzLl9mYWlsZWRfbG9naW5fY291bnQgPSB7IHR5cGU6ICdOdW1iZXInIH07XG4gICAgICBmaWVsZHMuX3BlcmlzaGFibGVfdG9rZW4gPSB7IHR5cGU6ICdTdHJpbmcnIH07XG4gICAgICBmaWVsZHMuX3BlcmlzaGFibGVfdG9rZW5fZXhwaXJlc19hdCA9IHsgdHlwZTogJ0RhdGUnIH07XG4gICAgICBmaWVsZHMuX3Bhc3N3b3JkX2NoYW5nZWRfYXQgPSB7IHR5cGU6ICdEYXRlJyB9O1xuICAgICAgZmllbGRzLl9wYXNzd29yZF9oaXN0b3J5ID0geyB0eXBlOiAnQXJyYXknIH07XG4gICAgfVxuICAgIGxldCBpbmRleCA9IDI7XG4gICAgY29uc3QgcmVsYXRpb25zID0gW107XG4gICAgT2JqZWN0LmtleXMoZmllbGRzKS5mb3JFYWNoKGZpZWxkTmFtZSA9PiB7XG4gICAgICBjb25zdCBwYXJzZVR5cGUgPSBmaWVsZHNbZmllbGROYW1lXTtcbiAgICAgIC8vIFNraXAgd2hlbiBpdCdzIGEgcmVsYXRpb25cbiAgICAgIC8vIFdlJ2xsIGNyZWF0ZSB0aGUgdGFibGVzIGxhdGVyXG4gICAgICBpZiAocGFyc2VUeXBlLnR5cGUgPT09ICdSZWxhdGlvbicpIHtcbiAgICAgICAgcmVsYXRpb25zLnB1c2goZmllbGROYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFsnX3JwZXJtJywgJ193cGVybSddLmluZGV4T2YoZmllbGROYW1lKSA+PSAwKSB7XG4gICAgICAgIHBhcnNlVHlwZS5jb250ZW50cyA9IHsgdHlwZTogJ1N0cmluZycgfTtcbiAgICAgIH1cbiAgICAgIHZhbHVlc0FycmF5LnB1c2goZmllbGROYW1lKTtcbiAgICAgIHZhbHVlc0FycmF5LnB1c2gocGFyc2VUeXBlVG9Qb3N0Z3Jlc1R5cGUocGFyc2VUeXBlKSk7XG4gICAgICBwYXR0ZXJuc0FycmF5LnB1c2goYCQke2luZGV4fTpuYW1lICQke2luZGV4ICsgMX06cmF3YCk7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnb2JqZWN0SWQnKSB7XG4gICAgICAgIHBhdHRlcm5zQXJyYXkucHVzaChgUFJJTUFSWSBLRVkgKCQke2luZGV4fTpuYW1lKWApO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBpbmRleCArIDI7XG4gICAgfSk7XG4gICAgY29uc3QgcXMgPSBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgJDE6bmFtZSAoJHtwYXR0ZXJuc0FycmF5LmpvaW4oKX0pYDtcbiAgICBjb25zdCB2YWx1ZXMgPSBbY2xhc3NOYW1lLCAuLi52YWx1ZXNBcnJheV07XG5cbiAgICBkZWJ1ZyhxcywgdmFsdWVzKTtcbiAgICByZXR1cm4gY29ubi50YXNrKCdjcmVhdGUtdGFibGUnLCBmdW5jdGlvbioodCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgeWllbGQgc2VsZi5fZW5zdXJlU2NoZW1hQ29sbGVjdGlvbkV4aXN0cyh0KTtcbiAgICAgICAgeWllbGQgdC5ub25lKHFzLCB2YWx1ZXMpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgIT09IFBvc3RncmVzRHVwbGljYXRlUmVsYXRpb25FcnJvcikge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVMU0U6IFRhYmxlIGFscmVhZHkgZXhpc3RzLCBtdXN0IGhhdmUgYmVlbiBjcmVhdGVkIGJ5IGEgZGlmZmVyZW50IHJlcXVlc3QuIElnbm9yZSB0aGUgZXJyb3IuXG4gICAgICB9XG4gICAgICB5aWVsZCB0LnR4KCdjcmVhdGUtdGFibGUtdHgnLCB0eCA9PiB7XG4gICAgICAgIHJldHVybiB0eC5iYXRjaChcbiAgICAgICAgICByZWxhdGlvbnMubWFwKGZpZWxkTmFtZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHgubm9uZShcbiAgICAgICAgICAgICAgJ0NSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTICQ8am9pblRhYmxlOm5hbWU+IChcInJlbGF0ZWRJZFwiIHZhckNoYXIoMTIwKSwgXCJvd25pbmdJZFwiIHZhckNoYXIoMTIwKSwgUFJJTUFSWSBLRVkoXCJyZWxhdGVkSWRcIiwgXCJvd25pbmdJZFwiKSApJyxcbiAgICAgICAgICAgICAgeyBqb2luVGFibGU6IGBfSm9pbjoke2ZpZWxkTmFtZX06JHtjbGFzc05hbWV9YCB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjaGVtYVVwZ3JhZGUoY2xhc3NOYW1lOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hVHlwZSwgY29ubjogYW55KSB7XG4gICAgZGVidWcoJ3NjaGVtYVVwZ3JhZGUnLCB7IGNsYXNzTmFtZSwgc2NoZW1hIH0pO1xuICAgIGNvbm4gPSBjb25uIHx8IHRoaXMuX2NsaWVudDtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBjb25uLnR4KCdzY2hlbWEtdXBncmFkZScsIGZ1bmN0aW9uKih0KSB7XG4gICAgICBjb25zdCBjb2x1bW5zID0geWllbGQgdC5tYXAoXG4gICAgICAgICdTRUxFQ1QgY29sdW1uX25hbWUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuY29sdW1ucyBXSEVSRSB0YWJsZV9uYW1lID0gJDxjbGFzc05hbWU+JyxcbiAgICAgICAgeyBjbGFzc05hbWUgfSxcbiAgICAgICAgYSA9PiBhLmNvbHVtbl9uYW1lXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3Q29sdW1ucyA9IE9iamVjdC5rZXlzKHNjaGVtYS5maWVsZHMpXG4gICAgICAgIC5maWx0ZXIoaXRlbSA9PiBjb2x1bW5zLmluZGV4T2YoaXRlbSkgPT09IC0xKVxuICAgICAgICAubWFwKGZpZWxkTmFtZSA9PlxuICAgICAgICAgIHNlbGYuYWRkRmllbGRJZk5vdEV4aXN0cyhcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgIGZpZWxkTmFtZSxcbiAgICAgICAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSxcbiAgICAgICAgICAgIHRcbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgIHlpZWxkIHQuYmF0Y2gobmV3Q29sdW1ucyk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRGaWVsZElmTm90RXhpc3RzKFxuICAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgIGZpZWxkTmFtZTogc3RyaW5nLFxuICAgIHR5cGU6IGFueSxcbiAgICBjb25uOiBhbnlcbiAgKSB7XG4gICAgLy8gVE9ETzogTXVzdCBiZSByZXZpc2VkIGZvciBpbnZhbGlkIGxvZ2ljLi4uXG4gICAgZGVidWcoJ2FkZEZpZWxkSWZOb3RFeGlzdHMnLCB7IGNsYXNzTmFtZSwgZmllbGROYW1lLCB0eXBlIH0pO1xuICAgIGNvbm4gPSBjb25uIHx8IHRoaXMuX2NsaWVudDtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gY29ubi50eCgnYWRkLWZpZWxkLWlmLW5vdC1leGlzdHMnLCBmdW5jdGlvbioodCkge1xuICAgICAgaWYgKHR5cGUudHlwZSAhPT0gJ1JlbGF0aW9uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHlpZWxkIHQubm9uZShcbiAgICAgICAgICAgICdBTFRFUiBUQUJMRSAkPGNsYXNzTmFtZTpuYW1lPiBBREQgQ09MVU1OICQ8ZmllbGROYW1lOm5hbWU+ICQ8cG9zdGdyZXNUeXBlOnJhdz4nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgIGZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgcG9zdGdyZXNUeXBlOiBwYXJzZVR5cGVUb1Bvc3RncmVzVHlwZSh0eXBlKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSBQb3N0Z3Jlc1JlbGF0aW9uRG9lc05vdEV4aXN0RXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCBzZWxmLmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgIHsgZmllbGRzOiB7IFtmaWVsZE5hbWVdOiB0eXBlIH0gfSxcbiAgICAgICAgICAgICAgdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVycm9yLmNvZGUgIT09IFBvc3RncmVzRHVwbGljYXRlQ29sdW1uRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDb2x1bW4gYWxyZWFkeSBleGlzdHMsIGNyZWF0ZWQgYnkgb3RoZXIgcmVxdWVzdC4gQ2Fycnkgb24gdG8gc2VlIGlmIGl0J3MgdGhlIHJpZ2h0IHR5cGUuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHQubm9uZShcbiAgICAgICAgICAnQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgJDxqb2luVGFibGU6bmFtZT4gKFwicmVsYXRlZElkXCIgdmFyQ2hhcigxMjApLCBcIm93bmluZ0lkXCIgdmFyQ2hhcigxMjApLCBQUklNQVJZIEtFWShcInJlbGF0ZWRJZFwiLCBcIm93bmluZ0lkXCIpICknLFxuICAgICAgICAgIHsgam9pblRhYmxlOiBgX0pvaW46JHtmaWVsZE5hbWV9OiR7Y2xhc3NOYW1lfWAgfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB5aWVsZCB0LmFueShcbiAgICAgICAgJ1NFTEVDVCBcInNjaGVtYVwiIEZST00gXCJfU0NIRU1BXCIgV0hFUkUgXCJjbGFzc05hbWVcIiA9ICQ8Y2xhc3NOYW1lPiBhbmQgKFwic2NoZW1hXCI6Ompzb24tPlxcJ2ZpZWxkc1xcJy0+JDxmaWVsZE5hbWU+KSBpcyBub3QgbnVsbCcsXG4gICAgICAgIHsgY2xhc3NOYW1lLCBmaWVsZE5hbWUgfVxuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3VsdFswXSkge1xuICAgICAgICB0aHJvdyAnQXR0ZW1wdGVkIHRvIGFkZCBhIGZpZWxkIHRoYXQgYWxyZWFkeSBleGlzdHMnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGB7ZmllbGRzLCR7ZmllbGROYW1lfX1gO1xuICAgICAgICB5aWVsZCB0Lm5vbmUoXG4gICAgICAgICAgJ1VQREFURSBcIl9TQ0hFTUFcIiBTRVQgXCJzY2hlbWFcIj1qc29uYl9zZXQoXCJzY2hlbWFcIiwgJDxwYXRoPiwgJDx0eXBlPikgIFdIRVJFIFwiY2xhc3NOYW1lXCI9JDxjbGFzc05hbWU+JyxcbiAgICAgICAgICB7IHBhdGgsIHR5cGUsIGNsYXNzTmFtZSB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBEcm9wcyBhIGNvbGxlY3Rpb24uIFJlc29sdmVzIHdpdGggdHJ1ZSBpZiBpdCB3YXMgYSBQYXJzZSBTY2hlbWEgKGVnLiBfVXNlciwgQ3VzdG9tLCBldGMuKVxuICAvLyBhbmQgcmVzb2x2ZXMgd2l0aCBmYWxzZSBpZiBpdCB3YXNuJ3QgKGVnLiBhIGpvaW4gdGFibGUpLiBSZWplY3RzIGlmIGRlbGV0aW9uIHdhcyBpbXBvc3NpYmxlLlxuICBkZWxldGVDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXG4gICAgICB7IHF1ZXJ5OiBgRFJPUCBUQUJMRSBJRiBFWElTVFMgJDE6bmFtZWAsIHZhbHVlczogW2NsYXNzTmFtZV0gfSxcbiAgICAgIHtcbiAgICAgICAgcXVlcnk6IGBERUxFVEUgRlJPTSBcIl9TQ0hFTUFcIiBXSEVSRSBcImNsYXNzTmFtZVwiID0gJDFgLFxuICAgICAgICB2YWx1ZXM6IFtjbGFzc05hbWVdLFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRcbiAgICAgIC50eCh0ID0+IHQubm9uZSh0aGlzLl9wZ3AuaGVscGVycy5jb25jYXQob3BlcmF0aW9ucykpKVxuICAgICAgLnRoZW4oKCkgPT4gY2xhc3NOYW1lLmluZGV4T2YoJ19Kb2luOicpICE9IDApOyAvLyByZXNvbHZlcyB3aXRoIGZhbHNlIHdoZW4gX0pvaW4gdGFibGVcbiAgfVxuXG4gIC8vIERlbGV0ZSBhbGwgZGF0YSBrbm93biB0byB0aGlzIGFkYXB0ZXIuIFVzZWQgZm9yIHRlc3RpbmcuXG4gIGRlbGV0ZUFsbENsYXNzZXMoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgY29uc3QgaGVscGVycyA9IHRoaXMuX3BncC5oZWxwZXJzO1xuICAgIGRlYnVnKCdkZWxldGVBbGxDbGFzc2VzJyk7XG5cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50XG4gICAgICAudGFzaygnZGVsZXRlLWFsbC1jbGFzc2VzJywgZnVuY3Rpb24qKHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXN1bHRzID0geWllbGQgdC5hbnkoJ1NFTEVDVCAqIEZST00gXCJfU0NIRU1BXCInKTtcbiAgICAgICAgICBjb25zdCBqb2lucyA9IHJlc3VsdHMucmVkdWNlKChsaXN0OiBBcnJheTxzdHJpbmc+LCBzY2hlbWE6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3QuY29uY2F0KGpvaW5UYWJsZXNGb3JTY2hlbWEoc2NoZW1hLnNjaGVtYSkpO1xuICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW1xuICAgICAgICAgICAgJ19TQ0hFTUEnLFxuICAgICAgICAgICAgJ19QdXNoU3RhdHVzJyxcbiAgICAgICAgICAgICdfSm9iU3RhdHVzJyxcbiAgICAgICAgICAgICdfSm9iU2NoZWR1bGUnLFxuICAgICAgICAgICAgJ19Ib29rcycsXG4gICAgICAgICAgICAnX0dsb2JhbENvbmZpZycsXG4gICAgICAgICAgICAnX0F1ZGllbmNlJyxcbiAgICAgICAgICAgIC4uLnJlc3VsdHMubWFwKHJlc3VsdCA9PiByZXN1bHQuY2xhc3NOYW1lKSxcbiAgICAgICAgICAgIC4uLmpvaW5zLFxuICAgICAgICAgIF07XG4gICAgICAgICAgY29uc3QgcXVlcmllcyA9IGNsYXNzZXMubWFwKGNsYXNzTmFtZSA9PiAoe1xuICAgICAgICAgICAgcXVlcnk6ICdEUk9QIFRBQkxFIElGIEVYSVNUUyAkPGNsYXNzTmFtZTpuYW1lPicsXG4gICAgICAgICAgICB2YWx1ZXM6IHsgY2xhc3NOYW1lIH0sXG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHlpZWxkIHQudHgodHggPT4gdHgubm9uZShoZWxwZXJzLmNvbmNhdChxdWVyaWVzKSkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlICE9PSBQb3N0Z3Jlc1JlbGF0aW9uRG9lc05vdEV4aXN0RXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBObyBfU0NIRU1BIGNvbGxlY3Rpb24uIERvbid0IGRlbGV0ZSBhbnl0aGluZy5cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZGVidWcoYGRlbGV0ZUFsbENsYXNzZXMgZG9uZSBpbiAke25ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbm93fWApO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIGNvbHVtbiBhbmQgYWxsIHRoZSBkYXRhLiBGb3IgUmVsYXRpb25zLCB0aGUgX0pvaW4gY29sbGVjdGlvbiBpcyBoYW5kbGVkXG4gIC8vIHNwZWNpYWxseSwgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBkZWxldGUgX0pvaW4gY29sdW1ucy4gSXQgc2hvdWxkLCBob3dldmVyLCBpbmRpY2F0ZVxuICAvLyB0aGF0IHRoZSByZWxhdGlvbiBmaWVsZHMgZG9lcyBub3QgZXhpc3QgYW55bW9yZS4gSW4gbW9uZ28sIHRoaXMgbWVhbnMgcmVtb3ZpbmcgaXQgZnJvbVxuICAvLyB0aGUgX1NDSEVNQSBjb2xsZWN0aW9uLiAgVGhlcmUgc2hvdWxkIGJlIG5vIGFjdHVhbCBkYXRhIGluIHRoZSBjb2xsZWN0aW9uIHVuZGVyIHRoZSBzYW1lIG5hbWVcbiAgLy8gYXMgdGhlIHJlbGF0aW9uIGNvbHVtbiwgc28gaXQncyBmaW5lIHRvIGF0dGVtcHQgdG8gZGVsZXRlIGl0LiBJZiB0aGUgZmllbGRzIGxpc3RlZCB0byBiZVxuICAvLyBkZWxldGVkIGRvIG5vdCBleGlzdCwgdGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIHN1Y2Nlc3NmdWxseSBhbnl3YXlzLiBDaGVja2luZyBmb3JcbiAgLy8gYXR0ZW1wdHMgdG8gZGVsZXRlIG5vbi1leGlzdGVudCBmaWVsZHMgaXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIFBhcnNlIFNlcnZlci5cblxuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIG5vdCBvYmxpZ2F0ZWQgdG8gZGVsZXRlIGZpZWxkcyBhdG9taWNhbGx5LiBJdCBpcyBnaXZlbiB0aGUgZmllbGRcbiAgLy8gbmFtZXMgaW4gYSBsaXN0IHNvIHRoYXQgZGF0YWJhc2VzIHRoYXQgYXJlIGNhcGFibGUgb2YgZGVsZXRpbmcgZmllbGRzIGF0b21pY2FsbHlcbiAgLy8gbWF5IGRvIHNvLlxuXG4gIC8vIFJldHVybnMgYSBQcm9taXNlLlxuICBkZWxldGVGaWVsZHMoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIGZpZWxkTmFtZXM6IHN0cmluZ1tdXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGRlYnVnKCdkZWxldGVGaWVsZHMnLCBjbGFzc05hbWUsIGZpZWxkTmFtZXMpO1xuICAgIGZpZWxkTmFtZXMgPSBmaWVsZE5hbWVzLnJlZHVjZSgobGlzdDogQXJyYXk8c3RyaW5nPiwgZmllbGROYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkID0gc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdO1xuICAgICAgaWYgKGZpZWxkLnR5cGUgIT09ICdSZWxhdGlvbicpIHtcbiAgICAgICAgbGlzdC5wdXNoKGZpZWxkTmFtZSk7XG4gICAgICB9XG4gICAgICBkZWxldGUgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgdmFsdWVzID0gW2NsYXNzTmFtZSwgLi4uZmllbGROYW1lc107XG4gICAgY29uc3QgY29sdW1ucyA9IGZpZWxkTmFtZXNcbiAgICAgIC5tYXAoKG5hbWUsIGlkeCkgPT4ge1xuICAgICAgICByZXR1cm4gYCQke2lkeCArIDJ9Om5hbWVgO1xuICAgICAgfSlcbiAgICAgIC5qb2luKCcsIERST1AgQ09MVU1OJyk7XG5cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50LnR4KCdkZWxldGUtZmllbGRzJywgZnVuY3Rpb24qKHQpIHtcbiAgICAgIHlpZWxkIHQubm9uZShcbiAgICAgICAgJ1VQREFURSBcIl9TQ0hFTUFcIiBTRVQgXCJzY2hlbWFcIj0kPHNjaGVtYT4gV0hFUkUgXCJjbGFzc05hbWVcIj0kPGNsYXNzTmFtZT4nLFxuICAgICAgICB7IHNjaGVtYSwgY2xhc3NOYW1lIH1cbiAgICAgICk7XG4gICAgICBpZiAodmFsdWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgeWllbGQgdC5ub25lKGBBTFRFUiBUQUJMRSAkMTpuYW1lIERST1AgQ09MVU1OICR7Y29sdW1uc31gLCB2YWx1ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgcHJvbWlzZSBmb3IgYWxsIHNjaGVtYXMga25vd24gdG8gdGhpcyBhZGFwdGVyLCBpbiBQYXJzZSBmb3JtYXQuIEluIGNhc2UgdGhlXG4gIC8vIHNjaGVtYXMgY2Fubm90IGJlIHJldHJpZXZlZCwgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZWplY3RzLiBSZXF1aXJlbWVudHMgZm9yIHRoZVxuICAvLyByZWplY3Rpb24gcmVhc29uIGFyZSBUQkQuXG4gIGdldEFsbENsYXNzZXMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudC50YXNrKCdnZXQtYWxsLWNsYXNzZXMnLCBmdW5jdGlvbioodCkge1xuICAgICAgeWllbGQgc2VsZi5fZW5zdXJlU2NoZW1hQ29sbGVjdGlvbkV4aXN0cyh0KTtcbiAgICAgIHJldHVybiB5aWVsZCB0Lm1hcCgnU0VMRUNUICogRlJPTSBcIl9TQ0hFTUFcIicsIG51bGwsIHJvdyA9PlxuICAgICAgICB0b1BhcnNlU2NoZW1hKHsgY2xhc3NOYW1lOiByb3cuY2xhc3NOYW1lLCAuLi5yb3cuc2NoZW1hIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgcHJvbWlzZSBmb3IgdGhlIHNjaGVtYSB3aXRoIHRoZSBnaXZlbiBuYW1lLCBpbiBQYXJzZSBmb3JtYXQuIElmXG4gIC8vIHRoaXMgYWRhcHRlciBkb2Vzbid0IGtub3cgYWJvdXQgdGhlIHNjaGVtYSwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2l0aFxuICAvLyB1bmRlZmluZWQgYXMgdGhlIHJlYXNvbi5cbiAgZ2V0Q2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICBkZWJ1ZygnZ2V0Q2xhc3MnLCBjbGFzc05hbWUpO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRcbiAgICAgIC5hbnkoJ1NFTEVDVCAqIEZST00gXCJfU0NIRU1BXCIgV0hFUkUgXCJjbGFzc05hbWVcIj0kPGNsYXNzTmFtZT4nLCB7XG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgIHRocm93IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0WzBdLnNjaGVtYTtcbiAgICAgIH0pXG4gICAgICAudGhlbih0b1BhcnNlU2NoZW1hKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbW92ZSB0aGUgbW9uZ28gZm9ybWF0IGRlcGVuZGVuY3kgaW4gdGhlIHJldHVybiB2YWx1ZVxuICBjcmVhdGVPYmplY3QoY2xhc3NOYW1lOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hVHlwZSwgb2JqZWN0OiBhbnkpIHtcbiAgICBkZWJ1ZygnY3JlYXRlT2JqZWN0JywgY2xhc3NOYW1lLCBvYmplY3QpO1xuICAgIGxldCBjb2x1bW5zQXJyYXkgPSBbXTtcbiAgICBjb25zdCB2YWx1ZXNBcnJheSA9IFtdO1xuICAgIHNjaGVtYSA9IHRvUG9zdGdyZXNTY2hlbWEoc2NoZW1hKTtcbiAgICBjb25zdCBnZW9Qb2ludHMgPSB7fTtcblxuICAgIG9iamVjdCA9IGhhbmRsZURvdEZpZWxkcyhvYmplY3QpO1xuXG4gICAgdmFsaWRhdGVLZXlzKG9iamVjdCk7XG5cbiAgICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goZmllbGROYW1lID0+IHtcbiAgICAgIGlmIChvYmplY3RbZmllbGROYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgYXV0aERhdGFNYXRjaCA9IGZpZWxkTmFtZS5tYXRjaCgvXl9hdXRoX2RhdGFfKFthLXpBLVowLTlfXSspJC8pO1xuICAgICAgaWYgKGF1dGhEYXRhTWF0Y2gpIHtcbiAgICAgICAgdmFyIHByb3ZpZGVyID0gYXV0aERhdGFNYXRjaFsxXTtcbiAgICAgICAgb2JqZWN0WydhdXRoRGF0YSddID0gb2JqZWN0WydhdXRoRGF0YSddIHx8IHt9O1xuICAgICAgICBvYmplY3RbJ2F1dGhEYXRhJ11bcHJvdmlkZXJdID0gb2JqZWN0W2ZpZWxkTmFtZV07XG4gICAgICAgIGRlbGV0ZSBvYmplY3RbZmllbGROYW1lXTtcbiAgICAgICAgZmllbGROYW1lID0gJ2F1dGhEYXRhJztcbiAgICAgIH1cblxuICAgICAgY29sdW1uc0FycmF5LnB1c2goZmllbGROYW1lKTtcbiAgICAgIGlmICghc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdICYmIGNsYXNzTmFtZSA9PT0gJ19Vc2VyJykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgZmllbGROYW1lID09PSAnX2VtYWlsX3ZlcmlmeV90b2tlbicgfHxcbiAgICAgICAgICBmaWVsZE5hbWUgPT09ICdfZmFpbGVkX2xvZ2luX2NvdW50JyB8fFxuICAgICAgICAgIGZpZWxkTmFtZSA9PT0gJ19wZXJpc2hhYmxlX3Rva2VuJyB8fFxuICAgICAgICAgIGZpZWxkTmFtZSA9PT0gJ19wYXNzd29yZF9oaXN0b3J5J1xuICAgICAgICApIHtcbiAgICAgICAgICB2YWx1ZXNBcnJheS5wdXNoKG9iamVjdFtmaWVsZE5hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZE5hbWUgPT09ICdfZW1haWxfdmVyaWZ5X3Rva2VuX2V4cGlyZXNfYXQnKSB7XG4gICAgICAgICAgaWYgKG9iamVjdFtmaWVsZE5hbWVdKSB7XG4gICAgICAgICAgICB2YWx1ZXNBcnJheS5wdXNoKG9iamVjdFtmaWVsZE5hbWVdLmlzbyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlc0FycmF5LnB1c2gobnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGZpZWxkTmFtZSA9PT0gJ19hY2NvdW50X2xvY2tvdXRfZXhwaXJlc19hdCcgfHxcbiAgICAgICAgICBmaWVsZE5hbWUgPT09ICdfcGVyaXNoYWJsZV90b2tlbl9leHBpcmVzX2F0JyB8fFxuICAgICAgICAgIGZpZWxkTmFtZSA9PT0gJ19wYXNzd29yZF9jaGFuZ2VkX2F0J1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAob2JqZWN0W2ZpZWxkTmFtZV0pIHtcbiAgICAgICAgICAgIHZhbHVlc0FycmF5LnB1c2gob2JqZWN0W2ZpZWxkTmFtZV0uaXNvKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzQXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZSkge1xuICAgICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgICBpZiAob2JqZWN0W2ZpZWxkTmFtZV0pIHtcbiAgICAgICAgICAgIHZhbHVlc0FycmF5LnB1c2gob2JqZWN0W2ZpZWxkTmFtZV0uaXNvKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzQXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BvaW50ZXInOlxuICAgICAgICAgIHZhbHVlc0FycmF5LnB1c2gob2JqZWN0W2ZpZWxkTmFtZV0ub2JqZWN0SWQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgaWYgKFsnX3JwZXJtJywgJ193cGVybSddLmluZGV4T2YoZmllbGROYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZXNBcnJheS5wdXNoKG9iamVjdFtmaWVsZE5hbWVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzQXJyYXkucHVzaChKU09OLnN0cmluZ2lmeShvYmplY3RbZmllbGROYW1lXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnT2JqZWN0JzpcbiAgICAgICAgY2FzZSAnQnl0ZXMnOlxuICAgICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICBjYXNlICdOdW1iZXInOlxuICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICB2YWx1ZXNBcnJheS5wdXNoKG9iamVjdFtmaWVsZE5hbWVdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRmlsZSc6XG4gICAgICAgICAgdmFsdWVzQXJyYXkucHVzaChvYmplY3RbZmllbGROYW1lXS5uYW1lKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUG9seWdvbic6IHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnZlcnRQb2x5Z29uVG9TUUwob2JqZWN0W2ZpZWxkTmFtZV0uY29vcmRpbmF0ZXMpO1xuICAgICAgICAgIHZhbHVlc0FycmF5LnB1c2godmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0dlb1BvaW50JzpcbiAgICAgICAgICAvLyBwb3AgdGhlIHBvaW50IGFuZCBwcm9jZXNzIGxhdGVyXG4gICAgICAgICAgZ2VvUG9pbnRzW2ZpZWxkTmFtZV0gPSBvYmplY3RbZmllbGROYW1lXTtcbiAgICAgICAgICBjb2x1bW5zQXJyYXkucG9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgYFR5cGUgJHtzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZX0gbm90IHN1cHBvcnRlZCB5ZXRgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29sdW1uc0FycmF5ID0gY29sdW1uc0FycmF5LmNvbmNhdChPYmplY3Qua2V5cyhnZW9Qb2ludHMpKTtcbiAgICBjb25zdCBpbml0aWFsVmFsdWVzID0gdmFsdWVzQXJyYXkubWFwKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgdGVybWluYXRpb24gPSAnJztcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IGNvbHVtbnNBcnJheVtpbmRleF07XG4gICAgICBpZiAoWydfcnBlcm0nLCAnX3dwZXJtJ10uaW5kZXhPZihmaWVsZE5hbWUpID49IDApIHtcbiAgICAgICAgdGVybWluYXRpb24gPSAnOjp0ZXh0W10nO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdICYmXG4gICAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXS50eXBlID09PSAnQXJyYXknXG4gICAgICApIHtcbiAgICAgICAgdGVybWluYXRpb24gPSAnOjpqc29uYic7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCQke2luZGV4ICsgMiArIGNvbHVtbnNBcnJheS5sZW5ndGh9JHt0ZXJtaW5hdGlvbn1gO1xuICAgIH0pO1xuICAgIGNvbnN0IGdlb1BvaW50c0luamVjdHMgPSBPYmplY3Qua2V5cyhnZW9Qb2ludHMpLm1hcChrZXkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBnZW9Qb2ludHNba2V5XTtcbiAgICAgIHZhbHVlc0FycmF5LnB1c2godmFsdWUubG9uZ2l0dWRlLCB2YWx1ZS5sYXRpdHVkZSk7XG4gICAgICBjb25zdCBsID0gdmFsdWVzQXJyYXkubGVuZ3RoICsgY29sdW1uc0FycmF5Lmxlbmd0aDtcbiAgICAgIHJldHVybiBgUE9JTlQoJCR7bH0sICQke2wgKyAxfSlgO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY29sdW1uc1BhdHRlcm4gPSBjb2x1bW5zQXJyYXlcbiAgICAgIC5tYXAoKGNvbCwgaW5kZXgpID0+IGAkJHtpbmRleCArIDJ9Om5hbWVgKVxuICAgICAgLmpvaW4oKTtcbiAgICBjb25zdCB2YWx1ZXNQYXR0ZXJuID0gaW5pdGlhbFZhbHVlcy5jb25jYXQoZ2VvUG9pbnRzSW5qZWN0cykuam9pbigpO1xuXG4gICAgY29uc3QgcXMgPSBgSU5TRVJUIElOVE8gJDE6bmFtZSAoJHtjb2x1bW5zUGF0dGVybn0pIFZBTFVFUyAoJHt2YWx1ZXNQYXR0ZXJufSlgO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtjbGFzc05hbWUsIC4uLmNvbHVtbnNBcnJheSwgLi4udmFsdWVzQXJyYXldO1xuICAgIGRlYnVnKHFzLCB2YWx1ZXMpO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRcbiAgICAgIC5ub25lKHFzLCB2YWx1ZXMpXG4gICAgICAudGhlbigoKSA9PiAoeyBvcHM6IFtvYmplY3RdIH0pKVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09IFBvc3RncmVzVW5pcXVlSW5kZXhWaW9sYXRpb25FcnJvcikge1xuICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkRVUExJQ0FURV9WQUxVRSxcbiAgICAgICAgICAgICdBIGR1cGxpY2F0ZSB2YWx1ZSBmb3IgYSBmaWVsZCB3aXRoIHVuaXF1ZSB2YWx1ZXMgd2FzIHByb3ZpZGVkJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLnVuZGVybHlpbmdFcnJvciA9IGVycm9yO1xuICAgICAgICAgIGlmIChlcnJvci5jb25zdHJhaW50KSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gZXJyb3IuY29uc3RyYWludC5tYXRjaCgvdW5pcXVlXyhbYS16QS1aXSspLyk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBBcnJheS5pc0FycmF5KG1hdGNoZXMpKSB7XG4gICAgICAgICAgICAgIGVyci51c2VySW5mbyA9IHsgZHVwbGljYXRlZF9maWVsZDogbWF0Y2hlc1sxXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGFsbCBvYmplY3RzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIFBhcnNlIFF1ZXJ5LlxuICAvLyBJZiBubyBvYmplY3RzIG1hdGNoLCByZWplY3Qgd2l0aCBPQkpFQ1RfTk9UX0ZPVU5ELiBJZiBvYmplY3RzIGFyZSBmb3VuZCBhbmQgZGVsZXRlZCwgcmVzb2x2ZSB3aXRoIHVuZGVmaW5lZC5cbiAgLy8gSWYgdGhlcmUgaXMgc29tZSBvdGhlciBlcnJvciwgcmVqZWN0IHdpdGggSU5URVJOQUxfU0VSVkVSX0VSUk9SLlxuICBkZWxldGVPYmplY3RzQnlRdWVyeShcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBzY2hlbWE6IFNjaGVtYVR5cGUsXG4gICAgcXVlcnk6IFF1ZXJ5VHlwZVxuICApIHtcbiAgICBkZWJ1ZygnZGVsZXRlT2JqZWN0c0J5UXVlcnknLCBjbGFzc05hbWUsIHF1ZXJ5KTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbY2xhc3NOYW1lXTtcbiAgICBjb25zdCBpbmRleCA9IDI7XG4gICAgY29uc3Qgd2hlcmUgPSBidWlsZFdoZXJlQ2xhdXNlKHsgc2NoZW1hLCBpbmRleCwgcXVlcnkgfSk7XG4gICAgdmFsdWVzLnB1c2goLi4ud2hlcmUudmFsdWVzKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocXVlcnkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgd2hlcmUucGF0dGVybiA9ICdUUlVFJztcbiAgICB9XG4gICAgY29uc3QgcXMgPSBgV0lUSCBkZWxldGVkIEFTIChERUxFVEUgRlJPTSAkMTpuYW1lIFdIRVJFICR7XG4gICAgICB3aGVyZS5wYXR0ZXJuXG4gICAgfSBSRVRVUk5JTkcgKikgU0VMRUNUIGNvdW50KCopIEZST00gZGVsZXRlZGA7XG4gICAgZGVidWcocXMsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudFxuICAgICAgLm9uZShxcywgdmFsdWVzLCBhID0+ICthLmNvdW50KVxuICAgICAgLnRoZW4oY291bnQgPT4ge1xuICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELFxuICAgICAgICAgICAgJ09iamVjdCBub3QgZm91bmQuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgIT09IFBvc3RncmVzUmVsYXRpb25Eb2VzTm90RXhpc3RFcnJvcikge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVMU0U6IERvbid0IGRlbGV0ZSBhbnl0aGluZyBpZiBkb2Vzbid0IGV4aXN0XG4gICAgICB9KTtcbiAgfVxuICAvLyBSZXR1cm4gdmFsdWUgbm90IGN1cnJlbnRseSB3ZWxsIHNwZWNpZmllZC5cbiAgZmluZE9uZUFuZFVwZGF0ZShcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBzY2hlbWE6IFNjaGVtYVR5cGUsXG4gICAgcXVlcnk6IFF1ZXJ5VHlwZSxcbiAgICB1cGRhdGU6IGFueVxuICApOiBQcm9taXNlPGFueT4ge1xuICAgIGRlYnVnKCdmaW5kT25lQW5kVXBkYXRlJywgY2xhc3NOYW1lLCBxdWVyeSwgdXBkYXRlKTtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3RzQnlRdWVyeShjbGFzc05hbWUsIHNjaGVtYSwgcXVlcnksIHVwZGF0ZSkudGhlbihcbiAgICAgIHZhbCA9PiB2YWxbMF1cbiAgICApO1xuICB9XG5cbiAgLy8gQXBwbHkgdGhlIHVwZGF0ZSB0byBhbGwgb2JqZWN0cyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBQYXJzZSBRdWVyeS5cbiAgdXBkYXRlT2JqZWN0c0J5UXVlcnkoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIHF1ZXJ5OiBRdWVyeVR5cGUsXG4gICAgdXBkYXRlOiBhbnlcbiAgKTogUHJvbWlzZTxbYW55XT4ge1xuICAgIGRlYnVnKCd1cGRhdGVPYmplY3RzQnlRdWVyeScsIGNsYXNzTmFtZSwgcXVlcnksIHVwZGF0ZSk7XG4gICAgY29uc3QgdXBkYXRlUGF0dGVybnMgPSBbXTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbY2xhc3NOYW1lXTtcbiAgICBsZXQgaW5kZXggPSAyO1xuICAgIHNjaGVtYSA9IHRvUG9zdGdyZXNTY2hlbWEoc2NoZW1hKTtcblxuICAgIGNvbnN0IG9yaWdpbmFsVXBkYXRlID0geyAuLi51cGRhdGUgfTtcblxuICAgIC8vIFNldCBmbGFnIGZvciBkb3Qgbm90YXRpb24gZmllbGRzXG4gICAgY29uc3QgZG90Tm90YXRpb25PcHRpb25zID0ge307XG4gICAgT2JqZWN0LmtleXModXBkYXRlKS5mb3JFYWNoKGZpZWxkTmFtZSA9PiB7XG4gICAgICBpZiAoZmllbGROYW1lLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBmaWVsZE5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBjb21wb25lbnRzLnNoaWZ0KCk7XG4gICAgICAgIGRvdE5vdGF0aW9uT3B0aW9uc1tmaXJzdF0gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG90Tm90YXRpb25PcHRpb25zW2ZpZWxkTmFtZV0gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1cGRhdGUgPSBoYW5kbGVEb3RGaWVsZHModXBkYXRlKTtcbiAgICAvLyBSZXNvbHZlIGF1dGhEYXRhIGZpcnN0LFxuICAgIC8vIFNvIHdlIGRvbid0IGVuZCB1cCB3aXRoIG11bHRpcGxlIGtleSB1cGRhdGVzXG4gICAgZm9yIChjb25zdCBmaWVsZE5hbWUgaW4gdXBkYXRlKSB7XG4gICAgICBjb25zdCBhdXRoRGF0YU1hdGNoID0gZmllbGROYW1lLm1hdGNoKC9eX2F1dGhfZGF0YV8oW2EtekEtWjAtOV9dKykkLyk7XG4gICAgICBpZiAoYXV0aERhdGFNYXRjaCkge1xuICAgICAgICB2YXIgcHJvdmlkZXIgPSBhdXRoRGF0YU1hdGNoWzFdO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHVwZGF0ZVtmaWVsZE5hbWVdO1xuICAgICAgICBkZWxldGUgdXBkYXRlW2ZpZWxkTmFtZV07XG4gICAgICAgIHVwZGF0ZVsnYXV0aERhdGEnXSA9IHVwZGF0ZVsnYXV0aERhdGEnXSB8fCB7fTtcbiAgICAgICAgdXBkYXRlWydhdXRoRGF0YSddW3Byb3ZpZGVyXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmllbGROYW1lIGluIHVwZGF0ZSkge1xuICAgICAgY29uc3QgZmllbGRWYWx1ZSA9IHVwZGF0ZVtmaWVsZE5hbWVdO1xuICAgICAgLy8gRHJvcCBhbnkgdW5kZWZpbmVkIHZhbHVlcy5cbiAgICAgIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZVtmaWVsZE5hbWVdO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gTlVMTGApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICBpbmRleCArPSAxO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZE5hbWUgPT0gJ2F1dGhEYXRhJykge1xuICAgICAgICAvLyBUaGlzIHJlY3Vyc2l2ZWx5IHNldHMgdGhlIGpzb25fb2JqZWN0XG4gICAgICAgIC8vIE9ubHkgMSBsZXZlbCBkZWVwXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlID0gKGpzb25iOiBzdHJpbmcsIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBqc29uX29iamVjdF9zZXRfa2V5KENPQUxFU0NFKCR7anNvbmJ9LCAne30nOjpqc29uYiksICR7a2V5fSwgJHt2YWx1ZX0pOjpqc29uYmA7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGxhc3RLZXkgPSBgJCR7aW5kZXh9Om5hbWVgO1xuICAgICAgICBjb25zdCBmaWVsZE5hbWVJbmRleCA9IGluZGV4O1xuICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSBPYmplY3Qua2V5cyhmaWVsZFZhbHVlKS5yZWR1Y2UoXG4gICAgICAgICAgKGxhc3RLZXk6IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGdlbmVyYXRlKFxuICAgICAgICAgICAgICBsYXN0S2V5LFxuICAgICAgICAgICAgICBgJCR7aW5kZXh9Ojp0ZXh0YCxcbiAgICAgICAgICAgICAgYCQke2luZGV4ICsgMX06Ompzb25iYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBmaWVsZFZhbHVlW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlLl9fb3AgPT09ICdEZWxldGUnKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsYXN0S2V5XG4gICAgICAgICk7XG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goYCQke2ZpZWxkTmFtZUluZGV4fTpuYW1lID0gJHt1cGRhdGV9YCk7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX19vcCA9PT0gJ0luY3JlbWVudCcpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChcbiAgICAgICAgICBgJCR7aW5kZXh9Om5hbWUgPSBDT0FMRVNDRSgkJHtpbmRleH06bmFtZSwgMCkgKyAkJHtpbmRleCArIDF9YFxuICAgICAgICApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUuYW1vdW50KTtcbiAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGRWYWx1ZS5fX29wID09PSAnQWRkJykge1xuICAgICAgICB1cGRhdGVQYXR0ZXJucy5wdXNoKFxuICAgICAgICAgIGAkJHtpbmRleH06bmFtZSA9IGFycmF5X2FkZChDT0FMRVNDRSgkJHtpbmRleH06bmFtZSwgJ1tdJzo6anNvbmIpLCAkJHtpbmRleCArXG4gICAgICAgICAgICAxfTo6anNvbmIpYFxuICAgICAgICApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIEpTT04uc3RyaW5naWZ5KGZpZWxkVmFsdWUub2JqZWN0cykpO1xuICAgICAgICBpbmRleCArPSAyO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZFZhbHVlLl9fb3AgPT09ICdEZWxldGUnKSB7XG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIG51bGwpO1xuICAgICAgICBpbmRleCArPSAyO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZFZhbHVlLl9fb3AgPT09ICdSZW1vdmUnKSB7XG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goXG4gICAgICAgICAgYCQke2luZGV4fTpuYW1lID0gYXJyYXlfcmVtb3ZlKENPQUxFU0NFKCQke2luZGV4fTpuYW1lLCAnW10nOjpqc29uYiksICQke2luZGV4ICtcbiAgICAgICAgICAgIDF9Ojpqc29uYilgXG4gICAgICAgICk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgSlNPTi5zdHJpbmdpZnkoZmllbGRWYWx1ZS5vYmplY3RzKSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX19vcCA9PT0gJ0FkZFVuaXF1ZScpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChcbiAgICAgICAgICBgJCR7aW5kZXh9Om5hbWUgPSBhcnJheV9hZGRfdW5pcXVlKENPQUxFU0NFKCQke2luZGV4fTpuYW1lLCAnW10nOjpqc29uYiksICQke2luZGV4ICtcbiAgICAgICAgICAgIDF9Ojpqc29uYilgXG4gICAgICAgICk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgSlNPTi5zdHJpbmdpZnkoZmllbGRWYWx1ZS5vYmplY3RzKSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkTmFtZSA9PT0gJ3VwZGF0ZWRBdCcpIHtcbiAgICAgICAgLy9UT0RPOiBzdG9wIHNwZWNpYWwgY2FzaW5nIHRoaXMuIEl0IHNob3VsZCBjaGVjayBmb3IgX190eXBlID09PSAnRGF0ZScgYW5kIHVzZSAuaXNvXG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgICBpbmRleCArPSAyO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWVsZFZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnUG9pbnRlcicpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZS5vYmplY3RJZCk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnRGF0ZScpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgdG9Qb3N0Z3Jlc1ZhbHVlKGZpZWxkVmFsdWUpKTtcbiAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGRWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgZmllbGRWYWx1ZSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnRmlsZScpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9YCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkTmFtZSwgdG9Qb3N0Z3Jlc1ZhbHVlKGZpZWxkVmFsdWUpKTtcbiAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGRWYWx1ZS5fX3R5cGUgPT09ICdHZW9Qb2ludCcpIHtcbiAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChcbiAgICAgICAgICBgJCR7aW5kZXh9Om5hbWUgPSBQT0lOVCgkJHtpbmRleCArIDF9LCAkJHtpbmRleCArIDJ9KWBcbiAgICAgICAgKTtcbiAgICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCBmaWVsZFZhbHVlLmxvbmdpdHVkZSwgZmllbGRWYWx1ZS5sYXRpdHVkZSk7XG4gICAgICAgIGluZGV4ICs9IDM7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb252ZXJ0UG9seWdvblRvU1FMKGZpZWxkVmFsdWUuY29vcmRpbmF0ZXMpO1xuICAgICAgICB1cGRhdGVQYXR0ZXJucy5wdXNoKGAkJHtpbmRleH06bmFtZSA9ICQke2luZGV4ICsgMX06OnBvbHlnb25gKTtcbiAgICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCB2YWx1ZSk7XG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkVmFsdWUuX190eXBlID09PSAnUmVsYXRpb24nKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpZWxkVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHVwZGF0ZVBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgICBpbmRleCArPSAyO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIGZpZWxkVmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSAmJlxuICAgICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZSA9PT0gJ09iamVjdCdcbiAgICAgICkge1xuICAgICAgICAvLyBHYXRoZXIga2V5cyB0byBpbmNyZW1lbnRcbiAgICAgICAgY29uc3Qga2V5c1RvSW5jcmVtZW50ID0gT2JqZWN0LmtleXMob3JpZ2luYWxVcGRhdGUpXG4gICAgICAgICAgLmZpbHRlcihrID0+IHtcbiAgICAgICAgICAgIC8vIGNob29zZSB0b3AgbGV2ZWwgZmllbGRzIHRoYXQgaGF2ZSBhIGRlbGV0ZSBvcGVyYXRpb24gc2V0XG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgT2JqZWN0LmtleXMgaXMgaXRlcmF0aW5nIG92ZXIgdGhlICoqb3JpZ2luYWwqKiB1cGRhdGUgb2JqZWN0XG4gICAgICAgICAgICAvLyBhbmQgdGhhdCBzb21lIG9mIHRoZSBrZXlzIG9mIHRoZSBvcmlnaW5hbCB1cGRhdGUgY291bGQgYmUgbnVsbCBvciB1bmRlZmluZWQ6XG4gICAgICAgICAgICAvLyAoU2VlIHRoZSBhYm92ZSBjaGVjayBgaWYgKGZpZWxkVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGZpZWxkVmFsdWUgPT0gXCJ1bmRlZmluZWRcIilgKVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBvcmlnaW5hbFVwZGF0ZVtrXTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIHZhbHVlICYmXG4gICAgICAgICAgICAgIHZhbHVlLl9fb3AgPT09ICdJbmNyZW1lbnQnICYmXG4gICAgICAgICAgICAgIGsuc3BsaXQoJy4nKS5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgICAgay5zcGxpdCgnLicpWzBdID09PSBmaWVsZE5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGsgPT4gay5zcGxpdCgnLicpWzFdKTtcblxuICAgICAgICBsZXQgaW5jcmVtZW50UGF0dGVybnMgPSAnJztcbiAgICAgICAgaWYgKGtleXNUb0luY3JlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaW5jcmVtZW50UGF0dGVybnMgPVxuICAgICAgICAgICAgJyB8fCAnICtcbiAgICAgICAgICAgIGtleXNUb0luY3JlbWVudFxuICAgICAgICAgICAgICAubWFwKGMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFtb3VudCA9IGZpZWxkVmFsdWVbY10uYW1vdW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBgQ09OQ0FUKCd7XCIke2N9XCI6JywgQ09BTEVTQ0UoJCR7aW5kZXh9Om5hbWUtPj4nJHtjfScsJzAnKTo6aW50ICsgJHthbW91bnR9LCAnfScpOjpqc29uYmA7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5qb2luKCcgfHwgJyk7XG4gICAgICAgICAgLy8gU3RyaXAgdGhlIGtleXNcbiAgICAgICAgICBrZXlzVG9JbmNyZW1lbnQuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGZpZWxkVmFsdWVba2V5XTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleXNUb0RlbGV0ZTogQXJyYXk8c3RyaW5nPiA9IE9iamVjdC5rZXlzKG9yaWdpbmFsVXBkYXRlKVxuICAgICAgICAgIC5maWx0ZXIoayA9PiB7XG4gICAgICAgICAgICAvLyBjaG9vc2UgdG9wIGxldmVsIGZpZWxkcyB0aGF0IGhhdmUgYSBkZWxldGUgb3BlcmF0aW9uIHNldC5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gb3JpZ2luYWxVcGRhdGVba107XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICB2YWx1ZSAmJlxuICAgICAgICAgICAgICB2YWx1ZS5fX29wID09PSAnRGVsZXRlJyAmJlxuICAgICAgICAgICAgICBrLnNwbGl0KCcuJykubGVuZ3RoID09PSAyICYmXG4gICAgICAgICAgICAgIGsuc3BsaXQoJy4nKVswXSA9PT0gZmllbGROYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1hcChrID0+IGsuc3BsaXQoJy4nKVsxXSk7XG5cbiAgICAgICAgY29uc3QgZGVsZXRlUGF0dGVybnMgPSBrZXlzVG9EZWxldGUucmVkdWNlKFxuICAgICAgICAgIChwOiBzdHJpbmcsIGM6IHN0cmluZywgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcCArIGAgLSAnJCR7aW5kZXggKyAxICsgaX06dmFsdWUnYDtcbiAgICAgICAgICB9LFxuICAgICAgICAgICcnXG4gICAgICAgICk7XG4gICAgICAgIC8vIE92ZXJyaWRlIE9iamVjdFxuICAgICAgICBsZXQgdXBkYXRlT2JqZWN0ID0gXCIne30nOjpqc29uYlwiO1xuXG4gICAgICAgIGlmIChkb3ROb3RhdGlvbk9wdGlvbnNbZmllbGROYW1lXSkge1xuICAgICAgICAgIC8vIE1lcmdlIE9iamVjdFxuICAgICAgICAgIHVwZGF0ZU9iamVjdCA9IGBDT0FMRVNDRSgkJHtpbmRleH06bmFtZSwgJ3t9Jzo6anNvbmIpYDtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVQYXR0ZXJucy5wdXNoKFxuICAgICAgICAgIGAkJHtpbmRleH06bmFtZSA9ICgke3VwZGF0ZU9iamVjdH0gJHtkZWxldGVQYXR0ZXJuc30gJHtpbmNyZW1lbnRQYXR0ZXJuc30gfHwgJCR7aW5kZXggK1xuICAgICAgICAgICAgMSArXG4gICAgICAgICAgICBrZXlzVG9EZWxldGUubGVuZ3RofTo6anNvbmIgKWBcbiAgICAgICAgKTtcbiAgICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lLCAuLi5rZXlzVG9EZWxldGUsIEpTT04uc3RyaW5naWZ5KGZpZWxkVmFsdWUpKTtcbiAgICAgICAgaW5kZXggKz0gMiArIGtleXNUb0RlbGV0ZS5sZW5ndGg7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBBcnJheS5pc0FycmF5KGZpZWxkVmFsdWUpICYmXG4gICAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSAmJlxuICAgICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZSA9PT0gJ0FycmF5J1xuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVHlwZSA9IHBhcnNlVHlwZVRvUG9zdGdyZXNUeXBlKHNjaGVtYS5maWVsZHNbZmllbGROYW1lXSk7XG4gICAgICAgIGlmIChleHBlY3RlZFR5cGUgPT09ICd0ZXh0W10nKSB7XG4gICAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChgJCR7aW5kZXh9Om5hbWUgPSAkJHtpbmRleCArIDF9Ojp0ZXh0W11gKTtcbiAgICAgICAgICB2YWx1ZXMucHVzaChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2goZmllbGROYW1lKTtcbiAgICAgICAgICBjb25zdCBidWlsZFNRTEFycmF5ID0gZmllbGRWYWx1ZSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0dGVybiA9ICdqc29uX2J1aWxkX2FycmF5KCc7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkVmFsdWUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGZpZWxkVmFsdWVbaV07XG4gICAgICAgICAgICAgIGxldCB0eXBlID0gJyc7XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiArPSBidWlsZFNRTEFycmF5KGVsZW1lbnQpICsgJywnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9ICc6Ompzb24nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICBwYXR0ZXJuICs9IGAkJHtpbmRleCArIDF9JHt0eXBlfSxgO1xuICAgICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVtb3ZlIGxhc3QgY29tbWFcbiAgICAgICAgICAgIGlmIChmaWVsZFZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcGF0dGVybiA9IHBhdHRlcm4uc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0dGVybiArPSAnKSc7XG4gICAgICAgICAgICByZXR1cm4gcGF0dGVybjtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IHNxbCA9IGAkJHtpbmRleH06bmFtZSA9ICR7YnVpbGRTUUxBcnJheShmaWVsZFZhbHVlKX1gO1xuXG4gICAgICAgICAgdXBkYXRlUGF0dGVybnMucHVzaChzcWwpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlYnVnKCdOb3Qgc3VwcG9ydGVkIHVwZGF0ZScsIGZpZWxkTmFtZSwgZmllbGRWYWx1ZSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgICBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PUEVSQVRJT05fRk9SQklEREVOLFxuICAgICAgICAgICAgYFBvc3RncmVzIGRvZXNuJ3Qgc3VwcG9ydCB1cGRhdGUgJHtKU09OLnN0cmluZ2lmeShmaWVsZFZhbHVlKX0geWV0YFxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB3aGVyZSA9IGJ1aWxkV2hlcmVDbGF1c2UoeyBzY2hlbWEsIGluZGV4LCBxdWVyeSB9KTtcbiAgICB2YWx1ZXMucHVzaCguLi53aGVyZS52YWx1ZXMpO1xuXG4gICAgY29uc3Qgd2hlcmVDbGF1c2UgPVxuICAgICAgd2hlcmUucGF0dGVybi5sZW5ndGggPiAwID8gYFdIRVJFICR7d2hlcmUucGF0dGVybn1gIDogJyc7XG4gICAgY29uc3QgcXMgPSBgVVBEQVRFICQxOm5hbWUgU0VUICR7dXBkYXRlUGF0dGVybnMuam9pbigpfSAke3doZXJlQ2xhdXNlfSBSRVRVUk5JTkcgKmA7XG4gICAgZGVidWcoJ3VwZGF0ZTogJywgcXMsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudC5hbnkocXMsIHZhbHVlcyk7XG4gIH1cblxuICAvLyBIb3BlZnVsbHksIHdlIGNhbiBnZXQgcmlkIG9mIHRoaXMuIEl0J3Mgb25seSB1c2VkIGZvciBjb25maWcgYW5kIGhvb2tzLlxuICB1cHNlcnRPbmVPYmplY3QoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIHF1ZXJ5OiBRdWVyeVR5cGUsXG4gICAgdXBkYXRlOiBhbnlcbiAgKSB7XG4gICAgZGVidWcoJ3Vwc2VydE9uZU9iamVjdCcsIHsgY2xhc3NOYW1lLCBxdWVyeSwgdXBkYXRlIH0pO1xuICAgIGNvbnN0IGNyZWF0ZVZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgcXVlcnksIHVwZGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlT2JqZWN0KGNsYXNzTmFtZSwgc2NoZW1hLCBjcmVhdGVWYWx1ZSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgLy8gaWdub3JlIGR1cGxpY2F0ZSB2YWx1ZSBlcnJvcnMgYXMgaXQncyB1cHNlcnRcbiAgICAgIGlmIChlcnJvci5jb2RlICE9PSBQYXJzZS5FcnJvci5EVVBMSUNBVEVfVkFMVUUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5kT25lQW5kVXBkYXRlKGNsYXNzTmFtZSwgc2NoZW1hLCBxdWVyeSwgdXBkYXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmQoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIHF1ZXJ5OiBRdWVyeVR5cGUsXG4gICAgeyBza2lwLCBsaW1pdCwgc29ydCwga2V5cyB9OiBRdWVyeU9wdGlvbnNcbiAgKSB7XG4gICAgZGVidWcoJ2ZpbmQnLCBjbGFzc05hbWUsIHF1ZXJ5LCB7IHNraXAsIGxpbWl0LCBzb3J0LCBrZXlzIH0pO1xuICAgIGNvbnN0IGhhc0xpbWl0ID0gbGltaXQgIT09IHVuZGVmaW5lZDtcbiAgICBjb25zdCBoYXNTa2lwID0gc2tpcCAhPT0gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZXMgPSBbY2xhc3NOYW1lXTtcbiAgICBjb25zdCB3aGVyZSA9IGJ1aWxkV2hlcmVDbGF1c2UoeyBzY2hlbWEsIHF1ZXJ5LCBpbmRleDogMiB9KTtcbiAgICB2YWx1ZXMucHVzaCguLi53aGVyZS52YWx1ZXMpO1xuXG4gICAgY29uc3Qgd2hlcmVQYXR0ZXJuID1cbiAgICAgIHdoZXJlLnBhdHRlcm4ubGVuZ3RoID4gMCA/IGBXSEVSRSAke3doZXJlLnBhdHRlcm59YCA6ICcnO1xuICAgIGNvbnN0IGxpbWl0UGF0dGVybiA9IGhhc0xpbWl0ID8gYExJTUlUICQke3ZhbHVlcy5sZW5ndGggKyAxfWAgOiAnJztcbiAgICBpZiAoaGFzTGltaXQpIHtcbiAgICAgIHZhbHVlcy5wdXNoKGxpbWl0KTtcbiAgICB9XG4gICAgY29uc3Qgc2tpcFBhdHRlcm4gPSBoYXNTa2lwID8gYE9GRlNFVCAkJHt2YWx1ZXMubGVuZ3RoICsgMX1gIDogJyc7XG4gICAgaWYgKGhhc1NraXApIHtcbiAgICAgIHZhbHVlcy5wdXNoKHNraXApO1xuICAgIH1cblxuICAgIGxldCBzb3J0UGF0dGVybiA9ICcnO1xuICAgIGlmIChzb3J0KSB7XG4gICAgICBjb25zdCBzb3J0Q29weTogYW55ID0gc29ydDtcbiAgICAgIGNvbnN0IHNvcnRpbmcgPSBPYmplY3Qua2V5cyhzb3J0KVxuICAgICAgICAubWFwKGtleSA9PiB7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtS2V5ID0gdHJhbnNmb3JtRG90RmllbGRUb0NvbXBvbmVudHMoa2V5KS5qb2luKCctPicpO1xuICAgICAgICAgIC8vIFVzaW5nICRpZHggcGF0dGVybiBnaXZlczogIG5vbi1pbnRlZ2VyIGNvbnN0YW50IGluIE9SREVSIEJZXG4gICAgICAgICAgaWYgKHNvcnRDb3B5W2tleV0gPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0cmFuc2Zvcm1LZXl9IEFTQ2A7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBgJHt0cmFuc2Zvcm1LZXl9IERFU0NgO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbigpO1xuICAgICAgc29ydFBhdHRlcm4gPVxuICAgICAgICBzb3J0ICE9PSB1bmRlZmluZWQgJiYgT2JqZWN0LmtleXMoc29ydCkubGVuZ3RoID4gMFxuICAgICAgICAgID8gYE9SREVSIEJZICR7c29ydGluZ31gXG4gICAgICAgICAgOiAnJztcbiAgICB9XG4gICAgaWYgKHdoZXJlLnNvcnRzICYmIE9iamVjdC5rZXlzKCh3aGVyZS5zb3J0czogYW55KSkubGVuZ3RoID4gMCkge1xuICAgICAgc29ydFBhdHRlcm4gPSBgT1JERVIgQlkgJHt3aGVyZS5zb3J0cy5qb2luKCl9YDtcbiAgICB9XG5cbiAgICBsZXQgY29sdW1ucyA9ICcqJztcbiAgICBpZiAoa2V5cykge1xuICAgICAgLy8gRXhjbHVkZSBlbXB0eSBrZXlzXG4gICAgICAvLyBSZXBsYWNlIEFDTCBieSBpdCdzIGtleXNcbiAgICAgIGtleXMgPSBrZXlzLnJlZHVjZSgobWVtbywga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICdBQ0wnKSB7XG4gICAgICAgICAgbWVtby5wdXNoKCdfcnBlcm0nKTtcbiAgICAgICAgICBtZW1vLnB1c2goJ193cGVybScpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbWVtby5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICB9LCBbXSk7XG4gICAgICBjb2x1bW5zID0ga2V5c1xuICAgICAgICAubWFwKChrZXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJyRzY29yZScpIHtcbiAgICAgICAgICAgIHJldHVybiBgdHNfcmFua19jZCh0b190c3ZlY3RvcigkJHsyfSwgJCR7M306bmFtZSksIHRvX3RzcXVlcnkoJCR7NH0sICQkezV9KSwgMzIpIGFzIHNjb3JlYDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGAkJHtpbmRleCArIHZhbHVlcy5sZW5ndGggKyAxfTpuYW1lYDtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oKTtcbiAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQoa2V5cyk7XG4gICAgfVxuXG4gICAgY29uc3QgcXMgPSBgU0VMRUNUICR7Y29sdW1uc30gRlJPTSAkMTpuYW1lICR7d2hlcmVQYXR0ZXJufSAke3NvcnRQYXR0ZXJufSAke2xpbWl0UGF0dGVybn0gJHtza2lwUGF0dGVybn1gO1xuICAgIGRlYnVnKHFzLCB2YWx1ZXMpO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRcbiAgICAgIC5hbnkocXMsIHZhbHVlcylcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIC8vIFF1ZXJ5IG9uIG5vbiBleGlzdGluZyB0YWJsZSwgZG9uJ3QgY3Jhc2hcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgIT09IFBvc3RncmVzUmVsYXRpb25Eb2VzTm90RXhpc3RFcnJvcikge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHRzID0+XG4gICAgICAgIHJlc3VsdHMubWFwKG9iamVjdCA9PlxuICAgICAgICAgIHRoaXMucG9zdGdyZXNPYmplY3RUb1BhcnNlT2JqZWN0KGNsYXNzTmFtZSwgb2JqZWN0LCBzY2hlbWEpXG4gICAgICAgIClcbiAgICAgICk7XG4gIH1cblxuICAvLyBDb252ZXJ0cyBmcm9tIGEgcG9zdGdyZXMtZm9ybWF0IG9iamVjdCB0byBhIFJFU1QtZm9ybWF0IG9iamVjdC5cbiAgLy8gRG9lcyBub3Qgc3RyaXAgb3V0IGFueXRoaW5nIGJhc2VkIG9uIGEgbGFjayBvZiBhdXRoZW50aWNhdGlvbi5cbiAgcG9zdGdyZXNPYmplY3RUb1BhcnNlT2JqZWN0KGNsYXNzTmFtZTogc3RyaW5nLCBvYmplY3Q6IGFueSwgc2NoZW1hOiBhbnkpIHtcbiAgICBPYmplY3Qua2V5cyhzY2hlbWEuZmllbGRzKS5mb3JFYWNoKGZpZWxkTmFtZSA9PiB7XG4gICAgICBpZiAoc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLnR5cGUgPT09ICdQb2ludGVyJyAmJiBvYmplY3RbZmllbGROYW1lXSkge1xuICAgICAgICBvYmplY3RbZmllbGROYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RJZDogb2JqZWN0W2ZpZWxkTmFtZV0sXG4gICAgICAgICAgX190eXBlOiAnUG9pbnRlcicsXG4gICAgICAgICAgY2xhc3NOYW1lOiBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udGFyZ2V0Q2xhc3MsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLnR5cGUgPT09ICdSZWxhdGlvbicpIHtcbiAgICAgICAgb2JqZWN0W2ZpZWxkTmFtZV0gPSB7XG4gICAgICAgICAgX190eXBlOiAnUmVsYXRpb24nLFxuICAgICAgICAgIGNsYXNzTmFtZTogc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLnRhcmdldENsYXNzLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKG9iamVjdFtmaWVsZE5hbWVdICYmIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXS50eXBlID09PSAnR2VvUG9pbnQnKSB7XG4gICAgICAgIG9iamVjdFtmaWVsZE5hbWVdID0ge1xuICAgICAgICAgIF9fdHlwZTogJ0dlb1BvaW50JyxcbiAgICAgICAgICBsYXRpdHVkZTogb2JqZWN0W2ZpZWxkTmFtZV0ueSxcbiAgICAgICAgICBsb25naXR1ZGU6IG9iamVjdFtmaWVsZE5hbWVdLngsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAob2JqZWN0W2ZpZWxkTmFtZV0gJiYgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdLnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICBsZXQgY29vcmRzID0gb2JqZWN0W2ZpZWxkTmFtZV07XG4gICAgICAgIGNvb3JkcyA9IGNvb3Jkcy5zdWJzdHIoMiwgY29vcmRzLmxlbmd0aCAtIDQpLnNwbGl0KCcpLCgnKTtcbiAgICAgICAgY29vcmRzID0gY29vcmRzLm1hcChwb2ludCA9PiB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHBhcnNlRmxvYXQocG9pbnQuc3BsaXQoJywnKVsxXSksXG4gICAgICAgICAgICBwYXJzZUZsb2F0KHBvaW50LnNwbGl0KCcsJylbMF0pLFxuICAgICAgICAgIF07XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RbZmllbGROYW1lXSA9IHtcbiAgICAgICAgICBfX3R5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogY29vcmRzLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKG9iamVjdFtmaWVsZE5hbWVdICYmIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXS50eXBlID09PSAnRmlsZScpIHtcbiAgICAgICAgb2JqZWN0W2ZpZWxkTmFtZV0gPSB7XG4gICAgICAgICAgX190eXBlOiAnRmlsZScsXG4gICAgICAgICAgbmFtZTogb2JqZWN0W2ZpZWxkTmFtZV0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy9UT0RPOiByZW1vdmUgdGhpcyByZWxpYW5jZSBvbiB0aGUgbW9uZ28gZm9ybWF0LiBEQiBhZGFwdGVyIHNob3VsZG4ndCBrbm93IHRoZXJlIGlzIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIGNyZWF0ZWQgYXQgYW5kIGFueSBvdGhlciBkYXRlIGZpZWxkLlxuICAgIGlmIChvYmplY3QuY3JlYXRlZEF0KSB7XG4gICAgICBvYmplY3QuY3JlYXRlZEF0ID0gb2JqZWN0LmNyZWF0ZWRBdC50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LnVwZGF0ZWRBdCkge1xuICAgICAgb2JqZWN0LnVwZGF0ZWRBdCA9IG9iamVjdC51cGRhdGVkQXQudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5leHBpcmVzQXQpIHtcbiAgICAgIG9iamVjdC5leHBpcmVzQXQgPSB7XG4gICAgICAgIF9fdHlwZTogJ0RhdGUnLFxuICAgICAgICBpc286IG9iamVjdC5leHBpcmVzQXQudG9JU09TdHJpbmcoKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChvYmplY3QuX2VtYWlsX3ZlcmlmeV90b2tlbl9leHBpcmVzX2F0KSB7XG4gICAgICBvYmplY3QuX2VtYWlsX3ZlcmlmeV90b2tlbl9leHBpcmVzX2F0ID0ge1xuICAgICAgICBfX3R5cGU6ICdEYXRlJyxcbiAgICAgICAgaXNvOiBvYmplY3QuX2VtYWlsX3ZlcmlmeV90b2tlbl9leHBpcmVzX2F0LnRvSVNPU3RyaW5nKCksXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Ll9hY2NvdW50X2xvY2tvdXRfZXhwaXJlc19hdCkge1xuICAgICAgb2JqZWN0Ll9hY2NvdW50X2xvY2tvdXRfZXhwaXJlc19hdCA9IHtcbiAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgIGlzbzogb2JqZWN0Ll9hY2NvdW50X2xvY2tvdXRfZXhwaXJlc19hdC50b0lTT1N0cmluZygpLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5fcGVyaXNoYWJsZV90b2tlbl9leHBpcmVzX2F0KSB7XG4gICAgICBvYmplY3QuX3BlcmlzaGFibGVfdG9rZW5fZXhwaXJlc19hdCA9IHtcbiAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgIGlzbzogb2JqZWN0Ll9wZXJpc2hhYmxlX3Rva2VuX2V4cGlyZXNfYXQudG9JU09TdHJpbmcoKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChvYmplY3QuX3Bhc3N3b3JkX2NoYW5nZWRfYXQpIHtcbiAgICAgIG9iamVjdC5fcGFzc3dvcmRfY2hhbmdlZF9hdCA9IHtcbiAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgIGlzbzogb2JqZWN0Ll9wYXNzd29yZF9jaGFuZ2VkX2F0LnRvSVNPU3RyaW5nKCksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmllbGROYW1lIGluIG9iamVjdCkge1xuICAgICAgaWYgKG9iamVjdFtmaWVsZE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgIGRlbGV0ZSBvYmplY3RbZmllbGROYW1lXTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmplY3RbZmllbGROYW1lXSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgb2JqZWN0W2ZpZWxkTmFtZV0gPSB7XG4gICAgICAgICAgX190eXBlOiAnRGF0ZScsXG4gICAgICAgICAgaXNvOiBvYmplY3RbZmllbGROYW1lXS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvLyBDcmVhdGUgYSB1bmlxdWUgaW5kZXguIFVuaXF1ZSBpbmRleGVzIG9uIG51bGxhYmxlIGZpZWxkcyBhcmUgbm90IGFsbG93ZWQuIFNpbmNlIHdlIGRvbid0XG4gIC8vIGN1cnJlbnRseSBrbm93IHdoaWNoIGZpZWxkcyBhcmUgbnVsbGFibGUgYW5kIHdoaWNoIGFyZW4ndCwgd2UgaWdub3JlIHRoYXQgY3JpdGVyaWEuXG4gIC8vIEFzIHN1Y2gsIHdlIHNob3VsZG4ndCBleHBvc2UgdGhpcyBmdW5jdGlvbiB0byB1c2VycyBvZiBwYXJzZSB1bnRpbCB3ZSBoYXZlIGFuIG91dC1vZi1iYW5kXG4gIC8vIFdheSBvZiBkZXRlcm1pbmluZyBpZiBhIGZpZWxkIGlzIG51bGxhYmxlLiBVbmRlZmluZWQgZG9lc24ndCBjb3VudCBhZ2FpbnN0IHVuaXF1ZW5lc3MsXG4gIC8vIHdoaWNoIGlzIHdoeSB3ZSB1c2Ugc3BhcnNlIGluZGV4ZXMuXG4gIGVuc3VyZVVuaXF1ZW5lc3MoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIGZpZWxkTmFtZXM6IHN0cmluZ1tdXG4gICkge1xuICAgIC8vIFVzZSB0aGUgc2FtZSBuYW1lIGZvciBldmVyeSBlbnN1cmVVbmlxdWVuZXNzIGF0dGVtcHQsIGJlY2F1c2UgcG9zdGdyZXNcbiAgICAvLyBXaWxsIGhhcHBpbHkgY3JlYXRlIHRoZSBzYW1lIGluZGV4IHdpdGggbXVsdGlwbGUgbmFtZXMuXG4gICAgY29uc3QgY29uc3RyYWludE5hbWUgPSBgdW5pcXVlXyR7ZmllbGROYW1lcy5zb3J0KCkuam9pbignXycpfWA7XG4gICAgY29uc3QgY29uc3RyYWludFBhdHRlcm5zID0gZmllbGROYW1lcy5tYXAoXG4gICAgICAoZmllbGROYW1lLCBpbmRleCkgPT4gYCQke2luZGV4ICsgM306bmFtZWBcbiAgICApO1xuICAgIGNvbnN0IHFzID0gYEFMVEVSIFRBQkxFICQxOm5hbWUgQUREIENPTlNUUkFJTlQgJDI6bmFtZSBVTklRVUUgKCR7Y29uc3RyYWludFBhdHRlcm5zLmpvaW4oKX0pYDtcbiAgICByZXR1cm4gdGhpcy5fY2xpZW50XG4gICAgICAubm9uZShxcywgW2NsYXNzTmFtZSwgY29uc3RyYWludE5hbWUsIC4uLmZpZWxkTmFtZXNdKVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVycm9yLmNvZGUgPT09IFBvc3RncmVzRHVwbGljYXRlUmVsYXRpb25FcnJvciAmJlxuICAgICAgICAgIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoY29uc3RyYWludE5hbWUpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIEluZGV4IGFscmVhZHkgZXhpc3RzLiBJZ25vcmUgZXJyb3IuXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgZXJyb3IuY29kZSA9PT0gUG9zdGdyZXNVbmlxdWVJbmRleFZpb2xhdGlvbkVycm9yICYmXG4gICAgICAgICAgZXJyb3IubWVzc2FnZS5pbmNsdWRlcyhjb25zdHJhaW50TmFtZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gQ2FzdCB0aGUgZXJyb3IgaW50byB0aGUgcHJvcGVyIHBhcnNlIGVycm9yXG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuRFVQTElDQVRFX1ZBTFVFLFxuICAgICAgICAgICAgJ0EgZHVwbGljYXRlIHZhbHVlIGZvciBhIGZpZWxkIHdpdGggdW5pcXVlIHZhbHVlcyB3YXMgcHJvdmlkZWQnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvLyBFeGVjdXRlcyBhIGNvdW50LlxuICBjb3VudChjbGFzc05hbWU6IHN0cmluZywgc2NoZW1hOiBTY2hlbWFUeXBlLCBxdWVyeTogUXVlcnlUeXBlKSB7XG4gICAgZGVidWcoJ2NvdW50JywgY2xhc3NOYW1lLCBxdWVyeSk7XG4gICAgY29uc3QgdmFsdWVzID0gW2NsYXNzTmFtZV07XG4gICAgY29uc3Qgd2hlcmUgPSBidWlsZFdoZXJlQ2xhdXNlKHsgc2NoZW1hLCBxdWVyeSwgaW5kZXg6IDIgfSk7XG4gICAgdmFsdWVzLnB1c2goLi4ud2hlcmUudmFsdWVzKTtcblxuICAgIGNvbnN0IHdoZXJlUGF0dGVybiA9XG4gICAgICB3aGVyZS5wYXR0ZXJuLmxlbmd0aCA+IDAgPyBgV0hFUkUgJHt3aGVyZS5wYXR0ZXJufWAgOiAnJztcbiAgICBjb25zdCBxcyA9IGBTRUxFQ1QgY291bnQoKikgRlJPTSAkMTpuYW1lICR7d2hlcmVQYXR0ZXJufWA7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudC5vbmUocXMsIHZhbHVlcywgYSA9PiArYS5jb3VudCkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgaWYgKGVycm9yLmNvZGUgIT09IFBvc3RncmVzUmVsYXRpb25Eb2VzTm90RXhpc3RFcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzdGluY3QoXG4gICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBTY2hlbWFUeXBlLFxuICAgIHF1ZXJ5OiBRdWVyeVR5cGUsXG4gICAgZmllbGROYW1lOiBzdHJpbmdcbiAgKSB7XG4gICAgZGVidWcoJ2Rpc3RpbmN0JywgY2xhc3NOYW1lLCBxdWVyeSk7XG4gICAgbGV0IGZpZWxkID0gZmllbGROYW1lO1xuICAgIGxldCBjb2x1bW4gPSBmaWVsZE5hbWU7XG4gICAgY29uc3QgaXNOZXN0ZWQgPSBmaWVsZE5hbWUuaW5kZXhPZignLicpID49IDA7XG4gICAgaWYgKGlzTmVzdGVkKSB7XG4gICAgICBmaWVsZCA9IHRyYW5zZm9ybURvdEZpZWxkVG9Db21wb25lbnRzKGZpZWxkTmFtZSkuam9pbignLT4nKTtcbiAgICAgIGNvbHVtbiA9IGZpZWxkTmFtZS5zcGxpdCgnLicpWzBdO1xuICAgIH1cbiAgICBjb25zdCBpc0FycmF5RmllbGQgPVxuICAgICAgc2NoZW1hLmZpZWxkcyAmJlxuICAgICAgc2NoZW1hLmZpZWxkc1tmaWVsZE5hbWVdICYmXG4gICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udHlwZSA9PT0gJ0FycmF5JztcbiAgICBjb25zdCBpc1BvaW50ZXJGaWVsZCA9XG4gICAgICBzY2hlbWEuZmllbGRzICYmXG4gICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0gJiZcbiAgICAgIHNjaGVtYS5maWVsZHNbZmllbGROYW1lXS50eXBlID09PSAnUG9pbnRlcic7XG4gICAgY29uc3QgdmFsdWVzID0gW2ZpZWxkLCBjb2x1bW4sIGNsYXNzTmFtZV07XG4gICAgY29uc3Qgd2hlcmUgPSBidWlsZFdoZXJlQ2xhdXNlKHsgc2NoZW1hLCBxdWVyeSwgaW5kZXg6IDQgfSk7XG4gICAgdmFsdWVzLnB1c2goLi4ud2hlcmUudmFsdWVzKTtcblxuICAgIGNvbnN0IHdoZXJlUGF0dGVybiA9XG4gICAgICB3aGVyZS5wYXR0ZXJuLmxlbmd0aCA+IDAgPyBgV0hFUkUgJHt3aGVyZS5wYXR0ZXJufWAgOiAnJztcbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGlzQXJyYXlGaWVsZCA/ICdqc29uYl9hcnJheV9lbGVtZW50cycgOiAnT04nO1xuICAgIGxldCBxcyA9IGBTRUxFQ1QgRElTVElOQ1QgJHt0cmFuc2Zvcm1lcn0oJDE6bmFtZSkgJDI6bmFtZSBGUk9NICQzOm5hbWUgJHt3aGVyZVBhdHRlcm59YDtcbiAgICBpZiAoaXNOZXN0ZWQpIHtcbiAgICAgIHFzID0gYFNFTEVDVCBESVNUSU5DVCAke3RyYW5zZm9ybWVyfSgkMTpyYXcpICQyOnJhdyBGUk9NICQzOm5hbWUgJHt3aGVyZVBhdHRlcm59YDtcbiAgICB9XG4gICAgZGVidWcocXMsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudFxuICAgICAgLmFueShxcywgdmFsdWVzKVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09IFBvc3RncmVzTWlzc2luZ0NvbHVtbkVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICBpZiAoIWlzTmVzdGVkKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKG9iamVjdCA9PiBvYmplY3RbZmllbGRdICE9PSBudWxsKTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0cy5tYXAob2JqZWN0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXNQb2ludGVyRmllbGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFtmaWVsZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBfX3R5cGU6ICdQb2ludGVyJyxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBzY2hlbWEuZmllbGRzW2ZpZWxkTmFtZV0udGFyZ2V0Q2xhc3MsXG4gICAgICAgICAgICAgIG9iamVjdElkOiBvYmplY3RbZmllbGRdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaGlsZCA9IGZpZWxkTmFtZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICByZXR1cm4gcmVzdWx0cy5tYXAob2JqZWN0ID0+IG9iamVjdFtjb2x1bW5dW2NoaWxkXSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4ocmVzdWx0cyA9PlxuICAgICAgICByZXN1bHRzLm1hcChvYmplY3QgPT5cbiAgICAgICAgICB0aGlzLnBvc3RncmVzT2JqZWN0VG9QYXJzZU9iamVjdChjbGFzc05hbWUsIG9iamVjdCwgc2NoZW1hKVxuICAgICAgICApXG4gICAgICApO1xuICB9XG5cbiAgYWdncmVnYXRlKGNsYXNzTmFtZTogc3RyaW5nLCBzY2hlbWE6IGFueSwgcGlwZWxpbmU6IGFueSkge1xuICAgIGRlYnVnKCdhZ2dyZWdhdGUnLCBjbGFzc05hbWUsIHBpcGVsaW5lKTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbY2xhc3NOYW1lXTtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IDI7XG4gICAgbGV0IGNvbHVtbnM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNvdW50RmllbGQgPSBudWxsO1xuICAgIGxldCBncm91cFZhbHVlcyA9IG51bGw7XG4gICAgbGV0IHdoZXJlUGF0dGVybiA9ICcnO1xuICAgIGxldCBsaW1pdFBhdHRlcm4gPSAnJztcbiAgICBsZXQgc2tpcFBhdHRlcm4gPSAnJztcbiAgICBsZXQgc29ydFBhdHRlcm4gPSAnJztcbiAgICBsZXQgZ3JvdXBQYXR0ZXJuID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaXBlbGluZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc3RhZ2UgPSBwaXBlbGluZVtpXTtcbiAgICAgIGlmIChzdGFnZS4kZ3JvdXApIHtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBpbiBzdGFnZS4kZ3JvdXApIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN0YWdlLiRncm91cFtmaWVsZF07XG4gICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQgPT09ICdfaWQnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICBjb2x1bW5zLnB1c2goYCQke2luZGV4fTpuYW1lIEFTIFwib2JqZWN0SWRcImApO1xuICAgICAgICAgICAgZ3JvdXBQYXR0ZXJuID0gYEdST1VQIEJZICQke2luZGV4fTpuYW1lYDtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRyYW5zZm9ybUFnZ3JlZ2F0ZUZpZWxkKHZhbHVlKSk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGZpZWxkID09PSAnX2lkJyAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAhPT0gMFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZ3JvdXBWYWx1ZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwQnlGaWVsZHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWxpYXMgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gT2JqZWN0LmtleXModmFsdWVbYWxpYXNdKVswXTtcbiAgICAgICAgICAgICAgY29uc3Qgc291cmNlID0gdHJhbnNmb3JtQWdncmVnYXRlRmllbGQodmFsdWVbYWxpYXNdW29wZXJhdGlvbl0pO1xuICAgICAgICAgICAgICBpZiAobW9uZ29BZ2dyZWdhdGVUb1Bvc3RncmVzW29wZXJhdGlvbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwQnlGaWVsZHMuaW5jbHVkZXMoYFwiJHtzb3VyY2V9XCJgKSkge1xuICAgICAgICAgICAgICAgICAgZ3JvdXBCeUZpZWxkcy5wdXNoKGBcIiR7c291cmNlfVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChcbiAgICAgICAgICAgICAgICAgIGBFWFRSQUNUKCR7XG4gICAgICAgICAgICAgICAgICAgIG1vbmdvQWdncmVnYXRlVG9Qb3N0Z3Jlc1tvcGVyYXRpb25dXG4gICAgICAgICAgICAgICAgICB9IEZST00gJCR7aW5kZXh9Om5hbWUgQVQgVElNRSBaT05FICdVVEMnKSBBUyAkJHtpbmRleCArXG4gICAgICAgICAgICAgICAgICAgIDF9Om5hbWVgXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChzb3VyY2UsIGFsaWFzKTtcbiAgICAgICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cFBhdHRlcm4gPSBgR1JPVVAgQlkgJCR7aW5kZXh9OnJhd2A7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChncm91cEJ5RmllbGRzLmpvaW4oKSk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZS4kc3VtKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlLiRzdW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbHVtbnMucHVzaChgU1VNKCQke2luZGV4fTpuYW1lKSBBUyAkJHtpbmRleCArIDF9Om5hbWVgKTtcbiAgICAgICAgICAgICAgdmFsdWVzLnB1c2godHJhbnNmb3JtQWdncmVnYXRlRmllbGQodmFsdWUuJHN1bSksIGZpZWxkKTtcbiAgICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvdW50RmllbGQgPSBmaWVsZDtcbiAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKGBDT1VOVCgqKSBBUyAkJHtpbmRleH06bmFtZWApO1xuICAgICAgICAgICAgICB2YWx1ZXMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZS4kbWF4KSB7XG4gICAgICAgICAgICBjb2x1bW5zLnB1c2goYE1BWCgkJHtpbmRleH06bmFtZSkgQVMgJCR7aW5kZXggKyAxfTpuYW1lYCk7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0cmFuc2Zvcm1BZ2dyZWdhdGVGaWVsZCh2YWx1ZS4kbWF4KSwgZmllbGQpO1xuICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlLiRtaW4pIHtcbiAgICAgICAgICAgIGNvbHVtbnMucHVzaChgTUlOKCQke2luZGV4fTpuYW1lKSBBUyAkJHtpbmRleCArIDF9Om5hbWVgKTtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRyYW5zZm9ybUFnZ3JlZ2F0ZUZpZWxkKHZhbHVlLiRtaW4pLCBmaWVsZCk7XG4gICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUuJGF2Zykge1xuICAgICAgICAgICAgY29sdW1ucy5wdXNoKGBBVkcoJCR7aW5kZXh9Om5hbWUpIEFTICQke2luZGV4ICsgMX06bmFtZWApO1xuICAgICAgICAgICAgdmFsdWVzLnB1c2godHJhbnNmb3JtQWdncmVnYXRlRmllbGQodmFsdWUuJGF2ZyksIGZpZWxkKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5zLnB1c2goJyonKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGFnZS4kcHJvamVjdCkge1xuICAgICAgICBpZiAoY29sdW1ucy5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgICAgY29sdW1ucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgaW4gc3RhZ2UuJHByb2plY3QpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN0YWdlLiRwcm9qZWN0W2ZpZWxkXTtcbiAgICAgICAgICBpZiAodmFsdWUgPT09IDEgfHwgdmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbHVtbnMucHVzaChgJCR7aW5kZXh9Om5hbWVgKTtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhZ2UuJG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0gW107XG4gICAgICAgIGNvbnN0IG9yT3JBbmQgPSBzdGFnZS4kbWF0Y2guaGFzT3duUHJvcGVydHkoJyRvcicpID8gJyBPUiAnIDogJyBBTkQgJztcblxuICAgICAgICBpZiAoc3RhZ2UuJG1hdGNoLiRvcikge1xuICAgICAgICAgIGNvbnN0IGNvbGxhcHNlID0ge307XG4gICAgICAgICAgc3RhZ2UuJG1hdGNoLiRvci5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgICBjb2xsYXBzZVtrZXldID0gZWxlbWVudFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHN0YWdlLiRtYXRjaCA9IGNvbGxhcHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgaW4gc3RhZ2UuJG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBzdGFnZS4kbWF0Y2hbZmllbGRdO1xuICAgICAgICAgIGNvbnN0IG1hdGNoUGF0dGVybnMgPSBbXTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhQYXJzZVRvUG9zZ3Jlc0NvbXBhcmF0b3IpLmZvckVhY2goY21wID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZVtjbXBdKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBnQ29tcGFyYXRvciA9IFBhcnNlVG9Qb3NncmVzQ29tcGFyYXRvcltjbXBdO1xuICAgICAgICAgICAgICBtYXRjaFBhdHRlcm5zLnB1c2goXG4gICAgICAgICAgICAgICAgYCQke2luZGV4fTpuYW1lICR7cGdDb21wYXJhdG9yfSAkJHtpbmRleCArIDF9YFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB2YWx1ZXMucHVzaChmaWVsZCwgdG9Qb3N0Z3Jlc1ZhbHVlKHZhbHVlW2NtcF0pKTtcbiAgICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAobWF0Y2hQYXR0ZXJucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXR0ZXJucy5wdXNoKGAoJHttYXRjaFBhdHRlcm5zLmpvaW4oJyBBTkQgJyl9KWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBzY2hlbWEuZmllbGRzW2ZpZWxkXSAmJlxuICAgICAgICAgICAgc2NoZW1hLmZpZWxkc1tmaWVsZF0udHlwZSAmJlxuICAgICAgICAgICAgbWF0Y2hQYXR0ZXJucy5sZW5ndGggPT09IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBhdHRlcm5zLnB1c2goYCQke2luZGV4fTpuYW1lID0gJCR7aW5kZXggKyAxfWApO1xuICAgICAgICAgICAgdmFsdWVzLnB1c2goZmllbGQsIHZhbHVlKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdoZXJlUGF0dGVybiA9XG4gICAgICAgICAgcGF0dGVybnMubGVuZ3RoID4gMCA/IGBXSEVSRSAke3BhdHRlcm5zLmpvaW4oYCAke29yT3JBbmR9IGApfWAgOiAnJztcbiAgICAgIH1cbiAgICAgIGlmIChzdGFnZS4kbGltaXQpIHtcbiAgICAgICAgbGltaXRQYXR0ZXJuID0gYExJTUlUICQke2luZGV4fWA7XG4gICAgICAgIHZhbHVlcy5wdXNoKHN0YWdlLiRsaW1pdCk7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICB9XG4gICAgICBpZiAoc3RhZ2UuJHNraXApIHtcbiAgICAgICAgc2tpcFBhdHRlcm4gPSBgT0ZGU0VUICQke2luZGV4fWA7XG4gICAgICAgIHZhbHVlcy5wdXNoKHN0YWdlLiRza2lwKTtcbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGFnZS4kc29ydCkge1xuICAgICAgICBjb25zdCBzb3J0ID0gc3RhZ2UuJHNvcnQ7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzb3J0KTtcbiAgICAgICAgY29uc3Qgc29ydGluZyA9IGtleXNcbiAgICAgICAgICAubWFwKGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHNvcnRba2V5XSA9PT0gMSA/ICdBU0MnIDogJ0RFU0MnO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXIgPSBgJCR7aW5kZXh9Om5hbWUgJHt0cmFuc2Zvcm1lcn1gO1xuICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgIHJldHVybiBvcmRlcjtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKCk7XG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLmtleXMpO1xuICAgICAgICBzb3J0UGF0dGVybiA9XG4gICAgICAgICAgc29ydCAhPT0gdW5kZWZpbmVkICYmIHNvcnRpbmcubGVuZ3RoID4gMCA/IGBPUkRFUiBCWSAke3NvcnRpbmd9YCA6ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHFzID0gYFNFTEVDVCAke2NvbHVtbnMuam9pbigpfSBGUk9NICQxOm5hbWUgJHt3aGVyZVBhdHRlcm59ICR7c29ydFBhdHRlcm59ICR7bGltaXRQYXR0ZXJufSAke3NraXBQYXR0ZXJufSAke2dyb3VwUGF0dGVybn1gO1xuICAgIGRlYnVnKHFzLCB2YWx1ZXMpO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRcbiAgICAgIC5tYXAocXMsIHZhbHVlcywgYSA9PlxuICAgICAgICB0aGlzLnBvc3RncmVzT2JqZWN0VG9QYXJzZU9iamVjdChjbGFzc05hbWUsIGEsIHNjaGVtYSlcbiAgICAgIClcbiAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnb2JqZWN0SWQnKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm9iamVjdElkID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGdyb3VwVmFsdWVzKSB7XG4gICAgICAgICAgICByZXN1bHQub2JqZWN0SWQgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGdyb3VwVmFsdWVzKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5vYmplY3RJZFtrZXldID0gcmVzdWx0W2tleV07XG4gICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvdW50RmllbGQpIHtcbiAgICAgICAgICAgIHJlc3VsdFtjb3VudEZpZWxkXSA9IHBhcnNlSW50KHJlc3VsdFtjb3VudEZpZWxkXSwgMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gIH1cblxuICBwZXJmb3JtSW5pdGlhbGl6YXRpb24oeyBWb2xhdGlsZUNsYXNzZXNTY2hlbWFzIH06IGFueSkge1xuICAgIC8vIFRPRE86IFRoaXMgbWV0aG9kIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB0byBtYWtlIHByb3BlciB1c2Ugb2YgY29ubmVjdGlvbnMgKEB2aXRhbHktdClcbiAgICBkZWJ1ZygncGVyZm9ybUluaXRpYWxpemF0aW9uJyk7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBWb2xhdGlsZUNsYXNzZXNTY2hlbWFzLm1hcChzY2hlbWEgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVGFibGUoc2NoZW1hLmNsYXNzTmFtZSwgc2NoZW1hKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBlcnIuY29kZSA9PT0gUG9zdGdyZXNEdXBsaWNhdGVSZWxhdGlvbkVycm9yIHx8XG4gICAgICAgICAgICBlcnIuY29kZSA9PT0gUGFyc2UuRXJyb3IuSU5WQUxJRF9DTEFTU19OQU1FXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5zY2hlbWFVcGdyYWRlKHNjaGVtYS5jbGFzc05hbWUsIHNjaGVtYSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC50eCgncGVyZm9ybS1pbml0aWFsaXphdGlvbicsIHQgPT4ge1xuICAgICAgICAgIHJldHVybiB0LmJhdGNoKFtcbiAgICAgICAgICAgIHQubm9uZShzcWwubWlzYy5qc29uT2JqZWN0U2V0S2V5cyksXG4gICAgICAgICAgICB0Lm5vbmUoc3FsLmFycmF5LmFkZCksXG4gICAgICAgICAgICB0Lm5vbmUoc3FsLmFycmF5LmFkZFVuaXF1ZSksXG4gICAgICAgICAgICB0Lm5vbmUoc3FsLmFycmF5LnJlbW92ZSksXG4gICAgICAgICAgICB0Lm5vbmUoc3FsLmFycmF5LmNvbnRhaW5zQWxsKSxcbiAgICAgICAgICAgIHQubm9uZShzcWwuYXJyYXkuY29udGFpbnNBbGxSZWdleCksXG4gICAgICAgICAgICB0Lm5vbmUoc3FsLmFycmF5LmNvbnRhaW5zKSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGRlYnVnKGBpbml0aWFsaXphdGlvbkRvbmUgaW4gJHtkYXRhLmR1cmF0aW9ufWApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUluZGV4ZXMoY2xhc3NOYW1lOiBzdHJpbmcsIGluZGV4ZXM6IGFueSwgY29ubjogP2FueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoY29ubiB8fCB0aGlzLl9jbGllbnQpLnR4KHQgPT5cbiAgICAgIHQuYmF0Y2goXG4gICAgICAgIGluZGV4ZXMubWFwKGkgPT4ge1xuICAgICAgICAgIHJldHVybiB0Lm5vbmUoJ0NSRUFURSBJTkRFWCAkMTpuYW1lIE9OICQyOm5hbWUgKCQzOm5hbWUpJywgW1xuICAgICAgICAgICAgaS5uYW1lLFxuICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgaS5rZXksXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGNyZWF0ZUluZGV4ZXNJZk5lZWRlZChcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgICB0eXBlOiBhbnksXG4gICAgY29ubjogP2FueVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGNvbm4gfHwgdGhpcy5fY2xpZW50KS5ub25lKFxuICAgICAgJ0NSRUFURSBJTkRFWCAkMTpuYW1lIE9OICQyOm5hbWUgKCQzOm5hbWUpJyxcbiAgICAgIFtmaWVsZE5hbWUsIGNsYXNzTmFtZSwgdHlwZV1cbiAgICApO1xuICB9XG5cbiAgZHJvcEluZGV4ZXMoY2xhc3NOYW1lOiBzdHJpbmcsIGluZGV4ZXM6IGFueSwgY29ubjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcXVlcmllcyA9IGluZGV4ZXMubWFwKGkgPT4gKHtcbiAgICAgIHF1ZXJ5OiAnRFJPUCBJTkRFWCAkMTpuYW1lJyxcbiAgICAgIHZhbHVlczogaSxcbiAgICB9KSk7XG4gICAgcmV0dXJuIChjb25uIHx8IHRoaXMuX2NsaWVudCkudHgodCA9PlxuICAgICAgdC5ub25lKHRoaXMuX3BncC5oZWxwZXJzLmNvbmNhdChxdWVyaWVzKSlcbiAgICApO1xuICB9XG5cbiAgZ2V0SW5kZXhlcyhjbGFzc05hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHFzID0gJ1NFTEVDVCAqIEZST00gcGdfaW5kZXhlcyBXSEVSRSB0YWJsZW5hbWUgPSAke2NsYXNzTmFtZX0nO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnQuYW55KHFzLCB7IGNsYXNzTmFtZSB9KTtcbiAgfVxuXG4gIHVwZGF0ZVNjaGVtYVdpdGhJbmRleGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0UG9seWdvblRvU1FMKHBvbHlnb24pIHtcbiAgaWYgKHBvbHlnb24ubGVuZ3RoIDwgMykge1xuICAgIHRocm93IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgIGBQb2x5Z29uIG11c3QgaGF2ZSBhdCBsZWFzdCAzIHZhbHVlc2BcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBwb2x5Z29uWzBdWzBdICE9PSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMV1bMF0gfHxcbiAgICBwb2x5Z29uWzBdWzFdICE9PSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMV1bMV1cbiAgKSB7XG4gICAgcG9seWdvbi5wdXNoKHBvbHlnb25bMF0pO1xuICB9XG4gIGNvbnN0IHVuaXF1ZSA9IHBvbHlnb24uZmlsdGVyKChpdGVtLCBpbmRleCwgYXIpID0+IHtcbiAgICBsZXQgZm91bmRJbmRleCA9IC0xO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHB0ID0gYXJbaV07XG4gICAgICBpZiAocHRbMF0gPT09IGl0ZW1bMF0gJiYgcHRbMV0gPT09IGl0ZW1bMV0pIHtcbiAgICAgICAgZm91bmRJbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm91bmRJbmRleCA9PT0gaW5kZXg7XG4gIH0pO1xuICBpZiAodW5pcXVlLmxlbmd0aCA8IDMpIHtcbiAgICB0aHJvdyBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICBQYXJzZS5FcnJvci5JTlRFUk5BTF9TRVJWRVJfRVJST1IsXG4gICAgICAnR2VvSlNPTjogTG9vcCBtdXN0IGhhdmUgYXQgbGVhc3QgMyBkaWZmZXJlbnQgdmVydGljZXMnXG4gICAgKTtcbiAgfVxuICBjb25zdCBwb2ludHMgPSBwb2x5Z29uXG4gICAgLm1hcChwb2ludCA9PiB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUocGFyc2VGbG9hdChwb2ludFsxXSksIHBhcnNlRmxvYXQocG9pbnRbMF0pKTtcbiAgICAgIHJldHVybiBgKCR7cG9pbnRbMV19LCAke3BvaW50WzBdfSlgO1xuICAgIH0pXG4gICAgLmpvaW4oJywgJyk7XG4gIHJldHVybiBgKCR7cG9pbnRzfSlgO1xufVxuXG5mdW5jdGlvbiByZW1vdmVXaGl0ZVNwYWNlKHJlZ2V4KSB7XG4gIGlmICghcmVnZXguZW5kc1dpdGgoJ1xcbicpKSB7XG4gICAgcmVnZXggKz0gJ1xcbic7XG4gIH1cblxuICAvLyByZW1vdmUgbm9uIGVzY2FwZWQgY29tbWVudHNcbiAgcmV0dXJuIChcbiAgICByZWdleFxuICAgICAgLnJlcGxhY2UoLyhbXlxcXFxdKSMuKlxcbi9naW0sICckMScpXG4gICAgICAvLyByZW1vdmUgbGluZXMgc3RhcnRpbmcgd2l0aCBhIGNvbW1lbnRcbiAgICAgIC5yZXBsYWNlKC9eIy4qXFxuL2dpbSwgJycpXG4gICAgICAvLyByZW1vdmUgbm9uIGVzY2FwZWQgd2hpdGVzcGFjZVxuICAgICAgLnJlcGxhY2UoLyhbXlxcXFxdKVxccysvZ2ltLCAnJDEnKVxuICAgICAgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgYXQgdGhlIGJlZ2lubmluZyBvZiBhIGxpbmVcbiAgICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKVxuICAgICAgLnRyaW0oKVxuICApO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzUmVnZXhQYXR0ZXJuKHMpIHtcbiAgaWYgKHMgJiYgcy5zdGFydHNXaXRoKCdeJykpIHtcbiAgICAvLyByZWdleCBmb3Igc3RhcnRzV2l0aFxuICAgIHJldHVybiAnXicgKyBsaXRlcmFsaXplUmVnZXhQYXJ0KHMuc2xpY2UoMSkpO1xuICB9IGVsc2UgaWYgKHMgJiYgcy5lbmRzV2l0aCgnJCcpKSB7XG4gICAgLy8gcmVnZXggZm9yIGVuZHNXaXRoXG4gICAgcmV0dXJuIGxpdGVyYWxpemVSZWdleFBhcnQocy5zbGljZSgwLCBzLmxlbmd0aCAtIDEpKSArICckJztcbiAgfVxuXG4gIC8vIHJlZ2V4IGZvciBjb250YWluc1xuICByZXR1cm4gbGl0ZXJhbGl6ZVJlZ2V4UGFydChzKTtcbn1cblxuZnVuY3Rpb24gaXNTdGFydHNXaXRoUmVnZXgodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnIHx8ICF2YWx1ZS5zdGFydHNXaXRoKCdeJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBtYXRjaGVzID0gdmFsdWUubWF0Y2goL1xcXlxcXFxRLipcXFxcRS8pO1xuICByZXR1cm4gISFtYXRjaGVzO1xufVxuXG5mdW5jdGlvbiBpc0FsbFZhbHVlc1JlZ2V4T3JOb25lKHZhbHVlcykge1xuICBpZiAoIXZhbHVlcyB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGZpcnN0VmFsdWVzSXNSZWdleCA9IGlzU3RhcnRzV2l0aFJlZ2V4KHZhbHVlc1swXS4kcmVnZXgpO1xuICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmaXJzdFZhbHVlc0lzUmVnZXg7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMSwgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGZpcnN0VmFsdWVzSXNSZWdleCAhPT0gaXNTdGFydHNXaXRoUmVnZXgodmFsdWVzW2ldLiRyZWdleCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNBbnlWYWx1ZVJlZ2V4U3RhcnRzV2l0aCh2YWx1ZXMpIHtcbiAgcmV0dXJuIHZhbHVlcy5zb21lKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzU3RhcnRzV2l0aFJlZ2V4KHZhbHVlLiRyZWdleCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXRlcmFsUmVnZXgocmVtYWluaW5nKSB7XG4gIHJldHVybiByZW1haW5pbmdcbiAgICAuc3BsaXQoJycpXG4gICAgLm1hcChjID0+IHtcbiAgICAgIGlmIChjLm1hdGNoKC9bMC05YS16QS1aXS8pICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGRvbid0IGVzY2FwZSBhbHBoYW51bWVyaWMgY2hhcmFjdGVyc1xuICAgICAgICByZXR1cm4gYztcbiAgICAgIH1cbiAgICAgIC8vIGVzY2FwZSBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZSBxdW90ZXMgd2l0aCBzaW5nbGUgcXVvdGVzLCBldmVyeXRoaW5nIGVsc2Ugd2l0aCBhIGJhY2tzbGFzaClcbiAgICAgIHJldHVybiBjID09PSBgJ2AgPyBgJydgIDogYFxcXFwke2N9YDtcbiAgICB9KVxuICAgIC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gbGl0ZXJhbGl6ZVJlZ2V4UGFydChzOiBzdHJpbmcpIHtcbiAgY29uc3QgbWF0Y2hlcjEgPSAvXFxcXFEoKD8hXFxcXEUpLiopXFxcXEUkLztcbiAgY29uc3QgcmVzdWx0MTogYW55ID0gcy5tYXRjaChtYXRjaGVyMSk7XG4gIGlmIChyZXN1bHQxICYmIHJlc3VsdDEubGVuZ3RoID4gMSAmJiByZXN1bHQxLmluZGV4ID4gLTEpIHtcbiAgICAvLyBwcm9jZXNzIHJlZ2V4IHRoYXQgaGFzIGEgYmVnaW5uaW5nIGFuZCBhbiBlbmQgc3BlY2lmaWVkIGZvciB0aGUgbGl0ZXJhbCB0ZXh0XG4gICAgY29uc3QgcHJlZml4ID0gcy5zdWJzdHIoMCwgcmVzdWx0MS5pbmRleCk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gcmVzdWx0MVsxXTtcblxuICAgIHJldHVybiBsaXRlcmFsaXplUmVnZXhQYXJ0KHByZWZpeCkgKyBjcmVhdGVMaXRlcmFsUmVnZXgocmVtYWluaW5nKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgcmVnZXggdGhhdCBoYXMgYSBiZWdpbm5pbmcgc3BlY2lmaWVkIGZvciB0aGUgbGl0ZXJhbCB0ZXh0XG4gIGNvbnN0IG1hdGNoZXIyID0gL1xcXFxRKCg/IVxcXFxFKS4qKSQvO1xuICBjb25zdCByZXN1bHQyOiBhbnkgPSBzLm1hdGNoKG1hdGNoZXIyKTtcbiAgaWYgKHJlc3VsdDIgJiYgcmVzdWx0Mi5sZW5ndGggPiAxICYmIHJlc3VsdDIuaW5kZXggPiAtMSkge1xuICAgIGNvbnN0IHByZWZpeCA9IHMuc3Vic3RyKDAsIHJlc3VsdDIuaW5kZXgpO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IHJlc3VsdDJbMV07XG5cbiAgICByZXR1cm4gbGl0ZXJhbGl6ZVJlZ2V4UGFydChwcmVmaXgpICsgY3JlYXRlTGl0ZXJhbFJlZ2V4KHJlbWFpbmluZyk7XG4gIH1cblxuICAvLyByZW1vdmUgYWxsIGluc3RhbmNlcyBvZiBcXFEgYW5kIFxcRSBmcm9tIHRoZSByZW1haW5pbmcgdGV4dCAmIGVzY2FwZSBzaW5nbGUgcXVvdGVzXG4gIHJldHVybiBzXG4gICAgLnJlcGxhY2UoLyhbXlxcXFxdKShcXFxcRSkvLCAnJDEnKVxuICAgIC5yZXBsYWNlKC8oW15cXFxcXSkoXFxcXFEpLywgJyQxJylcbiAgICAucmVwbGFjZSgvXlxcXFxFLywgJycpXG4gICAgLnJlcGxhY2UoL15cXFxcUS8sICcnKVxuICAgIC5yZXBsYWNlKC8oW14nXSknLywgYCQxJydgKVxuICAgIC5yZXBsYWNlKC9eJyhbXiddKS8sIGAnJyQxYCk7XG59XG5cbnZhciBHZW9Qb2ludENvZGVyID0ge1xuICBpc1ZhbGlkSlNPTih2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLl9fdHlwZSA9PT0gJ0dlb1BvaW50J1xuICAgICk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQb3N0Z3Jlc1N0b3JhZ2VBZGFwdGVyO1xuIl19