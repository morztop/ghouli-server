const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const messages = {
  chat_1: [],
  chat_2: []
};

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.emit('init_data', messages);

  socket.on('send_message', (data) => {
    const { chatId, msg } = data;
    if (!messages[chatId]) messages[chatId] = [];
    messages[chatId].push(msg);

    io.emit('new_message', { chatId, msg });
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
