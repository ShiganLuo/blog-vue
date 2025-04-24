// utils/geolocation.ts
import axios from 'axios'

export async function getVisitorLocation() {
  try {
    const response = await axios.get('https://ipapi.co/json/')
    return {
      ip: response.data.ip,
      city: response.data.city,
      country: response.data.country_name,
      latitude: response.data.latitude,
      longitude: response.data.longitude
    }
  } catch (error) {
    console.error('Failed to fetch location:', error)
    return null
  }
}
/**
 * 将度数转换为弧度
 * @param degrees 角度值
 * @returns 弧度值
 */
function rad(degrees: number): number {
    return degrees * Math.PI / 180.0;
}

/**
 * 计算两个经纬度坐标之间的距离（Haversine公式）
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @returns 两点之间的距离（单位：千米）
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6378; // 地球半径，单位：千米
    const radLat1 = rad(lat1);
    const radLat2 = rad(lat2);
    const a = radLat1 - radLat2;
    const b = rad(lon1) - rad(lon2);
  
    const sinHalfA = Math.sin(a / 2);
    const sinHalfB = Math.sin(b / 2);
    const cosRadLat1 = Math.cos(radLat1);
    const cosRadLat2 = Math.cos(radLat2);
  
    const s = 2 * Math.asin(
      Math.sqrt(
        sinHalfA * sinHalfA + 
        cosRadLat1 * cosRadLat2 * sinHalfB * sinHalfB
      )
    );
  
    return R * s
}

export function isMobile() {
  // 手机端
  let reg =
    /(phone|pad|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
  return reg.test(navigator.userAgent);
}
