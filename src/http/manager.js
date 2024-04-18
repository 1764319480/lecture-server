const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LectureModel = require('../db/LectureModel');
const ManagerModel = require('../db/ManagerModel');

// 解析json格式数据
const jsonParser = bodyParser.json();
// 解析query格式数据
// const urlencodeParser = bodyParser.urlencoded({ extended: false });

// 获取管理员名单
router.get('/superList', async (req, res) => {
    let nameList = [];
    const managerdata = await ManagerModel.find().select({ name: 1, _id: 0 });
    for (let k of managerdata) {
        nameList.push(k.name);
    }
    res.json(nameList);
})
// 管理员登录
router.post('/superLogin', jsonParser, async (req, res) => {
    const body = req.body;
    if (body == null) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const managerdata = await ManagerModel.findOne({ name: body.name, pwd: body.pwd }).select({ _id: 0, pwd: 0 });
    if (managerdata) {
        res.json(managerdata);
        // console.log(managerdata)
    } else {
        res.json({
            error: '密码错误'
        })
    }
})
// 修改密码
router.post('/modifyPwd', jsonParser, async (req, res) => {
    const body = req.body;
    if (!((body.hasOwnProperty('name')) && (body.hasOwnProperty('pwd')))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await ManagerModel.updateOne({name: body.name}, {pwd: body.pwd});
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
// 添加讲座
router.post('/addLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (body == null) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    if (await LectureModel.findOne({ lec_id: body.lec_id })) {
        res.json({
            error: '重复的讲座编号'
        })
    } else {
        try {
            await LectureModel.create({
                lec_title: body.lec_title,
                lec_id: body.lec_id,
                lec_master: body.lec_master,
                lec_time: body.lec_time,
                lec_place: body.lec_place,
                lec_detail: body.lec_detail,
                lec_type: body.lec_type,
                lec_status: body.lec_status,
                lec_num: body.lec_num,
                lec_people: body.lec_people,
                lec_sign: body.lec_sign,
                lec_length: body.lec_length
            });
            res.json({
                message: '添加成功'
            });
        } catch (error) {
            res.json({
                error: '添加失败'
            })
        }
    }
})
// 搜索某一讲座
router.post('/findLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (!(body.hasOwnProperty('lec_id'))) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await LectureModel.findOne({lec_id: body.lec_id});
    if (data) {
        res.json(data)
    } else {
        res.json({
            error: '讲座不存在'
        })
    }
})
// 删除讲座
router.post('/removeLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (body == null) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await LectureModel.deleteOne({ lec_id: body.lec_id });
    if (data.deletedCount == 1) {
        res.json({
            message: '删除成功'
        })
    } else {
        res.json({
            error: '删除失败'
        })
    }
})
// 修改讲座
router.post('/modifyLecture', jsonParser, async (req, res) => {
    const body = req.body;
    if (body == null) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    const data = await LectureModel.updateOne({ lec_id: body.lectures.lec_id }, {
        lec_title: body.lectures.lec_title,
        lec_master: body.lectures.lec_master,
        lec_time: body.lectures.lec_time,
        lec_place: body.lectures.lec_place,
        lec_detail: body.lectures.lec_detail,
        lec_type: body.lectures.lec_type,
        lec_status: body.lectures.lec_status,
        lec_num: body.lectures.lec_num,
        lec_people: body.lectures.lec_people,
        lec_sign: body.lectures.lec_sign,
        lec_length: body.lectures.lec_length,
    })
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