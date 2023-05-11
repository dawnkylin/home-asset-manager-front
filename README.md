# 家庭资产管家前端项目技术介绍

## 项目介绍

家庭资产管家前端项目是一个基于Vue.js的前后端分离的家庭资产管理系统，前端项目使用Vue3+Element-plus+VueRouter+Pinia+Axios+Webpack5等技术。

## 项目结构

```bash
├── dist # 打包后的文件
├── public # 静态资源
├── src # 源代码
│   ├── assets # 静态资源
│   ├── components # 公共组件
│   ├── router # 路由
│   ├── stores # pinia
│   ├── utils # 工具类
│   ├── views # 页面
│   ├── App.vue # 入口页面
│   ├── main.js # 入口文件
├── .env # 环境变量
├── .env.development # 开发环境变量
├── .env.production # 生产环境变量
```

## 项目运行

```bash
# 克隆项目
git clone

# 进入项目目录
cd

# 安装依赖
npm install

# 启动服务
npm run dev
```

## 项目打包

```bash
# 打包生产环境
npm run build
```

## 项目部署

```bash
# 安装pm2
npm install pm2 -g

# 启动项目
pm2 start npm --name "家庭资产管家前端项目" -- run start

# 查看项目状态
pm2 status

# 停止项目
pm2 stop 家庭资产管家前端项目

# 重启项目
pm2 restart 家庭资产管家前端项目

# 删除项目
pm2 delete 家庭资产管家前端项目
```
> pm2的使用请参考[pm2官网](https://pm2.keymetrics.io/)

## 项目截图

## 项目功能

1、登录、注册、发送验证码、修改密码、忘记密码、退出登录

2、家庭资产管理-资产列表、资产详情、添加资产、修改资产、删除资产、批量删除资产、导出资产、导入资产、复制资产序列号、修改资产分类

3、家庭财务管理-财务列表、财务详情、添加财务、修改财务、删除财务、批量删除财务、导出财务、导入财务、复制财务序列号、修改财务分类

4、家庭成员管理-成员列表、删除成员

5、家庭管理-修改家庭信息、创建家庭、加入家庭、退出家庭、解散家庭

6、个人信息管理-修改个人信息、修改密码

# 家庭资产管理前端项目开发记录

1、家庭创建者才显示家庭成员管理的删除按钮，并且不可删除自己

2、家庭成员管理的删除按钮，点击后，弹出确认框，确认后，删除家庭成员

3、修改密码时先验证旧密码是否正确，再看新旧密码是否相同

4、个人信息的手机号、家庭序列号、注册时间皆不可修改

5、注册密码使用强密码验证

6、发布使用https协议，测试时使用http协议

7、数据备份使用阿里云OSS

8、漏洞扫描使用阿里云安全中心

9、使用阿里云CDN加速

10、使用阿里云云盾DDoS防护

11、可以使用卡片或者表格展示数据

12、可以使用图表展示数据

13、可以导入、导出数据

14、gson日期格式问题，它返回MM d, yyyy或者MMM d, yyyy，前端需要转换成yyyy-MM-dd，使用moment.js处理后，转换成yyyy-MM-dd，将其返回，后端再转换成Date类型，gson报错，故对gson使用自定义日期格式，使用yyyy-MM-dd HH:mm:ss

15、使用lodash的防抖函数，解决echarts图表的resize问题导致的页面不流畅

16、dialog中的form表单按回车键，提交表单，使用prevent修饰符阻止该行为

17、el-table的min-width小于等于其他列的width时，出现resize的bug，解决办法：将min-width设置为大于其他width的值

# Alibaba Cloud Linux的相关安装

确切版本：Alibaba Cloud Linux  3.2104 LTS 64位

安装redis

```shell
sudo yum install gcc make wget
# 下载redis
wget http://download.redis.io/releases/redis-6.2.6.tar.gz
# 解压redis包
tar xzf redis-6.2.6.tar.gz
# 进入redis目录，编译redis
cd redis-6.2.6
make
# 安装redis
sudo make install
# 启动redis作为后台服务
redis-server &
# 查看redis进程
ps -ef | grep redis
# 查看redis是否启动
redis-cli ping
# 如果返回PONG，说明redis启动成功
# 关闭redis保护模式
redis-cli config set protected-mode no
# 关闭redis
redis-cli shutdown
```
# 权限管理

使用pinia存储用户角色信息，使用vue-router的beforeEach钩子函数，判断用户角色
