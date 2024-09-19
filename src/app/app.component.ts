import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NavigationComponent} from "./navigation/navigation.component";
import {LearningdashboardService} from "./services/learningdashboard.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GLiDe - Integrated Gamified Learning Dashboard Environment';
  constructor(private service: LearningdashboardService) {}

}
