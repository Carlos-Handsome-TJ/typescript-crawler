import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import router from './router'

const app = express()
//解析post表单中的内容：
app.use(bodyParser.urlencoded({ extended: false }))
//登录中间件：
app.use(cookieSession({
    name: 'session',
    keys: ['carlos'],
    maxAge: 1000 * 60 * 60 * 24
}))
//后端路由处理：
app.use(router)
app.listen(3000, () => {
    console.log('后端运行正常~')
})