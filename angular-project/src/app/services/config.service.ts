import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // Base url used in deployed application
  private _baseURL = 'http://34.205.79.220:80/api';

  // Base url used in local development
  // private _baseURL = 'http://localhost:80/api';

  constructor() { }

  get baseURL() {
    return this._baseURL;
  }
}
