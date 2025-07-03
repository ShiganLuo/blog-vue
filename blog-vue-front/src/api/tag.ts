import { request } from "./http";
export const getAllTag = ( data?: object ) => {
    return request({
        method: 'post',
        url: ' ',
        data: data
        
    })
}