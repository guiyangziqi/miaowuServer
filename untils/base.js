var crypto = require('crypto');
var captcha = require('trek-captcha');

//创建加密函数
var setCrypto = (info) => {
    return crypto.createHmac('sha256','%fyuf^$%')
                    .update(info)
                    .digest('hex');
}

var createVerify = (req,res)=>{
    return captcha().then((info)=>{
        req.session.verifyImg = info.token;
        return info.buffer;
    }).catch(()=>{
        return false;
    });
}

module.exports = {
    setCrypto,
    createVerify
}