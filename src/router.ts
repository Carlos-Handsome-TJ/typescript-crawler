import { Router, Request, Response } from 'express'
import Crawler from './crawler'
import Analyzer from './analyzer'

const router = Router()
router.get('/', (req, res) => {
    res.send(`
    <html>
        <body>
            <form method="post" action="/getData">
                <input type="password" name="password"/>
                <button type="submit">提交</button>
            </form>
        </body>
    </html>
    `)
})
router.post('/getData', (req: Request, res: Response) => {
    console.log(req.body.password)
    // const url = 'http://www.dell-lee.com/typescript/demo.html?secret' + 'x3b174jsx'
    // const analyze = Analyzer.getInstance()
    // new Crawler(url, analyze)
    res.send('getData success')
})
export default router