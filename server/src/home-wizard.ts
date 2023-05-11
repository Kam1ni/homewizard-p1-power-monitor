import Axios, { CancelToken } from "axios";

export interface IHomeWizardData {
	smr_version:number;
	meter_model:string;
	wifi_ssid:string;
	wifi_strength:string;
	total_power_import_t1_kwh:number;
	total_power_import_t2_kwh:number;
	total_power_export_t1_kwh:number;
	total_power_export_t2_kwh:number;
	active_power_w:number;
	active_power_l1_w:number;
	active_power_l2_w:number;
	active_power_l3_w:number;
	total_gas_m3:number;
	gas_timestamp:number;
}

export async function getP1Data(ip:string, cancelToken?:CancelToken):Promise<IHomeWizardData>{
	let result = await Axios.get(`http://${ip}/api/v1/data`, {cancelToken});
	let data  = result.data as IHomeWizardData;
	if (typeof(data.active_power_w) != "number" || Number.isNaN(data.active_power_w)){
		throw new Error("Invalid data");
	}
	return result.data;
}