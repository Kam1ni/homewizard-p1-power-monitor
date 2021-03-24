<template>
	<canvas ref="canvas" height="360" width="480"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataEntry } from '@/models/data-entry'
import { DataService, ListType } from '@/services/data-service'
import { Chart } from "chart.js";

interface ITimePoint {
	y:number;
	t:Date;
}

export default Vue.extend({
	data(){
		return {
			entries:[] as DataEntry[],
			chart:null as null | Chart,
			type:"last-hour" as ListType
		}
	},
	props:{
		list:{
			type:String as ()=>ListType,
			required:true
		},
		startingData:{
			type:Array as ()=>DataEntry[],
			required:true,
		}
	},
	methods:{
		getSortedData():ITimePoint[] {
			return [...this.entries].sort((a:DataEntry,b :DataEntry):number=>{
				return b.timeStamp.getTime() - a.timeStamp.getTime();
			}).map(d=>{
				return {
					t: d.timeStamp,
					y: d.powerUsage
				}
			});
		},
		getColors(data:ITimePoint[]):string[]{
			let result:string[] = [];
			for (let entry of data){
				if (entry.y > 0){
					result.push("red");
				}else{
					result.push("green");
				}
			}
			return result;
		},
		onNewData(data:DataEntry[]):void{
			if (!this.chart) return;
			if (!this.chart.data.datasets) return;
			let dataset = this.chart.data.datasets[0];
			if (!dataset.data) return;
			let oldData = dataset.data as ITimePoint[];
			for (let i = oldData.length-1; i >= 0; i --){
				let oldEntry = oldData[i] as ITimePoint;
				let foundEntry = data.find(d=>d.timeStamp.getTime() == oldEntry.t.getTime());
				if (foundEntry) continue;
				oldData.splice(i, 1);
			}
			for (let i = 0; i < data.length; i++){
				let entry = data[i];
				let oldEntry = oldData.find(d=>d.t.getTime()==entry.timeStamp.getTime());
				if (oldEntry) continue;
				oldData.unshift({
					t:entry.timeStamp,
					y:entry.powerUsage
				} as any);
			}
			dataset.borderColor = this.getColors(oldData);
			this.chart.update();
		}
	},
	mounted(){
		this.type = this.list;
		this.entries = this.startingData
		console.log(this.entries);
		let canvas = this.$refs.canvas as HTMLCanvasElement;
		let data = this.getSortedData();
		this.chart = new Chart(canvas, {
			type:"line",
			data:{
				datasets:[
					{
						label:"Power usaage",
						data:data,
						borderWidth:4,
						fill:false,
						borderColor:this.getColors(data),
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
		DataService.on(this.type, this.onNewData);
	},
	destroyed(){
		DataService.off(this.type, this.onNewData)
	}
})
</script>