# 简介
一个简单的前后端分离的博客，拥有完整的接口与后台

前端：[仓库 blog-vue](https://github.com/qxchuckle/blog-vue)

Vue3 + Vue Router + Pinia + Naive UI + wangEditor

后端：[仓库 blog-server](https://github.com/qxchuckle/blog-server)

NodeJS + Express + MongoDB + Mongoose

# 后端
接口文档：[API文档](https://console-docs.apipost.cn/preview/c671abaeb3ac6f29/c22da7ca55753064)

1. 登陆、注册、自动登陆校验
2. 分类的增删改查
3. 文章的增删改查
4. 敏感操作（增删改）校验token
5. API视情况返回不同的json信息

获取文章时通过携带的query参数不同，可以实现分页查询、查询指定分类的文章、标题和内容关键词搜索等

# 前端
1. 路由拦截，自动登陆
2. 完整的管理后台，文章管理、富文本编辑、分类管理
3. 人性化的交互，加载提示、信息提示
4. 表单输入内容的校验
5. 管理员登陆状态的管理
6. 对分类等数据进行暂存，除非进行了修改，否则不去请求后端接口
7. 使用pinia管理状态以及对状态的操作，两个store：UserStore、PostStore
8. 代码上，对文章列表、富文本编辑等组件的封装，方便复用

# Tip
因为是个人博客，所以后端没有设计区分多用户的文章、分类管理，注册好管理员就改后端代码把注册接口堵死吧

后端config.js保存了token加密字符串、数据库连接url等配置

# 截图
![image](https://github.com/qxchuckle/blog-vue/assets/55614189/f7d3a39f-f855-4c0b-a265-b1131a4d838f)

![image](https://github.com/qxchuckle/blog-vue/assets/55614189/8c1b9f09-b2a3-4970-ae82-ef66dd1f0ce8)

![image](https://github.com/qxchuckle/blog-vue/assets/55614189/9051c87e-bbe3-4e9b-ba6f-ce673f7b87b2)

![image](https://github.com/qxchuckle/blog-vue/assets/55614189/9a5f1d4e-b890-432e-a9ff-f31608b51406)
