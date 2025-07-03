import { request } from "./http";
export const homeGetConfig = (data?: object) => {
    return request({
        method: 'post',
        url: '',
        data:data
    })

}