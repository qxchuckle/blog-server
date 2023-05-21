var express = require('express');
var router = express.Router();
// 导入md5加密
const md5 = require('md5');
// 导入用户文档对象模型
const UserModel = require('../../models/UserModel');
// 导入配置文件
const config = require('../../config');
// jwt控制token
const jwt = require('jsonwebtoken');

const checkAuthMiddleware = require('../../middleware/checkAuthMiddleware');
// 导入token校验中间件
const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware');

// 检测token自动登陆接口
router.post('/autoLogin', checkTokenMiddleware, (req, res) => {
  // 有这两个属性说明解析token成功
  if ( req.username && req.userID) {
    res.json({
      code: '0000',
      msg: '登陆成功',
      data: {
        username: req.username
      }
    })
  }else{
    res.json({
      code: '90013',
      msg: '请先登陆',
      data: null
    })
  }
})

// 登陆API
router.post('/login', checkAuthMiddleware, (req, res) => {
  // 获取用户名和密码
  let { username, password } = req.body;
  // 查询数据库，看有没有该用户
  // 要对密码也做一次md5加密然后去数据库对比
  UserModel.findOne({
    username: username,
    password: md5(password)
  }).then(data => {
    // 如果data为空说明用户不存在
    if (!data) {
      res.json({
        code: '2002',
        msg: '用户名或密码错误',
        data: null
      })
      return;
    }
    // 创建并返回token
    let token = jwt.sign({
      username: data.username,
      _id: data._id
    }, config.token_secret, {
      // 7天过期
      expiresIn: 60 * 60 * 24 * 7
    });
    res.json({
      code: '0000',
      msg: '登陆成功',
      data: {
        username,
        token: token
      }
    })
  }).catch(err => {
    res.json({
      code: '2000',
      msg: '登陆出错',
      data: null
    })
  })
});

// 注册API
router.post('/reg', checkAuthMiddleware, (req, res) => {
  res.json({
    code: '9999',
    msg: '不允许注册',
    data: null
  })
  return;
  // 如果用户名重复就重新注册
  UserModel.findOne({ username: req.body.username })
    .then(data => {
      // data不为空说明用户名重复
      if (data) {
        res.json({
          code: '2011',
          msg: '用户名已存在',
          data: null
        })
        return;
      }
      // 用户名不重复则创建用户
      UserModel.create({
        username: req.body.username,
        // 使用md5对密码进行加密
        password: md5(req.body.password)
      }).then(data => {
        res.json({
          code: '0000',
          msg: '注册成功',
          data: {
            username: req.body.username
          }
        })
      }).catch(err => {
        res.json({
          code: '2010',
          msg: '注册失败',
          data: null
        })
      })
    })
});

// 退出登陆
router.post('/logout', (req, res) => {
  // 客户端删除token即可
  res.json({
    code: '0000',
    msg: '退出成功',
    data: null
  })
});

module.exports = router;