const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/users');

const server = express();

server.use(helmet());
server.use(express.json());
server.unsubscribe(cors());

server.use('/api', userRouter);

server.get('/', (req, res) => {
  res.send('<h2>Five by Five</h2>');
});

module.exports = server;