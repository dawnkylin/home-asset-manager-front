// 防抖
export function debounce(func, delay, imdediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 delay
    if (last < delay && last > 0) {
      timeout = setTimeout(later, delay - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!imdediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    // 保存当前上下文
    context = this;
    // 保存当前时间，用于判断是否需要立即执行，如果是立即执行，就不需要延时了
    timestamp = +new Date();
    // 延时不存在且立即执行，执行函数
    const callNow = imdediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, delay);
    // 如果是立即执行，调用函数
    if (callNow) {
      // 传入当前上下文和参数
      result = func.apply(context, args);
      // 清空上下文和参数，防止内存泄漏
      context = args = null;
    }

    return result;
  }
}
