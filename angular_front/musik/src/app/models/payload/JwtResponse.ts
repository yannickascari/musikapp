import {Song} from "../Song";

export interface JwtResponse {
  token : string;
  type : string;
  id : string;
  name : string;
  email : string;
  roles : string[];
  followers : string[];
  followings : string[];
  songs : Song[];
}
