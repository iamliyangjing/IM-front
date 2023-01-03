import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/views/login/Login";
import Register from "@/views/Register/Register";


Vue.use(Router)

const routes = [
    {
        path: "/login",
        name: Login,
        component:Login
    },
    {
        path: "/",
        name: Login,
        component:Login
    },
    {
        path: "/register",
        name: Register,
        component: Register
    }
]

// eslint-disable-next-line no-undef
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

