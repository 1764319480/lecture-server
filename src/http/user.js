const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const UserModel = require('../db/UserModel');
const LectureModel = require('../db/LectureModel')
// 解析json格式数据
const jsonParser = bodyParser.json();
// 解析query格式数据
// const urlencodeParser = bodyParser.urlencoded({ extended: false });

// 登录
router.post('/login', jsonParser, async (req, res) => {
    const body = req.body;
    // console.log(body)
    // console.log(req);
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('userPwd'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const name = await UserModel.findOne({ userName: body.userName });
    if (name == null) {
        res.json({
            error: '用户不存在'
        })
    } else {
        const pwd = await UserModel.findOne({ userName: body.userName, userPwd: body.userPwd }).select({ _id: 0, __v: 0, userPwd: 0 });
        if (pwd == null) {
            res.json({
                error: '密码错误'
            })
        } else {
            res.json(pwd)
        }
    }
})
// 获取用户数据
router.post('/getUser', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('token'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const userData = await UserModel.findOne({ userName: body.userName, token: body.token });
    if (userData != null) {
        res.json(userData);
    } 
})
// 注册  谨慎调用，必须先判断用户是否存在
router.post('/logon', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('userPwd'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    await UserModel.create({
        userPwd: body.userPwd,
        userName: body.userName,
        lec_order: [],
        lec_finish: [],
        lec_timeout: [],
        token: '123abcd' + Math.floor(Math.random() * 1000)
    })
    res.json({
        message: '注册成功'
    })
})
// 判断用户存不存在
router.post('/isLogon', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
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
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('userPwd'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
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
// 获取热门讲座
router.get('/hotLecture', async (req, res) => {
    const data = await LectureModel.find({ lec_length: { $gt: 30 } }).select({ _id: 0, __v: 0 });
    // console.log(data);
    res.json(data);
})
// 预约讲座
router.post('/orderLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('lec_id'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await LectureModel.findOne({ lec_id: body.lec_id });
    if (data?.lec_people.includes(body.userName)) {
        res.json({
            error: '您已预约该讲座'
        })
    } else {
        if (data?.lec_length < data?.lec_num) {
            // console.log(data.lec_people);
            // 预约成功后，修改讲座数据
            let newData = data.lec_people;
            newData.push(body.userName);
            // console.log(newData);
            const update = await LectureModel.updateOne({ lec_id: body.lec_id }, { lec_people: newData, lec_length: newData.length });
            if (update.modifiedCount == 0) {
                res.json({
                    error: '预约失败'
                })
            } else {
                const userData = await UserModel.findOne({ userName: body.userName });
                let newOrder = userData.lec_order;
                newOrder.push(body.lec_id);
                await UserModel.updateOne({ userName: body.userName }, { lec_order: newOrder });
                res.json({
                    message: '预约成功'
                    // data: newUserData
                })
            }

        } else {
            // console.log(2);
            // console.log(body);
            res.json({
                error: '预约失败'
            })
        }
    }
})
// 取消讲座
router.post('/cancelLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('lec_id'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await UserModel.findOne({ userName: body.userName });
    if (data?.lec_order.includes(body.lec_id)) {
        let newData = data.lec_order;
        newData = newData.filter(item => item != body.lec_id);
        await UserModel.updateOne({ userName: body.userName }, { lec_order: newData });
        const lecdata = await LectureModel.findOne({ lec_id: body.lec_id });
        let newLecdata = lecdata.lec_people;
        newLecdata = newLecdata.filter(item => item != body.userName);
        await LectureModel.updateOne({ lec_id: body.lec_id }, { lec_people: newLecdata, lec_length: newLecdata.length });
        // const newUserData = await UserModel.findOne({userName: body.userName});
        res.json({
            message: '取消成功'
            // data: newUserData
        })
    } else {
        res.json({
            error: '取消失败'
        })
    }
})
// 获取所有讲座数据
router.get('/allLecture', async (req, res) => {
    const data = await LectureModel.find().select({ _id: 0, __v: 0 });
    res.json(data);
})
// 签到
router.post('/signing', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('lec_id'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const lecdata = await LectureModel.findOne({ lec_id: body.lec_id });
    if (lecdata.lec_status == 0) {
        if (lecdata.lec_sign == body.lec_sign) {
            const data = await UserModel.findOne({ userName: body.userName });
            let orderData = data.lec_order;
            orderData = orderData.filter(item => item != body.lec_id);
            let finishData = data.lec_finish;
            finishData.push(body.lec_id);
            await UserModel.updateOne({ userName: body.userName }, { lec_order: orderData, lec_finish: finishData });
            res.json({
                message: '签到成功'
            })
        } else {
            res.json({
                error: '签到码错误'
            })
        }
    } else {
        res.json({
            error: '现在不是签到时间'
        })
    }
    // const timedata = lecdata.lec_time.split('-');
})
// 未签到处理
router.post('/failSign', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('userName') && body.hasOwnProperty('lec_id'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const userData = await UserModel.findOne({ userName: body.userName });
    let orderData = userData.lec_order;
    orderData = orderData.filter(item => item != body.lec_id);
    let timeoutData = userData.lec_timeout;
    timeoutData.push(body.lec_id);
    await UserModel.updateOne({ userName: body.userName }, { lec_order: orderData, lec_timeout: timeoutData });
    res.json({
        message: '超时讲座已转移'
    })
})

module.exports = router;