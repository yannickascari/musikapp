import {Component, OnInit} from '@angular/core';
import {Artist} from "../../../models/Artist";
import {ArtistService} from "../../../services/artist.service";
import {CloudService} from "../../../services/cloud.service";
import FastAverageColor from "fast-average-color";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent implements OnInit {

  artist ?: Artist;
  avatarUrl: string = CloudService.DEFAULT_URL_PIC;
  background: string = '';
  modalFollowersOpened = false;
  modalFollowingsOpened = false;

  followers : Artist[] = [];
  followings : Artist[] = [];

  constructor(private artistService: ArtistService, private cloudService: CloudService, private authService: AuthService) {
    this.artistService.getArtistState().subscribe(artist => {
      this.artist = artist;
      this.loadAvatar();
      this.closeModals();
    });
    this.artistService.followers$.subscribe(followers => {
      this.followers = followers;
    });
    this.artistService.followings$.subscribe(followings => {
      this.followings = followings;
    });
  }

  ngOnInit(): void {
    this.loadBackground(CloudService.DEFAULT_URL_PIC);
  }

  loadBackground(url: string) {
    const fac = new FastAverageColor();

    fac.getColorAsync(url).then(color => {
      const colorEnd = [...color.value.slice(0, 3), 0].join(',');
      this.background = `linear-gradient(to top, rgba(${colorEnd}) 0%, ${color.rgba} 100%)`;
    });
  }

  get isAlreadyFollowing() : boolean {
    return !!this.artist && !!this.authService.currentUser && this.artist.followers.includes(this.authService.currentUser?.id);
  }

  followOrUnfollow() {
    if (this.isAlreadyFollowing)
      this.unfollow();
    else
      this.follow();
  }

  closeModals() {
    this.modalFollowingsOpened = false;
    this.modalFollowersOpened = false;
  }

  loadAvatar() {
    if (this.artist)
      this.cloudService.getAvatar(this.artist, {
        onFound: url => {
          this.avatarUrl = url;
          this.loadBackground(this.avatarUrl);
        },
        onNotFound: () => {
          this.avatarUrl = CloudService.DEFAULT_URL_PIC;
          this.loadBackground(this.avatarUrl);
        },
      });
  }

  private follow() {
    if (!this.authService.currentUser || !this.artist) return;
    this.artist.followers.push(this.authService.currentUser.id);
    this.authService.currentUser.followings.push(this.artist.id);
    this.artistService.updateArtist(this.artist);
    this.authService.updateCurrentUser();
  }

  private unfollow() {
    if (!this.authService.currentUser || !this.artist) return;
    this.artist.followers = this.artist.followers.filter(f => f !== this.authService.currentUser?.id);
    this.authService.currentUser.followings = this.authService.currentUser.followings.filter(f => f!== this.artist?.id);
    this.artistService.updateArtist(this.artist);
    this.authService.updateCurrentUser();
  }

  get unableSelfFollow() {
    return this.artist?.id === this.authService.currentUser?.id;
  }

  get featuredArtists() {
    return this.artist?.songs.flatMap(s => s.features);
  }

  changeArtist(a : Artist) {
    this.artistService.changeArtistState(a);
  }

}
