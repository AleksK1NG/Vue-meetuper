module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Connection has been established');

    // Coming from client
    socket.on('meetup/postSave', (post) => {
      // Going to the client
      io.emit('meetup/postPublished', post);
    });
  });
};
