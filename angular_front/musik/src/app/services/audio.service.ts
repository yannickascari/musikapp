import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable, Subject, takeUntil} from "rxjs";
import {StreamState} from "../models/stream/StreamState";
import {Event} from "@angular/router";
import {Song} from "../models/Song";
import {CloudService} from "./cloud.service";
import {Artist} from "../models/Artist";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private stop$ = new Subject<void>();
  private audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart",
    "volumechange"
  ];

  private state: StreamState = {
    miniatureUrl: "",
    playing: false,
    duration: 0,
    currentTime: 0,
    canplay: false,
    error: false,
    volume: 0,
    song: undefined,
    author : undefined
  }

  private state$: BehaviorSubject<StreamState> = new BehaviorSubject<StreamState>(this.state);

  constructor(private cloudService: CloudService) {
  }

  public changeSong(author: Artist, song: Song) {
    const promises = [this.cloudService.getAsyncSongAudio(author,song), this.cloudService.getAsyncSongMiniature(author, song)];
    Promise.all(promises).then(res => {
      this.playStream(res[0]).subscribe((e) => {
        if (e.type === 'canplay') {
          this.state.song = song;
          this.state.author = author;
          this.state.miniatureUrl = res[1];
          this.state$.next(this.state);
        }
      });
    });
  }


  private streamObservable(url: string): Observable<any> {
    return new Observable(obs => {
      this.audioObj.src = url;
      this.audioObj.load();
      this.state.volume = this.audioObj.volume;
      this.audioObj.autoplay = true;

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        obs.next(event);
      }

      this.addEvents(this.audioObj, this.audioEvents, handler);

      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;

        this.removeEvents(this.audioObj, this.audioEvents, handler);
        this.resetState();
      }
    });
  }

  private addEvents(obj: HTMLAudioElement, events: string[], handler: any) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    })
  }

  private removeEvents(obj: HTMLAudioElement, events: string[], handler: any) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  private updateStateEvents(event: Event): void {
    switch ((event as unknown as UIEvent).type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        break;
      case 'volumechange':
        this.state.volume = this.audioObj.volume;
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.state$.next(this.state);
  }

  private resetState() {
    this.state = {
      miniatureUrl: "",
      playing: false,
      duration: 0,
      currentTime: 0,
      canplay: false,
      error: false,
      volume: 0.,
      song: undefined,
      author : undefined
    }
  }

  getState(): Observable<StreamState> {
    return this.state$.asObservable();
  }

  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  async play(): Promise<void> {
    return this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  changeVolume(volume: number) {
    this.audioObj.volume = volume;
  }
}
