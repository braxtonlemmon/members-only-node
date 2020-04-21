const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const messageController = require('../controllers/messageController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only' });
});

//////////////////
/* USER routes */
////////////////

// GET create 
router.get('/sign-up', userController.userCreateGet);
// POST create 
router.post('/sign-up', userController.userCreatePost);
// GET delete 
router.get('/user/:id/delete', userController.userDeleteGet);
// POST delete 
router.post('/user/:id/delete', userController.userDeletePost);
// GET update
router.get('/user/:id/update', userController.userUpdateGet);
// POST update
router.post('/user/:id/update', userController.userUpdatePost);
// GET one user
router.get('/user/:id', userController.userDetail);
// GET all users
router.get('/users', userController.userList);

/////////////////////
/* MESSAGE routes */
///////////////////

// GET create
router.get('/message/create', messageController.messageCreateGet);
// POST create
router.post('/message/create', messageController.messageCreatePost);
// GET delete
router.get('/message/:id/delete', messageController.messageDeleteGet);
// POST delete
router.post('/message/:id/delete', messageController.messageDeletePost);
// GET update
router.get('/message/:id/update', messageController.messageUpdateGet);
// POST update
router.get('/message/:id/update', messageController.messageUpdatePost);
// GET one message
router.get('/message/:id', messageController.messageDetail);
// GET all messages
router.get('/messages', messageController.messageList);

module.exports = router;
