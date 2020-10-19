import cheerio from 'cheerio'
import fs from 'fs'
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
export default class Analyzer implements Analyze {
    private static instance: Analyzer;
    public static getInstance() {
        if (!Analyzer.instance) {
            Analyzer.instance = new Analyzer()
        }
        return Analyzer.instance
    }
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
    private getJsonContent(courseInfo: CourseInfo, filePath: string) {
        let courseContent: FileContent = {}
        if (fs.existsSync(filePath)) {
            courseContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
        courseContent[courseInfo.time] = courseInfo.data
        return JSON.stringify(courseContent)
    }
    public analyze(html: string, filePath: string) {
        const courseResult = this.getCourseInfo(html)
        const jsonFile = this.getJsonContent(courseResult, filePath)
        return jsonFile
    }
    private constructor() {}
}