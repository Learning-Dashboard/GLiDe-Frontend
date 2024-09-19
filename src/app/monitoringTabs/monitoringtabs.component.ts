import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {UsermonitoringComponent} from "../userMonitoring/usermonitoring.component";
import {ProjectmonitoringComponent} from "../projectMonitoring/projectmonitoring.component";

@Component({
  selector: 'app-monitoringtabs',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, UsermonitoringComponent, ProjectmonitoringComponent],
  templateUrl: './monitoringtabs.component.html',
  styleUrl: './monitoringtabs.component.css'
})
export class MonitoringtabsComponent {

}
