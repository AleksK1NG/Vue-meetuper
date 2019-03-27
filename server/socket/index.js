module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Connection has been established');

    // Subscribe
    socket.on('meetup/subscribe', (meetupId) => {
      console.log(`Joining meetup: meetup-${meetupId}`);
      socket.join(`meetup-${meetupId}`);
    });

    // Unsubscribe
    socket.on('meetup/unsubscribe', (meetupId) => {
      console.log(`Leaving meetup: meetup-${meetupId}`);
      socket.leave(`meetup-${meetupId}`);
    });

    // Post Save
    socket.on('meetup/postSaved', (post) => {
      console.log(`emit to meetup: meetup-${post.meetup}`);
      socket.to(`meetup-${post.meetup}`).emit('meetup/postPublished', post);
    });
  });
};
