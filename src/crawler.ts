import superagent from 'superagent'

class Crawler {
    // private searchKey = 'crowllerKey'
    // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.searchKey}`
    private url = 'http://localhost:3000/'
    private getRawHtml = ''
    async getHtml() {
        const result = await superagent.get(this.url)
        console.log(result.text)
        // console.log('1231')
    }
    constructor() {
        this.getHtml()
    }
}