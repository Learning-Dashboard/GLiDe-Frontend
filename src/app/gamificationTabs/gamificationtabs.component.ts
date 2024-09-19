import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {TeamgamificationComponent} from "../teamGamification/teamgamification.component";
import {IndividualgamificationComponent} from "../individualGamification/individualgamification.component";

@Component({
  selector: 'app-gamificationtabs',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, TeamgamificationComponent, IndividualgamificationComponent],
  templateUrl: './gamificationtabs.component.html',
  styleUrl: './gamificationtabs.component.css'
})
export class GamificationtabsComponent {

}
