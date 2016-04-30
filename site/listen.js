var cluster = require('cluster')

module.exports = function container (get) {
  return function alter (listen) {
    return function task (cb) {
      var options = get('conf.site.cluster')

      if (cluster.isMaster) {
        if (options.workers === 'auto') options.workers = require('os').cpus().length
        cluster.on('exit', function (worker, code, signal) {
          var exitCode = worker.process.exitCode
          if (worker.exitedAfterDisconnect) {
            console.error('motley-cluster: worker ' + worker.id + ' exited after disconnect.')
          }
          else if (options.respawn) {
            console.error('motley-cluster: worker ' + worker.id + ' died (' + exitCode + '). respawning...')
            cluster.fork()
          }
          else {
            console.error('motley-cluster: worker ' + worker.id + ' died (' + exitCode + '). crashing...')
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
      else listen(cb)
    }
  }
}