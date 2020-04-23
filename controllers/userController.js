const User = require('../models/user');
const { body, check, validationResult } = require('express-validator')
const async = require('async');
const bcrypt = require('bcryptjs');
const passport = require('passport');


exports.userCreateGet = function(req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
}

exports.userCreatePost = [
  // Validate
  body('firstName', 'First name is required.').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required.').trim() .isLength({ min: 1 }),
  body('username', 'User name is required').trim().isLength({ min: 1 }),
  body('password', 'Password is required').trim().isLength({ min: 1 }),
  check('confirmPassword', 'Password confirmation must match password.')
    .exists()
    .custom((value, { req }) => value === req.body.password),

  // Sanitize
  body('*').escape(),

  // Check for errors and either re-render or save to db
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) { return next(err) }
      const errors = validationResult(req);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        membership: false,
        admin: false
      })
      if (!errors.isEmpty()) {
        res.render('sign_up', { title: 'Sign Up', user: user, errors: errors.array() });
        return;
      }
      else {
        user.save(function (err) {
          if (err) { return next(err) }
          req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
          })
        })
      } 
    })
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

exports.userUpgradeGet = function(req, res, next) {
  res.render('upgrade_membership', { title: 'Upgrade Membership' });
};

exports.userUpgradePost = [
  body('passcode', 'Correct passcode is required to enter the club.').trim().equals(process.env.PASSCODE),
  body("passcode").escape(),
  (req, res, next) => {
    User.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return next(err);
      }
      const errors = validationResult(req);
      const user = new User({
        firstName: result.firstName,
        lastName: result.lastName,
        username: result.username,
        password: result.password,
        membership: true,
        _id: result._id,
      });
      if (!errors.isEmpty()) {
        res.render("upgrade_membership", {
          title: "Upgrade Membership",
          errors: errors.array(),
        });
        return;
      } else {
        User.findByIdAndUpdate(req.params.id, user, {}, function (
          err,
          upgradedUser
        ) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    });
  },
];

exports.userAdminGet = function(req, res, next) {
  res.render('admin_form', { title: 'Enable Admin Status' });
}

exports.userAdminPost = [
  body('passcode', 'Correct admin passcode is required').trim().equals(process.env.ADMIN_CODE),
  body('passcode').escape(),
  (req, res, next) => {
    User.findById(req.params.id)
      .exec(function (err, result) {
        if (err) { return next(err); }
        const errors = validationResult(req);
        const user = new User({
          firstName: result.firstName,
          lastName: result.lastName,
          username: result.username,
          password: result.password,
          membership: result.membership,
          admin: true,
          _id: result._id
        })
        if (!errors.isEmpty()) {
          res.render('admin_form', { title: 'Enable Admin Status', errors: errors.array() });
          return;
        }
        else {
          User.findByIdAndUpdate(req.params.id, user, {}, function (err, upgradedUser) {
            if (err) { return next(err) }
            res.redirect('/');
          })
        }
      })
  }
]

exports.userDetail = function(req, res, next) {
  res.send('GET user detail');
}

exports.userList = function(req, res, next) {
  res.send('GET user list');
}


