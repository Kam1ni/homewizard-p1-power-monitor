import * as express from "express";
import { DataList } from "./data";
import * as cors from "cors";
import {createServer} from "http";

export async function server(p1StartIpAddress:string, ipAddressRange:number){
	const dataList = new DataList();
	dataList.startPolling(p1StartIpAddress, ipAddressRange);
	const app = express();
	app.use(cors());

	app.get("/api/average/:interval/:count", (req,res)=>{
		let interval = Math.min(parseInt(req.params.interval), 3600);
		let count = Math.min(parseInt(req.params.count), 60);
		let data = dataList.getAverages(interval, count);
		res.json(data.map(d=>d.getJSON()));
	});

	app.get("/api/current", (req,res)=>{
		let currentEntry = dataList.getLastEntry();
		res.json(currentEntry);
	});

	app.use(express.static("public"));

	let server = createServer(app);

	server.listen(3000, "0.0.0.0", ()=>{
		console.log("Server started");
	});
}