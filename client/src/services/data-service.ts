import { DataEntry } from "@/models/data-entry";
import axios from "axios";
import * as SocketIO from "socket.io-client";

export class DataService {
	public data:DataEntry[] = [];

	public async getHourly():Promise<DataEntry[]>{
		let result = await axios.get(`localhost:80/api/last-hourly`)
		this.data = result.data.map((d:any)=>new DataEntry(d));
		return this.data;
	}

	created(){
	}
}