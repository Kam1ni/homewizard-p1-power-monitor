<template>
	<app-basic-chart v-if="entries.length != 0" :starting-data="entries" list="last-hour"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataEntry } from '@/models/data-entry'
import { DataService } from '@/services/data-service'
import AppBasicChart from "@/components/BasicChart.vue"

export default Vue.extend({
	data(){
		return {
			entries:[] as DataEntry[],
		}
	},
	methods:{
	
	},
	async created(){
		this.entries = await DataService.getLastHour()
	},
	components:{
		AppBasicChart
	}
})
</script>