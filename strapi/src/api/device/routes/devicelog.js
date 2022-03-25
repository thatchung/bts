module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/devices-log',
      handler: 'devicelog.getLogData',
    }
  ]
}