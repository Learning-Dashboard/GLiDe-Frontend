import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(public router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    let user = localStorage.getItem('loggedUser');
    if (user) {
      let token = JSON.parse(user);
      let currentDate = Math.floor(Date.now() / 1000);
      if(!token.exp || token.exp < currentDate){
        localStorage.clear();
        this.router.navigate(['login']);
        this.toastr.info('Log in again to continue', 'Session timed out');
        return false;
      }
      return true;
    }
    this.router.navigate(['login']);
    this.toastr.error('Log in to access this content', 'Not available');
    return false;
  }
}
