import { Component, OnInit } from '@angular/core';
import {Artist} from "../../../models/Artist";
import {ArtistService} from "../../../services/artist.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchValues : Artist[] = [];

  constructor(private artistService : ArtistService, ) {
  }

  ngOnInit(): void {

  }

  onSearch(value : string) {
    this.artistService.search(value).subscribe(res => {
      this.searchValues = res;
    });
  }

}
