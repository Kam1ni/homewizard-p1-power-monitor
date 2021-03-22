import { searchDongle } from "./search-dongle";

async function main(){
	if (process.argv.indexOf("--help") != -1){
		console.log("Usage:");
		console.log("Running this command with no args will start the server.");
		console.log("Running with the scan command will only look for the p1 dongle and print it's ip");
		console.log("scan <start ip address> <ip count>");
	}

	let scanCommandIndex = process.argv.indexOf("scan");
	if (scanCommandIndex != -1){
		runScanCommand(scanCommandIndex);
		return;
	}

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


main();