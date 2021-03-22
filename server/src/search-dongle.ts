import axios from "axios";
import { getP1Data } from "./home-wizard";

export async function searchDongle(beginIp:string, count:number):Promise<string>{
	let bytes = beginIp.split(".").map(p=>parseInt(p));
	function add(index:number){
		let val = bytes[index];
		val++;
		bytes[index] = val;
		if (val > 255){
			val = 0;
			add(index-1);
		}
	}

	let done = 0;
	let found = false;

	return new Promise((resolve, reject)=>{
		let cancelToken = axios.CancelToken.source();
		for (let i = 0; i < count; i++){
			let str = bytes.map(p=>`${p}`).join(".");
			getP1Data(str, cancelToken.token).then((result)=>{
				cancelToken.cancel();
				resolve(str);
				found = true;
				done++;
			}).catch(err=>{
				done++;
				if (done >= count && !found){
					reject();
				}
			});
			add(3);
		}
	});
}