// https://www.jellyfishtechnologies.com/blog/implementation-of-passport-js-in-sailsjs/

var passport = require('passport');

module.exports = {
process: function(req, res){
    
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: 'login failed '
        });
             }
      req.logIn(user, function(err) {
        req.session.userId = user.id;
        req.session.email = user.email;
        

        if (err) {res.send(err);}

      return res.send({
          message: 'login successful'
        });
   
      });
    })(req, res);
  },
};