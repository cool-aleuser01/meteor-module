# Meteor-Module
Meteor-Module is designed to solve the problem of inter-file dependencies in large meteor projects.  I have often found that I want to share code between files in my Meteor project, however it has been frustrating to do as they must be passed in the global namespace (and thus avaliable to all files).  What is more, I have to be certain that the code has already been loaded before using it, so I must pay attention to the load order of files.

In the past, I have resorted to using Meteor smart packages for this shared code, to ensure that it has been run before any of my project's code, however it has never felt appropriate to place project-specific code into smart packages.

My solution is a very simple module based dependency system for large meteor projects.

Meteor-Module uses one global variable, `module`, and is very simplistic.

## Usage
```javascript
/* shared.js */
// Define a named module.
// This module will be automatically run, even if it is not used
// The module will not be run more than once
module('shared', function() {
  // The return value will be exported
  // It will be returned when the function is used
  return {
    sum: function() {
      var sum = 0;
      for (var i=0; i<arguments.length; i++) {
        sum += arguments[i];
      }
      return sum;
    }
  };
});

// Define a named module.
// This module will not be run until it is used
// The module will not be run more than once
module('secret', false, function() {
  console.log('Someone used the top secret module!');
});

/* app.js */
// Define an anonymous module.
// This module will not be run until the event loop is idle
// This means that all other modules should be defined at this time
module(function() {
  // Depend on a named module
  // If the module has not been executed yet, it will be now
  // The exports from the module will be returned
  var shared = module('shared');

  console.log(shared.sum(1, 3, 5, 6, 8, 9));
});
```
## API Reference
### `module('moduleName')`
Use the module 'moduleName'.  Returns the module's exports.

### `module('moduleName', [autorun,] function() {})`
Define the module 'moduleName' to be the passed function.  If `autorun` is truthy, the module will be executed when the event loop is idle.  If `autorun` is not passed, it will default to `true`.  The return value of the module will be returned when the module is used with `module('moduleName')`.

### `module(function() {})`
Define an anonymous module to be the passed function.  It will be executed when the event loop is idle.  This is currently identical to running `Meteor.defer(function() {});`

## Word of Warning
Meteor-Module will not make any effort to prevent cyclic dependencies.  Code like the following will hang.

```javascript
module('a', function() {
  module('b');
});

module('b', function() {
  module('a');
});
```

## Licence
(The MIT License)

Copyright (c) 2013 Michael Layzell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
