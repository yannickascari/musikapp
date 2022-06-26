import {Artist} from "./Artist";
import {Category} from "./Category";

export interface Song {
  id ?: string;
  name : string;
  numberOfListens : number;
  category : Category;
  features : Artist[];
}

export function authorsToString(author : Artist,song : Song) {
  return !!song.features.length ? author.name + ', ' + song.features.map(artist => artist.name).join(', ') : author.name;
}
