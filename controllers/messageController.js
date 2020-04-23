const Message = require("../models/message");
const { body, validationResult } = require('express-validator');

exports.messageCreateGet = function (req, res, next) {
  res.render('message_form', { title: 'Create Message' });
};

exports.messageCreatePost = [
  body('title', 'Message title is required').trim().isLength({ min: 1 }),
  body('body', 'Message content is required.').trim().isLength({ min: 1 }),
  body('*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('message_form', { title: 'Create Message', message: req.body, errors: errors.array() });
      return;
    }
    else {
      const message = new Message(
        {
          title: req.body.title,
          body: req.body.body,
          created: Date.now(),
          user: req.body.userId
        }
      );
      message.save(function(err) {
        if (err) { return next(err) }
        res.redirect('/');
      })
    }
  }
];

exports.messageDeletePost = function (req, res, next) {
  Message.findById(req.params.id)
  .exec(function(err, message) {
    if (err) { return next(err); }
    Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
      if (err) { return next(err); }
      res.redirect('/');
    })
  })
};

exports.messageUpdateGet = function (req, res, next) {
  res.send("GET Update");
};

exports.messageUpdatePost = function (req, res, next) {
  res.send("Post Update");
};

exports.messageDetail = function (req, res, next) {
  res.send("GET message detail");
};

exports.messageList = function (req, res, next) {
  Message.find()
    .populate('user')
    .exec(function(err, message_list) {
      if (err) { return next(err) }
      res.render('index', { title: 'Messages', message_list: message_list });
    });
};
