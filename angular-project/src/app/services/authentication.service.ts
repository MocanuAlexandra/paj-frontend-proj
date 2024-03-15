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

  //TODO: Replace with the actual API URL
  private baseURL = 'http://localhost:5000/api/Users';

  constructor() { 
    // Check for stored credentials
    const storedData = localStorage.getItem("RememberedUser");
    if(storedData){
      this.currentUser = JSON.parse(storedData);
    }
  }

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

      const token = (await response.json()).token;
      this.currentUser = this.decodeJWT(token);

      // If the rememberMe option is checked, store user credentials in local storage
      if(rememberMe)
        localStorage.setItem("RememberedUser", JSON.stringify(this.currentUser));

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
      
      const token = (await response.json()).token;
      this.currentUser = this.decodeJWT(token);

      return response.status;
    } catch(error){
      console.error(error);
    }

    return 0;
  }

  logout() {
    // Remove the remembered user (nothing will happen if there is no remembered user)
    localStorage.removeItem("RememberedUser");

    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
  get isAuthenticated() : boolean {
    return this.currentUser ? true : false;
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
