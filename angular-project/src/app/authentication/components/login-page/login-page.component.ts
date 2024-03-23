import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CredentialsValidators } from '../../helpers/credentials-validators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  successStatusCode = 200;
  loginIsBeingRequested = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    if (this.authenticationService.isAuthenticated) {
      this.navigateToMain();
      return;
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        CredentialsValidators.emailValidator,
      ]),
      password: new FormControl<string>('', [Validators.required]),
      rememberMe: new FormControl<boolean>(false),
    });
  }

  submitForm() {
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginIsBeingRequested = true;
    this.authenticationService
      .login(credentials, this.loginForm.value.rememberMe)
      .then((statusCode: number) => {
        this.loginIsBeingRequested = false;
        // If the user has logged in successfully, redirect to the main page
        if (statusCode === this.successStatusCode) this.navigateToMain();
      });
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  navigateToMain() {
    this.router.navigate(['/main/home']);
  }

  navigateToGuestPage() {
    // set the guest mode to true
    this.authenticationService.isGuestMode = true;
    this.router.navigate(['/main/guest']);
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
