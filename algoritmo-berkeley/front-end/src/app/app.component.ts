import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-home></app-home>`,
  styles: []
})
export class AppComponent implements OnInit{
  title = 'front-end';
  
  ngOnInit() {
  }

}
