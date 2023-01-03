// import ES2015模块语法，可以引入第三方模块。require module.exports
// export ES2015模块语法 暴露接口，可以被其他模块调用 module.exports
import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


Vue.config.productionTip = false  // 配置开发选项，友好的错误提示

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
