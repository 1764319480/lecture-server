const mongoose = require('mongoose');
// 创建集合中文档的属性
let userSchema = mongoose.Schema({
    userPwd: String,
    userName: String,
    lec_order: Array,
    lec_finish: Array,
    lec_timeout: Array,
    token: String
})
// 创建模型对象，对集合users进行操作
let usersModel = mongoose.model('users', userSchema);
module.exports = usersModel;