"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _commander = _interopRequireDefault(require("./commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logStartupOptions(options) {
  for (const key in options) {
    let value = options[key];

    if (key == 'masterKey') {
      value = '***REDACTED***';
    }

    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        if (value && value.constructor && value.constructor.name) {
          value = value.constructor.name;
        }
      }
    }
    /* eslint-disable no-console */


    console.log(`${key}: ${value}`);
    /* eslint-enable no-console */
  }
}

function _default({
  definitions,
  help,
  usage,
  start
}) {
  _commander.default.loadDefinitions(definitions);

  if (usage) {
    _commander.default.usage(usage);
  }

  if (help) {
    _commander.default.on('--help', help);
  }

  _commander.default.parse(process.argv, process.env);

  const options = _commander.default.getOptions();

  start(_commander.default, options, function () {
    logStartupOptions(options);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvdXRpbHMvcnVubmVyLmpzIl0sIm5hbWVzIjpbImxvZ1N0YXJ0dXBPcHRpb25zIiwib3B0aW9ucyIsImtleSIsInZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsImUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJjb25zb2xlIiwibG9nIiwiZGVmaW5pdGlvbnMiLCJoZWxwIiwidXNhZ2UiLCJzdGFydCIsInByb2dyYW0iLCJsb2FkRGVmaW5pdGlvbnMiLCJvbiIsInBhcnNlIiwicHJvY2VzcyIsImFyZ3YiLCJlbnYiLCJnZXRPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQSxTQUFTQSxpQkFBVCxDQUEyQkMsT0FBM0IsRUFBb0M7QUFDbEMsT0FBSyxNQUFNQyxHQUFYLElBQWtCRCxPQUFsQixFQUEyQjtBQUN6QixRQUFJRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQ0MsR0FBRCxDQUFuQjs7QUFDQSxRQUFJQSxHQUFHLElBQUksV0FBWCxFQUF3QjtBQUN0QkMsTUFBQUEsS0FBSyxHQUFHLGdCQUFSO0FBQ0Q7O0FBQ0QsUUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLFVBQUk7QUFDRkEsUUFBQUEsS0FBSyxHQUFHQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsS0FBZixDQUFSO0FBQ0QsT0FGRCxDQUVFLE9BQU9HLENBQVAsRUFBVTtBQUNWLFlBQUlILEtBQUssSUFBSUEsS0FBSyxDQUFDSSxXQUFmLElBQThCSixLQUFLLENBQUNJLFdBQU4sQ0FBa0JDLElBQXBELEVBQTBEO0FBQ3hETCxVQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0ksV0FBTixDQUFrQkMsSUFBMUI7QUFDRDtBQUNGO0FBQ0Y7QUFDRDs7O0FBQ0FDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLEdBQUVSLEdBQUksS0FBSUMsS0FBTSxFQUE3QjtBQUNBO0FBQ0Q7QUFDRjs7QUFFYyxrQkFBUztBQUFFUSxFQUFBQSxXQUFGO0FBQWVDLEVBQUFBLElBQWY7QUFBcUJDLEVBQUFBLEtBQXJCO0FBQTRCQyxFQUFBQTtBQUE1QixDQUFULEVBQThDO0FBQzNEQyxxQkFBUUMsZUFBUixDQUF3QkwsV0FBeEI7O0FBQ0EsTUFBSUUsS0FBSixFQUFXO0FBQ1RFLHVCQUFRRixLQUFSLENBQWNBLEtBQWQ7QUFDRDs7QUFDRCxNQUFJRCxJQUFKLEVBQVU7QUFDUkcsdUJBQVFFLEVBQVIsQ0FBVyxRQUFYLEVBQXFCTCxJQUFyQjtBQUNEOztBQUNERyxxQkFBUUcsS0FBUixDQUFjQyxPQUFPLENBQUNDLElBQXRCLEVBQTRCRCxPQUFPLENBQUNFLEdBQXBDOztBQUVBLFFBQU1wQixPQUFPLEdBQUdjLG1CQUFRTyxVQUFSLEVBQWhCOztBQUNBUixFQUFBQSxLQUFLLENBQUNDLGtCQUFELEVBQVVkLE9BQVYsRUFBbUIsWUFBVztBQUNqQ0QsSUFBQUEsaUJBQWlCLENBQUNDLE9BQUQsQ0FBakI7QUFDRCxHQUZJLENBQUw7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwcm9ncmFtIGZyb20gJy4vY29tbWFuZGVyJztcblxuZnVuY3Rpb24gbG9nU3RhcnR1cE9wdGlvbnMob3B0aW9ucykge1xuICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgbGV0IHZhbHVlID0gb3B0aW9uc1trZXldO1xuICAgIGlmIChrZXkgPT0gJ21hc3RlcktleScpIHtcbiAgICAgIHZhbHVlID0gJyoqKlJFREFDVEVEKioqJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgY29uc29sZS5sb2coYCR7a2V5fTogJHt2YWx1ZX1gKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih7IGRlZmluaXRpb25zLCBoZWxwLCB1c2FnZSwgc3RhcnQgfSkge1xuICBwcm9ncmFtLmxvYWREZWZpbml0aW9ucyhkZWZpbml0aW9ucyk7XG4gIGlmICh1c2FnZSkge1xuICAgIHByb2dyYW0udXNhZ2UodXNhZ2UpO1xuICB9XG4gIGlmIChoZWxwKSB7XG4gICAgcHJvZ3JhbS5vbignLS1oZWxwJywgaGVscCk7XG4gIH1cbiAgcHJvZ3JhbS5wYXJzZShwcm9jZXNzLmFyZ3YsIHByb2Nlc3MuZW52KTtcblxuICBjb25zdCBvcHRpb25zID0gcHJvZ3JhbS5nZXRPcHRpb25zKCk7XG4gIHN0YXJ0KHByb2dyYW0sIG9wdGlvbnMsIGZ1bmN0aW9uKCkge1xuICAgIGxvZ1N0YXJ0dXBPcHRpb25zKG9wdGlvbnMpO1xuICB9KTtcbn1cbiJdfQ==