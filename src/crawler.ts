import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import Analyzer from './analyzer'

export interface Analyze {
    analyze: (html: string, filePath: string) => string
}
class Crawler {
    private filePath = path.resolve(__dirname, '../data/data.json')
    private async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }
    private writeFile(jsonFile: string) {
        fs.writeFileSync(this.filePath, jsonFile)
    }
    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        const jsonFile = this.analyze.analyze(html, this.filePath)
        this.writeFile(jsonFile)
    }
    constructor(private url: string, private analyze: Analyze) {
        this.initSpiderProcess()
    }
}
const url = 'http://www.dell-lee.com/typescript/demo.html?secret' + 'x3b174jsx'
const analyze = Analyzer.getInstance()
new Crawler(url, analyze)