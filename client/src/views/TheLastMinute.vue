<template>
	<div>
		<canvas ref="canvas" height="360" width="480"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataEntry } from '@/models/data-entry'
import { DataService } from '@/services/data-service'
import { Chart } from "chart.js";

interface ITimePoint {
	y:number;
	t:Date;
}

export default Vue.extend({
	data(){
		return {
			entries:[] as DataEntry[],
			chart:null as null | Chart
		}
	},
	methods:{
		getSortedData():ITimePoint[] {
			let now = new Date();
			return [...this.entries].sort((a:DataEntry,b :DataEntry):number=>{
				return b.timeStamp.getTime() - a.timeStamp.getTime();
			}).map(d=>{
				return {
					t: d.timeStamp,
					y: d.powerUsage
				}
			});
		},
		onNewData(data:DataEntry){
			if (!this.chart) return;
			if (!this.chart.data.datasets) return;
			let dataset = this.chart.data.datasets[0];
			if (!dataset.data) return;
			dataset.data.unshift({
				t:data.timeStamp,
				y:data.powerUsage
			} as any)
			dataset.data.pop();
			this.chart.update();
		}
	},
	async mounted(){
		await DataService.getLastMinute()
		this.entries = DataService.hourlyData;
		let canvas = this.$refs.canvas as HTMLCanvasElement;
		console.log(this.getSortedData());
		this.chart = new Chart(canvas, {
			type:"line",
			data:{
				datasets:[
					{
						label:"Power usaage",
						data:this.getSortedData(),
						borderWidth:4,
						fill:false,
					},
				],
			},
			options:{
				animation:{
					easing:"linear",
				},
				scales:{
					xAxes:[
						{
							type:"time",
							
							time:{
								unit:"second"
							}
						}
					]
				}
			}
		});
		DataService.on("data", this.onNewData);
	},
	destroyed(){
		DataService.off("data", this.onNewData)
	}
})
</script>