import express from 'express'
import { checkBlog, checkLogin } from '../helper/check'
import { Blog, User } from '../models'
const router = express.Router()

//获取博客
router.get('/', (req, res) => {
  console.log(req.query)
  let userId = req.query.userId
  let atIndex = req.query.atIndex
  let page = parseInt(req.query.page) || 1
  let limit = 10
  let offset = (page - 1) * limit
  let option = { offset, limit,  where: {},
    attributes: {exclude: ['userId', 'content']},
    include: [{ model: User, as: 'user', attributes: { exclude: ['encryptPassword'] } }],
    order: [['createdAt', 'DESC']]
  }
  
  if(userId) {
    option.where.userId =  userId 
  }
  if(atIndex) {
    option.where.atIndex = JSON.parse(req.query.atIndex)
  }
  Blog.findAndCountAll(option)
    .then(({count, rows}) => {
      let data = { 
        status: 'ok', 
        msg: '获取成功', 
        total: count, 
        totalPage: Math.ceil(count/limit), 
        page: page,
        data: rows
      }
      res.send(data)
    }).catch(()=>{
      res.send({status:'fail', msg:'查询失败'})
    })
})

router.get('/:blogId', (req, res) => {

  Blog.findById(req.params.blogId, {
    attributes: {exclude: ['userId']},
    include: [{ model: User, as: 'user', attributes: { exclude: ['encryptPassword'] } }]
  }).then(result => {
      let data = result.get({plain: true})
      let ret = {
        status: 'ok',
        msg: '获取成功',
        data: data
      }
      res.send(ret)
    }).catch(()=>{
      res.send({status:'fail', msg:'博客不存在'})
    })
})

//创建博客
router.post('/', checkLogin, /*checkBlog, */(req, res) =>{
  let title = req.body.title
  let content = req.body.content
  let description = req.body.description
  let atIndex = req.body.atIndex

  let ret = {status: 'ok', msg: '创建成功'}

  let option = {title, content, description, userId: req.session.user.id}
  if(atIndex) {
    option.atIndex = JSON.parse(req.body.atIndex) || false
  }

  Blog.create(option).then(result=>{
    console.log(result)
    ret.data = result.get({plain: true})
    return User.findById(result.userId, {attributes: { exclude: ['encryptPassword'] }})
  }).then(user=>{
    console.log(user)
    console.log(user.get({plain: true}))

    ret.data.user = user.get({plain: true})
    console.log(ret)
    res.send(ret)
  }).catch(()=>{
      res.send({status:'fail', msg:'创建失败'})
    })
})

//修改博客
router.patch('/:blogId', checkLogin, /*checkBlog,*/ (req, res) =>{
  let title = req.body.title
  let content = req.body.content
  let description = req.body.description
  let atIndex = req.body.atIndex
  let obj = {}
  if(title) {
    obj.title = title
  }
  if(content) {
    obj.content = content
  }
  if(description) {
    obj.description = description
  }
  if(atIndex) {
    obj.atIndex = JSON.parse(req.body.atIndex)
  }

  Blog.update(obj,{where: {id: req.params.blogId, userId: req.session.user.id}})
    .then(([affectRow])=>{
      if(affectRow === 0){
        return res.send({status:'fail', msg: '博客不存在或你没有权限'})
      }
      return Blog.findById(req.params.blogId, {
              attributes: {exclude: ['userId']},
              include: [{ model: User, as: 'user', attributes: { exclude: ['encryptPassword'] } }]
            })
    }).then(result=>{
        let data = result.get({plain: true})
        let ret = {
          status: 'ok',
          msg: '修改成功',
          data: data
        }
        res.send(ret)
    }).catch(()=>{
      res.send({status:'fail', msg:'修改失败'})
    })   
})

//删除博客
router.delete('/:blogId', checkLogin, (req, res) =>{
  Blog.destroy({where: {id: req.params.blogId, userId: req.session.user.id}})
    .then(affectRow => {
      if(affectRow === 0){
        return res.send({status:'fail', msg: '博客不存在或你没有权限'})
      }
      res.send({status:'ok', msg: '删除成功'})
    }).catch(()=>{
      res.send({status:'fail', msg:'删除失败'})
    })

})


export default router
