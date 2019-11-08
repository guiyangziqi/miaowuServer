var express = require('express');
var adminController = require('../controllers/admin.js');
var router = express.Router();

/* GET users listing. */


//拦截
router.use((req,res,next)=>{
    if(req.session.username && req.session.isAdmin){
        next();
    }
    else{
        res.send({
            msg : '没有管理员权限',
            status : -1
        });
    }
});

router.get('/', adminController.index);
router.get('/userList', adminController.userList);
router.post('/updateFreeze', adminController.updateFreeze);
router.post('/deleteUser' , adminController.deleteUser);

module.exports = router;