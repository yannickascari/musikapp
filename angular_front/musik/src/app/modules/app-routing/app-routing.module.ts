import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "../../components/auth/login/login.component";
import {RegisterComponent} from "../../components/auth/register/register.component";
import {UserProfileComponent} from "../../components/auth/user-profile/user-profile.component";
import {AuthGuard} from "../../guards/auth.guard";
import {HomeComponent} from "../../components/home/home.component";
import {SearchComponent} from "../../components/home-fragments/search/search.component";
import {ArtistViewComponent} from "../../components/artist/artist-view/artist-view.component";
import {UploadComponent} from "../../components/home-fragments/upload/upload.component";

const routes : Routes = [
  { path : '', redirectTo : '/home', pathMatch: 'full'},
  { path : 'login', component : LoginComponent},
  { path : 'register', component : RegisterComponent},
  { path : 'user/profile/:id', component : UserProfileComponent, canActivate : [AuthGuard]},
  { path : 'home', component : HomeComponent, canActivate : [AuthGuard], children : [
      {
        path : 'search',
        component : SearchComponent
      },
      {
        path : 'artist',
        component : ArtistViewComponent
      },
      {
        path : 'upload',
        component : UploadComponent
      }
  ]}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports : [RouterModule]
})
export class AppRoutingModule { }
