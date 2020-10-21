import { Router, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import Crawler from './crawler'
import Analyzer from './analyzer'

interface BodyRequest extends Request {
    body: {
        [key: string]: string | undefined;
    }
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
            res.send('密码不正确~')
        }
    }
})
//退出登录：
router.get('/logout', (req: Request, res: Response) => {
    const isLogin = req.session ? req.session.login : undefined
    if (isLogin && req.session) {
        req.session.login = undefined
    }
    res.redirect('/')
})
//爬取数据：
router.get('/getData', (req: Request, res: Response) => {
    const url = 'http://www.dell-lee.com/typescript/demo.html?secret' + 'x3b174jsx'
    const analyze = Analyzer.getInstance()
    new Crawler(url, analyze)
    try {
        const fileContent = fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf-8')
        res.json(JSON.parse(fileContent))
    } catch(e) {
        console.log(e)
        res.send('尚未爬取到内容~')
    }
})

export default router