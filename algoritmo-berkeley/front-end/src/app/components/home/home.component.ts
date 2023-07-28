import { Component, OnInit } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    clock: number;
    id: string;

    constructor(private socket: SocketService) {
    }

    ngOnInit(): void {
        const rand = this.getRandomArbitrary(0, 300);
        console.log(rand)
        this.socket.clock = new Date().setSeconds(rand);
        console.log('ngOnInit.clock', this.clock);
        setInterval(() => {
            this.socket.clock += 200;
            this.clock = this.socket.clock;
            if (!this.id) {
                this.id = this.socket.id;
            }
        }, 200);
    }

    getRandomArbitrary(min: number, max: number) : number {
        return Math.random() * (max - min) + min;
    }
}