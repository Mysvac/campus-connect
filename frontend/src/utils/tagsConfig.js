// 商品标签配置
// 这个文件用于确保前端和后台管理的标签保持一致

export const productTags = [
  { id: 1, name: '图书教材', value: 1, label: '图书教材' },
  { id: 2, name: '生活服务', value: 2, label: '生活服务' },
  { id: 3, name: '电子产品', value: 3, label: '电子产品' },
  { id: 4, name: '运动器材', value: 4, label: '运动器材' },
  { id: 5, name: '服装鞋帽', value: 5, label: '服装鞋帽' },
  { id: 6, name: '日用百货', value: 6, label: '日用百货' },
  { id: 7, name: '票券礼品', value: 7, label: '票券礼品' },
  { id: 8, name: '其他', value: 8, label: '其他' }
];

// 用于前端组件的标签格式
export const frontendTags = productTags.map(tag => ({
  id: tag.id,
  name: tag.name,
  active: false
}));

// 用于后台管理的标签格式
export const backendTags = productTags.map(tag => ({
  value: tag.value,
  label: tag.label
}));

// 根据标签ID获取标签名称
export function getTagLabel(tagId) {
  const tag = productTags.find(t => t.id === tagId || t.value === tagId);
  return tag ? tag.label : `标签${tagId}`;
}

// 根据标签名称获取标签ID
export function getTagId(tagName) {
  const tag = productTags.find(t => t.name === tagName || t.label === tagName);
  return tag ? tag.id : null;
}
