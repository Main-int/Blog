/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { router } from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { AdminStore } from './stores/AdminStore';

// 配置服务器的基地址
axios.defaults.baseURL = "http://localhost:8080"

const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])

const app = createApp(App)
// 全局注册axios
app.provide("axios", axios)

app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL)

app.use(naive)
app.use(createPinia())
app.use(router)

// 拦截器，不用都写headers
const adminStore = AdminStore()
axios.interceptors.request.use((config)=>{
    config.headers.token = adminStore.token
    return config
})
app.mount('#app')
