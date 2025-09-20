const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello World!');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

console.log(`Configured to run on port ${PORT}. If using nginx, proxy requests from port 80 to ${PORT}.`);
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);   
});