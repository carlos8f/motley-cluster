var cluster = require('cluster')

module.exports = function container (get) {
  return function alter (listen) {
    return function listenClustered (cb) {
      var options = get('conf.site.cluster')

      if (cluster.isMaster) {
        if (options.workers === 'auto') options.workers = require('os').cpus().length
        cluster.on('exit', function (worker, code, signal) {
          var exitCode = worker.process.exitCode
          if (!exitCode) {
            get('console').error('motley-cluster: worker ' + worker.id + ' exited (' + exitCode + ').')
          }
          else if (options.respawn) {
            get('console').error('motley-cluster: worker ' + worker.id + ' crashed (' + exitCode + '). respawning...')
            cluster.fork()
          }
          else {
            get('console').error('motley-cluster: worker ' + worker.id + ' crashed (' + exitCode + '). crashing...')
            cluster.disconnect(function () {
              process.exit(1)
            })
          }
        })
        for (var i = 0; i < options.workers; i++) {
          cluster.fork()
        }
        setImmediate(cb)
      }
      else {
        listen(function (err) {
          if (err) return cb(err)
          if (options.setgid) process.setgid(options.setgid)
          if (options.setuid) process.setuid(options.setuid)
          setImmediate(cb)
        })
      }
    }
  }
}