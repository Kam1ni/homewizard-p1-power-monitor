<template>
	<div class="usage" :class="colorClass">
		<div class="arrow" v-if="currentUsage < 0">
			&#129069;
		</div>
		<div class="arrow" v-else-if="currentUsage > 0">
			&#129071;
		</div>
		<div class="spacer"></div>
		<div class="text">
			{{displayedUsage}}<span class="small">W</span>
		</div>
	</div>
</template>

<script lang="ts">
import { DataService } from '@/services/data-service';
import Vue from 'vue'
export default Vue.extend({
	data(){
		return {
			interval:0,
			currentUsage:0
		}
	},
	computed:{
		colorClass():string{
			if (this.currentUsage == 0){
				return "black";
			}else if (this.currentUsage < 0){
				return "green"
			}
			return "red"
		},
		displayedUsage():string{
			return Math.abs(this.currentUsage).toString();
		}
	},
	methods:{
		async fetch(){
			let result = await DataService.getCurrent();
			this.currentUsage = result.powerUsage;
		}
	},
	created(){
		this.interval = setInterval(this.fetch, 1000);
	},
	destroyed(){
		clearInterval(this.interval);
	}
})
</script>

<style scoped>
.usage{
	font-size: 100px;
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color:white;
	padding: 5px 10px;
	box-sizing: border-box;
	font-weight: bold;
	overflow: hidden;
}

.spacer{
	flex-grow: 1;
}

.arrow{
	font-size: 150px;
	align-self: flex-start;
}

.text{
	align-self: flex-end;
}

.usage>* {
	text-align: right;
	width: 100%;
}

.usage.black {
	background-color:#131313;
}

.usage.green{
	background-color:#3c803c;
}

.usage.red{
	background-color:#ac4545;
}

.small {
	font-size: 20px;
}
</style>