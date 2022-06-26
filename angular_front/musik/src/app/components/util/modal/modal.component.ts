import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input()
  opened : boolean = false;
  @Input()
  width : number = 50;
  @Input()
  height : number = 70;
  @Input()
  color : string = 'white';
  @Input()
  borderColor : string = 'gray';
  @Input()
  shadowColor : string = 'lightgray';
  @Input()
  overflowY : string = 'auto';

  constructor() { }

  ngOnInit(): void {
  }

  get heightStr() {
    return `${this.height}%`;
  }

  get widthStr() {
    return `${this.width}%`;
  }

  get left() {
    return `${(100 - this.width)/2}%`;
  }

  get top() {
    return `${(100 - this.height)/2}%`;
  }

  get boxShadow() {
    return `${this.shadowColor} 0 8px 25px -16px`;
  }

}
