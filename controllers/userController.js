const User = require('../models/user');
const { body, validationResult } = require('express-validator')
const async = require('async');

exports.userCreateGet = function(req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
}

exports.userCreatePost = [
  body('firstName', 'First name is required.').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required.').trim() .isLength({ min: 1 }),
  body('username', 'User name is required').trim().isLength({ min: 1 }),
  body('password', 'Password is required').trim().isLength({ min: 1 }),

  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      membership: 'Partial'
    })
    if (!errors.isEmpty()) {
      res.render('sign_up', { title: 'Sign Up', user: user, errors: errors.array() });
      return;
    }
    else {
      user.save(function (err) {
        if (err) { return next(err) }
        res.redirect('/');
      })
    } 
  }
];

exports.userDeleteGet = function(req, res, next) {
  res.send('GET Delete');
}

exports.userDeletePost = function(req, res, next) {
  res.send('Post Delete');
}

exports.userUpdateGet = function(req, res, next) {
  res.send('GET Update');
}

exports.userUpdatePost = function(req, res, next) {
  res.send('Post Update');
}

exports.userDetail = function(req, res, next) {
  res.send('GET user detail');
}

exports.userList = function(req, res, next) {
  res.send('GET user list');
}


