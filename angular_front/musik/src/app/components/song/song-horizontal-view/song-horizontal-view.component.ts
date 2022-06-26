import {Component, Input, OnInit} from '@angular/core';
import {authorsToString, Song} from "../../../models/Song";
import {CloudService} from "../../../services/cloud.service";
import {Artist} from "../../../models/Artist";
import {StreamState} from "../../../models/stream/StreamState";
import {AudioService} from "../../../services/audio.service";
import {iif} from "rxjs";
import {msToTime} from "../../../util/util";

@Component({
  selector: 'app-song-horizontal-view',
  templateUrl: './song-horizontal-view.component.html',
  styleUrls: ['./song-horizontal-view.component.css']
})
export class SongHorizontalViewComponent implements OnInit {

  @Input()
  author ?: Artist;
  @Input()
  song ?: Song;
  @Input()
  index: number = 0;
  @Input()
  colorOnHover: string = 'green';
  @Input()
  backgroundOnHover: string = '#2f3136';

  hover = false;

  songDuration = '';

  state ?: StreamState;

  songMiniatureSrc: string = '';

  constructor(private cloudService: CloudService, private audioService: AudioService) {
    this.audioService.getState().subscribe(a => {
      this.state = a;
    })
  }

  ngOnInit(): void {
    if (this.author && this.song) {
      this.cloudService.getSongMiniature(this.author, this.song, {
        onFound: url => this.songMiniatureSrc = url,
        onNotFound: () => this.songMiniatureSrc = '',
      });
      this.cloudService.getAsyncSongDuration(this.author, this.song).then(r => {
        this.songDuration = msToTime(r);
      });
    }
  }

  get authors() {
    if (!this.author || !this.song) return '';
    return authorsToString(this.author, this.song);
  }

  onAction() {
    if (this.song && this.author) {
      if (this.isCurrentlyPlayed)
        this.audioService.pause();
      else
        this.audioService.changeSong(this.author, this.song);
    }
  }

  pause() {
    this.audioService.pause();
  }

  change() {
    if (this.author && this.song)
      this.audioService.changeSong(this.author, this.song);
  }

  resume() {
    this.audioService.play().then();
  }

  get isCurrentlyPlayed() {
    return this.state?.song?.id === this.song?.id;
  }


}
