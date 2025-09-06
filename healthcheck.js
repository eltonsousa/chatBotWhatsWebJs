// healthcheck.js
const http = require("http");

const port = process.env.PORT || 3000;

// cria um servidor simples que responde "OK"
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.listen(port, () => {
  console.log(`✅ Healthcheck rodando na porta ${port}`);
});
