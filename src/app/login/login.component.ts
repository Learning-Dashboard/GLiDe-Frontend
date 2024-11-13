import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  ngOnInit(): void {
    (window as any).handleOauthResponse = this.handleOauthResponse.bind(this);
  }

  decodeJWTToken(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleOauthResponse(response: any): void {
    const responsePayload = this.decodeJWTToken(response.credential);
    console.log(responsePayload);
    sessionStorage.setItem('loggedinUser', JSON.stringify(responsePayload));
  }
}
