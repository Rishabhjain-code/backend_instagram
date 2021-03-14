function googleAuth(req , res){
  console.log("Inside o Auth");
  res.send("<h1>GOOGLE CONSENT FORM !!</h1>")
}

module.exports.googleAuth = googleAuth;