export function isPhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

export function isPassword(pass) {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return reg.test(pass);
}
