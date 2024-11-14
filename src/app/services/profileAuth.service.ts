import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileAuthService {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem('selectedPlayer')) {
      return true;
    }
    this.router.navigate(['profile']);
    return false;
  }
}
