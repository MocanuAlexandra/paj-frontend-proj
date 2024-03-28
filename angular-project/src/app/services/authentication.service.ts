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
  private currentUsername: string | null = '';
  private guestMode = false;

  constructor(private configService: ConfigService) {}

  async login(credentials: LoginCredentials, rememberMe: boolean) {
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

      //TODO maybe replace with id of user instead of username
      this.currentUsername = (await response.json()).username;

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

      //TODO receive from backend the id of the user, in order to store it in the user object

      return response.status;
    } catch (error) {
      console.error(error);
    }

    return 0;
  }

  //TODO fix this
  logout() {
    // Remove the remembered user (nothing will happen if there is no remembered user)
    localStorage.removeItem('RememberedUser');

    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated(): boolean {
    return this.currentUsername ? true : false;
  }
  get isGuestMode(): boolean {
    return this.guestMode;
  }
  set isGuestMode(value: boolean) {
    this.guestMode = value;
  }
}
