const Eureka = require('eureka-js-client').Eureka;
const os = require('os');
const fs = require('fs');

// Function to extract Docker container ID for instanceId
function getDockerContainerId() {
  try {
    return fs.readFileSync('/proc/self/cgroup', 'utf8')
      .split('\n')
      .find(line => line.includes('docker'))
      ?.split('/')?.pop()?.substring(0, 12) || 'manualid';
  } catch (err) {
    return 'manualid';
  }
}

const APP_NAME = process.env.APP_NAME || 'complaint-service';
const APP_PORT = process.env.APP_PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'complaint-service';
const IP_ADDR = process.env.IP_ADDR || '127.0.0.1';
const EUREKA_HOST = process.env.EUREKA_HOST || 'eureka-server';
const EUREKA_PORT = process.env.EUREKA_PORT || 8761;

const containerId = getDockerContainerId();

const eurekaClient = new Eureka({
  instance: {
    instanceId: `${containerId}:${APP_NAME}:${APP_PORT}`,
    app: APP_NAME.toUpperCase(),
    hostName: HOST_NAME,
    ipAddr: IP_ADDR,
    port: {
      '$': APP_PORT,
      '@enabled': true,
    },
    vipAddress: APP_NAME,
    statusPageUrl: `http://${HOST_NAME}:${APP_PORT}`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: EUREKA_HOST,
    port: EUREKA_PORT,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

module.exports = eurekaClient;
