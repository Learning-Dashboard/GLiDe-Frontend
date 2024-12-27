import {Component, Injector, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LearningdashboardService} from "../services/learningdashboard.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private scriptLoaded = false;

  constructor(private injector: Injector, private service: LearningdashboardService, private toastr: ToastrService) { }

  ngOnInit(): void {
    document.getElementById('g_id_onload')?.setAttribute('data-client_id', environment.googleClient);
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
    this.service.postLogin(response.credential).subscribe((result) => {
      if (result.status === 200){
        localStorage.setItem('loggedUser', JSON.stringify(responsePayload));
        localStorage.setItem('idToken', response.credential);
        const routerService = this.injector.get(Router);
        const ngZone = this.injector.get(NgZone);
        ngZone.run(() =>{
          routerService.navigate(['/profile']);
        });
      }
      else if (result.status === 404) this.toastr.error('The user does not exist', 'Log in failed');
      else if (result.status === 401) this.toastr.error('Failed to verify user', 'Log in failed');
    })
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
