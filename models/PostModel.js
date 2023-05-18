/* 文章模型 */
const mongoose = require('mongoose');
// 文档结构对象
let PostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    category_id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    // 存时间戳
    create_time: {
      type: String,
      required: true,
    },
    revise_time: {
      type: String,
      required: true,
    }
});
// 文档模型对象
let PostModel = mongoose.model('posts', PostSchema);
// 将文档模型对象暴露出去
module.exports = PostModel;




















