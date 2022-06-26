import {Song} from "./Song";

export interface Artist {

  id : string;
  name : string;
  email : string;
  roles : string[];
  followers : string[];
  followings : string[];
  songs : Song[];

}
