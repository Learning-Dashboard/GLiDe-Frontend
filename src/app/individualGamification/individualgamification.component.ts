import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {LearningdashboardService} from "../services/learningdashboard.service";
import { DomSanitizer } from '@angular/platform-browser';
import {MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDivider} from "@angular/material/divider";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTooltip} from "@angular/material/tooltip";
import {ListComponent} from "../list/list.component";
import {LeaderboardComponent} from "../leaderboard/leaderboard.component";
import {RankingComponent} from "../ranking/ranking.component";

class Badge {
  name: string | undefined;
  icon: string | undefined;
  date: string | undefined;
  units: number | undefined;
}

let globalAttainedBadges: Badge[] = [];
let globalNotAttainedBadges: Badge[] = [];

@Component({
  selector: 'app-individualgamification',
  templateUrl: './individualgamification.component.html',
  styleUrl: './individualgamification.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionModule,
    MatDivider,
    MatTooltip,
    LeaderboardComponent,
    RankingComponent
  ]
})

export class IndividualgamificationComponent {

  protected attainedBadges: Badge[] = [];
  protected notAttainedBadges: Badge[] = [];

  private badgesAttained : any;
  private badgesNotAttained : any;

  protected teamPlayer: any;
  protected individualPlayer: any;
  private teamPlayerName: any;
  private individualPlayerName: any;
  private individualLeaderboardId: any;
  protected leaderboard: any;

  constructor(private service: LearningdashboardService, private sanitizer: DomSanitizer, public dialog: MatDialog) {}

  ngOnInit() {

    this.individualPlayerName = localStorage.getItem("individualPlayername");
    this.teamPlayerName = localStorage.getItem("teamPlayername");
    this.individualLeaderboardId = localStorage.getItem("individualLeaderboardId");

    if (this.individualPlayerName != null && this.teamPlayerName != null) {

      //Leaderboard
      this.service.getLeaderboard(this.individualLeaderboardId).subscribe((res) => {
        this.leaderboard = res;
      })

      //Individual player information
      this.service.getIndividualPlayer(this.individualPlayerName).subscribe((res) => {
        this.individualPlayer = res;
        this.individualPlayer.avatar = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.individualPlayer.avatar);
      });

      //Team player information
      this.service.getTeamPlayer(this.teamPlayerName).subscribe((res) => {
        this.teamPlayer = res;
        this.teamPlayer.logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.teamPlayer.logo);
      });

      //Badges
      this.service.getPlayerAchievements(this.individualPlayerName, 'true', 'Badges').subscribe((res) => {
        this.badgesAttained = res;
        this.badgesAttained.forEach((element: { name: any; icon: any; date: any; units: any }) => {
          let imagePath: any;
          imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + element.icon);
          const dateReverse = element.date.split("-").reverse().join("/");
          this.attainedBadges.push({name: element.name, icon: imagePath, date: dateReverse, units: element.units});
        });
        globalAttainedBadges = this.attainedBadges;
      })

      this.service.getPlayerAchievements(this.individualPlayerName, 'false', 'Badges').subscribe((res) => {
        this.badgesNotAttained = res;
        this.badgesNotAttained.forEach((element: { name: any; icon: any; date: any; units: any }) => {
          let imagePath: any;
          imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + element.icon);
          this.notAttainedBadges.push({name: element.name, icon: imagePath, date: '-', units: element.units});
        });
        globalNotAttainedBadges = this.notAttainedBadges;
      })
    }
  }

  openDialogAchieved() {
    const dialogRef = this.dialog.open(DialogContentAchievedDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogMissing() {
    const dialogRef = this.dialog.open(DialogContentMissingDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'dialog-content-achieved-dialog',
  templateUrl: './dialog-content-achieved-dialog.html',
  styleUrl: './individualgamification.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ListComponent, ListComponent],
})
export class DialogContentAchievedDialog {

  attainedBadges: Badge[] = [];

  constructor(private service: LearningdashboardService, private sanitizer: DomSanitizer, public dialog: MatDialog) {}

  ngOnInit() {
    this.attainedBadges = globalAttainedBadges;
  }
}

@Component({
  selector: 'dialog-content-missing-dialog',
  templateUrl: './dialog-content-missing-dialog.html',
  styleUrl: './individualgamification.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ListComponent],
})
export class DialogContentMissingDialog {

  notAttainedBadges: Badge[] = [];

  constructor(private service: LearningdashboardService, private sanitizer: DomSanitizer, public dialog: MatDialog) {}

  ngOnInit() {
    this.notAttainedBadges = globalNotAttainedBadges;
  }
}
