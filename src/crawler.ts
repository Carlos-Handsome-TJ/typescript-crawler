import superagent from 'superagent'
import cheerio from 'cheerio'

interface Course {
    title: string
}
class Crawler {
    private key = '"x3b174jsx'
    private url = 'http://www.dell-lee.com/typescript/demo.html?secret=' + this.key
    getCourseInfo(html: string) {
        const $ = cheerio.load(html)
        const courseItems = $('.course-item')
        const courseData: Course[] = []
        courseItems.map((index, item) => {
            const desc = $(item).find('.course-desc').text()
            courseData.push({
                title: desc,
            })
        })
        const courseInfo = {
            time: (new Date()).getTime(),
            data: courseData
        }
        console.log(courseInfo)
    }
    async getRawHtml() {
        const result = await superagent.get(this.url)
        this.getCourseInfo(result.text)
    }
    constructor() {
        this.getRawHtml()
    }
}
const crawler = new Crawler()