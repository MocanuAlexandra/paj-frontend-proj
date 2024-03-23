import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { LoginCredentials } from '../authentication/interfaces/login-credentials.interface';
import { RegisterCredentials } from '../authentication/interfaces/register-credentials.interface';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: User | null = null;
  private currentUsername: string | null = '';

  private baseURL = 'http://localhost:80/api/auth';

  constructor() {}

  async login(credentials: LoginCredentials, rememberMe: boolean) {
    try{
      const response = await fetch(
        `${this.baseURL}/login`,
        {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...credentials
          }),
      }
      );

      this.currentUsername = (await response.json()).username;

      return response.status;
    } catch(error){
      console.error(error);
    }

    return 0;
  }

  async register(credentials: RegisterCredentials) {
    try
    {
      const response = await fetch(
        `${this.baseURL}/register`,
        {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.firstName,
          surname: credentials.lastName,
        }),
      }
      );

      //TODO fix this
      const token = (await response.json()).token;
      this.currentUser = this.decodeJWT(token);

      return response.status;
    } catch (error) {
      console.error(error);
    }

    return 0;
  }

  //TODO fix this
  logout() {
    // Remove the remembered user (nothing will happen if there is no remembered user)
    localStorage.removeItem("RememberedUser");

    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated(): boolean {
    return this.currentUsername ? true : false;
  }

  
  decodeJWT(token: string) : User | null {
    const decoded = jwtDecode<any>(token);
    return {
      id: decoded.nameid,
      email: decoded.name,
      JWT: token,
    };
  }
}
