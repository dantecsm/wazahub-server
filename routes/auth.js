import express from 'express'
import {checkUsername, checkPassword} from '../helper/check'
import {hash} from '../helper/util'
import { User } from '../models'

const router = express.Router()

// 新建用户
router.post('/register', checkUsername, checkPassword, (req, res, next) => {
  console.log('/register')
  let username = req.body.username
  let password = req.body.password
  let avatar = '//blog-server.hunger-valley.com/avatar/' + (Math.floor(Math.random()*87)) + '.jpg'

  User.findOrCreate({
    where: {username}, 
    defaults: {encryptPassword: hash(password), avatar}
  }).spread((user, created)=>{
      if(!created){
        return res.send({status:'fail', msg: '用户已存在'})
      }
      let json = user.get({plain: true})
      req.session.user = json
      delete json.encryptPassword
      res.send({status:'ok',msg: '创建成功', data: json})
    })

})


router.get('/', (req, res, next) => {
  // req.session.user 代表发来请求的这个用户登录了 {session: user}
  if(req.session.user){
    res.send({status:'ok',isLogin: true, data: req.session.user})
  }else {
    res.send({status:'ok', isLogin: false})
  }
})

router.get('/logout', (req, res, next) => {
  if(req.session.user){
    req.session.destroy()
    res.send({status:'ok',msg: '注销成功'})
  }else {
    res.send({status:'fail',msg: '当前用户尚未登录'})
  }

})

router.post('/login', checkUsername, checkPassword, (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  // 从数据中检索用户名一致的用户对象
  User.findOne({where: {username}})
    .then(user=>{
      if(!user){
        return res.send({status:'fail',msg:'用户不存在'})
      }
      if(user.encryptPassword !== hash(password)){
        return res.send({status:'fail',msg:'密码不正确'})
      }
      let json = user.get({plain: true})
      req.session.user = json
      delete json.encryptPassword
      res.send({status:'ok',msg: '登录成功', data: json})
    })
})


export default  router

