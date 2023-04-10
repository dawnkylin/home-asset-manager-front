export function isPhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

export function isPassword(pass) {
  // 至少包含一个字母和一个数字，长度至少6位
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return reg.test(pass);
}
