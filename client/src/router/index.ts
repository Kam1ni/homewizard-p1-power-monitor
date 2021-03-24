import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import AppLastMinute from "@/views/TheLastMinute.vue";
import AppLastHour from "@/views/TheLastHour.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path:"/",
		redirect:"/last-minute"
	},
	{
		path: "/last-minute",
		component:AppLastMinute
	},
	{
		path: "/last-hour",
		component:AppLastHour
	},
]	

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
