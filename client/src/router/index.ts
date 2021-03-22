import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Hourly from "@/views/TheHourly.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		component:Hourly
	},
]	

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
