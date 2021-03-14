const express = require("express");
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const requestRouter = require("./router/requestRouter");
const authRouter = require("./router/authRouter");
const commentRouter = require("./router/commentRouter");
const cors = require("cors");
const app = express();
app.use(cors());
// const session = require("express-session");

//added for auth
const cookie = require("cookie-session");
const passport = require("passport");

app.use(express.json());
app.use(express.static("public"));
//added for auth and cookies creation
app.use(
  cookie({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["key1"],
    secure: process.env.ENV === "PRODUCTION",
  })
);
// app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

//end - added for auth and cookies creation

// oAuth Authentication
app.use("/auth", authRouter);

//Users =>
//get all users , get a user , create a user ,  update a user , delete a user
app.use("/api/user", userRouter);

//POSTS ->
//get all posts , get a post , create a post , update a post , delete a post
app.use("/api/post", postRouter);

// REQUESTS ->
app.use("/api/request", requestRouter);

//commments ->
app.use("/api/comment", commentRouter);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("app is listeningg at 3000 port !!");
});
