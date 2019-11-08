var {Email , Head} = require('../untils/config.js');
var UserModel = require('../models/users.js');
var fs = require('fs');
var url = require('url');
var { setCrypto , createVerify } = require('../untils/base.js');

var login = async (req,res,next)=>{
    var {username , password , verifyImg} = req.body;
    if(verifyImg !== req.session.verifyImg){
        res.send({
            msg : '验证码输入不正确'+req.session.verifyImg,
            status : -3
        });
    }
    var result = await UserModel.findLogin({
        username,
        password : setCrypto(password)
    });
    if(result){
        req.session.username = username;
        req.session.isAdmin = result.isAdmin;
        req.session.userHead = result.userHead;
        if(result.isFreeze){
            res.send({
                msg : '账号已冻结',
                status : -2
            });
        }
        else{
            res.send({
                msg : '登录成功',
                status : 0
            });
        }
    }
    else{
        res.send({
            msg : '登录失败',
            status : -1
        });
    }
};

var register = async (req,res,next)=>{
    var {username,password,email,verify} = req.body;
    if(email !== req.session.email || verify !== req.session.verify ){
        res.send({
            msg : '验证码错误',
            status : -1
        });
        return;
    }
    if((Email.time-req.session.time)/1000 > 60){
        res.send({
            msg : '验证码已过期',
            status : -3
        });
        return;
    }
    var result = await UserModel.save({
        username,
        password : setCrypto(password),
        email
    });

    if(result){
        res.send({
            msg : "注册成功",
            status : 0
        });
    }
    else{
        res.send({
            msg : "邮箱|昵称 已被占用",
            status : -2
        });
    }

};

var verify = async (req,res,next)=>{
    // res.send({
    //     msg:'测试',
    //     status: 0
    // });
    var email = req.query.email;
    var verify = Email.verify;
    //数据持久化
    req.session.email = email;
    req.session.verify = verify;
    req.session.time = Email.time;
    var mailOptions = {
        from: '喵呜 284584927@qq.com', // sender address
        to: email, // list of receivers
        subject: "喵呜的邮箱验证", // Subject line
        text: "验证码:  " + verify, // plain text body
        //html: "<b>Hello world?</b>" // html body
    }
    Email.transporter.sendMail(mailOptions,(err)=>{
        if(err){
            res.send({
                msg: '验证码发送失败',
                status: -1
            });
        }
        else{
            res.send({
                msg : '验证码发送成功',
                status : 0 
            });
        }
    });
};

var logout = async (req,res,next)=>{
    req.session.username = '';
    res.send({
        msg : '退出登录',
        status : 0
    });
};

var getUser = async (req,res,next)=>{
    if(req.session.username){
        res.send({
            msg : '获取用户信息成功',
            status : 0,
            /* 提供数据给前台 */
            data : {
                username : req.session.username,
                isAdmin : req.session.isAdmin,
                userHead : req.session.userHead
            }
        });
    }
    else{
        res.send({
            msg : '获取用户信息失败',
            status : -1
        });
    }
};

var findPassword = async (req,res,next)=>{
    var {email , password , verify} = req.body;
    if(email === req.session.email && verify == req.session.verify){
        var result = await UserModel.updatePassword(email,setCrypto(password));
        if(result){
            res.send({
                msg : '修改密码成功',
                status : 0
            });
        }
        else{
            res.send({
                msg : '修改密码失败',
                status : -1
            });
        }
    }
    else{
        res.send({
            msg : '验证码|邮箱错误',
            status : -1
        });
    }
};

var verifyImg = async (req,res,next) =>{
    var result = await createVerify(req,res);
    if(result){
        res.send(result);
    }
};

var uploadUserHead = async (req,res,next)=>{
    console.log(req.file);
    console.log(req.file.filename);
    console.log(req.session.username);
    await fs.rename( 'public/uploads/' + req.file.filename , 'public/uploads/' + req.session.username + '.jpeg' ,err=>{
        if(err){
            console.log('有错误',err);
        }
        else{
            console.log('重命名成功');
        }
    });
    var result = await UserModel.updateUserHead( req.session.username , url.resolve( Head.baseUrl , req.session.username + '.jpeg'));
    if(result){
        res.send({
            msg : '头像修改成功',
            status : 0,
            data : {
                userHead : url.resolve( Head.baseUrl , req.session.username + '.jpeg' )
            }
        });
    }
    else{
        res.send({
            msg : '头像修改失败',
            status : -1
        });
    }
};


var updateUsername = async (req,res,next) => {
    var {email , username , verify} = req.body;
    if( email === req.session.email && verify == req.session.verify ){
        var result = await UserModel.updateUsername(email,username);
        if(result){
            req.session.username = username;
            res.send({
                msg : '修改昵称成功',
                status : 0
            });
        }
        else{
            res.send({
                msg : '修改昵称失败',
                status : -2
            });
        }
    }
    else{
        res.send({
            msg : '验证码|邮箱错误',
            status : -1
        });
    }
}

module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    verifyImg,
    uploadUserHead,
    updateUsername
};