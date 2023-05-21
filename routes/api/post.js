var express = require('express');
var router = express.Router();

// 导入文章模型
const PostModel = require('../../models/PostModel');
// 导入shortid生成文章id
const shortid = require('shortid');
// moment处理时间
const moment = require('moment');

// 导入token校验中间件
const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware');
// 导入查找分类中间件
const checkCategoryMiddleware = require('../../middleware/checkCategoryMiddleware');


// 获取文章，默认获取全部，支持分页
router.get('/post', (req, res) => {
  // 记录集合的长度
  let postSize = 0;
  let keyword = Number(req.query.keyword) || ""; // 查找关键字
  let category_id = req.query.category_id || "";
  let condition = {
    $or: [
      { content: { $regex: keyword, $options: 'i' } },
      { title: { $regex: keyword, $options: 'i' } },
    ]
  }
  if (category_id.length) {
    condition = {
      $and: [
        {
          $or: [
            { content: { $regex: keyword, $options: 'i' } },
            { title: { $regex: keyword, $options: 'i' } }
          ]
        },
        { category_id: category_id }
      ]
    }
  }
  // 查找符合关键字条件的文档总数，用于展示分页
  PostModel.countDocuments(condition)
    .then((count) => {
      postSize = count;
      let page = Number(req.query.page) || 1; // 第几页，默认获取第一页
      let postNum = Number(req.query.postNum) || postSize; // 每页多少个文章，默认获取全部
      // 按创建时间降序排序
      PostModel.find(condition)
        .select({ _id: 0, __v: 0 })
        .sort({ create_time: -1 })
        .skip((page - 1) * postNum)
        .limit(postNum)
        .then((data) => {
          for (let item of data) {
            item.content = item.content.replace(/<[^>]*>/g, '')
            if (item.content.length > 50) {
              item.content = item.content.slice(0, 50)
              item.content += '...'
            }
          }
          res.json({
            code: '0000',
            msg: '获取文章成功',
            data: {
              postArr: data,
              // 将文章总数返回
              postSize,
            }
          })
        }).catch(err => {
          console.log(err);
          res.json({
            code: '3000',
            msg: '获取文章失败',
            data: null
          })
        })
    }).catch((err) => {
      console.log(`Error: ${err}`);
    });
})

// 获取单个文章
router.get('/post/one', (req, res) => {
  // 按创建时间降序排序
  let query = req.query;
  console.log(query)
  PostModel.findOne({ post_id: query.post_id }).select({ _id: 0, __v: 0 })
    .then((data) => {
      if (data) {
        res.json({
          code: '0000',
          msg: '获取单个文章成功',
          data: data
        })
      } else {
        res.json({
          code: '3009',
          msg: '获取单个文章失败',
          data: data
        })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        code: '3000',
        msg: '获取单个文章失败',
        data: null
      })
    })
})

// 添加文章
router.post('/post', checkTokenMiddleware, checkCategoryMiddleware, (req, res) => {
  let { title, content, category_id, isShow } = req.body
  if (!title) {
    res.json({
      code: '3011',
      msg: '标题不能为空',
      data: null
    })
    return;
  }
  let time = Date.now();
  let post_id = shortid.generate();
  let post = {
    post_id,
    title,
    category_id,
    content,
    create_time: time,
    revise_time: time,
    isShow
  }
  PostModel.create(post).then(data => {
    res.json({
      code: '0000',
      msg: '文章创建成功',
      data: {
        ...post,
        category_id: data.category_id,
        content: data.content,
        isShow: data.isShow
      }
    })
  }).catch(err => {
    console.log(err);
    res.json({
      code: '3010',
      msg: '文章创建失败',
      data: null
    })
  })
})

// 删除文章
router.post('/post/delete', checkTokenMiddleware, (req, res) => {
  // 获取要删除的id
  let post_id = req.body.post_id;
  PostModel.deleteOne({ post_id })
    .then(data => {
      if (data.deletedCount === 0) {
        res.json({
          code: '3021',
          msg: '不存在该文章',
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
        code: '3020',
        msg: '删除失败',
        data: null
      })
    })
})

// 修改文章
router.post('/post/update', checkTokenMiddleware, checkCategoryMiddleware, (req, res) => {
  let { post_id, title, content, category_id, isShow } = req.body
  if (!post_id) {
    res.json({
      code: '4031',
      msg: '缺少post_id',
      data: null
    })
    return;
  }
  let time = Date.now();
  PostModel.updateOne({ post_id }, {
    title,
    content,
    category_id,
    isShow,
    revise_time: time
  }).then(data => {
    if (data.matchedCount === 0) {
      res.json({
        code: '3031',
        msg: '没有该文章',
        data: data
      })
      return;
    }
    res.json({
      code: '0000',
      msg: '更新成功',
      data: data
    })
  }).catch(err => {
    console.log(err);
    res.json({
      code: '3030',
      msg: '更新失败',
      data: null
    })
  })
})

module.exports = router;