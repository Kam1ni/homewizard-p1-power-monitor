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
		let onData = (entry:DataEntry)=>{
			socket.emit("/data", entry);
		};
		dataList.on("data", onData);

		socket.on("disconnect", ()=> dataList.off("data", onData));
	});

	server.listen(80, "0.0.0.0", ()=>{
		console.log("Server started");
	});
}