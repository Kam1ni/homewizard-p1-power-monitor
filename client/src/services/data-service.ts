import { EventEmitter } from "@/event-emitter";
import { DataEntry } from "@/models/data-entry";
import axios from "axios";
import * as SocketIO from "socket.io-client";

export type ListType = "last-minute" | "last-hour"
export class DataServiceClass{
	public socket:SocketIO.Socket;
	private subs:{
		event:string,
		localHandler:Function;
		handler:(data:DataEntry[])=>void;
	}[] = [];

	public constructor(){
		this.socket = SocketIO.io("ws://localhost:80", {path:"/socket", transports:["websocket"]});
	}

	public async getLastMinute():Promise<DataEntry[]>{
		let result = await axios.get(`http://localhost:80/api/last-minute`)
		return result.data.map((d:any)=>new DataEntry(d));
	}

	public async getLastHour():Promise<DataEntry[]>{
		let result = await axios.get(`http://localhost:80/api/last-hour`)
		return result.data.map((d:any)=>new DataEntry(d));
	}

	public on(list:ListType, handler:(data:DataEntry[])=>void){
		let localHandler = (data:any)=>{
			let entries:DataEntry[] = data.map((d:any)=>new DataEntry(d));
			handler(entries);
		}
		this.subs.push({
			event:list,
			localHandler:localHandler,
			handler:handler
		});
		this.socket.on(`/data/${list}`, localHandler);
		this.socket.emit("/on", list);
	}

	public off(list:ListType, handler:(data:DataEntry[])=>void){
		for (let i = this.subs.length - 1; i >= 0; i--){
			let sub = this.subs[i];
			if (sub.event == list && sub.handler == handler){
				this.subs.splice(i, 1);
				this.socket.off(`/data/${list}`, sub.localHandler);
			}
		}
	}

}

export const DataService = new DataServiceClass();