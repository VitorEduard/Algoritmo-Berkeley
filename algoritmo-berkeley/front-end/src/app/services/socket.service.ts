import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
	clock : number;
	id: string;

  	constructor(private socket: Socket) {
		this.onWaitAdjustClock();
		this.onWaitClock();
		this.onWaitId();
	}

	private onWaitId() {
		this.socket.on("send-id-client", (id: string) => {
			this.id = id;
		});
	}

	private onWaitClock() {
		console.log('SocketService.onWaitClock', this.socket);
		this.socket.on('send-clock-master', (date: any) => {
			console.log('SocketService.onWaitClock.date', date)
			console.log('SocketService.onWaitClock.clock', this.clock)
			this.sendCalculatorClock(this.clock - date)
		});
	}

	private onWaitAdjustClock() {
		console.log('SocketService.onWaitAdjustClock', this.socket);
		this.socket.on('adjust-clock-client', (value: any) => {
			let dateClock = new Date(this.clock);
			console.log('SocketService.onWaitAdjustClock', dateClock.getHours() + ':' + dateClock.getMinutes() + ':' + dateClock.getSeconds(), value/1000)
			this.clock += value;
			dateClock = new Date(this.clock);
			console.log('SocketService.onWaitAdjustClock', dateClock.getHours() + ':' + dateClock.getMinutes() + ':' + dateClock.getSeconds())
		});
	}

	sendCalculatorClock(clockDifference: number) {
		console.log('SocketService.sendCalculatorClock', clockDifference);
		this.socket.emit('calc-clock-server', clockDifference);
	}

}
