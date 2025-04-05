import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from '../../core/models/olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [BaseChartDirective, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public olympic$: Observable<Olympic[] | null> = of(null);
  public statistic = { numberOfEntries: 0, totalMedals: 0, totalNumberOfAthletes: 0 };
  public lineChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public lineChartType: ChartConfiguration['type'] = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  }

  constructor(
    private readonly olympicService: OlympicService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  private getOlympicIndexFromRoute(): number {
    return Number(this.route.snapshot.paramMap.get('index'));
  }

  private loadOlympicData(): void {
    const olympicIndex = this.getOlympicIndexFromRoute();
    this.olympic$ = this.olympicService.getOlympics();
    this.olympic$.pipe(
      map(olympics => {
        if (olympics) {
          const olympic = olympics[olympicIndex];
          this.updateStatistics(olympic);
          this.updateChart(olympic);
        }
      })
    ).subscribe()
  }

  private updateStatistics(olympic: Olympic): void {
    this.statistic = {
      numberOfEntries: olympic.participations.length,
      totalMedals: olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0),
      totalNumberOfAthletes: olympic.participations.reduce((acc, participation) => acc + participation.athleteCount, 0),
    };
  }

  private updateChart(olympic: Olympic): void {
    this.lineChartData.labels = olympic.participations.map(participation => participation.year);
    this.lineChartData.datasets = [{
      data: olympic.participations.map(participation => participation.medalsCount),
      label: 'Medals',
      backgroundColor: 'rgba(14,116,144,0.2)',
      borderColor: 'rgba(14,116,144,1)',
      pointBackgroundColor: 'rgba(14,116,144,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(14,116,144,1)',
      fill: 'origin',
    }]
  }
}
