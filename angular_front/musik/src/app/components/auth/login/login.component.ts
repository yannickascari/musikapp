import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  showError = false;

  constructor(
    private fb : FormBuilder,
    private authService : AuthService,
    private router : Router
  ) {
    this.loginForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      password : ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  loginUser() {
    this.showError = true;
    if (!this.loginForm.valid) return;
    this.authService.login(this.loginForm.value);
  }

}
