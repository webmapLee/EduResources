/**
 * 图片代理服务
 * 用于解决跨域和防盗链问题
 */

/**
 * 获取代理后的图片URL
 * @param {string} url - 原始图片URL
 * @returns {string} - 代理后的URL
 */
export function getProxiedImageUrl(url) {
  // 如果不是豆瓣图片链接，直接返回原链接
  if (!url || (!url.includes('doubanio.com') && !url.includes('douban.com'))) {
    return url;
  }
  
  // 使用免费的图片代理服务
  // 方案1: 使用weserv.nl图片代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  
  // 方案2: 如果有自建的代理服务，可以使用下面的代码
  // return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

/**
 * 处理图片加载错误
 * @param {Event} event - 错误事件
 * @param {string} fallbackImage - 备用图片URL
 */
export function handleImageError(event, fallbackImage = '/images/book-placeholder.jpg') {
  // 设置为默认图片
  event.target.src = fallbackImage;
  
  // 记录错误
  console.warn(`图片加载失败: ${event.target.alt || '未知图片'}`);
}