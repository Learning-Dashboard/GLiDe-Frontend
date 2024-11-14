import {Component, Injector, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private scriptLoaded = false;

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    (window as any).handleOauthResponse = this.handleOauthResponse.bind(this);
    this.loadGoogleScript()
      .then(() => {
        this.scriptLoaded = true;
      })
      .catch((error) => {
        console.error('Error loading Google script:', error);
      });
  }

  decodeJWTToken(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleOauthResponse(response: any): void {
    const responsePayload = this.decodeJWTToken(response.credential);
    console.log(responsePayload);
    localStorage.setItem('loggedUser', JSON.stringify(responsePayload));
    const routerService = this.injector.get(Router);
    const ngZone = this.injector.get(NgZone);
    ngZone.run(() =>{
      routerService.navigate(['/profile']);
    });
  }

  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }
}
