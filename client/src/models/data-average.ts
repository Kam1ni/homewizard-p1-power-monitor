export class DataAverage{
	begin:Date = new Date();
	end:Date = new Date();
	average:number = 0;

	public constructor(data:any){
		this.begin = new Date(data.begin);
		this.end = new Date(data.end);
		this.average = data.average;
	}
}