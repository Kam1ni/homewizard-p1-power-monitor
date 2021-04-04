<template>
	<canvas ref="canvas" height="292" width="480"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { ListType } from '@/services/data-service'
import { Chart, TimeUnit } from "chart.js";
import { DataAverage } from '@/models/data-average';

interface ITimePoint {
	y:number;
	t:Date;
}

export default Vue.extend({
	data(){
		return {
			chart:null as null | Chart,
			type:"last-hour" as ListType
		}
	},
	props:{
		list:{
			type:String as ()=>ListType,
			required:true
		},
		data:{
			type:Array as ()=>DataAverage[],
			required:true,
		},
		timeUnit:{
			type:String,
			default: ()=> "second"
		}
	},
	computed:{
		tUnit():TimeUnit{
			return this.timeUnit as TimeUnit;
		}
	},
	watch:{
		data(){
			this.onNewData();
		}
	},
	methods:{
		getSortedData():ITimePoint[] {
			return this.data.map(d=>{
				return {
					t: d.begin,
					y: d.average
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
		onNewData():void{
			if (!this.chart) return;
			if (!this.chart.data.datasets) return;
			let dataset = this.chart.data.datasets[0];
			if (!dataset.data) return;
			let d = this.getSortedData();
			dataset.data = d;
			dataset.borderColor = this.getColors(d);
			this.setMinAndMaxValues();
			this.chart.update();
		},
		setMinAndMaxValues():void{
			if (!this.chart) return;
			if (!this.chart.data.datasets) return;
			let largest = 0;
			for (let item of this.data){
				largest = Math.max(largest, Math.abs(item.average));
			}
			largest = Math.ceil(largest / 1000.0) * 1000.0;
			if (!this.chart.options.scales) return;
			if (!this.chart.options.scales.yAxes) return;
			this.chart.options.scales.yAxes[0].ticks = {
				suggestedMin: -largest,
				suggestedMax: largest,
			}
		}
	},
	mounted(){
		this.type = this.list;
		let canvas = this.$refs.canvas as HTMLCanvasElement;
		let data = this.getSortedData();
		this.chart = new Chart(canvas, {
			type:"line",
			data:{
				datasets:[
					{
						label:"test",
						data:data,
						borderWidth:4,
						fill:false,
						borderColor:this.getColors(data),
					},
				],
			},
			options:{
				animation:{
					duration:0,
				},
				scales:{
					scaleLabel:{
						display:false,
					},

					xAxes:[
						{
							type:"time",
							time:{
								unit:this.tUnit,
							},
						},
					],
				},
				legend:{
					display:false
				}
			}
		});
		this.setMinAndMaxValues();
		this.chart.update();
	},
})
</script>