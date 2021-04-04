<template>
	<app-basic-chart v-if="entries.length != 0" :data="entries" list="last-hour" time-unit="minute"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataService } from '@/services/data-service'
import AppBasicChart from "@/components/BasicChart.vue"
import { DataAverage } from '@/models/data-average';

const INTERVAL = 360;

export default Vue.extend({
	data(){
		return {
			entries:[] as DataAverage[],
			interval:0
		}
	},
	methods:{
		async getData(){
			this.entries = await DataService.getAverages(INTERVAL, 10)
		}
	},
	async created(){
		this.getData();
		this.interval = setInterval(()=>{
			this.getData();
		}, INTERVAL*1000)
	},
	destroyed(){
		clearInterval(this.interval)
	},
	components:{
		AppBasicChart
	}
})
</script>