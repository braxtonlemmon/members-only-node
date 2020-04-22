const Message = require("../models/message");

exports.messageCreateGet = function (req, res, next) {
  res.send("GET create");
};

exports.messageCreatePost = function (req, res, next) {
  res.send("Post create");
};

exports.messageDeleteGet = function (req, res, next) {
  res.send("GET Delete");
};

exports.messageDeletePost = function (req, res, next) {
  res.send("Post Delete");
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
