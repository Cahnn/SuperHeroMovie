import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 用Vue.prototype挂载
Vue.prototype.server_url = "https://www.imovietrailer.com/superhero";
// const server_url = "https://www.imovietrailer-dev.com/superhero"; 开发环境

// 缓存用户信息，全局使用
Vue.prototype.getGlobalUser = function(key) {
	var userInfo = uni.getStorageSync("globalUser")
	if(userInfo != null && userInfo != "" && userInfo != undefined) {
		return userInfo
	} else{
		return null
	}
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
