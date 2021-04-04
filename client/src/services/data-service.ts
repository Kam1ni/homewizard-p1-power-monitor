import { DataAverage } from "@/models/data-average";
import axios from "axios";

export type ListType = "last-minute" | "last-hour"
export class DataServiceClass{

	public async getAverages(intervalInSeconds:number, count:number):Promise<DataAverage[]> {
		let result = await axios.get(`http://localhost:80/api/average/${intervalInSeconds}/${count}`);
		return result.data.map((d:any)=>new DataAverage(d));
	}
}

export const DataService = new DataServiceClass();