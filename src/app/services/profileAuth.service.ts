import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ProfileAuthService {

  constructor(public router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    if (localStorage.getItem('selectedPlayer')) {
      return true;
    }
    this.router.navigate(['profile']);
    this.toastr.error('Select a user to access this content', 'Not available');
    return false;
  }
}
