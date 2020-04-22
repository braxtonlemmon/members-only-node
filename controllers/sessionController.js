const passport = require('passport');

exports.logInGet = function(req, res) {
  res.render('log_in', { title: 'Log In' });
}

exports.logInPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
});

exports.logOutGet = function(req, res) {
  req.logout();
  res.redirect('/');
};
