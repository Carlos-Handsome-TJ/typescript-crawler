import fs from 'fs'
import cheerio from 'cheerio'
import { Analyze } from './crawler'

interface Course {
    title: string;
    count: number;
}
interface CourseInfo {
    time: number;
    data: Course[];
}
interface FileContent {
    [propName: number]: Course[];
}
export default class Analyzer implements Analyze{
    private getCourseInfo(html: string) {
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
    private getJsonContent(courseContent: CourseInfo, filePath: string) {
        let courseResult: FileContent = {}
        if (fs.existsSync(filePath)) {
            courseResult = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
        courseResult[courseContent.time] = courseContent.data
        return JSON.stringify(courseResult)
    }
    public analyze(html: string, filePath: string) {
        const courseInfo = this.getCourseInfo(html)
        const courseResult = this.getJsonContent(courseInfo, filePath)
        return courseResult
    }
}