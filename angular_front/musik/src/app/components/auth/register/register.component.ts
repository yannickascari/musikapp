import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {Artist} from "../../../models/Artist";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;
  showError = false;

  constructor(public fb : FormBuilder, public authService : AuthService, public router : Router) {
    this.registerForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  ngOnInit(): void {
  }

  register() {
    this.showError = true;
    if (!this.registerForm.valid) return;
    const artist : Artist = {
      followers : [],
      followings : [],
      ...this.registerForm.value
    };
    this.authService.register(artist).subscribe(res => {
      if (res.message) {
        this.registerForm.reset();
        this.router.navigate(['login']).then();
      }
    });
  }

}
