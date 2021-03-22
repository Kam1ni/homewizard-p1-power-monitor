import EventEmitter = require("events");
import { getP1Data } from "./home-wizard";

const MAX_DATA_ENTRIES = 60;

export class DataEntry {
	public timeStamp:Date = new Date();
	public powerUsage:number = 0;

	public constructor(powerUsage:number){
		this.powerUsage = powerUsage;
	}
}


export class DataList extends EventEmitter{
	public lastMinute:DataEntry[] = [];
	public lastHour:DataEntry[] = [];
	private timeout:NodeJS.Timeout | null = null;

	public addEntry(entry:DataEntry){
		this.addToLastMinute(entry);
		this.addToLastHour(entry);
	}

	private addToLastMinute(entry:DataEntry){
		this.lastMinute.push(entry);
		while (this.lastMinute.length > 60){
			this.lastMinute.shift();
		}
	}

	private addToLastHour(entry:DataEntry){
		if (this.lastHour.length == 0) {
			this.lastHour.push(entry);
			return;
		}

		let lastEntry = this.lastHour[this.lastHour.length-1];
		if (lastEntry.timeStamp.getTime() <= (entry.timeStamp.getTime() - 60000)){
			this.lastHour.push(entry);
		}

		while (this.lastHour.length > 60) {
			this.lastHour.shift();
		}
	}

	public startPolling(ipAddress:string){
		if (this.timeout) return;
		this.timeout = setInterval(async ()=>{
			let data = await getP1Data(ipAddress);
			let entry = new DataEntry(data.active_power_w);
			this.addEntry(entry);
			this.emit("data", entry);
		}, 1000);
	}

	public stopPolling(){
		if (!this.timeout) return;
		clearInterval(this.timeout);
	}
}