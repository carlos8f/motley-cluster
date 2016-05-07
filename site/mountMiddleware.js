var cluster = require('cluster')

module.exports = function container (get, set) {
  return function alter (mountMiddleware) {
    return function mountMiddlewareClustered (cb) {
      if (cluster.isMaster) {
        setImmediate(cb)
      }
      else mountMiddleware(cb)
    }
  }
}