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
  lastName: String
})

module.exports = {
  User: mongoose.model("User", userSchema)
}
