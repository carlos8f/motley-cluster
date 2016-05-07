module.exports = {
  _ns: 'motley',
  _folder: 'site',

  '@listen': require('./listen'),
  '@mountMiddleware': require('./mountMiddleware'),
  'disconnectCluster': require('./disconnectCluster')
}