/* 用户模型 */
const mongoose = require('mongoose')
// 文档结构对象
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
// 文档模型对象
const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel