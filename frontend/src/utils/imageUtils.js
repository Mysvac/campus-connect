import { baseURL } from '@/api/index';

/**
 * 获取完整的图片URL
 * @param {string} imagePath - 图片相对路径
 * @returns {string} 完整的图片URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) {
    return '/images/default.jpg'; // 默认图片
  }
  
  // 如果已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 如果是相对路径，拼接baseURL
  if (imagePath.startsWith('/')) {
    return baseURL.replace(/\/$/, '') + imagePath;
  }
  
  // 如果没有以/开头，添加/
  return baseURL.replace(/\/$/, '') + '/' + imagePath;
}
