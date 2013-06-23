Package.describe({
  summary: 'Simple in-project depencency manager'
});

Package.on_use(function(api) {
  api.use(['meteor', 'underscore'], ['client', 'server']);

  api.add_files('module.js', ['client', 'server']);
});
