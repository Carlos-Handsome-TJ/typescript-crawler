interface ResponseData {
    success: boolean;
    errMsg?: string;
    data?: any;
}

export const getResponseData = (errMsg?: string, data?: any): ResponseData => {
    if (errMsg) {
        return {
            success: false,
            errMsg,
        }
    }
    return {
        success: true,
        data
    }
}