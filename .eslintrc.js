module.exports = {
  // env 指定代码运行的环境，包括浏览器、CommonJS、ES6和Node.js
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  // extends 指定要扩展的规则集，这里使用了 eslint:recommand 和 plugin:vue/vue3-essential
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  // overrides 指定了要覆盖的规则集
  overrides: [],
  // parserOptions 指定了代码解析器的选项，这里包括了ECMAScript的版本和源代码模块类型
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  // plugins 指定了要使用的插件，这里使用了 vue
  plugins: ["vue"],
  // rules 指定了一些自定义的规则，这里包括了最大行长度、
  rules: {
    "max-len": ["error", { code: 120 }],
  },
};
