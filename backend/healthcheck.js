import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0); // Success
  } else {
    process.exit(1); // Failure
  }
});

healthCheck.on('error', () => {
  process.exit(1); // Failure
});

healthCheck.end();