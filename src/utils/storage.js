/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    // 如果content不是字符串，将其转换为字符串
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getLocalStorage = (name) => {
  if (!name) return;
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return localStorage.getItem(name);
  }
};

/**
 * 删除localStorage
 */
export const removeLocalStorage = (name) => {
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
