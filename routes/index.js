import express from 'express'
import auth from './auth'
import blog from './blog'

const router = express.Router()

router.get('/', (req, res)=>{
  console.log(req.session.user)
  res.render('index', req.session.user = {})
})

export {
  router as index,
  auth,
  blog
}

