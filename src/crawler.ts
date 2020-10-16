import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import cheerio from 'cheerio'

interface Course {
    title: string;
    count: number;
}
interface FileContent {
    [propName: number]: Course[];
}
interface CourseInfo {
    time: number;
    data: Course[];
}
class Crawler {
    private key = 'http://www.dell-lee.com/typescript/demo.html?secret='
    private url = 'http://www.dell-lee.com/typescript/demo.html?secret=' + this.key
    private filePath = path.resolve(__dirname, '../data/data.json')
    //获取HTML文件：
    async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }
    //从HTML文件中获取course信息：
    getCourseInfo(html: string) {
        const $ = cheerio.load(html)
        const courseItem = $('.course-item')
        const courseInfo: Course[] = []
        courseItem.map((index, item) => {
            const title = $(item).find('.course-desc').eq(0).text()
            const count = parseInt($(item).find('.course-desc').eq(1).text().split('：')[1], 10)
            courseInfo.push({
                title,
                count
            })
        })
        return {
            time: (new Date()).getTime(),
            data: courseInfo
        }
    }
    //把获取到的数据转化成JSON文件格式：
    getJsonContent(courseResult: CourseInfo) {
        let courseContent: FileContent = {}
        if (fs.existsSync(this.filePath)) {
            courseContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
        }
        courseContent[courseResult.time] = courseResult.data
        return JSON.stringify(courseContent)
    }
    //将文件写入到本地文件夹当中：
    writeFile(courseContent: string) {
        fs.writeFileSync(this.filePath, courseContent)
    }
    //处理爬取功能函数：
    async initSpiderProcess() {
        const html = await this.getRawHtml()
        const courseResult = this.getCourseInfo(html)
        const fileContent = this.getJsonContent(courseResult)
        this.writeFile(fileContent)
    }
    constructor() {
        this.initSpiderProcess()
    }
}
new Crawler()