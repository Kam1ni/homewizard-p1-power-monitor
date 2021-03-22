import { searchDongle } from "./search-dongle";
import { server as startServer } from "./server";

async function main(){
	if (process.argv.indexOf("--help") != -1){
		printHelp();
		return;
	}

	let scanCommandIndex = process.argv.indexOf("scan");
	if (scanCommandIndex != -1){
		runScanCommand(scanCommandIndex);
		return;
	}

	let startCommandIndex = process.argv.indexOf("start-server");
	if (startCommandIndex != -1){
		runStartCommand(startCommandIndex);
		return;
	}


	printHelp();
}

function printHelp(){
	console.log("Usage:");
	console.log("Running this command with no args will show this message.");
	console.log("Running with the scan command will only look for the p1 dongle and print it's ip");
	console.log("scan <start ip address> <ip count>");
	console.log("Running the start-server command will start the server but it needs to know the ip address of the p1 dongle");
	console.log("start-server <dongle ip address>");
}

async function runScanCommand(commandIndex:number){
	function printHelp(){
		console.log("Usage");
		console.log("scan <start ip address> <ip count>");
		console.log("Example: scan 192.168.0.100 100");
		console.log("\tWill look for the p1 dongle at ips 192.168.0.100 to 192.168.0.199");
	}

	let scanStartIp = process.argv[commandIndex+1];
	let scanCount = parseInt(process.argv[commandIndex+2]) || 0;
	if (scanCount < 0 || Number.isNaN(scanCount)){
		printHelp();
		return;
	}

	let result = await searchDongle(scanStartIp, scanCount);
	console.log(result);
}

async function runStartCommand(commandIndex:number){
	function printHelp(){
		console.log("Usage");
		console.log("start-server <dongle ip address>");
		console.log("Exammple: start-server 192.168.0.42");
	}

	let ip = process.argv[commandIndex+1];
	if (!ip){
		printHelp();
		return;
	}

	await startServer(ip);
}


main();