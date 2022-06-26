import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-left-menu-element',
  templateUrl: './left-menu-element.component.html',
  styleUrls: ['./left-menu-element.component.css']
})
export class LeftMenuElementComponent implements OnInit {

  @Input()
  navName : string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
