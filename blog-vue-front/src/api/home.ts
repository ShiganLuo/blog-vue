import { request } from "./http";
export const homeGetStatistic = ( data?: object ) => {
    return request({
        method: 'post',
        url: ' ',
        data:data
    })
}