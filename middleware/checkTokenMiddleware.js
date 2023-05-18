const jwt = require("jsonwebtoken");
const config = require('../config');

const checkTokenMiddleware = (req, res, next) => {
  // 获取请求头中的token
  let token = req.get('token');
  // 没有token则报错
  if (!token) {
      res.json({
          code: '9011',
          msg: '缺失token',
          data: null
      })
      return;
  }
  jwt.verify(token, config.token_secret, (err, data) => {
      if (err) {
          res.json({
              code: '9012',
              msg: 'token校验失败',
              data: null
          })
          return;
      }
      // 校验成功后，将username和userID绑定到req上
      req.username = data.username;
      req.userID = data._id;
      next();
  })
}

module.exports = checkTokenMiddleware;