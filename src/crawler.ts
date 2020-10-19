import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import Analyzer from './analyzer'

export interface Analyze {
    analyze: (html: string, filePath: string) => string;
}
class Crawler {
    private filePath = path.resolve(__dirname, '../data/data.json')
    async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }
    public writeFile(file: string) {
        fs.writeFileSync(this.filePath, file)
    }
    async initSpiderProcess() {
        const html = await this.getRawHtml()
        const jsonContent = this.analyzer.analyze(html, this.filePath)
        console.log(jsonContent)
        this.writeFile(jsonContent)
    }
    constructor(private url: string, private analyzer: Analyze) {
        this.initSpiderProcess()
    }
}
const url = 'http://www.dell-lee.com/typescript/demo.html?secret=' + 'x3b174jsx'
const analyzer = new Analyzer()
const crawler = new Crawler(url, analyzer)
