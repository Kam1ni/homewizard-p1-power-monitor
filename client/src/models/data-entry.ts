export class DataEntry {
	timeStamp:Date = new Date();
	powerUsage:number = 0;

	public constructor(data:any){
		this.timeStamp = new Date(data.timeStamp);
		this.powerUsage = data.powerUsage;
	}
}