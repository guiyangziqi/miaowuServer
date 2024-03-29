var mongoose = require('mongoose');
var { Head } = require('../untils/config.js');
var url = require('url');
mongoose.set('useCreateIndex',true);

var UserSchema = new mongoose.Schema({
    username : {type : String, required : true, index : {unique : true}},
    password : {type : String, required : true},
    email : {type : String, required : true, index : {unique : true}},
    date : {type : Date, default : Date.now()},
    isAdmin : {type : Boolean, default : false},
    isFreeze : {type : Boolean, default : false},
    userHead : {type : String, default : url.resolve(Head.baseUrl , 'default.svg') } 
});

var UserModel = mongoose.model('user',UserSchema);
UserModel.createIndexes();

var save = (data)=>{
    var user = new UserModel(data);
    return user.save()
           .then(()=>{
               return true;
           })
           .catch(()=>{
               return false;
           });
}


var findLogin = (data)=>{
    return UserModel.findOne(data);
}


var updatePassword = (email,password)=>{
    return UserModel.update({email} , { $set : {password} })
                    .then(()=>{
                        return true;
                    })
                    .catch(()=>{
                        return false
                    });
}



var userList = ()=>{
    return UserModel.find();
}


var updateFreeze = (email,isFreeze)=>{
    return UserModel.update({email} , {$set : { isFreeze }})
                    .then(()=>{
                        return true;
                    })
                    .catch(()=>{
                        return false
                    });
}

var deleteUser = (email)=>{
    return UserModel.deleteOne({ email });
}

var updateUserHead = (username,userHead)=>{
    return UserModel.update({username} , {$set : { userHead }})
                    .then(()=>{
                        return true;
                    })
                    .catch(()=>{
                        return false
                    });
}

var updateUsername = (email,username)=>{
    return UserModel.update({email} , {$set : { username }})
                    .then(()=>{
                        return true;
                    })
                    .catch(()=>{
                        return false;
                    });
}
module.exports = {
    save,
    findLogin,
    updatePassword,
    userList,
    updateFreeze,
    deleteUser,
    updateUserHead,
    updateUsername
}