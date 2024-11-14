import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NoAuthService {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!localStorage.getItem('loggedUser')) {
      return true;
    }
    this.router.navigate(['profile']);
    return false;
  }
}
