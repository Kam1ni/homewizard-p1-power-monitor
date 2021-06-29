import EventEmitter = require("events");
import { getP1Data } from "./home-wizard";
import { searchDongle } from "./search-dongle";


export class DataEntry {
	public timeStamp:Date = new Date();
	public powerUsage:number = 0;

	public constructor(powerUsage:number){
		this.powerUsage = powerUsage;
	}
}

class DataAverage {
	public begin:Date | null = null;
	public end:Date | null = null;
	private total:number = 0;
	private entries:number = 0;

	public getAverage():number {
		return this.total / this.entries;
	}

	public getEntryCount():number {
		return this.entries;
	}

	public addEntry(entry:DataEntry){
		if (this.end == null || entry.timeStamp > this.end) {
			this.end = entry.timeStamp;
		}
		if (this.begin == null || entry.timeStamp < this.begin) {
			this.begin = entry.timeStamp;
		}
		this.total += entry.powerUsage;
		this.entries++;
	}

	public getJSON(){
		return {
			begin: this.begin,
			end: this.end,
			average: this.getAverage()
		};
	}
}


const MAX_DATA_ENTRIES = 60*60*24;

export class DataList{
	private allEntriesFromLastDay:DataEntry[] = [];
	private timeout:NodeJS.Timeout | null = null;
	private storedIpAddress:string = "";

	public getAverages(intervalInSeconds:number, count:number):DataAverage[]{
		let result:DataAverage[] = [];
		let currentAverage = new DataAverage();
		for (let i = this.allEntriesFromLastDay.length - 1; i >= 0 && result.length < count; i--){
			currentAverage.addEntry(this.allEntriesFromLastDay[i]);
			if (currentAverage.getEntryCount() > intervalInSeconds){
				result.unshift(currentAverage);
				currentAverage = new DataAverage;
			}
		}
		if (result.indexOf(currentAverage) == -1){
			if (currentAverage.begin != null) {
				result.unshift(currentAverage);
			}
		}
		return result;
	}

	public addEntry(entry:DataEntry){
		this.allEntriesFromLastDay.push(entry);
		if(this.allEntriesFromLastDay.length < MAX_DATA_ENTRIES) {
			this.allEntriesFromLastDay.splice(0, this.allEntriesFromLastDay.length - MAX_DATA_ENTRIES);
		}
	}

	public getLastEntry():DataEntry{
		if (this.allEntriesFromLastDay.length == 0){
			return new DataEntry(0);
		}
		return this.allEntriesFromLastDay[this.allEntriesFromLastDay.length-1];
	}

	public startPolling(startIpAddress:string, ipAddressRange:number){
		if (this.timeout) return;
		let searching = false;
		this.timeout = setInterval(async ()=>{
			if (searching) {
				let lastEntry = this.getLastEntry();
				this.addEntry(new DataEntry(lastEntry.powerUsage));
				return;
			}
			if (this.storedIpAddress == ""){
				try{
					this.storedIpAddress = await searchDongle(startIpAddress, ipAddressRange);
					console.log("Found p1 on ip address", this.storedIpAddress);
					searching = false;
				}catch(err){
					let lastEntry = this.getLastEntry();
					this.addEntry(new DataEntry(lastEntry.powerUsage));
					searching = false;
					console.warn("Failed to find p1 ip address", err);
					return;
				}
			}

			let entry = new DataEntry(0);
			try{
				let data = await getP1Data(startIpAddress);
				entry = new DataEntry(data.active_power_w);
			}catch(err){
				this.storedIpAddress = "";
				let lastEntry = this.getLastEntry();
				entry = new DataEntry(lastEntry.powerUsage);
			}
			this.addEntry(entry);
		}, 1000);
	}

	public stopPolling(){
		if (!this.timeout) return;
		clearInterval(this.timeout);
	}
}