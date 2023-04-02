/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) return;
  try {
    const t = JSON.parse(localStorage.getItem(name));
    return t;
  } catch (e) {
    return localStorage.getItem(name);
  }
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  localStorage.removeItem(name);
};

// 不建议在客户端设置token过期时间

export function setLocalStorageWithExpiration(key, value, expirationMinutes) {
  const expirationMS = expirationMinutes * 60 * 1000; // 转换为毫秒
  const record = {
    value: value,
    timestamp: new Date().getTime() + expirationMS, // 保存过期时间
  };
  localStorage.setItem(key, JSON.stringify(record));
}

export function getLocalStorageWithExpiration(key) {
  const record = JSON.parse(localStorage.getItem(key));
  if (!record) {
    return null;
  }
  return new Date().getTime() < record.timestamp && record.value;
}
