interface ISub {
	event:string;
	handler:Function;
	once:boolean;
}

export class EventEmitter {
	private $subs:ISub[] = [];

	public emit(event:string, ...data:any){
		for (let i = this.$subs.length-1; i >= 0; i--){
			this.$subs[i].handler(...data);
			if (this.$subs[i].once) {
				this.$subs.splice(i,1);
			}
		}
	}

	public on(event:string, handler:Function){
		this.$subs.push({event, handler, once:false});
	}
	
	public once(event:string, handler:Function){
		this.$subs.push({event, handler, once:true});
	}

	public off(event:string, handler:Function){
		for (let i = this.$subs.length-1; i >= 0; i--){
			if (this.$subs[i].event == event && this.$subs[i].handler == handler) {
				this.$subs.splice(i,1);
			}
		}
	}
}