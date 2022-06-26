import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {Artist} from "../models/Artist";
import {Observable} from "rxjs";
import {CloudLoadCallback} from "./cloud/CloudLoadCallback";
import {wrapCloudCallback} from "./cloud/CloudLoaderWrapper";
import {Song} from "../models/Song";

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  endpoint: string = 'http://localhost:8080/api';

  public static readonly DEFAULT_URL_PIC = "https://musik.blob.core.windows.net/avatars/default.jpg?sp=r&st=2022-06-15T19:31:12Z&se=4000-06-16T03:31:12Z&spr=https&sv=2021-06-08&sr=b&sig=1z1PsLZd9FxBLs3sboeFlI8AilfIEYZD6MgS0LVWyio%3D";

  constructor(private authService : AuthService, private http : HttpClient) { }

  getAvatar(artist : Artist, callback : CloudLoadCallback){
    return this.http.get(`${this.endpoint}/artist/${artist.id}/avatar`).subscribe(res => wrapCloudCallback(res,callback));
  }

  getSongMiniature(artist : Artist, song : Song, callback : CloudLoadCallback) {
    return this.http.get(`${this.endpoint}/artist/${artist.id}/songs/${song.id}/miniature`).subscribe(res => wrapCloudCallback(res, callback));
  }

  async getAsyncSongAudio(artist : Artist, song : Song) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.getSongAudio(artist, song, {
        onFound : url => resolve(url),
        onNotFound : () => reject(),
      });
    });
  }

  async getAsyncSongMiniature(artist : Artist, song : Song) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.getSongMiniature(artist, song, {
        onFound : url => resolve(url),
        onNotFound : () => reject(),
      });
    });
  }

  async getAsyncSongDuration(artist : Artist, song : Song) : Promise<number> {
    return new Promise((resolve, reject) => {
      this.getAsyncSongAudio(artist, song).then(song => {
        const audio = new Audio();
        audio.src = song;
        audio.load();
        audio.addEventListener('loadedmetadata', () => {
          const duration = audio.duration;
          resolve(duration);
          audio.remove();
        });
      });
    });
  }

  getSongAudio(artist : Artist, song : Song, callback : CloudLoadCallback) {
    return this.http.get(`${this.endpoint}/artist/${artist.id}/songs/${song.id}/audio`).subscribe(res => wrapCloudCallback(res, callback));
  }

}
