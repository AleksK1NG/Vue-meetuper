const Meetup = require('../models/meetups');
const User = require('../models/users');

/*
 * GET Meetups
 * */
exports.getMeetups = function(req, res) {
  const { category } = req.query || {};
  const { location } = req.query || {};

  const findQuery = location
    ? Meetup.find({ processedLocation: { $regex: '.*' + location + '.*' } })
    : Meetup.find({});
  findQuery
    .populate('category')
    .populate('joinedPeople')
    .limit(5)
    .sort({ createdAt: -1 })
    .exec((errors, meetups) => {
      if (errors) {
        return res.status(422).send({ errors });
      }

      // WARNING: requires improvement, can decrease performance
      if (category) {
        meetups = meetups.filter((meetup) => {
          return meetup.category.name === category;
        });
      }

      return res.status(200).json(meetups);
    });
};
/*
 * GET Meetup By Id
 * */
exports.getMeetupById = function(req, res) {
  const { id } = req.params;

  Meetup.findById(id)
    .populate('meetupCreator', 'name id avatar')
    .populate('category')
    .populate({
      path: 'joinedPeople',
      options: { limit: 5, sort: { username: -1 } }
    })
    .exec((errors, meetup) => {
      if (errors) {
        return res.status(422).send({ errors });
      }

      return res.json(meetup);
    });
};

/*
 * GET Secret
 * */
exports.getSecret = function(req, res) {
  return res.status(200).json({ secret: 'Secret message' });
};

exports.createMeetup = function(req, res) {
  const meetupData = req.body;
  const user = req.user;

  const meetup = new Meetup(meetupData);
  meetup.user = user;
  meetup.status = 'active';

  meetup.save((err, createdMeetup) => {
    if (err) {
      return res.status(422).send({ errors: err });
    }

    return res.status(200).json(createdMeetup);
  });
};

/*
 * Join Meetup
 * */
exports.joinMeetup = function(req, res) {
  const user = req.user;
  const { id } = req.params;

  Meetup.findById(id, (errors, meetup) => {
    if (errors) return res.status(422).send({ errors });

    meetup.joinedPeople.push(user);
    meetup.joinedPeopleCount++;

    return Promise.all([
      meetup.save(),
      User.updateOne({ _id: user.id }, { $push: { joinedMeetups: meetup } })
    ])
      .then((result) => res.status(200).json({ id }))
      .catch((errors) => res.status(422).send({ errors }));
  });
};

/*
 * Leave Meetup
 * */
exports.leaveMeetup = function(req, res) {
  const user = req.user;
  const { id } = req.params;

  Promise.all([
    Meetup.updateOne(
      { _id: id },
      { $pull: { joinedPeople: user.id }, $inc: { joinedPeopleCount: -1 } }
    ),
    User.updateOne({ _id: user.id }, { $pull: { joinedMeetups: id } })
  ])
    .then((result) => res.status(200).json({ id }))
    .catch((errors) => res.status(422).send({ errors }));
};
