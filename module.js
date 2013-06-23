var modules = {};
var exports = {};

// Internal Helper Functions
var runModule = function(name) {
  var toexport = modules[name]();
  if (typeof toexport === 'undefined') {
    toexport = {};
  }

  exports[name] = toexport;
};

var use = function(name) {
  if (typeof exports[name] !== 'undefined') {
    return exports[name];
  } else {
    if (modules[name]) {
      runModule(name);
    } else {
      throw 'Cannot use module `'+name+'`, as it does not exist';
    }
  }
};

var register = function(name, module, autorun) {
  if (modules[name]) {
    throw 'Cannot register module `'+name+'`, as it already exists';
  }

  modules[name] = module;

  if (autorun) {
    Meteor.defer(function() {
      use(name);
    });
  }
};

module = function module() {
  switch (arguments.length) {
    case 1:
      if (typeof arguments[0] === 'function') {
        // Anonymous module definition
        Meteor.defer(arguments[0]);
      } else {
        // Module usage
        return use(arguments[0]);
      }
      break;
    case 2:
      // Named module definition
      register(arguments[0], arguments[1], true);
      break;
    case 3:
      // Named module definition, with autorun set
      register(arguments[0], arguments[2], arguments[1]);
      break;
    default:
      throw 'module() only accepts 1, 2 or 3 arguments';
  }
};
