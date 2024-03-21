const express = require('express');
const connectDB = require('./config/db');
const app = express();
const { blockchainListen } = require('./blockchain/listen');
const { queryOnServerStart } = require('./blockchain/query');
const { gatewayConnect } = require('./blockchain/gateway');

const main = async function () {
  // Connect Databas
  connectDB();

  // Initialize Middleware
  app.use(express.json());

  // Dummy index page to land on for now
  app.get('/', (req, res) => {
    res.send(`The server is running`);
  });

  const server = require('http').createServer(app);
  const sio = require('socket.io')(server, {
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  });

  sio.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });
  });

  sio.listen(4000);

  app.set('sio', sio);
  // Define Routes
  app.use('/api/channels', require('./routes/api/channels'));
  app.use('/api/organizations', require('./routes/api/organizations'));
  app.use('/api/users', require('./routes/api/users'));
  app.use('/api/auth', require('./routes/api/auth'));
  app.use('/api/messages', require('./routes/api/messages'));
  app.use('/api/theme', require('./routes/api/theme'));

  const PORT = process.env.PORT || 5000;

  // Set up gateway and set as global
  const gateway = await gatewayConnect();
  global.Globals = {
    gateway: gateway,
  };

  // Query on startup
  queryOnServerStart();

  // Set up blockchain listener
  blockchainListen(app);

  // Listen on backend port
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

// Call the main function
main();
