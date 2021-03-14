const authRouter = require("express").Router();
let passport = require("passport");
let GoogleStrategy = require("passport-google-oauth2").Strategy;
// let { CLIENT_ID, CLIENT_PSWD } = require("../config/secrets");
let { CLIENT_ID, CLIENT_PSWD } = process.env;
let connection = require("../model/db");

passport.serializeUser(function (user, done) {
  console.log("inside serailize user !!");
  console.log(user);
  // console.log(done);
  done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
  connection.query(
    `SELECT * from user_table WHERE uid="${uid}"`,
    function (error, data) {
      let user = {};
      if (error) {
        done(err);
      } else {
        user = data[0];
        done(null, user);
      }
    }
  );
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_PSWD,
      callbackURL: "https://sociogram-backend.herokuapp.com/auth/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      let { email, id, displayName, given_name } = profile;
      let sql = `SELECT * FROM user_table WHERE email = '${email}'`;
      connection.query(sql, function (error, data) {
        if (error) {
          done(error);
        }
        if (data.length) {
          // user pehle se signed up hain
          console.log(data[0]);
          console.log("user already signed up !!");
          // done
          done(null, data[0]);
        } else {
          // createUser
          let sql = `INSERT INTO user_table(uid , name , email , username ) VALUES('${id}' , '${displayName}' , '${email}' , '${given_name}')`;
          connection.query(sql, function (err, data) {
            if (err) {
              done(err);
            } else {
              console.log("User created !!!");
              console.log(data[0]);
              let sql = `SELECT * FROM user_table WHERE email = '${email}'`;
              connection.query(sql, function (error, data) {
                if (error) {
                  done(error);
                } else {
                  done(null, data[0]);
                }
              });
            }
          });
        }
      });
    }
  )
);

// called by client
authRouter
  .route("/google")
  .get(
    passport.authenticate("google", { scope: ["email", "profile"] }),
    (req, res) => {
      console.log("Inside o Auth");
      res.send("<h1>GOOGLE CONSENT FORM !!</h1>");
    }
  );

//called by google server
authRouter
  .route("/callback")
  .get(passport.authenticate("google"), function (req, res) {
    console.log(req.user);
    console.log("data recieved from server");
    console.log("user authenticated");
    res.redirect("https://sociogram.netlify.app");
  });

// by react app
authRouter.route("/setState").get(function (req, res) {
  console.log(req.user);
  if (req.user) {
    res.json({
      loggedIn: true,
      uid: req.user.uid,
    });
  } else {
    res.json({
      loggedIn: false,
      uid: "",
    });
  }
});

authRouter.route("/destroyCookie").get(function (req, res) {
  req.session = null;
  res.json({
    messaged: "LOGGED OUT",
  });
});

module.exports = authRouter;
