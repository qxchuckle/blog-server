/* 文章模型 */
const mongoose = require('mongoose');
// 文档结构对象
let PostSchema = new mongoose.Schema({
  // 该id用于路由参数
  post_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  // 保存的分类集合的_id字段
  category_id: {
    type: String,
    // 空字符串代表未分类
    default: ""
  },
  content: {
    type: String,
    default: '',
  },
  // 存时间戳
  create_time: {
    type: String,
    required: true,
  },
  revise_time: {
    type: String,
    required: true,
  },
  isShow: {
    type: Boolean,
    // 默认展示文章
    default: true
  }
});
// 文档模型对象
let PostModel = mongoose.model('posts', PostSchema);
// 将文档模型对象暴露出去
module.exports = PostModel;




















