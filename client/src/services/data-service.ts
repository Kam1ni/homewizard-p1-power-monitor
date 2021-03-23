import { EventEmitter } from "@/event-emitter";
import { DataEntry } from "@/models/data-entry";
import axios from "axios";
import * as SocketIO from "socket.io-client";

export class DataServiceClass extends EventEmitter {
	public hourlyData:DataEntry[] = [];
	public socket:SocketIO.Socket;

	public constructor(){
		super();
		this.socket = SocketIO.io("ws://localhost:80", {path:"/socket", transports:["websocket"]});
		this.socket.on("/data", (event:any)=>{
			this.hourlyData.push(new DataEntry(event));
			while (this.hourlyData.length > 60){
				this.hourlyData.shift();
			}
			this.emit("data", event);
		})
	}

	public async getLastMinute():Promise<DataEntry[]>{
		let result = await axios.get(`http://localhost:80/api/last-minute`)
		this.hourlyData = result.data.map((d:any)=>new DataEntry(d));
		return this.hourlyData;
	}
}

export const DataService = new DataServiceClass();