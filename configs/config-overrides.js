module.exports = function override(config, env) {
  config.plugins = config.plugins.map(plugin => {
    if (plugin.definitions && plugin.definitions['process.env']) {
      plugin.definitions['process.env'].REACT_APP_PATH = JSON.stringify(process.cwd())
    }

    return plugin
  })

  return config
}
