const http = require('http');
import socket from 'socket.io';
import app from './app';

const server = http.createServer(app);
export const io = socket(server);

server.listen(5000, () => console.log('Server is start on *:5000'));
