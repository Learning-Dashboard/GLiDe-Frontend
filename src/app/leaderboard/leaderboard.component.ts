import {Component, Input} from '@angular/core';
import Chart from "chart.js/auto";
import {LearningdashboardService} from "../services/learningdashboard.service";

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {

  @Input() item: any;

  protected chart: any = [];

  private leaderboardResultsData: any = [];
  private leaderboardResults: any = [];

  constructor(private service: LearningdashboardService){}

  ngOnInit(){

    const leaderboardId = this.item.id;

    this.service.getLeaderboardResults(leaderboardId).subscribe((res) => {
      this.leaderboardResultsData = res;
      this.leaderboardResults = this.leaderboardResultsData[0].leaderboardResults;

      let name = ['-', '-', '-'];
      let achievementUnit = ['-', '-', '-'];
      let avatar = ['-', '-', '-'];

      const position1 = this.leaderboardResults.find((x: { position: number}) => x.position === 1);
      const position2 = this.leaderboardResults.find((x: { position: number}) => x.position === 2);
      const position3 = this.leaderboardResults.find((x: { position: number}) => x.position === 3);

      if (position1 != undefined) {
        name[1] = position1.playername;
        achievementUnit[1] = position1.achievementunits;
        avatar[1] = position1.playerimage;
      }

      if (position2 != undefined) {
        name[0] = position2.playername;
        achievementUnit[0] = position2.achievementunits;
        avatar[0] = position2.playerimage;
      }

      if (position3 != undefined) {
        name[2] = position3.playername;
        achievementUnit[2] = position3.achievementunits;
        avatar[2] = position3.playerimage;
      }

      this.chart = printLeaderboard(name, achievementUnit, avatar, leaderboardId);

    })

    function base64ToBlob(base64: string, mimeType: any) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    }

    function printLeaderboard(name: string[], achievementUnit: string[], avatar: string[], id: any) {

      const data = {
        labels: ['2','1','3'],
        datasets: [{
          label: 'My First Dataset',
          data: [30, 40, 20],
          backgroundColor: [
            'rgba(59,130,246,0.8)',
            'rgba(29,78,216,0.8)',
            'rgba(147,197,253,0.8)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderWidth: 0,
          barPercentage: 1,
          categoryPercentage: 0.9,
          borderRadius: {
            topLeft: 10,
            topRight: 10
          },
          positions: ['2','1','3'],
          names: name,
          points: achievementUnit,
          image: avatar
        }]
      }

      const bgImage = {
        id: 'bgImage',
        afterDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any; chartArea?: any; scales?: any}) {
          const {ctx, data, scales} = chart;
          ctx.save();
          data.datasets[0].image.forEach((image: string, index: number) => {
            const xPos = chart.getDatasetMeta(0).data[index].x;
            const yPos = chart.getDatasetMeta(0).data[index].y;

            const b64 = image;

            ctx.font = 'bolder 80px sans-serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center'
            ctx.fillText(data.datasets[0].positions[index], scales.x.getPixelForValue(index), yPos + 100);

            if (image != '-') {
              const mime = 'image/png';
              const blob = base64ToBlob(b64, mime);

              createImageBitmap(blob).then((imageBitmap) => {
                ctx.drawImage(imageBitmap, xPos - 50, yPos - 140, 100, 100);
              });

              ctx.font = 'bolder 20px sans-serif';
              ctx.fillStyle = 'black';
              ctx.textAlign = 'center'
              ctx.fillText(data.datasets[0].names[index], scales.x.getPixelForValue(index), yPos - 20);

              ctx.font = 'bolder 15px sans-serif';
              ctx.fillStyle = 'gray';
              ctx.textAlign = 'center'
              ctx.fillText(data.datasets[0].points[index] + " points", scales.x.getPixelForValue(index), yPos - 5);
            }
          })
        }
      };

      const elementId = 'canvasLeaderboard_' + id;

      let ctx: any;
      ctx = document.getElementById(elementId);

      return new Chart(ctx, {
        type: 'bar',
        data: data,
        plugins: [bgImage],
        options: {
          maintainAspectRatio: false,
          events: [],
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          },
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                drawTicks: false
              },
              border: {
                display: false
              },
              ticks: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                drawOnChartArea: false,
                drawTicks: false
              },
              border: {
                display: false
              },
              ticks: {
                display: false
              },
              grace: 20
            }
          }
        },
      });
    }
  }
}
