import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Minutely from "@/views/TheLastMinute.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		component:Minutely
	},
]	

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
