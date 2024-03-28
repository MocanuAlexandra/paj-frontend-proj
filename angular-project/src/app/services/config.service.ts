import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _baseURL = 'http://localhost:80/api';

  constructor() { }

  get baseURL() {
    return this._baseURL;
  }
}
