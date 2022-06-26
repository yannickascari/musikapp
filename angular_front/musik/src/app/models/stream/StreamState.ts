import {Song} from "../Song";
import {Artist} from "../Artist";

export interface StreamState {
  playing : boolean;
  duration : number;
  volume : number;
  currentTime : number;
  canplay : boolean;
  error : boolean;
  song ?: Song;
  author ?: Artist;
  miniatureUrl : string;
}
