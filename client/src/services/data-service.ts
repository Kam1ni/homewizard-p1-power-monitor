import { DataAverage } from "@/models/data-average";
import { DataEntry } from "@/models/data-entry";
import axios from "axios";

export type ListType = "last-minute" | "last-hour"

const HOST = process.env.VUE_APP_HOST;
export class DataServiceClass{

	public async getAverages(intervalInSeconds:number, count:number):Promise<DataAverage[]> {
		let result = await axios.get(`${HOST}/api/average/${intervalInSeconds}/${count}`);
		return result.data.map((d:any)=>new DataAverage(d));
	}

	public async getCurrent():Promise<DataEntry> {
		let result = await axios.get(`${HOST}/api/current`);
		return new DataEntry(result.data)
	}
}

export const DataService = new DataServiceClass();