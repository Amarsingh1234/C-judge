const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    submissions:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Submission'
    }],
    solved:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    }]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);