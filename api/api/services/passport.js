// https://www.jellyfishtechnologies.com/blog/implementation-of-passport-js-in-sailsjs/

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

async function findById(id, fn) {
  var id = await User.findOne(id);
  if(id){
    return fn(null ,id);
  }

}

async function findByUsername(u, fn) {
  
  try {
    var user = await User.findOne({email: u});

    if(user){
      
      return fn(null , user);
    }else{
      return fn(null , false);
    }
  }
  catch (e) {
    console.log(e);
  }

}

passport.serializeUser(function (user, done) {
//In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
  console.log('user id for session : ', user.id);
});

passport.deserializeUser(function (id, done) {
 //Here you retrieve all the info of the user from the
//session storage using the user id stored in the session earlier using serialize user.
  findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function (username, password, done) {
    
    process.nextTick(function () {
      findByUsername(username, function (err, user) {
        if (err)
          return done(null, err);

        bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });

          return done(null, user, {
            message: 'Logged In Successfully'
          });
        });
      })
    });
  }
));