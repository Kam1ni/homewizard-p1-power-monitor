import * as express from "express";
import { DataEntry, DataList } from "./data";
import {Server as SocketIO} from "socket.io";
import * as cors from "cors";
import {createServer} from "http";

export async function server(p1IpAddress:string){
	const dataList = new DataList();
	dataList.startPolling(p1IpAddress);
	const app = express();
	app.use(cors());

	app.get("/api/last-minute", (req,res)=>{
		let data = dataList.lastMinute;
		res.json(data);
	});

	app.get("/api/last-hour", (req, res)=>{
		let data = dataList.lastHour;
		res.json(data);
	});

	let server = createServer(app);

	let io = new SocketIO(server, {path: "/socket/"});
	io.on("connection", (socket)=>{
		let subs = [] as {event:string, handler:(...args:any[])=>void}[];
		socket.on("disconnect", ()=> {
			for (let sub of subs){
				dataList.off(sub.event, sub.handler);
			}
		});
		socket.on("/on", (event:string)=>{
			let sub = (data:DataEntry[])=>{
				socket.emit(`/data/${event}`, data);
			};
			dataList.on(event, sub);
			let i = subs.push({event, handler: sub}) - 1;
			socket.once(`/off/${event}`, ()=>{
				dataList.off(event, sub);
				subs.splice(i,1);
			});
		});
	});

	server.listen(80, "0.0.0.0", ()=>{
		console.log("Server started");
	});
}