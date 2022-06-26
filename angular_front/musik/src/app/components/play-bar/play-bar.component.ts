import { Component, OnInit } from '@angular/core';
import {authorsToString, Song} from "../../models/Song";
import {StreamState} from "../../models/stream/StreamState";
import {AudioService} from "../../services/audio.service";
import {Artist} from "../../models/Artist";

@Component({
  selector: 'app-play-bar',
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.css']
})
export class PlayBarComponent implements OnInit {

  currentSong ?: Song;

  currentAuthor ?: Artist;

  state : StreamState | undefined;

  progress = 0;

  lastVolumeChange = 0;

  refreshRateEqualizer = 0.2;

  nbOfBars = 10;

  constructor(
    public audioService : AudioService,
  ) {
    this.audioService.getState().subscribe(state => {
      this.state = state;
      this.currentSong = this.state.song;
      this.currentAuthor = this.state.author;
    });
  }

  ngOnInit(): void {
  }

  get authors() {
    if (!this.currentSong || !this.currentAuthor) return '';
    return authorsToString(this.currentAuthor,this.currentSong);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play().then(() => {
      if (this.state)
        this.lastVolumeChange = this.state.volume;
    });
  }

  stop() {
    this.audioService.stop();
  }

  next() {

  }

  seekTo(change : number) {
    this.audioService.seekTo(change);
  }

  changeVolume(change : number) {
    if (this.state)
      this.lastVolumeChange = this.state.volume;
    this.audioService.changeVolume(change / 100);
  }

  mute() {
    this.changeVolume(0);
  }

  unmute() {
    this.changeVolume(this.lastVolumeChange * 100);
  }

  playOrPause() {
    console.log(this.state);
    if (this.state?.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  previous() {

  }

}
