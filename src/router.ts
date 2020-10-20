import { Router, Request, Response } from 'express'
import Crawler from './crawler'
import Analyzer from './analyzer'

const router = Router()
router.get('/', (req, res) => {
    res.send('hello!')
})
router.get('/getData', (req: Request, res: Response) => {
    const url = 'http://www.dell-lee.com/typescript/demo.html?secret' + 'x3b174jsx'
    const analyze = Analyzer.getInstance()
    new Crawler(url, analyze)
    res.send('getData')
})
export default router