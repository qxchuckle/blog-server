var express = require('express');
var router = express.Router();

// 导入文章模型
const CategoryModel = require('../../models/CategoryModel');

// 导入token校验中间件
const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware');

// 获取分类
router.get('/category', (req, res) => {
  CategoryModel.find().select({ __v: 0 })
    .then((data) => {
      res.json({
        code: '0000',
        msg: '获取分类成功',
        data: {
          categoryArr: data
        }
      })
    }).catch(err => {
      console.log(err);
      res.json({
        code: '4000',
        msg: '获取文章失败',
        data: null
      })
    })
})

// 添加分类
router.post('/category', checkTokenMiddleware, (req, res) => {
  let { name } = req.body
  if (!name) {
    res.json({
      code: '4011',
      msg: '分类名不能为空',
      data: null
    })
    return;
  }
  // 看看分类名是否已经存在
  CategoryModel.findOne({ name }).then((data) => {
    // 不为null说明分类存在
    if (data) {
      res.json({
        code: '4012',
        msg: '分类已存在',
        data: null
      })
      return;
    }
    // 创建分类
    CategoryModel.create({
      name
    }).then(data => {
      res.json({
        code: '0000',
        msg: '分类创建成功',
        data: {
          name: data.name,
          category_id: data._id
        }
      })
    }).catch(err => {
      console.log(err);
      res.json({
        code: '4014',
        msg: '分类创建失败',
        data: null
      })
    })
  }).catch(err => {
    console.log(err);
    res.json({
      code: '4010',
      msg: '检查分类名时出错',
      data: null
    })
    return;
  });
})

// 删除文章
router.post('/category/delete', checkTokenMiddleware, (req, res) => {
  // 获取要删除的id
  let category_id = req.body.category_id;
  CategoryModel.deleteOne({ _id: category_id })
    .then(data => {
      if (data.deletedCount === 0) {
        res.json({
          code: '4021',
          msg: '不存在该分类',
          data: data
        })
        return;
      }
      res.json({
        code: '0000',
        msg: '删除成功',
        data: data
      })
    })
    .catch(err => {
      console.log(err);
      res.json({
        code: '4020',
        msg: '删除失败',
        data: null
      })
    })
})

// 修改分类
router.post('/category/update', checkTokenMiddleware, (req, res) => {
  let { name, category_id } = req.body
  if(!category_id) {
    res.json({
      code: '4031',
      msg: '缺少category_id',
      data: null
    })
    return;
  }
  CategoryModel.updateOne({ _id: category_id }, {
    // 也就只能改个分类名了
    name
  }).then(data => {
    if (data.matchedCount === 0) {
      res.json({
        code: '4032',
        msg: '没有该分类',
        data: data
      })
      return;
    }
    res.json({
      code: '0000',
      msg: '修改成功',
      data: data
    })
  }).catch(err => {
    console.log(err);
    res.json({
      code: '4030',
      msg: '修改失败',
      data: null
    })
  })
})

module.exports = router;