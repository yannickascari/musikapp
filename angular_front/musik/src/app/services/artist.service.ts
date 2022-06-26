import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Artist} from "../models/Artist";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  endpoint: string = 'http://localhost:8080/api';

  private artist ?: Artist;
  private followers : Artist[] = [];
  private followings : Artist[] = [];

  public artist$ : BehaviorSubject<Artist | undefined> = new BehaviorSubject(this.artist);
  public followers$ : BehaviorSubject<Artist[]> = new BehaviorSubject(this.followers);
  public followings$ : BehaviorSubject<Artist[]> = new BehaviorSubject(this.followings);

  constructor(private authService : AuthService, private http : HttpClient) { }

  search(searchValue : string) : Observable<Artist[]> {
    return this.http.get(`${this.endpoint}/artist/search/` + searchValue) as Observable<Artist[]>;
  }

  getArtistState() : Observable<Artist | undefined> {
    return this.artist$.asObservable();
  }

  changeArtistState(artist : Artist) {
    this.artist = artist;
    this.artist$.next(this.artist);
    this.loadFollowers(this.artist);
    this.loadFollowings(this.artist);
  }

  updateArtist(artist : Artist) {
    this.http.put(`${this.endpoint}/artist/${artist.id}`, artist).subscribe(ar => {
      this.changeArtistState(ar as Artist);
    });
  }

  loadFollowers(artist : Artist) {
    this.http.get(`${this.endpoint}/artist/${artist.id}/followers`).subscribe(artists => {
      this.followers = artists as Artist[];
      this.followers$.next(this.followers);
    });
  }

  loadFollowings(artist : Artist) {
    this.http.get(`${this.endpoint}/artist/${artist.id}/followings`).subscribe(artists => {
      this.followings = artists as Artist[];
      this.followings$.next(this.followings);
    });
  }

}
