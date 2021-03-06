var mongoose = require('mongoose');
const crypto = require('crypto');
//const uuidv1 = require('uuid/v1');
  


  var userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },

    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    userinfo: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        required: true

    },
    role: {
        type: Number,
        default: 0

    },

    purchases: {
        type: Array,
        default: []
    },
    cart: {
        type: Array,
        default: []
    },
    fav: {
        type: Array,
        default: []
    },

    address: {
        type: String,
        default: ""
    }
    
  },
  {timestamps: true}
  );

  userSchema.methods = {

    authenticate: function(plainpassword) {
        return plainpassword === this.password
    }
}
  

  module.exports = mongoose.model("User",userSchema)
