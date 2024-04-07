const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const UserModel = require('../db/UserModel');
// 解析json格式数据
const jsonParser = bodyParser.json();
// 解析query格式数据
const urlencodeParser = bodyParser.urlencoded({ extended: false });

// 登录
router.post('/login', jsonParser, async (req, res) => {
    const body = req.body;
    // console.log(body)
    // console.log(req);
    // if (body == null) {
    //     res.status(403).json({
    //         error: '缺少用户信息'
    //     });
    //     return;     
    // }
    const name = await UserModel.findOne({ userName: body.userName });
    if (name == null) {
        res.json({
            error: '用户不存在'
        })
    } else {
        const pwd = await UserModel.findOne({ userName: body.userName, userPwd: body.userPwd }).select({ _id: 0, __v: 0 });
        if (pwd == null) {
            res.json({
                error: '密码错误'
            })
        } else {
            res.json(pwd)
        }
    }
})

// 注册
router.post('/logon', jsonParser, async (req, res) => {
    const body = req.body;
    await UserModel.create({
        userPwd: body.userPwd,
        userName: body.userName,
        lec_order: [],
        lec_finish: [],
        lec_timeout: [],
        token: '123abcd' + Math.floor(Math.random() * 10)
    })
    res.json({
        message: '注册成功'
    })
})
// 判断用户存不存在
router.post('/isLogon', jsonParser, async (req, res) => {
    const body = req.body;
    if (await UserModel.findOne({ userName: body.userName })) {
        res.json({
            message: 'true'
        })
    } else {
        res.json({
            error: 'false'
        })
    }
})
// 修改密码
router.post('/changePwd', jsonParser, async (req, res) => {
    const body = req.body;
    // console.log(body);
    const data = await UserModel.updateOne({ userName: body.userName }, { userPwd: body.userPwd });
    if (data.modifiedCount == 1) {
        res.json({
            message: '修改成功'
        })
    } else {
        res.json({
            error: '修改失败'
        })
    }

})

module.exports = router;