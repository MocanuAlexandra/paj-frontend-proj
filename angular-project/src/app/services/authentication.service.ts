import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { LoginCredentials } from '../authentication/interfaces/login-credentials.interface';
import { RegisterCredentials } from '../authentication/interfaces/register-credentials.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUser: User | null = null;
  private guestMode = false;

  constructor(private configService: ConfigService) {}

  async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(`${this.configService.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
        }),
      });

      // If the login is successful, store the user object
      this.currentUser = await response.json() as User;
      console.log(this.currentUser);
        
      return response.status;
    } catch (error) {
      console.error(error);
    }

    return 0;
  }

  async register(credentials: RegisterCredentials) {
    try {
      const response = await fetch(
        `${this.configService.baseURL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
          }),
        }
      );

      // If the register is successful, store the user object
      this.currentUser = await response.json() as User;
      console.log(this.currentUser);

      return response.status;
    } catch (error) {
      console.error(error);
    }

    return 0;
  }

  async logout() {
    try {
      const response = await fetch(
        `${this.configService.baseURL}/auth/logout`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },       
        }
      );

      var logoutMessage = await response.json() as String;
      console.log(logoutMessage);

      // If the logout is successful, remove the user object
      this.currentUser = null;

      return response.status;
    } catch (error) {
      console.error(error);
    }

    return 0;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated(): boolean {
    return this.currentUser ? true : false;
  }
  get isGuestMode(): boolean {
    return this.guestMode;
  }
  set isGuestMode(value: boolean) {
    this.guestMode = value;
  }
}
