var cluster = require('cluster')

module.exports = function container (get) {
  return function alter (_listen) {
    return function task (cb) {
      var options = get('conf.site.cluster')

      if (cluster.isMaster) {
        if (options.workers === 'auto') options.workers = require('os').cpus().length
        cluster.on('disconnect', function (worker) {
          console.error('motley-cluster: worker ' + worker.process.pid + ' disconnected. killing...')
          worker.kill()
        })
        cluster.on('exit', function (worker, code, signal) {
          var exitCode = worker.process.exitCode
          if (worker.exitedAfterDisconnect) {
            console.error('motley-cluster: worker ' + worker.process.pid + ' exited after disconnect.')
          }
          else if (options.respawn) {
            console.error('worker ' + worker.process.pid + ' died (' + exitCode + '). respawning...')
            cluster.fork()
          }
          else {
            console.error('worker ' + worker.process.pid + ' died (' + exitCode + '). crashing...')
            process.stderr.once('drain', function () {
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
        cb()
      }
    }
  }
}