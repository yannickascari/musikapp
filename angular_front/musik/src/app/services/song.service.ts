import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Artist} from "../models/Artist";

@Injectable({
  providedIn: 'root'
})
export class SongService {

  endpoint: string = 'http://localhost:8080/api';

  constructor(private http : HttpClient) { }

  addSong(artist : Artist, formData : FormData) : Observable<any> {
    return this.http.post(`${this.endpoint}/artist/${artist.id}/songs`, formData);
  }

}
