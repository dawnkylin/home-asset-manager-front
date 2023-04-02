// 用于处理汉堡包图标控制菜单栏的隐藏与显示时，其他网格内容自动占满空余位置
export default{
  mounted(el,binding){
    const {value}=binding;
    el.style.gridColumn=value?"2/3":"1/3";
  },
  updated(el,binding){
    const {value}=binding;
    el.style.gridColumn=value?"2/3":"1/3";
  }
}