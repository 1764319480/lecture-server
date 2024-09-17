const UserModel = require('../db/UserModel');
const LectureModel = require('../db/LectureModel');
const ManagerModel = require('../db/ManagerModel');
const CarouselModel = require('../db/CarouselModel');
const fs = require('fs');
const path = require('path');
const db = require('../db/mongo');
const mongoose = require('mongoose');
const { error } = require('console');
//读取data.json
let jsonData = null;
const filePath = path.join(__dirname, 'data.json');
try {
  jsonData = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(err);
}
// console.log(jsonData); 
//将数据录入数据库
const { lectures, users, managers, carousels } = JSON.parse(jsonData);
async function addData() {
  for (let k of lectures) {
    try {
      if (await LectureModel.findOne({ lec_id: k.lec_id })) {
        throw '讲座已存在';
      };
      await LectureModel.create({
        lec_title: k.lec_title,
        lec_id: k.lec_id,
        lec_master: k.lec_master,
        lec_time: k.lec_time,
        lec_place: k.lec_place,
        lec_detail: k.lec_detail,
        lec_type: k.lec_type,
        lec_status: k.lec_status,
        lec_num: k.lec_num,
        lec_people: k.lec_people,
        lec_sign: k.lec_sign,
        lec_length: k.lec_length
      });
      console.log('已添加一条讲座数据');
    } catch (error) {
      console.log(error);
    }
  };
  for (let k of users) {
    try {
      if (await UserModel.findOne({ userName: k.userName })) {
        throw '用户已存在';
      };
      await UserModel.create({
        userPwd: k.userPwd,
        userName: k.userName,
        lec_order: [],
        lec_finish: [],
        lec_timeout: [],
        token: 'ThisIsARandomToken' + Math.floor(Math.random() * 1000)
      });
      console.log('已添加一条用户数据')
    } catch (error) {
      console.log(error)
    }
  };
  for (let k of managers) {
    try {
      if (await ManagerModel.findOne({ name: k.name })) {
        throw '管理员已存在';
      };
      await ManagerModel.create({
        name: k.name,
        pwd: k.pwd,
        supertoken: k.supertoken
      });
      console.log('已添加一条管理员数据')
    } catch (error) {
      console.log(error)
    }
  };
  for (let k of carousels) {
    try {
      if (await CarouselModel.findOne({lec_id: k.lec_id})) {
        throw '该讲座图片已存在';
      };
      await CarouselModel.create({
        lec_id: k.lec_id,
        img_id: k.img_id
      });
      console.log('已添加一条轮播图数据');
    } catch (error) {
      console.log(error)
    }
  }
}
db(async () => {
  console.log('数据库连接成功！');
  await addData();
  mongoose.connection.close();
});
