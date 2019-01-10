const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const route = require('koa-route');
const webSocket = require('koa-websocket');

const app = webSocket(new Koa());

let socket;
app.ws.use(route.all('/', (ctx) => {
  socket = ctx.websocket;

  socket.on('message', (m) => {
    console.log(`WS Message: ${m}`);
    socket.send('connected to the server');
  });

}));

process.on('SIGINT', () => {
  if (socket) {
    console.log('Closing Socket');
    socket.close();
  }
  process.exit();
});


app.use(async (ctx, next) => {
  const start = Date.now();
  next();
  const fullTime = Date.now() - start;
  console.log(`Time: ${fullTime}`);
});

app.use(async (ctx) => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  ctx.body = indexHtml;
});

app.listen(3000);

