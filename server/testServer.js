const express = require('express');
const app = express();

// Initialize Middleware
app.use(express.json());

// Dummy index page to land on for now
app.get('/', (req, res) => {
  res.send(`The server is running`);
});

// Define Routes
app.use('/api/channels', require('./routes/api/channels'));
app.use('/api/organizations', require('./routes/api/organizations'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/messages', require('./routes/api/messages'));

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
  })
});

sio.listen(2010);

app.set('sio', sio);

module.exports = app;