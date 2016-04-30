module.exports = {
  _ns: 'motley',
  _folder: 'conf',

  'site.cluster': {
    workers: 'auto', // ex: 8
    respawn: false, // by default, the main process crashes if any of the workers crash. set to true to optimistically respawn workers.
    setuid: null, // requires root. ex: 'nobody'
    setgid: null // requires root. ex: 'nogroup'
  }
}