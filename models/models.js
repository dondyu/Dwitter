var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//ENTER YOUR MONGODB CREDENTIALS IN CONNECT.JS FILE OR USE AN ENVIRONMENT VARIABLE
mongoose.connect(process.env.MONGODB_URI || require("./connect"))
var db = mongoose.connection;


var userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  registrationDate: Date,
  followers: [{type: String, ref: "User"}],
  following: [{type: String, ref: "User"}],
  tweets: [{type: String, ref: "Tweet"}]
})

userSchema.methods.createSafeUser=function(callback){
  bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(this.password, salt, (err,hash)=>{
      //Store hash in your password DB;
      this.password = hash;
      console.log('password is hashed' + this.password)
      this.save(callback);
    })
  })
}
var User = mongoose.model("User", userSchema)

var tweetSchema = mongoose.Schema({
  date: Date,
  content: String,
  likes: [{type: String, ref: "User"}],
  _creator: {type: String, ref: "User"},

})

var Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = {
  User: User,
  getUserByEmail: function(email, callback){
    User.findOne({email:email}, callback)
  },
  getUserById: function(id, callback){
    User.findById(id, callback)
  },
  comparePassword: function(candidatePassword, hashedPassword, callback){
      bcrypt.compare(candidatePassword, hashedPassword, (err,isMatch)=>{
        if (err) throw err;
        callback(null, isMatch);
      })
  },
  Tweet:Tweet
}
