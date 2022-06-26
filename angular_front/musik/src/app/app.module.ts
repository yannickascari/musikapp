import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserProfileComponent } from './components/auth/user-profile/user-profile.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./security/AuthInterceptor";
import {AppRoutingModule} from "./modules/app-routing/app-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EqualizerComponent } from './components/animation/equalizer/equalizer.component';
import { HeaderComponent } from './components/common/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { LeftMenuElementComponent } from './components/left-menu-element/left-menu-element.component';
import { PlayBarComponent } from './components/play-bar/play-bar.component';
import { ProgressBarComponent } from './components/util/progress-bar/progress-bar.component';
import { SearchComponent } from './components/home-fragments/search/search.component';
import { InputButtonComponent } from './components/util/input-button/input-button.component';
import { ArtistHorizontalViewComponent } from './components/artist/artist-horizontal-view/artist-horizontal-view.component';
import { ArtistViewComponent } from './components/artist/artist-view/artist-view.component';
import {AuthService} from "./services/auth.service";
import { ModalComponent } from './components/util/modal/modal.component';
import { UploadComponent } from './components/home-fragments/upload/upload.component';
import { ArtistBadgeViewComponent } from './components/artist/artist-badge-view/artist-badge-view.component';
import { SongHorizontalViewComponent } from './components/song/song-horizontal-view/song-horizontal-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    EqualizerComponent,
    HeaderComponent,
    HomeComponent,
    LeftMenuComponent,
    LeftMenuElementComponent,
    PlayBarComponent,
    ProgressBarComponent,
    SearchComponent,
    InputButtonComponent,
    ArtistHorizontalViewComponent,
    ArtistViewComponent,
    ModalComponent,
    UploadComponent,
    ArtistBadgeViewComponent,
    SongHorizontalViewComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    },
    {
      provide : APP_INITIALIZER,
      useFactory : (authService : AuthService) => () => {
        if (authService.isLoggedIn)
          return authService.loadCurrentUser();
        else return new Promise(resolve => resolve(true));
      },
      deps : [AuthService],
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
