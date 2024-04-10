const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LectureModel = require('../db/LectureModel')
// 解析json格式数据
const jsonParser = bodyParser.json();
// 解析query格式数据
// const urlencodeParser = bodyParser.urlencoded({ extended: false });
// 管理员名单
const superList = [
    {
        name: 'vip001',
        pwd: 'vip1234567',
        supertoken: 'vip000001'
    },
    {
        name: 'vip002',
        pwd: 'vip12345678',
        supertoken: 'vip000002'
    }
]

// 获取管理员名单
router.get('/superList', (req, res) => {
    let nameList = [];
    for (let k of superList) {
        nameList.push(k.name);
    }
    res.json(nameList);
})
// 管理员登录
router.post('/superLogin', jsonParser, (req, res) => {
    const body = req.body;
    if (body == null) {
        res.status(403).json({
            error: '缺少信息'
        });
    }
    for (let k of superList) {
        if (k.name == body.name) {
            if (k.pwd == body.pwd) {
                res.json({
                    message: '验证成功',
                    name: k.name,
                    supertoken: k.supertoken
                })
            } else {
                res.json({
                    error: '验证失败'
                })
            }
        }
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
    if (await LectureModel.find({ lec_id: body.lec_id })) {
        res.json({
            error: '重复的讲座编号'
        })
    } else {
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
            lec_sign: body.lec_sign
        })
        res.json({
            message: '添加成功'
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
    const data = await LectureModel.updateOne({ lec_id: body.lec_id }, {
        lec_title: body.lec_title,
        lec_master: body.lec_master,
        lec_time: body.lec_time,
        lec_place: body.lec_place,
        lec_detail: body.lec_detail,
        lec_type: body.lec_type,
        lec_status: body.lec_status,
        lec_num: body.lec_num,
        lec_people: body.lec_people,
        lec_sign: body.lec_sign
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