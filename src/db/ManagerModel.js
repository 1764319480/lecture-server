const mongoose = require('mongoose');

let managerSchema = mongoose.Schema({
    name: String,
    pwd: String,
    supertoken: String
})

let managersModel = mongoose.model('managers', managerSchema);

module.exports = managersModel;