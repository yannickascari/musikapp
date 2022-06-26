import {Component, Input, OnInit} from '@angular/core';
import {Artist} from "../../../models/Artist";
import {CloudService} from "../../../services/cloud.service";

@Component({
  selector: 'app-artist-badge-view',
  templateUrl: './artist-badge-view.component.html',
  styleUrls: ['./artist-badge-view.component.css']
})
export class ArtistBadgeViewComponent implements OnInit {

  @Input()
  size : number = 100;
  @Input()
  artist ?: Artist;
  @Input()
  percentImage : number = 40;
  @Input()
  fontSize : string = '18px';

  hover = false;

  avatarUrl : string = CloudService.DEFAULT_URL_PIC;

  constructor(private cloudService : CloudService) {
  }

  ngOnInit(): void {
    if (!this.artist) return;
    this.cloudService.getAvatar(this.artist, {
      onFound : url => this.avatarUrl = url,
      onNotFound : () => this.avatarUrl = CloudService.DEFAULT_URL_PIC,
    });
  }

  get sizeStr() {
    return `${this.size}%`;
  }

  get percentImageStr() {
    return this.percentImage + '%';
  }

}
