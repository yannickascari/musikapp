import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {msToTime} from "../../../util/util";
import {Event} from "@angular/router";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, OnChanges {

  @Input()
  end : number = 0;
  @Input()
  progressTime : number = 0;
  @Input()
  colorOnHover : string = 'green';
  @Input()
  displayLabel : boolean = true;
  @Output()
  progressTimeChange = new EventEmitter<number>();
  @Output()
  drag = new EventEmitter<any>();

  hover = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
  }

  get progressLabel() {
    if (this.progressTime > this.end)
      return this.endLabel;
    return msToTime(this.progressTime);
  }

  get endLabel() {
    return msToTime(this.end);
  }

  get change() {
    let v = (this.progressTime)/(this.end) * 100;
    if (v < 10)
      v += 0.25;
    else if(v > 85)
      v -= 0.35;
    else if(v > 70)
      v -= 0.2;
    const color = this.hover ? this.colorOnHover : 'white';
    return `linear-gradient(to right, ${color} 0%, ${color} ${v}%, rgba(213, 213, 213, 0.44) ${v}%, rgba(213, 213, 213, 0.44) 100%)`;
  }

  move(event : any) {
    const e = event as InputEvent;
    const v = (e.target as HTMLInputElement).value;
    this.progressTime = parseFloat(v);
    this.progressTimeChange.emit(this.progressTime);
  }

  mouseover() {
    this.hover = true;
  }

  mouseleave() {
    this.hover = false;
  }

  mousedown() {
    this.drag.emit({});
  }

}
