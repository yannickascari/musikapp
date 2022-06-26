import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-input-button',
  templateUrl: './input-button.component.html',
  styleUrls: ['./input-button.component.css']
})
export class InputButtonComponent implements OnInit {

  @Input()
  width : number = 100;
  @Input()
  height : number = 100;
  @Input()
  backgroundColor : string = '#202225';
  @Input()
  buttonText : string = 'Ok !';
  @Input()
  inputPlaceHolder : string = 'Type some text ...';
  @Input()
  fontSize : string = '18px';
  @Input()
  alignHorizontally : boolean = true;
  @Input()
  alignVertically : boolean = true;
  @Input()
  colorOnInputFocus : string = 'hsl(197,calc(100%),47.8%)';
  @Input()
  validatePredicate : (str : string) => boolean = str => str.length !== 0;
  @Output()
  clickButton = new EventEmitter<string>();

  focused = false;

  textValue : string = '';

  constructor() { }

  ngOnInit(): void {
  }

  get widthStr() {
    return this.width + '%';
  }

  get heightStr() {
    return this.height + '%';
  }

  sendEvent() {
    if (!this.disabled)
      this.clickButton.emit(this.textValue);
  }

  get disabled() {
    return !this.validatePredicate(this.textValue);
  }

}
