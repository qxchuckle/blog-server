// 导入分类模型
const CategoryModel = require('../models/CategoryModel');
const checkCategoryMiddleware = (req, res, next) => {
  let { category_id } = req.body;
  // 若没有传入category_id则直接next()
  if (!category_id) {
    category_id
    next();
  } else {
    CategoryModel.findOne({ _id: category_id })
      .then(data => {
        // 找到有这个分类才继续
        if (data) {
          next();
        } else {
          res.json({
            code: '3091',
            msg: '没有该分类',
            data: null
          })
          return;
        }
      }).catch(err => {
        console.log(err);
        res.json({
          code: '3090',
          msg: '查找分类时出错，或没有该分类',
          data: null
        })
      });
  }

}
module.exports = checkCategoryMiddleware