const Eureka = require('eureka-js-client').Eureka;

// Configuration du client Eureka
const eurekaClient = new Eureka({
  instance: {
    app: process.env.APP_NAME || 'complaint-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': process.env.APP_PORT || 3000,
      '@enabled': true,
    },
    vipAddress: process.env.APP_NAME || 'complaint-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'localhost',
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

module.exports = eurekaClient;
