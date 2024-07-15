const http = require("http");

const server = http.createServer((req, res) => {
    if(req.url === '/' && req.method === 'GET') {
        res.writeHead(302, {'location': '/home'});
        res.end();
    } else if(req.url === '/home' && req.method === 'GET') {
        res.write("<h1>Hello, Welcome to Home!</h1>");
        res.end();
    }
});

server.listen(3002, () => {
    console.log("Listening on http://localhost:3002");
});