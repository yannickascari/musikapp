import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Artist} from "../models/Artist";
import {BehaviorSubject, catchError, map, Observable, of, throwError} from "rxjs";
import {JwtResponse} from "../models/payload/JwtResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  endpoint: string = 'http://localhost:8080/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser ?: Artist;
  private followers : Artist[] = [];
  private followings : Artist[] = [];


  currentUser$ : BehaviorSubject<Artist | undefined> = new BehaviorSubject<Artist | undefined>(this.currentUser);
  followers$ : BehaviorSubject<Artist[]> = new BehaviorSubject(this.followers);
  followings$ : BehaviorSubject<Artist[]> = new BehaviorSubject(this.followings);


  constructor(private http : HttpClient, public router : Router) {
  }

  register(user : Artist) : Observable<any> {
    let api = `${this.endpoint}/auth/register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  login(user : Artist) {
    return this.http.post(`${this.endpoint}/auth/login`, user)
      .subscribe((res : any) => {
        const jwt = res as JwtResponse;
        localStorage.setItem('access_token', jwt.token);
        this.currentUser = {
          id : jwt.id,
          email : jwt.email,
          name : jwt.name,
          roles : jwt.roles,
          followers : jwt.followers,
          followings : jwt.followings,
          songs : jwt.songs,
        };
        this.currentUser$.next(this.currentUser);
        this.router.navigate(['home']).then();
      })
  }

  get token() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']).then();
  }

  loadCurrentUser() : Promise<Artist> {
    return new Promise(resolve => {
      this.http.get(`${this.endpoint}/artist/me`).subscribe(ar => {
        this.currentUser = ar as Artist;
        this.currentUser$.next(this.currentUser);
        resolve(this.currentUser);
      });
    });
  }

  updateCurrentUser() {
    if (!this.currentUser) return;
    this.http.put(`${this.endpoint}/artist/${this.currentUser.id}`, this.currentUser).subscribe(ar => {
      this.currentUser = ar as Artist;
      this.currentUser$.next(this.currentUser);
      this.loadFollowers(this.currentUser);
      this.loadFollowings(this.currentUser);
    });
  }

  handleError(error : HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent)
      msg = error.error.message;
    else
      msg = `Error Code : ${error.status}\nMessage : ${error.message}`;
    return throwError(() => {
      new Error(msg);
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
