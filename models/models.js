var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
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
  email: String
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
// var User = module.exports = mongoose.model("User", userSchema);
//
// module.exports.getUserByEmail = function(email, callback){
//     console.log('in getUserByEmail')
//     User.findOne({email:email}, callback)
//   }
//
// module.exports.getUserById = function(id, callback){
//     User.findById(id, callback)
//   }
//
// module.exports.comparePassword = function(candidatePassword, hashedPassword, callback){
//       bcrypt.compare(candidatePassword, hashedPassword, (err,isMatch)=>{
//         if (err) throw err;
//         if(isMatch){
//           callback(null, isMatch);
//         }
//       })
//   }
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
  }
}
