#! /usr/bin/env node

console.log(
  "This script populates some test games, categories, and gameinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const bcrypt = require('bcryptjs');

const User = require('./models/user');
const Message = require('./models/message');

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let users = [];
let messages = [];

function userCreate(firstName, lastName, username, password, membership, cb) {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      cb(err, null);
      return;
    }
    userdetail = { firstName, lastName, username, password: hashedPassword, membership };
    const user = new User(userdetail);
    user.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log(`New User: ${user}`);
      users.push(user);
      cb(null, user);
    });
  })
}

function messageCreate(title, created, body, user, cb) {
  messagedetail = { title, created, body, user };
  const message = new Message(messagedetail);
  message.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Message: ${message}`);
    messages.push(message);
    cb(null, message);
  });
}

function createUsers(cb) {
  async.parallel(
    [
      function (callback) {
        userCreate(
          'Tom',
          'Dawson',
          'tommyd',
          'foobar',
          'Partial',
          callback
        );
      },
      function (callback) {
        userCreate(
          'Louis',
          'Prancer',
          'louisp',
          'foobar',
          'Partial',
          callback
        );
      },
      function (callback) {
        userCreate(
          'Megan',
          'Mustard',
          'meganm',
          'foobar',
          'Partial',
          callback
        );
      },  
    ],
    cb
  );
}

function createMessages(cb) {
  async.parallel(
    [
      function (callback) {
        messageCreate(
          'Wednesday Thoughts',
          Date.now(),
          'It is quite windy today and my allergies are awful.',
          users[0],
          callback
        );
      },
      function (callback) {
        messageCreate(
          'Tonight',
          Date.now(),
          'We are going to eat some Belgian fries and french onion soup',
          users[0],
          callback
        );
      },
      function (callback) {
        messageCreate(
          'Worries',
          Date.now(),
          'Will I actually be able to find a job this fall?',
          users[1],
          callback
        );
      },
      function (callback) {
        messageCreate(
          'Ha ha',
          Date.now(),
          'I just told myself a really funny joke.',
          users[2],
          callback
        );
      }, 
    ],
    cb
  );
}

async.series(
  [createUsers, createMessages],
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('MESSAGES: ' + messages);
    }
    mongoose.connection.close();
  }
);