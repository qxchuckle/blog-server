/* 文章分类模型 */
const mongoose = require('mongoose');
// 文档结构对象
let CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    }
});
// 文档模型对象
let CategoryModel = mongoose.model('categories', CategorySchema);
// 将文档模型对象暴露出去
module.exports = CategoryModel;
