import {Component, ElementRef, inject} from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {LearningdashboardService} from "../services/learningdashboard.service";




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class UserComponent {
  private fb = inject(FormBuilder);
  protected result : any;
  protected gamification : any;
  private players : any;

  protected selectedPlayer: any;

  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    user: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  states = [
    {name: 'Alabama', abbreviation: 'AL'},
    {name: 'Alaska', abbreviation: 'AK'},
    {name: 'American Samoa', abbreviation: 'AS'},
    {name: 'Arizona', abbreviation: 'AZ'},
    {name: 'Arkansas', abbreviation: 'AR'},
    {name: 'California', abbreviation: 'CA'},
    {name: 'Colorado', abbreviation: 'CO'},
    {name: 'Connecticut', abbreviation: 'CT'},
    {name: 'Delaware', abbreviation: 'DE'},
    {name: 'District Of Columbia', abbreviation: 'DC'},
    {name: 'Federated States Of Micronesia', abbreviation: 'FM'},
    {name: 'Florida', abbreviation: 'FL'},
    {name: 'Georgia', abbreviation: 'GA'},
    {name: 'Guam', abbreviation: 'GU'},
    {name: 'Hawaii', abbreviation: 'HI'},
    {name: 'Idaho', abbreviation: 'ID'},
    {name: 'Illinois', abbreviation: 'IL'},
    {name: 'Indiana', abbreviation: 'IN'},
    {name: 'Iowa', abbreviation: 'IA'},
    {name: 'Kansas', abbreviation: 'KS'},
    {name: 'Kentucky', abbreviation: 'KY'},
    {name: 'Louisiana', abbreviation: 'LA'},
    {name: 'Maine', abbreviation: 'ME'},
    {name: 'Marshall Islands', abbreviation: 'MH'},
    {name: 'Maryland', abbreviation: 'MD'},
    {name: 'Massachusetts', abbreviation: 'MA'},
    {name: 'Michigan', abbreviation: 'MI'},
    {name: 'Minnesota', abbreviation: 'MN'},
    {name: 'Mississippi', abbreviation: 'MS'},
    {name: 'Missouri', abbreviation: 'MO'},
    {name: 'Montana', abbreviation: 'MT'},
    {name: 'Nebraska', abbreviation: 'NE'},
    {name: 'Nevada', abbreviation: 'NV'},
    {name: 'New Hampshire', abbreviation: 'NH'},
    {name: 'New Jersey', abbreviation: 'NJ'},
    {name: 'New Mexico', abbreviation: 'NM'},
    {name: 'New York', abbreviation: 'NY'},
    {name: 'North Carolina', abbreviation: 'NC'},
    {name: 'North Dakota', abbreviation: 'ND'},
    {name: 'Northern Mariana Islands', abbreviation: 'MP'},
    {name: 'Ohio', abbreviation: 'OH'},
    {name: 'Oklahoma', abbreviation: 'OK'},
    {name: 'Oregon', abbreviation: 'OR'},
    {name: 'Palau', abbreviation: 'PW'},
    {name: 'Pennsylvania', abbreviation: 'PA'},
    {name: 'Puerto Rico', abbreviation: 'PR'},
    {name: 'Rhode Island', abbreviation: 'RI'},
    {name: 'South Carolina', abbreviation: 'SC'},
    {name: 'South Dakota', abbreviation: 'SD'},
    {name: 'Tennessee', abbreviation: 'TN'},
    {name: 'Texas', abbreviation: 'TX'},
    {name: 'Utah', abbreviation: 'UT'},
    {name: 'Vermont', abbreviation: 'VT'},
    {name: 'Virgin Islands', abbreviation: 'VI'},
    {name: 'Virginia', abbreviation: 'VA'},
    {name: 'Washington', abbreviation: 'WA'},
    {name: 'West Virginia', abbreviation: 'WV'},
    {name: 'Wisconsin', abbreviation: 'WI'},
    {name: 'Wyoming', abbreviation: 'WY'}
  ];

  onSubmit(): void {
    this.saveUserData();
    alert('Thanks!');

  }

  saveUserData(): void {
    console.log('saveUserData');
    console.log(this.selectedPlayer);
    console.log('points');

    console.log("Result");
    console.log(this.result);

    let points = this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).points;
    //categoryName = metricsWithCategories.find((x: { externalId: string}) => x.externalId === this.selectedMetrics[metric]).categoryName;
    let level = this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).level;
    console.log(points);
    console.log('level');
    console.log(level);
    localStorage.setItem('selectedPlayer', this.selectedPlayer);

    localStorage.setItem('username', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).learningdashboardUsername);
    localStorage.setItem('githubUsername', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).githubUsername);
    localStorage.setItem('taigaUsername', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).taigaUsername);
    localStorage.setItem('project', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).project);
    localStorage.setItem('teamPlayername', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).teamPlayername);
    localStorage.setItem('individualPlayername', this.result.find((x: { playername: string}) => x.playername === this.selectedPlayer).playername);


    console.log('SelectedPlayer');

    let individualPlayername: any;

    individualPlayername = localStorage.getItem('individualPlayername');

    console.log(localStorage.getItem('selectedPlayer'));
    console.log(localStorage.getItem('githubUsername'));
    console.log(localStorage.getItem('taigaUsername'));
    console.log(localStorage.getItem('project'));
    console.log(localStorage.getItem('teamPlayername'));
    console.log(localStorage.getItem('individualPlayername'));

    this.service.getPlayerGamification(individualPlayername).subscribe((res) => {
      this.gamification = res;
      //this.metrics = this.result.map((item: any) => item.value);
      //this.dates = this.result.map((item: any) => item.date);
      console.log("Gamification");
      console.log(this.gamification);

      localStorage.setItem('teamLeaderboardId', this.gamification.teamLeaderboardId);
      localStorage.setItem('individualLeaderboardId', this.gamification.individualLeaderboardId);

      console.log(localStorage.getItem('teamLeaderboardId'));
      console.log(localStorage.getItem('individualLeaderboardId'));
      //console.log(this.metrics);
      //console.log(this.dates);

    });

  }

  constructor(private service: LearningdashboardService) {}

  ngOnInit(): void {
    this.service.getUsers().subscribe((res) => {
      this.result = res;
      //this.metrics = this.result.map((item: any) => item.value);
      //this.dates = this.result.map((item: any) => item.date);

      console.log(this.result);
      //console.log(this.metrics);
      //console.log(this.dates);

    })
  }

}
