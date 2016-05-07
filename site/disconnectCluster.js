var cluster = require('cluster')

module.exports = function container (get, set) {
  return function disconnectCluster (cb) {
    if (cluster.isMaster && get('hooks.listened')) {
      get('console').log('motley-cluster: disconnecting cluster...')
      cluster.disconnect(function (err) {
        if (err) return cb(err)
        get('console').log('motley-cluster: disconnected.')
        cb()
      })
    }
    else setImmediate(cb)
  }
}