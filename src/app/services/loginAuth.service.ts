import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(public router: Router) { }

  canActivate(): boolean {
    let user = localStorage.getItem('loggedUser');
    if (user) {
      let token = JSON.parse(user);
      let currentDate = Math.floor(Date.now() / 1000);
      if(!token.exp || token.exp < currentDate){
        localStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
