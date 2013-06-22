var modules = {};
var exports = {};

var runModule = function(name) {
  exports[name] = {};
  _.bind(modules[name], exports[name])();
};

function require(name) {
  if (exports[name]) {
    return exports[name];
  } else {
    if (modules[name]) {
      runModule(name);
    } else {
      throw 'Cannot require module `'+name+'`, as it does not exist';
    }
  }
}

_.extend(require, {
  register: function(name, module) {
    if (modules[name]) {
      throw 'Cannot register module `'+name+'`, as it already exists';
    }
    modules[name] = module;

    setTimeout(0, function() {
      // Run the module if it has not already been run
      // Set this in the context of the module to the exports for 
      // the module.
      if (!exports[name]) {
        runModule(name);
      }
    });
  }
});
