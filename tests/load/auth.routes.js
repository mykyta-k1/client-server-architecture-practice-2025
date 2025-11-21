const { randomUUID } = require('node:crypto');
const autocannon = require('autocannon');

const loginBody = JSON.stringify({
  username: randomUUID().slice(0, 32),
  password: randomUUID().slice(0, 32),
});

const registerBody = JSON.stringify({
  username: randomUUID().slice(0, 32),
  email: `${randomUUID().slice(0, 16)}@example.com`,
  password: randomUUID().slice(0, 32),
});

function logSummary(result) {
  const summary = `
  ======================================================
  📅 Duration: ${result.duration}s
  👥 Connections: ${result.connections}
  🔁 Total Requests Sent: ${result.requests.sent}
  ------------------------------------------------------
  💀 Errors: ${result.errors}
  ------------------------------------------------------
  🚦 Status Codes:
      - 1xx: ${result['1xx'] || 0}
      - 2xx: ${result['2xx'] || 0}
      - 3xx: ${result['3xx'] || 0}
      - 4xx: ${result['4xx'] || 0}
      - 5xx: ${result['5xx'] || 0}
  📈 Requests per Second: ${result.requests.average || 0}
  🕒 Average Latency (ms): ${result.latency.average || 0}
  🔄 Total Throughput (bytes): ${result.throughput.total || 0}
  `;

  console.log(summary);
}

// Configurations for each load test
/**
 * @type {Array<import('autocannon').Options>}
 */
const testConfigs = [
  {
    title: 'Login Test',
    url: 'https://localhost/api/auth/login',
    method: 'POST',
    connections: 100,
    duration: 30,
    servername: 'localhost',
    tlsOptions: { rejectUnauthorized: false }, // self-signed
    headers: { 'content-type': 'application/json', host: 'localhost' },
    body: loginBody,
  },
  {
    title: 'Registration Test',
    url: 'https://localhost/api/auth/register',
    method: 'POST',
    connections: 100,
    duration: 30,
    servername: 'localhost',
    tlsOptions: { rejectUnauthorized: false }, // self-signed
    headers: { 'content-type': 'application/json', host: 'localhost' },
    body: registerBody,
  },
  {
    title: 'Protected Route Test',
    url: 'https://localhost/api/auth/logout',
    method: 'POST',
    connections: 100,
    duration: 30,
    servername: 'localhost',
    tlsOptions: { rejectUnauthorized: false }, // self-signed
  },
  {
    title: 'Static Route Test',
    url: 'https://localhost/',
    method: 'GET',
    connections: 50,
    duration: 15,
  },
];

/**
 * Run tests by periods in 5 seconds, and render view result details
 */
async function runTest() {
  console.log('🚀 Initiating all load tests...\n');

  for (const config of testConfigs) {
    await new Promise((resolve) => {
      console.log(`📊 Load Test Summary for ${config.title}:`);
      const instance = autocannon(config, (err, result) => {
        if (err) {
          console.error(`Error running load test for ${config.title}:`, err);
        } else {
          logSummary(result);
        }
        resolve();
      });

      let seen = 0;
      instance.on('response', (client, statusCode, resBytes, responseTime) => {
        if (seen++ < 3) console.log('↩', { statusCode, responseTime });
      });
    });

    console.log('\n⏳ Waiting 5 seconds before next test...\n');

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log('✅ All load tests completed!');
}

runTest();
