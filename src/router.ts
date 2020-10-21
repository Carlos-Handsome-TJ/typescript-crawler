import { Router, Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import Crawler from './utils/crawler'
import Analyzer from './utils/analyzer'
import { getResponseData } from './utils/util'

interface BodyRequest extends Request {
    body: {
        [key: string]: string | undefined;
    }
}
//检验是否登录的中间件：
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : undefined
    if (isLogin) next()
    else res.json(getResponseData('请先登录'))
}
const router = Router()
router.get('/', (req, res) => {
    const isLogin = req.session ? req.session.login : undefined
    if (isLogin) {
        res.send(`
            <html>
                <body>
                    <a href="/logout">退出登录</a>
                </body>
            </html>
        `)
    } else {
        res.send(`
        <html>
            <body>
                <form method="post" action="/login">
                    <input type="password" name="password" />
                    <button type="submit">点击登录</button>
                </form>
            </body>
        </html>
    `)
    }
})
//登录：
router.post('/login', (req: BodyRequest, res: Response) => {
    const { password } = req.body
    const isLogin = req.session ? req.session.login : undefined
    if (isLogin) {
        res.send('已经登录~')
    } else {
        if (password === '123' && req.session) {
            req.session.login = true
            res.send(`
                <html>
                    <body>
                        <a href="/getData">爬取数据</a>
                        <a href="/logout">退出登录</a>
                    </body>
                </html>
            `)
        } else {
            res.json(getResponseData('密码不正确~'))
        }
    }
})
//退出登录：
router.get('/logout', checkLogin, (req: Request, res: Response) => {
    if (req.session) req.session.login = undefined
    res.redirect('/')
})
//爬取数据：
router.get('/getData', checkLogin, (req: Request, res: Response) => {
    const url = 'http://www.dell-lee.com/typescript/demo.html?secret' + 'x3b174jsx'
    const analyze = Analyzer.getInstance()
    new Crawler(url, analyze)
    try {
        const fileContent = fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf-8')
        res.json(JSON.parse(fileContent))
        res.json(getResponseData('', JSON.parse(fileContent)))
    } catch (e) {
        console.log(e)
        res.json(getResponseData('数据为空~'))
    }
})

export default router