import {Component, OnInit} from '@angular/core';
import {Artist} from "../../../models/Artist";
import {DomSanitizer} from "@angular/platform-browser";
import FastAverageColor from "fast-average-color";
import {ArtistService} from "../../../services/artist.service";
import {Song} from "../../../models/Song";
import {SongService} from "../../../services/song.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../models/Category";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  audioFile ?: File;
  miniatureFile ?: File;
  songName = '';
  features: Artist[] = [];
  previewMiniatureSrc ?: string;
  previewAudioSrc ?: string;
  boxShadowColor: string = 'white';
  openModal: boolean = false;

  categories : Category[] = [];
  selectedCategory ?: Category;
  searchedFeaturedArtists: Artist[] = [];
  selectedFeaturedArtists : Artist[] = [];

  constructor(private _sanitizer: DomSanitizer, private artistService: ArtistService, private songService : SongService, private authService : AuthService, private categoryService : CategoryService, private router : Router) {

  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(a => this.categories = a);
  }

  changeAudioFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.audioFile = input.files[0];
      const split = this.audioFile.name.split('.');
      this.songName = split.slice(0, split.length - 1).join('.');
      this.previewAudioSrc = this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.audioFile)) as string;
    }
  }

  changeMiniatureFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.miniatureFile = input.files[0];
      this.previewMiniatureSrc = this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.miniatureFile)) as string;
      const ctx = (document.querySelector('#cv') as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;
      const fac = new FastAverageColor();
      const img = new Image(300, 300);
      img.src = URL.createObjectURL(this.miniatureFile);
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        let imgData = ctx.getImageData(0, 0, img.width, img.height).data;
        const res = fac.getColorFromArray4(imgData);
        this.boxShadowColor = `rgba(${res[0]},${res[1]},${res[2]},${res[3]})`;
        ctx.clearRect(0, 0, 300, 300);
      }
    }
  }

  get boxShadowImg() {
    return `${this.boxShadowColor} 0 12px 40px 10px`;
  }

  searchArtist(value: string) {
    this.artistService.search(value).subscribe(artists => {
      this.searchedFeaturedArtists = this.filterSearch(artists);
    });
  }

  selectArtist(artist : Artist) {
    this.selectedFeaturedArtists.push(artist);
    this.searchedFeaturedArtists = this.filterSearch(this.searchedFeaturedArtists);
  }

  private filterSearch(ar : Artist[]) : Artist[] {
    return ar.filter(art => !this.selectedFeaturedArtists.map(ar => ar.id).includes(art.id));
  }

  removeSelect(artist : Artist) {
    this.selectedFeaturedArtists = this.selectedFeaturedArtists.filter(a => a.id !== artist.id);
    this.searchedFeaturedArtists = this.filterSearch(this.searchedFeaturedArtists);
  }

  addSong() {
    if (!this.audioFile || !this.miniatureFile || !this.selectedCategory || !this.authService.currentUser) return;
    const formData = new FormData();
    const song : Song = {
      name : this.songName,
      numberOfListens : 0,
      category : this.selectedCategory,
      features : this.selectedFeaturedArtists
    }
    formData.append('song', JSON.stringify(song));
    formData.append('song_content', this.audioFile);
    formData.append('song_miniature', this.miniatureFile);

    this.songService.addSong(this.authService.currentUser, formData).subscribe(res => {
      if (res) {
        this.router.navigate(['home']).then();
      }
    });
  }

}
