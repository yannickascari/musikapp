import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.css']
})
export class EqualizerComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  numberOfBars: number = 25;
  @Input()
  height: number = 100;
  @Input()
  width: number = 100;
  @Input()
  regression: number = 3;
  @Input()
  maxRegressionAnimation: number = 5;
  @Input()
  frequency: number = 0.2;
  @Input()
  color: string = '#23272a';
  @Input()
  pauseAnimation = false;
  @Input()
  alignHorizontally = true;

  maxHeightComponents = 40;
  malus: Array<number> = [];
  interval: number = -1;

  constructor() {
    if (!this.pauseAnimation)
      this.shuffleMalus();
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    if (this.interval !== -1)
      clearInterval(this.interval);
  }

  get numberOfBarsStr() {
    return `repeat(${this.numberOfBars},1fr)`;
  }

  get widthStr() {
    return this.width + '%';
  }

  get heightStr() {
    return this.height + '%';
  }

  get midValue() {
    return this.numberOfBars / 2;
  }

  getComponentHeight(compIndex: number) {
    let diff = this.midValue - compIndex;
    if (this.midValue % 1 !== 0)
      diff = Math.floor(diff);
    else if (diff === 1)
      diff = 0;
    else if (diff < 0)
      diff--;
    const h = this.maxHeightComponents - Math.abs(diff * this.regression);
    return h + this.malus[compIndex] + '%';
  }

  getRandomMalus() {
    const random = Math.random() * this.maxRegressionAnimation * 2;
    return (random < this.maxRegressionAnimation ? random : -random) / 2;
  }

  shuffleMalus() {
    for (let i = 0; i < this.numberOfBars; i++)
      this.malus[i] = this.getRandomMalus();
  }

  get transition() {
    return `${this.frequency * 1000}ms linear`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const e = changes as unknown as {frequency : {
        currentValue : number,
        firstChange : boolean,
        previousValue : number,
    }};
    if (e) {
      if (this.interval !== -1) {
        clearInterval(this.interval);
        this.refresh();
      }
    }
  }

  refresh() {
    this.interval = setInterval(() => {
      if (!this.pauseAnimation)
        this.shuffleMalus();
    }, this.frequency * 1000);
  }

}
