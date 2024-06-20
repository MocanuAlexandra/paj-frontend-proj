import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _baseURL = 'http://34.205.79.220:80/api';

  constructor() { }

  get baseURL() {
    return this._baseURL;
  }
}
