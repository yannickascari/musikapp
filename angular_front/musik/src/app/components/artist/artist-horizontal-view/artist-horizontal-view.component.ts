import {Component, Input, OnInit} from '@angular/core';
import {Artist} from "../../../models/Artist";
import {Router} from "@angular/router";
import {ArtistService} from "../../../services/artist.service";
import {CloudService} from "../../../services/cloud.service";

@Component({
  selector: 'app-artist-horizontal-view',
  templateUrl: './artist-horizontal-view.component.html',
  styleUrls: ['./artist-horizontal-view.component.css']
})
export class ArtistHorizontalViewComponent implements OnInit {

  @Input()
  width : number = 100;
  @Input()
  height : number = 100;
  @Input()
  artist ?: Artist;
  @Input()
  colorOnHover : string = '#2f3136';
  @Input()
  alignHorizontally : boolean = true;
  @Input()
  borderRadius : number = 5;
  @Input()
  disableRedirection : boolean = false;
  @Input()
  backgroundColor : string = 'transparent';

  hover : boolean = false;
  avatarUrl : string = '';

  constructor(private router : Router, private artistService : ArtistService, private cloudService : CloudService) {
  }

  ngOnInit(): void {
    if (!this.artist) return;
    this.cloudService.getAvatar(this.artist, {
      onFound : url => this.avatarUrl = url,
      onNotFound : () => this.avatarUrl = CloudService.DEFAULT_URL_PIC,
    });
  }

  get widthStr(){
    return this.width + '%';
  }

  get heightStr() {
    return this.height + '%';
  }

  get borderRadiusStr() {
    return this.borderRadius + 'px';
  }

  goToArtistView(artist : Artist) {
    if (this.disableRedirection) return;
    this.artistService.changeArtistState(artist);
    this.router.navigate(['home/artist']).then();
  }

}
